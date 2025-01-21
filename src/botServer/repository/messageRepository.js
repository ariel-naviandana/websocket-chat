const { Message } = require('../../../models');

const saveMessage = async (message) => {
    return await Message.create(message);
};

module.exports = {
    saveMessage,
};