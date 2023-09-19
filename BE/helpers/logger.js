const winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    }),
  ],
  exitOnError: false
});

const info = (context, message, scope) => {
  logger.info({ context, scope, message });
};

const warn = (context, message, scope) => {
  logger.warn({ context, scope, message });
};

const error = (context, message, scope) => {
  logger.error({ context, scope, message });
};

const log = (context, message, scope) => {
  logger.debug({ context, scope, message });
};

module.exports = {
  log,
  info,
  warn,
  error
};
