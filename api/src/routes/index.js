const authRouter = require('./auth');
const userRouter = require('./user');
const taskRouter = require('./task');
const teamRouter = require('./team');
const teamManageRouter = require('./teamManager');

module.exports = {
  authRouter,
  userRouter,
  taskRouter,
  teamRouter,
  teamManageRouter,
};
