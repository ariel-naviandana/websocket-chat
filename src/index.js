const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const bodyParser = require('body-parser')
const logger = require('../helpers/logger')
const { sequelize } = require('../models')
const path = require('path')
const { scopePerRequest } = require('awilix-express')
const container = require('./container')
const setupRoutes = require('./routes')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.', 'views'))
app.use(scopePerRequest(container))

setupRoutes(app, container, io)

sequelize.sync().then(() => {
    server.listen(8000, () => {
        logger.info('Server is running on port 8000')
    })
})

process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at:', p, 'reason:', reason)
})