const botHandler = (io, botService) => {
    io.on('connection', (socket) => {
        socket.on('message', async (data) => {
            const response = await botService.processMessage(data)
            if (response) {
                socket.emit('message', response)
            }
        })
    })
}

module.exports = botHandler