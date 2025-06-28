const { createLogger, transports, format } = require('winston');

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), customFormat),
    }),
    new transports.File({
      filename: 'logs/requests.log',
      format: customFormat,
    }),
  ],
});

module.exports = logger;
