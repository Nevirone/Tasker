const express = require('express');
const TaskModel = require('../models/Task');

const router = express.Router();

router.post('/', async (req, res) => {
  // Validation
  let error = TaskModel.validateTitle(req.body.title);
  if (error) return res.status(400).send({ message: `title: ${error}` });

  error = TaskModel.validateContent(req.body.content);
  if (error) return res.status(400).send({ message: `content: ${error}` });

  const task = TaskModel({
    title: req.body.title,
    content: req.body.content,
    author: req.user.username,
  });

  try {
    await task.save();
    res.status(201).send({ message: 'New task created!' });
  } catch (error) {
    res.status(500).send();
    console.log(`Task post error: ${error}`);
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await TaskModel.find({});
    res.status(200).send({ data: tasks });
  } catch (error) {
    res.status(500).send();
    console.log(`Task get error: ${error}`);
  }
});

module.exports = router;
