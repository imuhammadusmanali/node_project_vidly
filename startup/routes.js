const express = require('express');

const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const login = require('../routes/login');
const returns = require('../routes/returns');

const auth = require('../middlewares/authware');
const error = require('../middlewares/error');

module.exports = (app) => {
  app.use(express.json());
  app.use('/api/genres', genres);
  app.use('/api/customers', auth, customers);
  app.use('/api/movies', auth, movies);
  app.use('/api/rentals', auth, rentals);
  app.use('/api/users', users);
  app.use('/api/login', login);
  app.use('/api/returns', returns);

  app.use(error);
};
