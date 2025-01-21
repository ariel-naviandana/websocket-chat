const messageRepository = require('../repository/messageRepository');

const processMessage = async (message) => {
    // Implement your bot logic here
    const response = `Bot received: ${message.text}`;
    await messageRepository.saveMessage({ ...message, text: response });
    return response;
};

module.exports = {
    processMessage,
};