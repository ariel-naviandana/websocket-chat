const messageRepository = require('../repository/messageRepository');

const processMessage = async (message) => {
    const response = `Bot received: ${message.text}`;
    await messageRepository.saveMessage({ ...message, text: response });
    return response;
};

module.exports = {
    processMessage,
};