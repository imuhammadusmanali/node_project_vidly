const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 20,
    },
    phone: {
      type: String,
      required: true,
      minlength: 13,
      maxlength: 20,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
  })
);

const validateCustomers = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(20).required(),
    phone: Joi.string().min(13).max(13).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};

module.exports.Customer = Customer;
module.exports.validate = validateCustomers;
