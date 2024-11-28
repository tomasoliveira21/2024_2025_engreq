// logger.js
require('dotenv').config();
const winston = require('winston');

// Logger configs
const logPath = process.env.LOG_PATH || './logs';
const logFileName = process.env.LOG_FILENAME || 'eng-req-api.log';

// Create a logger
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),

        new winston.transports.File({
            filename: `${logPath}/${logFileName}`,
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

// Export the logger for use in the app
module.exports = logger;