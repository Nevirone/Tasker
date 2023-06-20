const express = require('express');

const TeamModel = require('../models/Team');
const UserModel = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
  // Validate
  const error = TeamModel.validateName(req.body.name);
  if (error) return res.status(400).send({ message: `name: ${error}` });

  // Check if name is unused
  const duplicate = await TeamModel.findOne({ name: req.body.name });

  if (duplicate)
    return res.status(409).send({ message: 'Name already taken!' });

  const owner = await UserModel.findOne({ _id: req.user._id });
  // Create new team
  try {
    const team = TeamModel({
      name: req.body.name,
      owner: owner,
      users: [owner],
    });

    const token = team.generateToken();
    await team.save();

    res.status(200).send({ message: 'Team created!', data: token });
  } catch (error) {
    console.log(`Team create error: ${error}`);
    res.status(500).send();
  }
});

router.get('/', async (req, res) => {
  try {
    let teams = await TeamModel.find({});

    // Filter only those where user is found
    teams = teams.filter((team) => {
      let found = false;
      team.users.forEach((user) => {
        if (user._id == req.user._id) found = true;
      });
      return found;
    });

    res.status(200).send({ data: teams });
  } catch (error) {
    console.log(`Team get error: ${error}`);
    res.status(500).send();
  }
});

router.get('/:teamId', async (req, res) => {
  try {
    const team = await TeamModel.findOne({ _id: req.params.teamId });

    // Filter only those where user is found
    let found = false;
    team.users.forEach((user) => {
      if (user._id == req.user._id) found = true;
    });

    if (!found)
      return res.status(403).send({ message: 'You are not in this team' });

    res.status(200).send({ data: team });
  } catch (error) {
    console.log(`Team get error: ${error}`);
    res.status(500).send();
  }
});

router.patch('/:id', async (req, res) => {
  // Check if any data is provided
  if (!req.body.name && !req.body.owner)
    return res.status(400).send({ message: 'No data provided!' });

  if (req.body.name) {
    const error = TeamModel.validateName(req.body.name);
    if (error) return res.status(400).send({ message: `name: ${error}` });
  }

  try {
    let newOwner = null;
    if (req.body.owner) {
      newOwner = await UserModel.findOne({ _id: req.body.owner });
      if (!newOwner)
        return res
          .status(400)
          .send({ message: `owner: User with given id not found` });
    }

    const team = await TeamModel.findOne({ _id: req.params.id });

    // Found no team with given id
    if (!team)
      return res.status(404).send({ message: 'Found no team with given id!' });

    if (team.owner != req.user._id)
      return res.status(403).send({ message: 'You are not the owner' });

    // Change user data to those provided
    team.name = req.body.name ? req.body.name : team.name;
    team.owner = req.body.owner ? req.body.owner : team.owner;

    // Save changes
    await team.save();
    res.status(200).send({ message: 'Team updated!' });
  } catch (error) {
    console.log(`Team update error: ${error}`);
    res.status(500).send();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const team = await TeamModel.findOne({ _id: req.params.id });

    // Found no team with given id
    if (!team)
      return res.status(404).send({ message: 'Found no team with given id!' });

    if (team.owner._id != req.user._id)
      return res.status(403).send({ message: 'You are not the owner' });

    // TODO - Remove tasks associated with team

    // Delete user
    team.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: 'Team deleted!' });
  } catch (error) {
    console.log(`Team delete error: ${error}`);
    res.status(500).send();
  }
});

module.exports = router;
