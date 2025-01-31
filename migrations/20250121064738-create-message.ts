import { QueryInterface, DataTypes } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      senderId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      receiverId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      text: {
        type: Sequelize.STRING,
        allowNull: true
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'terkirim'
      }
    })
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('Messages')
  }
}