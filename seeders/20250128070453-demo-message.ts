import { QueryInterface } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert('Messages', [
      {
        senderId: 'user1',
        receiverId: 'user2',
        text: 'Hello, this is a test message.',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'terkirim'
      },
      {
        senderId: 'user2',
        receiverId: 'user3',
        text: 'Hi, this is another test message.',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'terkirim'
      },
      {
        senderId: 'user3',
        receiverId: 'user4',
        text: 'Hello everyone!',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'terkirim'
      },
      {
        senderId: 'user4',
        receiverId: 'user1',
        text: 'Good morning!',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'terkirim'
      }
    ])
  },

  down: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete('Messages', {}, {})
  }
}