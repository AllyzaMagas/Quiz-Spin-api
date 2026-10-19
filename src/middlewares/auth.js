const authService = require('../services/auth.service');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.slice(7);
  const payload = await authService.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.authHost = { hostId: payload.hostId, userId: payload.userId, username: payload.username };
  next();
}

module.exports = { requireAuth };