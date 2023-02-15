const { Genre, validate } = require('../models/genreModel');
const admin = require('../middlewares/adminware');
const auth = require('../middlewares/authware');
const validateObjectId = require('../middlewares/validateObjectId');

const express = require('express');
const router = express.Router();

// const genreSchema = new mongoose.Schema({
//   _id: String,
//   name: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 50,
//   },
// });

// const genres = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Horror" },
//   { id: 3, name: "Romance" },
// ];

router.get('/', async (req, res, next) => {
  const genres = await Genre.find().sort('name');
  res.status(200).send(genres);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  let genre = new Genre({ name: req.body.name });

  genre = await genre.save();

  res.status(200).send(genre);
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const updatedGenre = await Genre.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { new: true }
  );

  if (!updatedGenre) {
    res.status(404).send(`Genre was not found with given ID: ${id}`);
  }

  res.status(200).send(updatedGenre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const { id } = req.params;
  const genre = await Genre.findByIdAndRemove(id);

  if (!genre) {
    res.status(404).send(`Genre was not found with given ID: ${id}`);
  }

  res.status(200).send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const { id } = req.params;

  const genre = await Genre.findById(id);

  if (!genre) {
    res.status(404).send(`Genre was not found with given ID: ${id}`);
  }

  res.status(200).send(genre);
});

module.exports = router;
