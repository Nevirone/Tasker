const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  created_by: { type: String, required: true },
  objectives: {
    type: [
      {
        id: { type: Number, required: true },
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
  },
});

taskSchema.methods.addObjective = function (title) {
  if (title == ' ') return;
  let objectives = this.objectives;

  const lastId =
    this.objectives.length > 0
      ? this.objectives[this.objectives.length - 1].id
      : 0;

  objectives = [
    ...objectives,
    { id: lastId + 1, title: title, completed: false },
  ];

  this.objectives = objectives;
};

taskSchema.methods.removeObjective = function (id) {
  let objectives = this.objectives;
  objectives = objectives.filter((obj) => obj.id != id);

  this.objectives = objectives;
};

taskSchema.methods.switchCompleted = function (stringId) {
  let objectives = this.objectives;
  const id = Number(stringId);

  objectives.forEach((obj) => {
    if (obj.id === id) {
      obj.completed = !obj.completed;
    }
  });

  this.objectives = objectives;
};
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
