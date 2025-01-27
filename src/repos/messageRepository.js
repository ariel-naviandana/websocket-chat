const { Message } = require('../../models')

const saveMessage = async (data) => {
    try {
        if (!data.senderId) {
            throw new Error('senderId is required')
        }
        await Message.create({
            text: data.text,
            senderId: data.senderId,
            imageUrl: data.imageUrl,
            createdAt: data.createdAt
        })
    } catch (error) {
        console.error('Error saving message:', error)
        throw error
    }
}

const getMessages = async () => {
    try {
        return await Message.findAll({
            order: [['createdAt', 'ASC']]
        })
    } catch (error) {
        console.error('Error fetching messages:', error)
        throw error
    }
}

module.exports = {
    saveMessage,
    getMessages
}