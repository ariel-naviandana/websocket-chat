const { createContainer, asClass, asValue, asFunction } = require('awilix')
const { scopePerRequest } = require('awilix-express')

const ChatService = require('./services/chatService')
const BotService = require('./services/botService')
const MessageRepository = require('./repos/messageRepository')

const container = createContainer()

container.register({
    messageRepository: asClass(MessageRepository).singleton(),
})

container.register({
    chatService: asClass(ChatService).singleton(),
    botService: asClass(BotService).singleton(),
})

module.exports = container