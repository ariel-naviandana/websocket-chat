const axios = require('axios');
const multer = require('multer');
const path = require('path');
const express = require('express');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const chatHandler = (io, chatService) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('message', async (data) => {
            try {
                data.senderId = data.senderId || socket.id;
                data.createdAt = new Date().toISOString();

                await chatService.saveMessage(data);
                io.emit('message', data);

                if (data.text) {
                    const response = await axios.post('http://localhost:8001/bot', { text: data.text });
                    const botMessage = response.data;

                    if (botMessage) {
                        const botData = { text: botMessage, senderId: 'bot', createdAt: new Date().toISOString() };
                        await chatService.saveMessage(botData);
                        io.emit('message', botData);
                    }
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', { senderId: data.senderId || socket.id });
        });

        socket.on('stopTyping', (data) => {
            socket.broadcast.emit('stopTyping', { senderId: data.senderId || socket.id });
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};

const sendMessage = (app, chatService) => {
    app.post('/sendMessage', upload.single('image'), async (req, res) => {
        try {
            const { senderId, text } = req.body;
            console.log('Received request:', req.body, req.file);
            let imageUrl = null;

            if (req.file) {
                imageUrl = `/uploads/${req.file.filename}`;
            }

            const messageData = { senderId, text, imageUrl, createdAt: new Date().toISOString() }; // Set createdAt to current time in ISO format
            await chatService.saveMessage(messageData);
            res.json(messageData);
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Failed to send message' });
        }
    });

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
};

module.exports = { chatHandler, sendMessage };