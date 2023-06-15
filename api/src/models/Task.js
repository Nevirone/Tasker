const mongoose = require('mongoose');

const RatingModel = require('./Rating');
const CommentModel = require('./Comment');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }, // user id
  comments: { type: [CommentModel.schema], default: [] },
  ratings: { type: [RatingModel.schema], default: [] },
  created_at: { type: Date, default: Date.now },
});

// Validation methods
taskSchema.statics.validateTitle = function (title) {
  if (!title) return 'Title must be provided';
  if (title.length === 0) return 'Title cannot be empty';
};

taskSchema.statics.validateContent = function (content) {
  if (!content) return 'Content must be provided';
  if (content.length === 0) return 'Content cannot be empty';
};

// Comment methods
taskSchema.methods.addComment = function (req, res) {
  if (req.body.content)
    return res.status(400).send({ message: 'Content not provided' });

  if (req.body.content.length === 0)
    return res.status(400).send({ message: 'Content empty' });

  const comment = CommentModel({
    content: req.body.content,
    author: req.user.username,
  });

  this.comments.push(comment);
};

const TaskModel = mongoose.model('Task', taskSchema);

module.exports = TaskModel;
