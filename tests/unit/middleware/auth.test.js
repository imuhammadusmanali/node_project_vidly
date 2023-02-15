const { User } = require('../../../models/userModel');
const auth = require('../../../middlewares/authware');
const mongoose = require('mongoose');

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();

    const res = {};
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
