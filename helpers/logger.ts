import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Definisikan format log
const logFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Buat logger
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
});

export default logger;