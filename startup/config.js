require('dotenv').config();

module.exports = () => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('FATAL ERROR: ACCESS_TOKEN_SECRET is not defined!');
  }
};
