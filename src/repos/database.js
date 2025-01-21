import { Sequelize } from 'sequelize'
import { config as _config } from 'dotenv'
const config = require('../../config/config.json')[process.env.NODE_ENV || 'development']

_config()

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

export default sequelize