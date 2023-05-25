require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connect = require('./src/services/database');
const { authRouter } = require('./src/routes/index');

const app = express();

connect();

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello world!' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
