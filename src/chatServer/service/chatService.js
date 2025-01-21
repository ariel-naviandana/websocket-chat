const messageRepository = require('../repository/messageRepository');

const saveMessage = async (message) => {
    return await messageRepository.saveMessage(message);
};

module.exports = {
    saveMessage,
};