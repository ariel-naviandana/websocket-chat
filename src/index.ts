import express, { Application } from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import bodyParser from 'body-parser'
import logger from '../helpers/logger'
import { sequelize } from '../models'
import path from 'path'
import { scopePerRequest } from 'awilix-express'
import container from './container'
import setupRoutes from './routes'

const app: Application = express()
const server = http.createServer(app)
const io: SocketIOServer = new SocketIOServer(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(scopePerRequest(container))

setupRoutes(app, container, io)

sequelize.sync().then(() => {
    server.listen(8000, () => {
        logger.info('Server is running on port 8000')
    })
})

process.on('unhandledRejection', (reason: any, p: Promise<any>) => {
    logger.error('Unhandled Rejection at:', p, 'reason:', reason)
})