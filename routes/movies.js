const { Movie, validate } = require('../models/movieModel');
const { Genre } = require('../models/genreModel');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.status(200).send(movies);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    res.status(400).send('Invalid Genre');
  }

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie = await movie.save();

  res.status(200).send(movie);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const updatedMovie = await Movie.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!updatedMovie) {
    res.status(404).send(`Customer not found with ID: ${id}`);
  }

  res.status(200).send(updatedMovie);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const movie = await Movie.findByIdAndRemove(id);

  if (!movie) {
    res.status(404).send(`Customer not found with ID: ${id}`);
  }

  res.status(200).send(movie);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const movie = Movie.findById(id);

  if (!movie) {
    res.status(404).send(`Customer not found with ID: ${id}`);
  }
  res.status(200).send(movie);
});

module.exports = router;
