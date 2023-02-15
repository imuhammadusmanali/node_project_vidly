require('dotenv').config();

const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/userModel');
const auth = require('../middlewares/authware');

const express = require('express');
const router = express.Router();

router.get('/:me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('name email');

  res.status(200).send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res
      .status(400)
      .send(`User Already Registered! under Email: ${req.body.email}`);
  }

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .status(200)
    .send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
