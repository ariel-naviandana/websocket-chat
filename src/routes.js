const express = require('express')
const multer = require('multer')
const path = require('path')
const ChatHandler = require('./handlers/ChatHandler')
const BotHandler = require('./handlers/BotHandler')

module.exports = (app, container, io) => {
    const chatService = container.resolve('chatService')
    const chatHandler = new ChatHandler(io, chatService)
    chatHandler.setupRoutes(app)

    const botService = container.resolve('botService')
    const botHandler = new BotHandler(io, botService)

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, 'uploads')
            cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname))
        }
    })
    const upload = multer({ storage: storage })

    app.get('/', (req, res) => {
        res.render('index', { title: 'Chat Room' })
    })

    app.get('/messages', async (req, res) => {
        try {
            const messages = await chatService.getMessages()
            res.json(messages)
        } catch (error) {
            console.error('Error fetching messages:', error)
            res.status(500).json({ error: 'Failed to fetch messages' })
        }
    })

    app.post('/sendMessage', upload.single('image'), async (req, res) => {
        try {
            const { senderId, text } = req.body
            let imageUrl = null

            if (req.file) {
                imageUrl = `/uploads/${req.file.filename}`
            }

            const messageData = { senderId, text, imageUrl, createdAt: new Date().toISOString() }
            console.log('Saving message to database:', messageData)
            await chatService.saveMessage(messageData)
            res.json(messageData)
        } catch (error) {
            console.error('Error sending message:', error)
            res.status(500).json({ error: 'Failed to send message' })
        }
    })

    app.post('/bot', async (req, res) => {
        const { text } = req.body
        try {
            const response = await botService.processMessage({ text })
            res.json(response)
        } catch (error) {
            console.error('Error processing bot response:', error)
            res.status(500).json({ error: 'Failed to process bot response' })
        }
    })

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
}