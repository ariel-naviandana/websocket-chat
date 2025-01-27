const messageRepository = require('../repos/messageRepository')

const keywords = ['help', 'info']

const processMessage = async (message) => {
    let response = null

    for (const keyword of keywords) {
        if (message.text.toLowerCase().includes(keyword)) {
            response = `Bot received the keyword: ${keyword}`
            break
        }
    }

    return response
}

module.exports = {
    processMessage,
}