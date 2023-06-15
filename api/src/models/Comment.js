const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true }, // user id
  created_at: { type: Date, default: Date.now },
});

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;
