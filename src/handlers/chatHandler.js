const axios = require('axios')
const multer = require('multer')
const path = require('path')
const express = require('express')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads')

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

class ChatHandler {
    constructor(io, chatService) {
        this.io = io
        this.chatService = chatService
        this.initializeSocketEvents()
    }

    initializeSocketEvents() {
        this.io.on('connection', (socket) => {
            console.log('a user connected')

            socket.on('message', async (data) => {
                try {
                    data.senderId = data.senderId || socket.id
                    data.createdAt = new Date().toISOString()

                    this.io.emit('message', data)

                    if (data.text) {
                        const response = await axios.post('http://localhost:8000/bot', { text: data.text })
                        const botMessage = response.data

                        if (botMessage) {
                            const botData = { text: botMessage, senderId: 'bot', createdAt: new Date().toISOString() }
                            this.io.emit('message', botData)
                            await this.chatService.saveMessage(botData)
                        }
                    }
                } catch (error) {
                    console.error('Error processing message:', error)
                }
            })

            socket.on('typing', (data) => {
                socket.broadcast.emit('typing', { senderId: data.senderId || socket.id })
            })

            socket.on('stopTyping', (data) => {
                socket.broadcast.emit('stopTyping', { senderId: data.senderId || socket.id })
            })

            socket.on('disconnect', () => {
                console.log('user disconnected')
            })
        })
    }

    setupRoutes(app) {
        app.post('/sendMessage', upload.single('image'), async (req, res) => {
            try {
                const { senderId, text } = req.body
                let imageUrl = null

                if (req.file) {
                    imageUrl = `/uploads/${req.file.filename}`
                }

                const messageData = { senderId, text, imageUrl, createdAt: new Date().toISOString() }
                console.log('Saving message to database:', messageData)
                await this.chatService.saveMessage(messageData)
                res.json(messageData)
            } catch (error) {
                console.error('Error sending message:', error)
                res.status(500).json({ error: 'Failed to send message' })
            }
        })

        app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
    }
}

module.exports = ChatHandler