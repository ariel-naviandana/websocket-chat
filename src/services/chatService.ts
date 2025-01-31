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
        return this.messageRepository.saveMessage({
            ...data,
            status: data.status ?? 'terkirim'
        })
    }

    async getMessages(): Promise<Message[]> {
        return this.messageRepository.getMessages()
    }

    async updateMessageStatus(id: number, status: string): Promise<void> {
        return this.messageRepository.updateMessageStatus(id, status)
    }
}

export default ChatService