import { Server, Socket } from 'socket.io'
import { IBotService } from '../services/IBotService'
import axios from 'axios'

class BotHandler {
    private io: Server
    private botService: IBotService

    constructor(io: Server, botService: IBotService) {
        this.io = io
        this.botService = botService
        this.initializeSocketEvents()
    }

    private initializeSocketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            socket.on('message', async (data: { text: string, senderId: string, receiverId: string, imageUrl?: string, createdAt?: Date }) => {
                try {
                    const response = await this.botService.processMessage(data)
                    socket.emit('botResponse', response)
                } catch (error) {
                    console.error('Error processing bot message:', error)
                }
            })

            socket.on('messageRead', async (data: { messageId: number }) => {
                try {
                    await axios.put('http://localhost:8000/updateMessageStatus', { messageId: data.messageId, status: 'dibaca' })
                    socket.emit('statusUpdated', { messageId: data.messageId, status: 'dibaca' })
                } catch (error) {
                    console.error('Error updating message status:', error)
                }
            })

            socket.on('disconnect', () => {
            })
        })
    }
}

export { BotHandler }