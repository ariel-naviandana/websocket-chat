import Message from '../model/message'

class ChatService {
    constructor(messageRepo) {
        this.messageRepo = messageRepo
    }

    async getMessages() {
        return await this.messageRepo.getAllMessages()
    }

    async addMessage(content, sender) {
        const message = new Message(content, sender, new Date())
        await this.messageRepo.saveMessage(message)
    }
}

export default ChatService