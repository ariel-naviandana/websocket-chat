import fs from 'fs'
import path from 'path'
import { Sequelize, DataTypes, Model, ModelCtor, Options } from 'sequelize'

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'

interface CustomOptions extends Options {
    use_env_variable?: string
}

interface AnyModel extends ModelCtor<Model> {
    associate?: (db: { [key: string]: AnyModel }) => void
}

const config = require(__dirname + '/../config/config.json')[env] as CustomOptions

const db: { [key: string]: AnyModel } = {}

let sequelize: Sequelize
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable] as string, config)
} else {
    sequelize = new Sequelize(config.database as string, config.username as string, config.password as string, config)
}

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes) as AnyModel
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate!(db)
    }
})

export { sequelize, Sequelize }
export default db