const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const logger = require('../../logger');
const chatHandler = require('./handler/chatHandler');
const chatService = require('./service/chatService');
const { sequelize } = require('../../models');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

chatHandler(io, chatService);

sequelize.sync().then(() => {
    server.listen(8000, () => {
        logger.info('Chat server is running on port 8000');
    });
});