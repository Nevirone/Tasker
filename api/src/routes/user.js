const express = require('express');
const bcrypt = require('bcrypt');

const { authAdmin } = require('../middlewares/index');
const { User } = require('../models/User');

const router = express.Router();

router.get('/', authAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ users: users });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get('/me', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(200).send({ user: user });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch('/:id', authAdmin, async (req, res) => {
  if (
    !req.body.firstName &&
    !req.body.lastName &&
    !req.body.email &&
    !req.body.password
  )
    return res.status(204).send({ message: 'No changes provided' });

  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user)
      return res.status(404).send({ message: 'Found no user with given id' });

    user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
    user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
    user.email = req.body.email ? req.body.email : user.email;

    if (req.body.password) {
      const hash = await bcrypt.hash(
        req.body.password,
        10,
      );
      user.password = hash;
    }

    user.save();
    res.status(200).send({ message: 'User created' });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user)
      return res.status(404).send({ message: 'Found no user with given id' });

    user.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: 'User deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
