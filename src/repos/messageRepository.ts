import initMessageModel from '../../models/message'
import { IMessageRepository, MessageData, Message as MessageType } from './IMessageRepository'
import { sequelize } from '../../models'

const Message = initMessageModel(sequelize)

class MessageRepository implements IMessageRepository {
    async saveMessage(data: MessageData): Promise<MessageType> {
        try {
            if (!data.senderId) {
                throw new Error('senderId is required')
            }
            if (!data.receiverId) {
                throw new Error('receiverId is required')
            }
            const message = await Message.create({
                text: data.text,
                senderId: data.senderId,
                receiverId: data.receiverId,
                imageUrl: data.imageUrl,
                createdAt: data.createdAt ?? new Date(),
                updatedAt: new Date(),
                status: data.status ?? 'terkirim'
            })
            return message as any as MessageType
        } catch (error) {
            console.error('Error saving message:', error)
            throw error
        }
    }

    async getMessages(): Promise<MessageType[]> {
        try {
            const messages = await Message.findAll({
                order: [['createdAt', 'ASC']]
            })
            return messages as any as MessageType[]
        } catch (error) {
            console.error('Error fetching messages:', error)
            throw error
        }
    }

    async updateMessageStatus(id: number, status: string): Promise<MessageType> {
        try {
            const message = await Message.findByPk(id)
            if (!message) {
                throw new Error('Message not found')
            }
            message.status = status
            const messageSaved = await message.save()
            return messageSaved as any as MessageType
        } catch (error) {
            console.error('Error updating message status:', error)
            throw error
        }
    }
}

export { MessageRepository }