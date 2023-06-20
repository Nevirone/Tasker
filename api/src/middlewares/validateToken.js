const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) return res.status(401).send({ message: 'No token provided!' });

  // Token send - verify it
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      console.log(`Token verification failed`);
      return res.status(401).send();
    }

    req.user = decodedUser;

    console.log(`Token verified for user: ${req.user._id} - ${req.user.email}`);
    next();
  });
};

module.exports = validateToken;
