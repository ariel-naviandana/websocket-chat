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

app.post('/bot', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await botService.processMessage({ text });
        res.json(response);
    } catch (error) {
        console.error('Error processing bot response:', error);
        res.status(500).json({ error: 'Failed to process bot response' });
    }
});

sequelize.sync().then(() => {
    server.listen(8001, () => {
        logger.info('Bot server is running on port 8001');
    });
});

process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at:', p, 'reason:', reason);
});