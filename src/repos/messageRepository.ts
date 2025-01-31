import db from '../../models'
import { IMessageRepository, MessageData, Message } from './IMessageRepository'

class MessageRepository implements IMessageRepository {
    async saveMessage(data: MessageData): Promise<void> {
        try {
            if (!data.senderId) {
                throw new Error('senderId is required')
            }
            await db.Message.create({
                text: data.text,
                senderId: data.senderId,
                imageUrl: data.imageUrl,
                createdAt: data.createdAt ?? new Date(),
                updatedAt: new Date()
            })
        } catch (error) {
            console.error('Error saving message:', error)
            throw error
        }
    }

    async getMessages(): Promise<Message[]> {
        try {
            const messages = await db.Message.findAll({
                order: [['createdAt', 'ASC']]
            })
            return messages as any as Message[]
        } catch (error) {
            console.error('Error fetching messages:', error)
            throw error
        }
    }
}

export { MessageRepository }