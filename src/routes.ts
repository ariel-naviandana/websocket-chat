import express, { Request, Response } from 'express'
import { Application as ExpressApp } from 'express-serve-static-core'
import multer, { StorageEngine } from 'multer'
import path from 'path'
import { Server } from 'socket.io'
import {ChatHandler} from './handlers/chatHandler'
// import {BotHandler} from './handlers/botHandler'
import { IChatService } from './services/IChatService'
import { IBotService } from './services/IBotService'

export default (app: ExpressApp, container: any, io: Server): void => {
    const chatService: IChatService = container.resolve('chatService')
    const chatHandler = new ChatHandler(io, chatService)
    chatHandler.setupRoutes(app)

    const botService: IBotService = container.resolve('botService')
    // const botHandler = new BotHandler(io, botService)

    const storage: StorageEngine = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, 'uploads')
            cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname))
        }
    })
    const upload = multer({ storage: storage })

    app.get('/', (req: Request, res: Response) => {
        res.render('index', { title: 'Chat Room' })
    })

    app.get('/messages', async (req: Request, res: Response) => {
        try {
            const messages = await chatService.getMessages()
            res.json(messages)
        } catch (error) {
            console.error('Error fetching messages:', error)
            res.status(500).json({ error: 'Failed to fetch messages' })
        }
    })

    app.post('/sendMessage', upload.single('image'), async (req: Request, res: Response) => {
        try {
            const { senderId, text } = req.body
            let imageUrl: string | undefined = undefined

            if (req.file) {
                imageUrl = `/uploads/${req.file.filename}`
            }

            const messageData = { senderId, text, imageUrl, createdAt: new Date() }
            console.log('Saving message to database:', messageData)
            await chatService.saveMessage(messageData)
            res.json(messageData)
        } catch (error) {
            console.error('Error sending message:', error)
            res.status(500).json({ error: 'Failed to send message' })
        }
    })

    app.post('/bot', async (req: Request, res: Response) => {
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