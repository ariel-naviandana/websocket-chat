import { configure, getLogger } from 'log4js'

configure({
    appenders: { out: { type: 'stdout' } },
    categories: { default: { appenders: ['out'], level: 'info' } }
})

const logger = getLogger()

export default logger