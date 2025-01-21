const axios = require('axios');

const chatHandler = (io, chatService) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('message', async (data) => {
            try {
                data.senderId = data.senderId || socket.id;

                await chatService.saveMessage(data);
                io.emit('message', data);

                const response = await axios.post('http://localhost:8001/bot', { text: data.text });
                const botMessage = response.data;

                if (botMessage) {
                    await chatService.saveMessage({ text: botMessage, senderId: 'bot' });
                    io.emit('message', { text: botMessage, senderId: 'bot' });
                }
            } catch (error) {
                console.error('Error processing message:', error);
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