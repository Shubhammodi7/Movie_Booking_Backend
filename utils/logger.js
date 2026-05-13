const winston = require('winston');
const dotenvResult = require('dotenv').config()
const { NODE_ENV } = dotenvResult.parsed || {}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),

  defaultMeta: { service: 'booking-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log ', level: 'error'}),
    new winston.transports.File({ filename: 'logs/combined.log'}),
  ],
});

if(NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}


module.exports = logger;