const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const bodyParser = require('body-parser')
const multer = require('multer')
const logger = require('../helpers/logger')
const { chatHandler, sendMessage } = require('./handlers/chatHandler')
const botHandler = require('./handlers/botHandler')
const { sequelize } = require('../models')
const path = require('path')
const { scopePerRequest } = require('awilix-express')
const container = require('./container')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.', 'views'))

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

app.use(scopePerRequest(container))

chatHandler(io, container.resolve('chatService'))
botHandler(io, container.resolve('botService'))

app.get('/', (req, res) => {
    res.render('index', { title: 'Chat Room' })
})

app.get('/messages', async (req, res) => {
    try {
        const chatService = req.container.resolve('chatService')
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

        const chatService = req.container.resolve('chatService')
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
        const botService = req.container.resolve('botService')
        const response = await botService.processMessage({ text })
        res.json(response)
    } catch (error) {
        console.error('Error processing bot response:', error)
        res.status(500).json({ error: 'Failed to process bot response' })
    }
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

sequelize.sync().then(() => {
    server.listen(8000, () => {
        logger.info('Server is running on port 8000')
    })
})

process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at:', p, 'reason:', reason)
})