const { GameSession, QuestionSet, Player, Question } = require('../models');

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createSession({ questionSetId, hostId }) {
  const questionSet = await QuestionSet.findByPk(questionSetId, {
    include: [{ association: 'questions' }],
  });
  if (!questionSet) return null;
  if (questionSet.host_id !== hostId) return null;
  if (!questionSet.questions || questionSet.questions.length === 0) return null;

  let code;
  let exists = true;
  while (exists) {
    code = generateCode();
    exists = await GameSession.findOne({ where: { code } });
  }

  return GameSession.create({
    question_set_id: questionSetId,
    code,
    status: 'waiting',
  });
}

async function findSessionByCode(code) {
  return GameSession.findOne({
    where: { code },
    include: [
      { association: 'questionSet', include: [{ association: 'questions' }] },
      { association: 'players' },
    ],
  });
}

async function findSessionById(sessionId) {
  return GameSession.findByPk(sessionId, {
    include: [
      { association: 'questionSet', include: [{ association: 'questions' }] },
      { association: 'players' },
    ],
  });
}

async function startSession(session) {
  session.status = 'active';
  session.started_at = new Date();
  return session.save();
}

async function endSession(session) {
  session.status = 'completed';
  session.ended_at = new Date();
  return session.save();
}

async function getRandomQuestion(session) {
  const questions = session.questionSet.questions;
  if (!questions || questions.length === 0) return null;

  const answeredQuestionIds = await Player.findOne({
    where: { session_id: session.session_id },
    include: [{
      association: 'answers',
      attributes: ['question_id'],
    }],
  }).then(p => p?.answers?.map(a => a.question_id) || []);

  const unanswered = questions.filter(q => !answeredQuestionIds.includes(q.question_id));
  if (unanswered.length === 0) return null;

  return unanswered[Math.floor(Math.random() * unanswered.length)];
}

module.exports = {
  createSession,
  findSessionByCode,
  findSessionById,
  startSession,
  endSession,
  getRandomQuestion,
};