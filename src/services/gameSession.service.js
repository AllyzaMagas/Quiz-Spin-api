const repo = require('../repositories/gameSession.repository');
const playerRepo = require('../repositories/player.repository');
const answerRepo = require('../repositories/answer.repository');

async function createSession(hostId, { questionSetId }) {
  if (!questionSetId) {
    const err = new Error('questionSetId is required');
    err.status = 400;
    throw err;
  }
  const session = await repo.createSession({ questionSetId: Number(questionSetId), hostId });
  if (!session) {
    const err = new Error('Invalid question set or no questions available');
    err.status = 400;
    throw err;
  }
  return session;
}

async function getSessionByCode(code) {
  const session = await repo.findSessionByCode(code);
  if (!session) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }
  return session;
}

async function startSession(sessionId) {
  const session = await repo.findSessionById(sessionId);
  if (!session) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }
  if (session.status !== 'waiting') {
    const err = new Error('Session already started or completed');
    err.status = 400;
    throw err;
  }
  return repo.startSession(session);
}

async function joinSession(code, nickname) {
  const session = await getSessionByCode(code);
  if (session.status === 'completed') {
    const err = new Error('Session has ended');
    err.status = 400;
    throw err;
  }
  const result = await playerRepo.joinSession(session.session_id, nickname);
  if (result.error) {
    const err = new Error(result.error === 'NICKNAME_TAKEN' ? 'Nickname already taken' : 'Cannot join session');
    err.status = result.error === 'SESSION_NOT_FOUND' ? 404 : 409;
    throw err;
  }
  return { session, player: result.player };
}

async function spinWheel(sessionId, playerId) {
  const session = await repo.findSessionById(sessionId);
  if (!session) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }
  if (session.status !== 'active') {
    const err = new Error('Session not active');
    err.status = 400;
    throw err;
  }
  const question = await repo.getRandomQuestion(session);
  if (!question) {
    return { sessionEnded: true };
  }
  return { question: { question_id: question.question_id, text: question.text, choices: question.choices } };
}

async function submitAnswer({ sessionId, playerId, questionId, choiceIndex }) {
  const session = await repo.findSessionById(sessionId);
  if (!session || session.status !== 'active') {
    const err = new Error('Session not active');
    err.status = 400;
    throw err;
  }
  const result = await answerRepo.submitAnswer({ sessionId, playerId, questionId, choiceIndex });
  if (result.error) {
    const err = new Error(result.error === 'ALREADY_ANSWERED' ? 'Already answered this question' : 'Invalid answer');
    err.status = result.error === 'ALREADY_ANSWERED' ? 409 : 400;
    throw err;
  }
  if (result.pointsEarned > 0) {
    await playerRepo.updatePlayerScore(playerId, result.pointsEarned);
  }
  return {
    isCorrect: result.isCorrect,
    pointsEarned: result.pointsEarned,
  };
}

async function getLeaderboard(sessionId) {
  const session = await repo.findSessionById(sessionId);
  if (!session) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }
  const players = await playerRepo.getLeaderboard(sessionId);
  return players.map((p, i) => ({
    rank: i + 1,
    player_id: p.player_id,
    nickname: p.nickname,
    score: p.score,
  }));
}

module.exports = {
  createSession,
  getSessionByCode,
  startSession,
  joinSession,
  spinWheel,
  submitAnswer,
  getLeaderboard,
};