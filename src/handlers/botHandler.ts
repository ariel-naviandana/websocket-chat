import { Server, Socket } from 'socket.io'
import { IBotService } from '../services/IBotService'

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
            socket.on('message', async (data: { text: string }) => {
                try {
                    const response = await this.botService.processMessage(data)
                    socket.emit('botResponse', response)
                } catch (error) {
                    console.error('Error processing bot message:', error)
                }
            })

            socket.on('disconnect', () => {
            })
        })
    }
}

export { BotHandler }