const mongoose = require('mongoose');

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;

const connect = async () => {
  try {
    await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
    console.log('Connected to database');
  } catch (error) {
    console.log(`Connecting to database error: ${error}`);
    process.exit();
  }
};

module.exports = connect;
