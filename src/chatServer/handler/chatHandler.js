const chatHandler = (io, chatService) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', data);
        });

        socket.on('message', async (data) => {
            await chatService.saveMessage(data);
            socket.broadcast.emit('message', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = chatHandler;