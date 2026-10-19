const service = require('../services/gameSession.service');

async function createSession(req, res) {
  const { questionSetId } = req.body;
  const session = await service.createSession(req.authHost.hostId, { questionSetId });
  res.status(201).json(session);
}

async function startSession(req, res) {
  const { sessionId } = req.params;
  const session = await service.startSession(Number(sessionId));
  res.json(session);
}

async function joinSession(req, res) {
  const { code } = req.params;
  const { nickname } = req.body;
  if (!nickname || nickname.trim().length === 0) {
    return res.status(400).json({ error: 'nickname required' });
  }
  const result = await service.joinSession(code, nickname.trim());
  res.status(201).json(result);
}

async function spinWheel(req, res) {
  const { sessionId } = req.params;
  const { playerId } = req.body;
  if (!playerId) {
    return res.status(400).json({ error: 'playerId required' });
  }
  const result = await service.spinWheel(Number(sessionId), Number(playerId));
  res.json(result);
}

async function submitAnswer(req, res) {
  const { sessionId } = req.params;
  const { questionId, choiceIndex, playerId } = req.body;
  if (questionId === undefined || choiceIndex === undefined || !playerId) {
    return res.status(400).json({ error: 'questionId, choiceIndex, and playerId required' });
  }
  const result = await service.submitAnswer({
    sessionId: Number(sessionId),
    playerId: Number(playerId),
    questionId: Number(questionId),
    choiceIndex: Number(choiceIndex),
  });
  res.status(201).json(result);
}

async function getLeaderboard(req, res) {
  const { sessionId } = req.params;
  const leaderboard = await service.getLeaderboard(Number(sessionId));
  res.json(leaderboard);
}

module.exports = { createSession, startSession, joinSession, spinWheel, submitAnswer, getLeaderboard };