import { QueryInterface } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert('messages', [
      {
        senderId: 'user1',
        text: 'Hello, this is a test message.',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        senderId: 'user2',
        text: 'Hi, this is another test message.',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        senderId: 'user3',
        text: 'Hello everyone!',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        senderId: 'user4',
        text: 'Good morning!',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete('messages', {}, {})
  }
}