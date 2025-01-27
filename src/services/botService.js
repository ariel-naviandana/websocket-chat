class BotService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository
    }

    async processMessage(message) {
        const keywords = ['help', 'info']
        let response = null

        for (const keyword of keywords) {
            if (message.text.toLowerCase().includes(keyword)) {
                response = `Bot received the keyword: ${keyword}`
                break
            }
        }

        return response
    }
}

module.exports = BotService