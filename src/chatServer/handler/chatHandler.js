const chatHandler = (io, chatService) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('message', async (data) => {
            try {
                // Save the message to the database
                await chatService.saveMessage(data);
                // Broadcast the message to all clients
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