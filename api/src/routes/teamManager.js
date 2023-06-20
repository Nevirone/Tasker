const express = require('express');

const TeamModel = require('../models/Team');
const UserModel = require('../models/User');

const router = express.Router();

// Joining a team
router.post('/join', async (req, res) => {
  if (!req.body.token)
    return res.status(400).send({ message: 'token: No token provided' });

  let team = await TeamModel.findOne({ token: req.body.token });

  if (!team) return res.status(404).send({ message: 'Token invalid' });

  const user = await UserModel.findOne({ _id: req.user._id });

  console.log(user);

  let found = false;
  team.users.forEach((user) => {
    if (user._id == req.user._id) found = true;
  });
  if (found)
    return res.status(409).send({ message: 'You are already in this team' });

  team.users = [...team.users, user];

  try {
    await team.save();
    res.status(200).send({ message: `${team.name} joined` });
  } catch (error) {
    console.log(`Team join error: ${error}`);
    res.status(500).send();
  }
});

//Remove user from team
router.delete('/:teamId/:userId', async (req, res) => {
  let team = await TeamModel.findOne({ _id: req.params.teamId });
  if (!team)
    return res.status(404).send({ message: 'Found no team with given id' });

  const user = UserModel.findOne({ _id: req.params.userId });
  if (!user)
    return res.status(404).send({ message: 'Found user with given id' });

  if (team.owner._id != req.user._id)
    return res.status(403).send({ message: 'You are not the owner' });

  team.users = team.users.filter((user) => user._id != req.params.userId);
  team.tasks = team.tasks.filter(
    (task) => task.author._id != req.params.userId,
  );

  try {
    await team.save();
    res.status(200).send({ message: 'User removed' });
  } catch (error) {
    console.log(`Team user delete error: ${error}`);
    res.status(500).send();
  }
});

module.exports = router;
