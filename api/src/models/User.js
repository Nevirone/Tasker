const mongoose = require('mongoose');
const joi = require('joi');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const validateUser = (data) => {
  const schema = joi.object({
    firstName: joi.string().required().label('First Name'),
    lastName: joi.string().required().label('Last Name'),
    email: joi.string().email().required().label('Email'),
    password: joi.string().required().label('Password'),
  });

  return schema.validate(data);
};

module.exports = { User, validateUser };
