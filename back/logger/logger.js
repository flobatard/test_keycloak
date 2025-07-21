const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, json, colorize, align } = format;
require('winston-daily-rotate-file');
const correlationId = require('express-correlation-id');

// Custom format for logging
const logFormat = printf(({ level, message, timestamp, correlationId }) => {
  return JSON.stringify({
    timestamp,
    level,
    correlationId,
    message,
  });
});

// Create logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',  
  format: combine(
    timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    format(info => (
      {
        ...info,
        correlationId: correlationId.getId() || 'no-correlation-id (probably not an api call)',
        node: process.pid
      }
  ))()),
  transports: [
    new transports.Console({
      format: format.combine(
        colorize({all: true}), 
        align(),
        printf((info) => 
        {
          const resInfo = {
            ...info,
            timestamp: undefined,
            correlationId: undefined,
            level: undefined,
            message: undefined
          }
          return `[${info.timestamp}] (${info.correlationId}) ${info.level}: ${info.message} : ${JSON.stringify(resInfo)}`
        }))
    }),
    new transports.DailyRotateFile({
      filename: 'logs/boc-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: json(),
    }),
    new transports.DailyRotateFile({
      level: "warn",
      filename: 'logs/boc-errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: json(),
    }),
  ],
});

module.exports = logger;