const { User } = require('../models/User');

const authAdmin = async (req, res, next) => {
  const decodedUser = req.user;

  if (!decodedUser)
    return res.status(403).send({ message: 'No token validation' });

  const user = await User.findOne({ _id: req.user._id });

  if (!user) return res.status(500).send({ message: 'Internal Server Error' });

  if (!user.admin) return res.status(401).send({ message: 'Unauthorized' });

  next();
};

module.exports = authAdmin;
