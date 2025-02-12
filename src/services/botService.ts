import { IBotService } from './IBotService'
import { IMessageRepository } from '../repos/IMessageRepository'
import { Message, MessageData } from "./IChatService"

interface IMessage {
    text: string
    senderId: string
    receiverId: string
    imageUrl?: string
    createdAt?: Date
    status?: string
}

class BotService implements IBotService {
    private messageRepository: IMessageRepository

    constructor({ messageRepository }: { messageRepository: IMessageRepository }) {
        this.messageRepository = messageRepository
    }

    async processMessage(message: IMessage): Promise<string | null> {
        const keywords = ['help', 'info']
        let response: string | null = null

        for (const keyword of keywords) {
            if (message.text.toLowerCase().includes(keyword)) {
                response = `Bot received the keyword: ${keyword}`
                break
            }
        }

        return response
    }

    async updateMessageStatus(id: number, status: string): Promise<Message> {
        return this.messageRepository.updateMessageStatus(id, status)
    }

    async saveMessage(data: MessageData): Promise<Message> {
        if (!data.senderId) {
            throw new Error('senderId is required')
        }
        if (!data.receiverId) {
            throw new Error('receiverId is required')
        }
        return this.messageRepository.saveMessage({
            ...data,
            status: data.status ?? 'terkirim'
        })
    }
}

export default BotService