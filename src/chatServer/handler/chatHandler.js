const chatHandler = (io, chatService) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('message', async (data) => {
            try {
                await chatService.saveMessage(data);
                io.emit('message', data);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('typing', () => {
            socket.broadcast.emit('typing');
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};

module.exports = chatHandler;