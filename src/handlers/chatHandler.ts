import axios from 'axios'
import multer, { StorageEngine } from 'multer'
import path from 'path'
import express, { Application, Request, Response } from 'express'
import fs from 'fs'
import { Server, Socket } from 'socket.io'
import { IChatService, MessageData } from '../services/IChatService'

const storage: StorageEngine = multer.diskStorage({
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
    private io: Server
    private chatService: IChatService

    constructor(io: Server, chatService: IChatService) {
        this.io = io
        this.chatService = chatService
        this.initializeSocketEvents()
    }

    private initializeSocketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log('a user connected')

            socket.on('message', async (data: MessageData) => {
                try {
                    data.senderId = data.senderId || socket.id
                    data.createdAt = data.createdAt ?? new Date()
                    data.status = 'terkirim'

                    this.io.emit('message', data)

                    if (data.text && data.receiverId === 'bot') {
                        const response = await axios.post('http://localhost:8000/bot', { text: data.text })
                        const botMessage = response.data

                        if (botMessage) {
                            const botData: MessageData = {
                                text: botMessage,
                                senderId: 'bot',
                                receiverId: data.senderId,
                                createdAt: new Date(),
                                status: 'terkirim'
                            }
                            this.io.emit('message', botData)
                            await this.chatService.saveMessage(botData)
                        }
                    }
                } catch (error) {
                    console.error('Error processing message:', error)
                }
            })

            socket.on('messageRead', async (data: { messageId: number }) => {
                try {
                    await axios.put('http://localhost:8000/updateMessageStatus', { messageId: data.messageId, status: 'dibaca' })
                    this.io.emit('statusUpdated', { messageId: data.messageId, status: 'dibaca' })
                } catch (error) {
                    console.error('Error updating message status:', error)
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

    public setupRoutes(app: Application): void {
        app.post('/sendMessage', upload.single('image'), async (req: Request, res: Response) => {
            try {
                const { senderId, text, receiverId } = req.body
                let imageUrl: string | undefined = undefined

                if (req.file) {
                    imageUrl = `/uploads/${req.file.filename}`
                }

                const messageData: MessageData = {
                    senderId,
                    receiverId,
                    text,
                    imageUrl,
                    createdAt: new Date(),
                    status: 'terkirim'
                }
                console.log('Saving message to database:', messageData)
                const responseData = await this.chatService.saveMessage(messageData)
                res.json(responseData)
            } catch (error) {
                console.error('Error sending message:', error)
                res.status(500).json({ error: 'Failed to send message' })
            }
        })

        app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
    }
}

export { ChatHandler }