const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, colorize } = format

const logFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`
})

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        }),
        new transports.File({ filename: 'logs/application.log' })
    ],
})

module.exports = logger