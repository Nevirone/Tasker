const express = require('express');
const bcrypt = require('bcrypt');

const UserModel = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
  // Validate
  let error = UserModel.validateEmail(req.body.email);
  if (error) return res.status(400).send({ message: `email: ${error}` });

  if (!req.body.password)
    return res.status(400).send({ message: 'Invalid Email or Password!' });

  try {
    const user = await UserModel.findOne({ email: req.body.email });

    // Found no user with given email
    if (!user)
      return res.status(403).send({ message: 'Invalid Email or Password!' });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    // Password is incorrect
    if (!validPassword)
      return res.status(403).send({ message: 'Invalid Email or Password!' });

    const token = user.generateJWT();

    // Login success
    res.status(200).send({ message: 'Logged in successfully!', token: token });
  } catch (error) {
    console.log(`User login error: ${error}`);
    res.status(500).send();
  }
});

router.post('/register', async (req, res) => {
  // Validation
  let error = UserModel.validateFirstName(req.body.firstName);
  if (error) return res.status(400).send({ message: `firstName: ${error}` });

  error = UserModel.validateLastName(req.body.lastName);
  if (error) return res.status(400).send({ message: `lastName: ${error}` });

  error = UserModel.validateEmail(req.body.email);
  if (error) return res.status(400).send({ message: `email: ${error}` });

  error = UserModel.validatePassword(req.body.password);
  if (error) return res.status(400).send({ message: `password: ${error}` });

  // Email unique
  const user = await UserModel.findOne({ email: req.body.email });

  if (user)
    return res
      .status(409)
      .send({ message: 'User with given email already exists!' });

  const hash = await bcrypt.hash(req.body.password, 10);

  const newUser = UserModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
  });

  // Create new user
  try {
    await newUser.save();
    res.status(201).send({ message: 'User created!' });
  } catch (error) {
    res.status(500).send();
    console.log(`User creation error: ${error}`);
  }
});

module.exports = router;
