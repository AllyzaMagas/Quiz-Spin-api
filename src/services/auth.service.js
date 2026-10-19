const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Host } = require('../models');
const env = require('../config/env');

async function registerHost({ username, password }) {
  const existing = await User.findOne({ where: { username } });
  if (existing) {
    const err = new Error('Username already exists');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password_hash: passwordHash, role: 'host' });
  const host = await Host.create({ user_id: user.user_id });
  return { user, host };
}

async function loginHost({ username, password }) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const host = await Host.findOne({ where: { user_id: user.user_id } });
  const token = jwt.sign({ hostId: host.host_id, userId: user.user_id, username: user.username }, env.jwtSecret, { expiresIn: '24h' });
  return { token, host: { host_id: host.host_id, user_id: user.user_id, username: user.username } };
}

async function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }
}

module.exports = { registerHost, loginHost, verifyToken };