const express = require('express');
const Task = require('../models/Task');

const { authAdmin } = require('../middlewares/index');

const router = express.Router();

router.get('/my', async (req, res) => {
  try {
    const tasks = await Task.find({});
    tasks.filter((task) => task.created_by === req.user._id);
    res.status(200).send({ tasks: tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get('/', authAdmin, async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send({ tasks: tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  if (!req.body.title)
    return res.status(400).send({ message: 'No title provided' });

  const task = Task({
    title: req.body.title,
    created_by: req.user._id,
    objectives: [],
  });

  try {
    await task.save();
    res.status(201).send({ message: 'Task created' });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post('/my/:id', async (req, res) => {
  if (!req.body.title)
    return res.status(400).send({ message: 'No title provided' });

  const task = await Task.findOne({ _id: req.params.id });

  if (!task)
    return res.status(404).send({ message: 'Found no task with given id' });

  if (task.created_by != req.user._id) return res.status(401).send();

  task.addObjective(req.body.title);

  try {
    await task.save();
    res.status(201).send({ message: 'Objective added' });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post('/my/:id/objective/:objectiveId', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });

  if (!task)
    return res.status(404).send({ message: 'Found no task with given id' });

  if (task.created_by != req.user._id) return res.status(401).send();

  task.switchCompleted(req.params.objectiveId);

  try {
    await task.save();
    res.status(201).send({ message: 'Objective updated' });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.delete('/my/:id/objective/:objectiveId', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });

  if (!task)
    return res.status(404).send({ message: 'Found no task with given id' });

  if (task.created_by != req.user._id) return res.status(401).send();

  task.removeObjective(req.params.objectiveId);

  try {
    await task.save();
    res.status(201).send({ message: 'Objective removed' });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.delete('/my/:id', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });

  if (!task)
    return res.status(404).send({ message: 'Found no task with given id' });

  if (task.created_by != req.user._id) return res.status(401).send();

  try {
    task.deleteOne({ _id: req.params.id });
    return res.status(200).send({ message: 'Task deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.delete('/:id', authAdmin, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });

  if (!task)
    return res.status(404).send({ message: 'Found no task with given id' });

  try {
    task.deleteOne({ _id: req.params.id });
    return res.status(200).send({ message: 'Task deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
