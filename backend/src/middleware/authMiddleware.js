const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: token missing' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
    req.user = { userId: payload.userId, email: payload.email };
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
}

module.exports = { requireAuth };
