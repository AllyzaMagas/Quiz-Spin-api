const { Host, User } = require('../models');

async function findByUsername(username) {
  const user = await User.findOne({ where: { username }, include: [{ association: 'hostProfile' }] });
  return user?.hostProfile || null;
}

async function findById(hostId) {
  return Host.findByPk(hostId, { include: [{ association: 'user' }] });
}

async function createHost(data) {
  return Host.create(data);
}

module.exports = { findByUsername, findById, createHost };