const mongoose = require('mongoose');

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connect = async () => {
  try {
    mongoose.connect('mongodb://mongodb:27017/tasker', connectionParams);
  } catch (error) {
    console.log(`Connection error: ${error}`);
  }
};

module.exports = connect;
