const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const logger = require('../logger');
const chatHandler = require('./handler/chatHandler');
const chatService = require('./service/chatService');
const { sequelize } = require('../../models');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Chat Room' });
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (data) => {
        io.emit('message', data);
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

sequelize.sync().then(() => {
    server.listen(8000, () => {
        logger.info('Chat server is running on port 8000');
    });
});

process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at:', p, 'reason:', reason);
});