class BotHandler {
    constructor(io, botService) {
        this.io = io
        this.botService = botService
        this.initializeSocketEvents()
    }

    initializeSocketEvents() {
        this.io.on('connection', (socket) => {
            socket.on('message', async (data) => {
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

module.exports = BotHandler