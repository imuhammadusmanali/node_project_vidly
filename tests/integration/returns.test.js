const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');
const { Rental } = require('../../models/rentalModel');
const { User } = require('../../models/userModel');
const { Movie } = require('../../models/movieModel');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const exec = async () => {
    return await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../app');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      genre: { name: '12345' },
      numberInStock: 10,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '1234567890',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it('should return 401 when client is not logged in', async () => {
    token = '';
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    movieId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental is found for customer/movie', async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return 400 if rental is already processed', async () => {
    rental.returnedDate = new Date();
    await rental.save();
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if we have a valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the returnedDate if the request is valid', async () => {
    const res = await exec();

    const requiredRental = await Rental.findById(rental._id);
    const diff = new Date() - requiredRental.returnedDate;

    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should set the rental fee if the request is valid', async () => {
    rental.rentedDate = moment().add(-7, 'days').toDate();
    await rental.save();
    const res = await exec();

    const requiredRental = await Rental.findById(rental._id);

    expect(requiredRental.rentalFee).toBe(14);
  });

  it('should increase the movie stock if input is valid', async () => {
    const res = await exec();

    const requiredMovie = await Movie.findById(movieId);

    expect(requiredMovie.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return the rental if input is valid', async () => {
    const res = await exec();

    const requiredRental = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'rentedDate',
        'returnedDate',
        'rentalFee',
        'customer',
        'movie',
      ])
    );
  });
});
