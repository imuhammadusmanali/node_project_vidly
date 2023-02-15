require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../../../models/userModel');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    const user = new User(payload);

    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    expect(decoded).toMatchObject(payload);
  });
});
