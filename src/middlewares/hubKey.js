const env = require('../config/env');

function requireHubKey(req, res, next) {
  const apiKey = req.headers['x-hub-api-key'] || req.query.hub_api_key;
  if (!apiKey || apiKey !== env.hubApiKey) {
    return res.status(401).json({ error: 'Invalid or missing Hub API key' });
  }
  next();
}

module.exports = { requireHubKey };