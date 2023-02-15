require('dotenv').config();

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 16,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, isAdmin: this.isAdmin },
    process.env.ACCESS_TOKEN_SECRET
  );

  return token;
};

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
};

module.exports.User = User;
module.exports.validate = validateUser;
