const service = require('../services/auth.service');

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  const result = await service.loginHost({ username, password });
  res.json(result);
}

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  const result = await service.registerHost({ username, password });
  res.status(201).json({ user_id: result.user.user_id, host_id: result.host.host_id, username: result.user.username });
}

module.exports = { login, register };