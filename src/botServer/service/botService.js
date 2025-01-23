const messageRepository = require('../repository/messageRepository');

const keywords = ['halo', 'help', 'info'];

const processMessage = async (message) => {
    let response = null;

    for (const keyword of keywords) {
        if (message.text.toLowerCase().includes(keyword)) {
            response = `Bot received the keyword: ${keyword}`;
            break;
        }
    }

    if (response) {
        await messageRepository.saveMessage({ ...message, text: response, senderId: 'bot' });
    }

    return response;
};

module.exports = {
    processMessage,
};