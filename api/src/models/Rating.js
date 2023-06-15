const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
  positive: { type: Boolean, required: true },
  author: { type: String, required: true }, // user id
});

const RatingModel = mongoose.model('Rating', ratingSchema);

module.exports = RatingModel;
