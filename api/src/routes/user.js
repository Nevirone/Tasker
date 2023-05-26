const express = require('express');
const { validateToken, authAdmin } = require('../middlewares/index');
const { User } = require('../models/User');

const router = express.Router();

router.get('/', validateToken, authAdmin, async (req, res) => {
  const users = await User.find({});
  res.status(200).send({ users: users });
});

router.get('/me', validateToken, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });

  if (!user) return res.status(500).send({ message: 'Internal Server Error' });

  res.status(200).send({ user: user });
});

module.exports = router;
