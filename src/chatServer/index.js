const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const logger = require('../../helpers/logger');
const { chatHandler, sendMessage } = require('./handler/chatHandler');
const chatService = require('./service/chatService');
const { sequelize } = require('../../models');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

chatHandler(io, chatService);
sendMessage(app, chatService);

app.get('/', (req, res) => {
    res.render('index', { title: 'Chat Room' });
});

app.get('/messages', async (req, res) => {
    try {
        const messages = await chatService.getMessages();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

sequelize.sync().then(() => {
    server.listen(8000, () => {
        logger.info('Chat server is running on port 8000');
    });
});

process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at:', p, 'reason:', reason);
});