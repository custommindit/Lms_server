const winston = require('winston');
const { format, transports } = winston;

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ 
      filename: 'logs/errors.log', 
      level: 'error' 
    })
  ]
});

module.exports = logger;
