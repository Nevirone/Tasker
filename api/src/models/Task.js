const mongoose = require('mongoose');

const UserModel = require('./User');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ['Normal', 'Urgent', 'Critical'],
    required: true,
  },
  author: { type: UserModel.schema, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, required: true },
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

taskSchema.statics.validateStatus = function (status) {
  const states = ['Normal', 'Urgent', 'Critical'];
  if (!status) return `Status must be provided [${states.join(', ')}]`;
  if (!states.includes(status)) return `Wrong status [${states.join(', ')}]`;
};

const TaskModel = mongoose.model('Task', taskSchema);

module.exports = TaskModel;
