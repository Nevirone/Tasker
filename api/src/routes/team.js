const express = require('express');
const bcrypt = require('bcrypt');

const authAdmin = require('../middlewares/authAdmin');

const TeamModel = require('../models/Team');
const UserModel = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
  // Validate
  let error = TeamModel.validateToken(req.body.token);
  if (error) return res.status(400).send({ message: `token: ${error}` });

  error = TeamModel.validateName(req.body.name);
  if (error) return res.status(400).send({ message: `name: ${error}` });

  // Check if token and name are unused
  const hash = await bcrypt.hash(req.body.token, 10);
  let duplicate = await TeamModel.findOne({ token: hash });

  if (duplicate)
    return res.status(409).send({ message: 'Token already taken!' });

  duplicate = await TeamModel.findOne({ name: req.body.name });

  if (duplicate)
    return res.status(409).send({ message: 'Name already taken!' });

  // Create new team
  try {
    const team = TeamModel({
      token: hash,
      name: req.body.name,
      owner: req.user._id,
      users: [req.user._id],
    });

    await team.save();
    res.status(200).send({ message: 'Team created!' });
  } catch (error) {
    console.log(`Team create error: ${error}`);
    res.status(500).send();
  }
});

router.get('/', async (req, res) => {
  try {
    let teams = await TeamModel.find({}).populate('users').populate('owner');

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

router.get('/admin/', authAdmin, async (req, res) => {
  try {
    let teams = await TeamModel.find({}).populate('users').populate('owner');
    res.status(200).send({ data: teams });
  } catch (error) {
    console.log(`Team get error: ${error}`);
    res.status(500).send();
  }
});

router.patch('/:id', async (req, res) => {
  // Check if any data is provided
  if (!req.body.token && !req.body.name && !req.body.owner)
    return res.status(400).send({ message: 'No data provided!' });

  // Validate given data
  if (req.body.token) {
    const error = TeamModel.validateToken(req.body.token);
    if (error) return res.status(400).send({ message: `token: ${error}` });
  }

  if (req.body.name) {
    const error = TeamModel.validateName(req.body.name);
    if (error) return res.status(400).send({ message: `name: ${error}` });
  }

  if (req.body.owner) {
    try {
      const owner = await UserModel.findOne({ _id: req.body.owner });
      if (!owner)
        return res
          .status(400)
          .send({ message: `owner: User with given id not found` });
    } catch {
      return res
        .status(400)
        .send({ message: `owner: User with given id not found` });
    }
  }

  try {
    const team = await TeamModel.findOne({ _id: req.params.id });

    // Found no team with given id
    if (!team)
      return res.status(404).send({ message: 'Found no team with given id!' });

    if (team.owner != req.user._id)
      return res.status(403).send({ message: 'You are not the owner' });

    // Change user data to those provided
    if (req.body.token) {
      const hash = await bcrypt.hash(req.body.token, 10);
      team.token = hash;
    }
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

router.patch('/admin/:id', authAdmin, async (req, res) => {
  // Check if any data is provided
  if (!req.body.token && !req.body.name && !req.body.owner)
    return res.status(400).send({ message: 'No data provided!' });

  // Validate given data
  if (req.body.token) {
    const error = TeamModel.validateToken(req.body.token);
    if (error) return res.status(400).send({ message: `token: ${error}` });
  }

  if (req.body.name) {
    const error = TeamModel.validateName(req.body.name);
    if (error) return res.status(400).send({ message: `name: ${error}` });
  }

  if (req.body.owner) {
    try {
      const owner = await UserModel.findOne({ _id: req.body.owner });
      if (!owner)
        return res
          .status(400)
          .send({ message: `owner: User with given id not found` });
    } catch {
      return res
        .status(400)
        .send({ message: `owner: User with given id not found` });
    }
  }

  try {
    const team = await TeamModel.findOne({ _id: req.params.id });

    // Found no team with given id
    if (!team)
      return res.status(404).send({ message: 'Found no team with given id!' });

    // Change team data to those provided
    if (req.body.token) {
      const hash = await bcrypt.hash(req.body.token, 10);
      team.token = hash;
    }
    team.name = req.body.name ? req.body.name : team.name;
    team.owner = req.body.owner ? req.body.owner : team.owner;

    // Save changes
    await team.save();
    res.status(200).send({ message: 'Team updated!' });
  } catch (error) {
    console.log(`Team admin update error: ${error}`);
    res.status(500).send();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const team = await TeamModel.findOne({ _id: req.params.id });

    // Found no team with given id
    if (!team)
      return res.status(404).send({ message: 'Found no team with given id!' });

    if (team.owner != req.user._id)
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

router.delete('/admin/:id', authAdmin, async (req, res) => {
  try {
    const team = await TeamModel.findOne({ _id: req.params.id });

    // Found no team with given id
    if (!team)
      return res.status(404).send({ message: 'Found no team with given id!' });

    // TODO - Remove tasks associated with team

    // Delete user
    team.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: 'Team deleted!' });
  } catch (error) {
    console.log(`Team admin delete error: ${error}`);
    res.status(500).send();
  }
});

// Joining a team
router.post('/join', async (req, res) => {
  if (!req.body.token)
    return res.status(400).send({ message: 'token: No token provided' });

  let teams = await TeamModel.find({});

  if (teams.length === 0)
    return res.status(404).send({ message: 'Token invalid' });

  teams = teams.filter((team) =>
    bcrypt.compareSync(req.body.token, team.token),
  );

  if (teams.length === 0)
    return res.status(404).send({ message: 'Token invalid' });

  const team = teams[0];
  team.addUser(req.user._id);

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
  const team = TeamModel.findOne({ _id: req.params.teamId });
  if (!team) return res.status(404).send({ message: 'Team not found' });

  if (team.owner != req.user._id)
    return res.status(403).send({ message: 'You are not the owner' });

  team.removeUser(req.params.userId);

  try {
    await team.save();
    res.status(200).send({ message: 'User removed' });
  } catch (error) {
    console.log(`Team user delete error: ${error}`);
    res.status(500).send();
  }
});

module.exports = router;
