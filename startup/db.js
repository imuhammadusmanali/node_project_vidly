require('dotenv').config();

const winston = require('winston');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

module.exports = () => {
  let db = process.env.DB;
  if (process.env.NODE_ENV === 'test') {
    db = process.env.TEST_DB;
  }
  mongoose.connect(db).then(() => {
    winston.info(`Connected to ${db}...`);
  });
};
