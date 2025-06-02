const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET||'tripsync_secret_key', { expiresIn: '7d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
