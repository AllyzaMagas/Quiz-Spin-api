const { Player, GameSession } = require('../models');

async function joinSession(sessionId, nickname) {
  const session = await GameSession.findByPk(sessionId);
  if (!session) return { error: 'SESSION_NOT_FOUND' };
  if (session.status !== 'waiting' && session.status !== 'active') return { error: 'SESSION_NOT_JOINABLE' };

  const existing = await Player.findOne({
    where: { session_id: sessionId, nickname },
  });
  if (existing) return { error: 'NICKNAME_TAKEN' };

  const player = await Player.create({ session_id: sessionId, nickname });
  return { player };
}

async function findPlayerById(playerId) {
  return Player.findByPk(playerId);
}

async function updatePlayerScore(playerId, points) {
  const player = await Player.findByPk(playerId);
  if (!player) return null;
  player.score += points;
  await player.save();
  return player;
}

async function getLeaderboard(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    order: [['score', 'DESC'], ['joined_at', 'ASC']],
  });
}

module.exports = { joinSession, findPlayerById, updatePlayerScore, getLeaderboard };