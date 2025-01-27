const messageRepository = require('../repos/messageRepository')

const saveMessage = async (data) => {
    if (!data.senderId) {
        throw new Error('senderId is required')
    }
    return messageRepository.saveMessage(data)
}

const getMessages = async () => {
    return messageRepository.getMessages()
}

module.exports = {
    saveMessage,
    getMessages
}