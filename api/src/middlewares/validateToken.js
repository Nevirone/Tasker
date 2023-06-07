const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) return res.status(403).send({ message: 'No token provided!' });

  // Token send - verify it
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).send();
    }

    // TODO - remove this
    console.log(`Token verified, User Id: ${decodedUser._id}`);

    req.user = decodedUser;

    next();
  });
};

module.exports = validateToken;
