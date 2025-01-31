import { createContainer, asClass, Resolver } from 'awilix'

import { IChatService } from './services/IChatService'
import { IBotService } from './services/IBotService'
import { IMessageRepository } from './repos/IMessageRepository'

import ChatService from './services/chatService'
import BotService from './services/botService'
import {MessageRepository} from './repos/messageRepository'

const container = createContainer()

container.register({
    messageRepository: asClass(MessageRepository).singleton().proxy() as Resolver<IMessageRepository>,
})

container.register({
    chatService: asClass(ChatService).singleton().proxy() as Resolver<IChatService>,
    botService: asClass(BotService).singleton().proxy() as Resolver<IBotService>,
})

export default container