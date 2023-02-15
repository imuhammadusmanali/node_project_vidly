const moment = require('moment');

const mongoose = require('mongoose');

const { Rental } = require('../models/rentalModel');
const { Movie } = require('../models/movieModel');
const auth = require('../middlewares/authware');

const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  if (!req.body.customerId) {
    res.status(400).send('Customer ID is not Provided!');
  }
  if (!req.body.movieId) {
    res.status(400).send('Movie ID is not Provided!');
  }

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) {
    res.status(404).send('Rental not Found!');
  }

  if (rental.returnedDate) {
    res.status(400).send('Rental Already Processed!');
  }

  rental.returned();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  res.status(200).send(rental);
});

module.exports = router;
