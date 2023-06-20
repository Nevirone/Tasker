const mongoose = require('mongoose');
const crypto = require('crypto');

const UserModel = require('./User');
const TaskModel = require('./Task');

const teamSchema = mongoose.Schema({
  token: { type: String, required: true },
  name: { type: String, required: true },
  owner: { type: UserModel.schema, required: true },
  users: { type: [{ type: UserModel.schema, required: true }], required: true },
  tasks: { type: [{ type: TaskModel.schema, required: true }], default: [] },
  created_at: { type: Date, default: Date.now },
});

teamSchema.methods.generateToken = function () {
  const token = crypto.randomBytes(4).toString('hex').substring(0, 6);
  this.token = token;
  return token;
};

teamSchema.statics.validateName = function (name) {
  if (!name) return 'No name provided';
  if (name.length < 3) return 'Name must contain at least 3 letters';
  if (name.length > 32) return 'Name can only contain 32 letters';
  if (!name.match(/^[a-zA-Z\s]*$/))
    return 'Name can only consist of letters and spaces';
};

const TeamModel = mongoose.model('Team', teamSchema);

module.exports = TeamModel;
