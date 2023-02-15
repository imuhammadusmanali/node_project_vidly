const { Rental, validate } = require('../models/rentalModel');
const { Customer } = require('../models/customerModel');
const { Movie } = require('../models/movieModel');
// const Fawn = require('fawn');

const express = require('express');
const router = express.Router();

// Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-rentedDate');
  res.status(200).send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    res.status(400).send('Invalid Customer');
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    res.status(400).send('Invalid Movie');
  }

  if (movie.numberInStock === 0) {
    res.status(400).send(`${movie.name} is Out of Stock`);
  }

  // const session = await mongoose.startSession();

  // session.startTransaction();

  // try {
  //   const rental = new Rental({
  //     customer: {
  //       _id: customer._id,
  //       name: customer.name,
  //       phone: customer.phone,
  //     },
  //     movie: {
  //       _id: movie._id,
  //       title: movie.title,
  //       dailyRentalRate: movie.dailyRentalRate,
  //     },
  //   });

  //   await rental.save({ session });

  //   movie.numberInStock--;
  //   await movie.save({ session });

  //   await session.commitTransaction();
  //   console.log('Transaction Committed!');
  // } catch (err) {
  //   await session.abortTransaction();

  //   console.error('Transaction Aborted...', err);
  // } finally {
  //   session.endSession();
  // }

  // rental = await rental.save();

  // movie.numberInStock--;
  // movie.save();

  try {
    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    rental = await rental.save();

    movie.numberInStock--;
    movie.save();

    res.status(200).send(rental);
  } catch (err) {
    // There's flaw in movie stock with this approach
    res.status(500).send('Somthing went wrong please recreate the rental');
  }

  // try {
  //   new Fawn.Task()
  //     .save('rentals', rental)
  //     .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
  //     .run();

  //   res.status(200).send(rental);
  // } catch (err) {
  //   res.status(500).send('Something Failed');
  // }
});

module.exports = router;
