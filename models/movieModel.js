const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genreModel');

const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 250,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 250,
    },
  })
);

const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
};

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
