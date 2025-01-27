class IMessageRepository {
    async saveMessage(data) {
        throw new Error('Method not implemented.')
    }

    async getMessages() {
        throw new Error('Method not implemented.')
    }
}

module.exports = IMessageRepository