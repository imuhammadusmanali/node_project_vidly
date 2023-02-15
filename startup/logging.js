require('express-async-errors');
const winston = require('winston');

module.exports = () => {
  winston.add(
    new winston.transports.File({
      filename: 'logFile.log',
    })
  );
  winston.add(new winston.transports.Console());

  process.on('uncaughtException', (err) => {
    winston.error(err.message, err);
    process.exit(1);
  });
  process.on('unhandledRejection', (err) => {
    winston.error(err.message, err);
    process.exit(1);
  });
};
