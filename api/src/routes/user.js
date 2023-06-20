const express = require('express');
const bcrypt = require('bcrypt');

const { authAdmin } = require('../middlewares/index');
const UserModel = require('../models/User');

const router = express.Router();

router.get('/', authAdmin, async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send({ data: users });
  } catch (error) {
    console.log(`User get error: ${error}`);
    res.status(500).send();
  }
});

router.get('/me', async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });

    res.status(200).send({ data: user });
  } catch (error) {
    console.log(`User get me error: ${error}`);
    res.status(500).send();
  }
});

router.patch('/', async (req, res) => {
  // Check if any data is provided
  if (
    !req.body.firstName &&
    !req.body.lastName &&
    !req.body.email &&
    !req.body.password
  )
    return res.status(400).send({ message: 'No data provided!' });

  // Validate
  if (req.body.firstName) {
    const error = UserModel.validateFirstName(req.body.firstName);
    if (error) return res.status(400).send({ message: `firstName: ${error}` });
  }

  if (req.body.lastName) {
    const error = UserModel.validateLastName(req.body.lastName);
    if (error) return res.status(400).send({ message: `lastName: ${error}` });
  }

  if (req.body.email) {
    const error = UserModel.validateEmail(req.body.email);
    if (error) return res.status(400).send({ message: `email: ${error}` });
  }

  if (req.body.password) {
    const error = UserModel.validatePassword(req.body.password);
    if (error) return res.status(400).send({ message: `password: ${error}` });
  }

  try {
    const user = await UserModel.findOne({ _id: req.user._id });

    // Change user data
    user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
    user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
    user.email = req.body.email ? req.body.email : user.email;

    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      user.password = hash;
    }

    // Save changes
    await user.save();
    res.status(200).send({ message: 'User updated!' });
  } catch (error) {
    console.log(`User patch error: ${error}`);
    res.status(500).send();
  }
});

router.patch('/admin/:id', authAdmin, async (req, res) => {
  // Check if any data is provided
  if (
    !req.body.firstName &&
    !req.body.lastName &&
    !req.body.email &&
    !req.body.password
  )
    return res.status(400).send({ message: 'No data provided!' });

  // Validate
  if (req.body.firstName) {
    const error = UserModel.validateFirstName(req.body.firstName);
    if (error) return res.status(400).send({ message: `firstName: ${error}` });
  }

  if (req.body.lastName) {
    const error = UserModel.validateLastName(req.body.lastName);
    if (error) return res.status(400).send({ message: `lastName: ${error}` });
  }

  if (req.body.email) {
    const error = UserModel.validateEmail(req.body.email);
    if (error) return res.status(400).send({ message: `email: ${error}` });
  }

  if (req.body.password) {
    const error = UserModel.validatePassword(req.body.password);
    if (error) return res.status(400).send({ message: `password: ${error}` });
  }

  try {
    const user = await UserModel.findOne({ _id: req.params.id });

    // Found no user with given id
    if (!user)
      return res.status(404).send({ message: 'Found no user with given id!' });

    // Change user data
    user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
    user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
    user.email = req.body.email ? req.body.email : user.email;

    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      user.password = hash;
    }

    // Save changes
    await user.save();
    res.status(200).send({ message: 'User updated!' });
  } catch (error) {
    console.log(`User admin patch error: ${error}`);
    res.status(500).send();
  }
});

router.delete('/', async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });

    // TODO - Remove posts asociated or set their author to null

    // Delete user
    await user.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: 'User deleted!' });
  } catch (error) {
    console.log(`User delete error: ${error}`);
    res.status(500).send();
  }
});

router.delete('/admin/:id', authAdmin, async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });

    // Found no user with given id
    if (!user)
      return res.status(404).send({ message: 'Found no user with given id!' });

    // TODO - Remove posts asociated or set their author to null

    // Delete user
    await user.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: 'User deleted!' });
  } catch (error) {
    console.log(`User admin delete error: ${error}`);
    res.status(500).send();
  }
});

module.exports = router;
