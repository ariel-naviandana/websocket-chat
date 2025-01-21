import express, { json } from 'express'
import { Server } from 'ws'
import { info } from './helpers/logger'
import MessageRepo from './repos/messageRepo'
import ChatService from './service/chatService'
import clientHandler from './handlers/clientHandler'
import botHandler from './handlers/botHandler'

const app = express()
const port = process.env.PORT || 3000
const messageRepo = new MessageRepo()
const chatService = new ChatService(messageRepo)

app.use(json())

const server = app.listen(port, () => {
    info(`Server is running on port ${port}`)
})

const wss = new Server({ server })

wss.on('connection', (ws, req) => {
    const url = req.url
    if (url === '/client') {
        clientHandler(ws, chatService)
    } else if (url === '/bot') {
        botHandler(ws, chatService)
    }
})