const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const logger = require('../../helpers/logger');
const botHandler = require('./handler/botHandler');
const botService = require('./service/botService');
const { sequelize } = require('../../models');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

botHandler(io, botService);

sequelize.sync().then(() => {
    server.listen(8001, () => {
        logger.info('Bot server is running on port 8001');
    });
});

process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at:', p, 'reason:', reason);
});