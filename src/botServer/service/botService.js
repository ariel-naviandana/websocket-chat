const messageRepository = require('../repository/messageRepository');

const processMessage = async (message) => {
    const response = `Bot received: ${message.text}`;
    await messageRepository.saveMessage({ ...message, text: response, senderId: 'bot' });
    return response;
};

module.exports = {
    processMessage,
};