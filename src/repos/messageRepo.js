import Message from "../models/message"

class MessageRepo {
    async getAllMessages() {
        return await Message.findAll()
    }

    async saveMessage(message) {
        return await Message.create(message)
    }
}
export default MessageRepo