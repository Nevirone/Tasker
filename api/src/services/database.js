const mongoose = require('mongoose');

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGODB, connectionParams);
  } catch (error) {
    console.log(`Connection error: ${error}`);
  }
};

module.exports = connect;
