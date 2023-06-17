const mongoose = require('mongoose');

const UserModel = require('./User');

const teamSchema = mongoose.Schema({
  token: { type: String, required: true },
  name: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
  users: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel,
      },
    ],
    default: [],
  },
  created_at: { type: Date, default: Date.now },
});

teamSchema.methods.addUser = function (userId) {
  if (!userId) return;
  if (this.users.includes(userId)) return;
  this.users.push(userId);
};

teamSchema.methods.removeUser = function (userId) {
  let users = this.users;
  users = users.filter((user) => user._id == userId);
  this.users = users;
};

teamSchema.statics.validateToken = function (token) {
  if (!token) return 'No token provided';
  if (token.length < 6) return 'Token must contain at least 6 letters';
  if (token.length > 32) return 'Token can only contain 32 letters';
  if (!token.match(/^[a-zA-Z\s]*$/))
    return 'Token can only consist of letters and spaces';
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
