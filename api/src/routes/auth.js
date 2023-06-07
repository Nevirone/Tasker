const express = require('express');
const joi = require('joi');
const bcrypt = require('bcrypt');

const { User, validateUser } = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required().label('Email'),
    password: joi.string().required().label('Password'),
  });

  const { error } = schema.validate(req.body);

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

  const token = user.generateJWT();

  // Login success
  return res
    .status(200)
    .send({ token: token, message: 'Logged in successfully' });
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

    // User created
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

module.exports = router;
