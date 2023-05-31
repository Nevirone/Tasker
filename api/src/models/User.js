const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  admin: { type: Boolean, default: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// JWT
userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '30m',
    },
  );
  return token;
};

const User = mongoose.model('User', userSchema);

// Validation
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
