const express = require('express');
const TaskModel = require('../models/Task');
const TeamModel = require('../models/Team');

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
  const team = TeamModel.findOne({ _id: req.params.teamId });
  if (!team) return res.status(404).send({ message: 'Team not found' });

  // Check for duplacate
  const duplicate = await TaskModel.findOne({
    title: req.body.title,
    content: req.body.content,
    team: req.params.teamId,
  });

  if (duplicate) return res.status(409).send({ messsage: 'Duplicate found' });

  const task = TaskModel({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    author: req.user._id,
    team: req.params.teamId,
  });

  try {
    await task.save();
    res.status(201).send({ message: `New task created in ${team.name}!` });
  } catch (error) {
    res.status(500).send();
    console.log(`Task post error: ${error}`);
  }
});

router.get('/:teamId', async (req, res) => {
  try {
    let tasks = await TaskModel.find({ team: req.params.teamId }).populate(
      'author',
    );
    res.status(200).send({ data: tasks });
  } catch (error) {
    res.status(500).send();
    console.log(`Task get error: ${error}`);
  }
});

router.patch('/:id', async (req, res) => {
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
    const task = await TaskModel.findOne({ _id: req.params.id });

    // Found no task with given id
    if (!task)
      return res.status(404).send({ message: 'Found no task with given id!' });

    if (task.author != req.user._id)
      return res.status(401).send({ message: 'You are not the author' });

    // Change user data to those provided
    task.title = req.body.title ? req.body.title : task.title;
    task.content = req.body.content ? req.body.content : task.content;
    task.status = req.body.status ? req.body.status : task.status;

    // Save changes
    task.save();
    res.status(200).send({ message: 'Task updated!' });
  } catch (error) {
    console.log(`Task update error: ${error}`);
    res.status(500).send();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await TaskModel.findOne({ _id: req.params.id });

    // Found no task with given id
    if (!task)
      return res.status(404).send({ message: 'Found no task with given id' });

    if (task.author != req.user._id)
      return res.status(401).send({ message: 'You are not the author' });

    // Delete task
    task.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: 'Task deleted' });
  } catch (error) {
    console.log(`Task delete error: ${error}`);
    res.status(500).send();
  }
});

module.exports = router;
