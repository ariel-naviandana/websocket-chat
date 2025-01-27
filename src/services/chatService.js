class ChatService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository
    }

    async saveMessage(data) {
        if (!data.senderId) {
            throw new Error('senderId is required')
        }
        return this.messageRepository.saveMessage(data)
    }

    async getMessages() {
        return this.messageRepository.getMessages()
    }
}

module.exports = ChatService