import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Definisikan antarmuka untuk atribut Model
interface MessageAttributes {
  id: number;
  text?: string;
  senderId: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Definisikan antarmuka untuk atribut yang dapat diisi
interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'text' | 'imageUrl'> {}

// Buat model dengan Sequelize
module.exports = (sequelize: Sequelize) => {
  class Message extends Model<MessageAttributes, MessageCreationAttributes>
      implements MessageAttributes {
    public id!: number;
    public text?: string;
    public senderId!: string;
    public imageUrl?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  Message.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        text: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        senderId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'Message',
        tableName: 'Messages',
        timestamps: true,
      }
  );

  return Message;
};