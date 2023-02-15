require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).send('Acces Denied: No Token Provided!');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid  Token!');
  }
};

module.exports = auth;
