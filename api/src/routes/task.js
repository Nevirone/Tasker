const express = require('express');
const TaskModel = require('../models/Task');
const TeamModel = require('../models/Team');
const UserModel = require('../models/User');

const router = express.Router();

router.post('/:teamId', async (req, res) => {
  // Validation
  let error = TaskModel.validateTitle(req.body.title);
  if (error) return res.status(400).send({ message: `title: ${error}` });

  error = TaskModel.validateContent(req.body.content);
  if (error) return res.status(400).send({ message: `content: ${error}` });

  error = TaskModel.validateStatus(req.body.status);
  if (error) return res.status(400).send({ message: `status: ${error}` });

  // check if team exists
  const team = await TeamModel.findOne({ _id: req.params.teamId });
  if (!team) return res.status(404).send({ message: 'Team not found' });

  const author = await UserModel.findOne({ _id: req.user._id });

  const task = TaskModel({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    author: author,
    team: req.params.teamId,
  });

  try {
    team.tasks.push(task);
    await team.save();
    res.status(201).send({ message: `New task created in ${team.name}!` });
  } catch (error) {
    res.status(500).send();
    console.log(`Task post error: ${error}`);
  }
});

router.get('/:teamId', async (req, res) => {
  try {
    const team = await TeamModel.findOne({ _id: req.params.teamId });

    if (!team)
      return res.status(404).send({ message: 'Team with given id not found' });
    res.status(200).send({ data: team.tasks });
  } catch (error) {
    res.status(500).send();
    console.log(`Task get error: ${error}`);
  }
});

router.get('/:teamId/:taskId', async (req, res) => {
  try {
    const team = await TeamModel.findOne({ _id: req.params.teamId });

    if (!team)
      return res.status(404).send({ message: 'Team with given id not found' });

    const index = team.tasks.findIndex((task) => task._id == req.params.taskId);

    if (index === -1)
      return res.status(404).send({ message: 'Task not found' });

    res.status(200).send({ data: team.tasks[index] });
  } catch (error) {
    res.status(500).send();
    console.log(`Task get error: ${error}`);
  }
});

router.patch('/:teamId/:id', async (req, res) => {
  if (!req.body.title && !req.body.content && !req.body.status)
    return res.status(400).send({ message: 'No data provided!' });

  // Validation
  if (req.body.title) {
    const error = TaskModel.validateTitle(req.body.title);
    if (error) return res.status(400).send({ message: `title: ${error}` });
  }

  if (req.body.content) {
    const error = TaskModel.validateContent(req.body.content);
    if (error) return res.status(400).send({ message: `content: ${error}` });
  }

  if (req.body.status) {
    const error = TaskModel.validateStatus(req.body.status);
    if (error) return res.status(400).send({ message: `status: ${error}` });
  }

  try {
    const team = await TeamModel.findOne({ _id: req.params.teamId });

    if (!team)
      return res.status(404).send({ message: 'Found no team with given id' });

    const index = team.tasks.findIndex((task) => task._id == req.params.id);

    if (index === -1)
      return res.status(404).send({ message: 'Found no task with given id' });

    if (team.tasks[index].author._id != req.user._id)
      return res.status(403).send({ message: 'You are not the author' });

    // Change user data to those provided
    team.tasks[index].title = req.body.title
      ? req.body.title
      : team.tasks[index].title;
    team.tasks[index].content = req.body.content
      ? req.body.content
      : team.tasks[index].content;
    team.tasks[index].status = req.body.status
      ? req.body.status
      : team.tasks[index].status;

    // Save changes
    await team.save();
    res.status(200).send({ message: 'Task updated!' });
  } catch (error) {
    console.log(`Task update error: ${error}`);
    res.status(500).send();
  }
});

router.delete('/:teamId/:id', async (req, res) => {
  try {
    let team = await TeamModel.findOne({ _id: req.params.teamId });
    // Found no task with given id
    if (!team)
      return res.status(404).send({ message: 'Found no team with given id' });

    const index = team.tasks.findIndex((task) => task._id == req.params.id);

    if (index === -1)
      return res.status(404).send({ message: 'Found no task with given id' });

    if (
      team.tasks[index].author._id != req.user._id &&
      team.owner._id != req.user._id
    )
      return res.status(403).send({ message: 'You are not the author' });

    // Delete task
    team.tasks = team.tasks.filter((task) => task._id != req.params.id);
    await team.save();
    res.status(200).send({ message: 'Task deleted' });
  } catch (error) {
    console.log(`Task delete error: ${error}`);
    res.status(500).send();
  }
});

module.exports = router;
