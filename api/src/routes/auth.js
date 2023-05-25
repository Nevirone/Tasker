const express = require('express');
const joi = require('joi');
const bcrypt = require('bcrypt');

const { User, validateUser } = require('../models/User');

const router = express.Router();

const validateLoginData = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().label('Email'),
    password: joi.string().required().label('Password'),
  });

  return schema.validate(data);
};

router.post('/login', async (req, res) => {
  const { error } = validateLoginData(req.body);

  // Validation failed
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });

  // Found no user with given email
  if (!user)
    return res.status(401).send({ message: 'Invalid Email or Password' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  // Password is incorrect
  if (!validPassword)
    return res.status(401).send({ message: 'Invalid Email or Password' });

  // Login success
  // TODO - sign and send JWT token
  return res.status(200).send({ message: 'Logged in successfully' });
});

router.post('/register', async (req, res) => {
  const { error } = validateUser(req.body);

  //  Validation failed
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });

  // Email unique
  if (user)
    return res
      .status(409)
      .send({ message: 'User with given email already exists' });

  const hash = await bcrypt.hash(
    req.body.password,
    Number(process.env.SALT_ROUNDS),
  );

  // Error when saving user
  try {
    await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
    }).save();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }

  // User created
  res.status(200).send({ message: 'User created successfully' });
});

module.exports = router;
