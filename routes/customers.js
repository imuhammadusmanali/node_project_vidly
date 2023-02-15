const { Customer, validate } = require('../models/customerModel');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');

  res.status(200).send(customers);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  customer = await customer.save();

  res.status(200).send(customer);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );

  if (!updatedCustomer) {
    res.status(404).send(`Customer not found with ID: ${id}`);
  }

  res.status(200).send(updatedCustomer);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const customer = await Customer.findByIdAndRemove(id);

  if (!customer) {
    res.status(404).send(`Customer not found with ID: ${id}`);
  }

  res.status(200).send(customer);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const customer = Customer.findById(id);

  if (!customer) {
    res.status(404).send(`Customer not found with ID: ${id}`);
  }
  res.status(200).send(customer);
});

module.exports = router;
