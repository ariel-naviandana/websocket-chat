const { Message } = require('../../../models');

const saveMessage = async (message) => {
    return Message.create(message);
};

module.exports = {
    saveMessage,
};