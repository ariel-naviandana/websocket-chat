import { IChatService, MessageData, Message } from './IChatService'
import { IMessageRepository } from '../repos/IMessageRepository'

class ChatService implements IChatService {
    private messageRepository: IMessageRepository

    constructor({ messageRepository }: { messageRepository: IMessageRepository }) {
        this.messageRepository = messageRepository
    }

    async saveMessage(data: MessageData): Promise<void> {
        if (!data.senderId) {
            throw new Error('senderId is required')
        }
        return this.messageRepository.saveMessage(data)
    }

    async getMessages(): Promise<Message[]> {
        return this.messageRepository.getMessages()
    }
}

export default ChatService