const express = require('express');
const Task = require('../models/Task');

const { authAdmin } = require('../middlewares/index');

const router = express.Router();

router.get('/', authAdmin, async (req, res) => {
  try {
    const tasks = await Task.find({});
    tasks.filter((task) => task.created_by === req.user._id);
    res.status(200).send({ tasks: tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  if (!req.body.title)
    return res.status(400).send({ message: 'No title provided' });

  if (req.body.completed === undefined)
    return res.status(400).send({ message: 'No completion status provided' });

  const task = Task({
    title: req.body.title,
    completed: req.body.completed,
    created_by: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send({ message: 'Task created' });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch('/:id', authAdmin, async (req, res) => {
  if (!req.body.title && req.body.completed === undefined)
    return res.status(204).send({ message: 'No changes provided' });

  const task = await Task.findOne({ _id: req.params.id });

  if (!task)
    return res.status(404).send({ message: 'Found no task with given id' });

  task.title = req.body.title ? req.body.title : task.title;
  if (req.body.completed !== undefined) {
    task.completed = req.body.completed;
    if (req.body.completed && task.objectives.length > 0) {
      task.objectives.map((objective) => (objective.completed = true));
    }
  }

  try {
    task.save();
    res.status(200).send({ message: 'Task updated' });
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
