import { Sequelize, DataTypes, Model, Optional } from 'sequelize'

interface MessageAttributes {
    id: number
    text?: string
    senderId: string
    imageUrl?: string
    createdAt: Date
    updatedAt: Date
    status?: string
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'text' | 'imageUrl' | 'status'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    public id!: number
    public text?: string
    public senderId!: string
    public imageUrl?: string
    public createdAt!: Date
    public updatedAt!: Date
    public status?: string
}

export function initMessageModel(sequelize: Sequelize): typeof Message {
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
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'terkirim'
            }
        },
        {
            sequelize,
            modelName: 'Message',
            tableName: 'Messages',
            timestamps: true,
        }
    )

    return Message
}

export default initMessageModel