const { Message } = require('../../../models');

const saveMessage = async (data) => {
    try {
        await Message.create({
            text: data.text,
            senderId: data.id,
        });
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

module.exports = {
    saveMessage,
};