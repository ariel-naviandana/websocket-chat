'use strict'

export default (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        content: DataTypes.STRING,
        sender: DataTypes.STRING,
        timestamp: DataTypes.DATE
    }, {})

    return Message
}