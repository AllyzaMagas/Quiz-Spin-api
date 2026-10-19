const { Answer, Question, Player } = require('../models');

async function submitAnswer({ sessionId, playerId, questionId, choiceIndex }) {
  const question = await Question.findByPk(questionId);
  if (!question) return { error: 'QUESTION_NOT_FOUND' };
  
  const player = await Player.findByPk(playerId);
  if (!player || player.session_id !== sessionId) {
    return { error: 'INVALID_PLAYER_FOR_SESSION' };
  }
  
  const session = await Player.findByPk(playerId, {
    include: [{ association: 'session', include: [{ association: 'questionSet' }] }],
  });
  
  if (!session || session.session.questionSet.question_set_id !== question.question_set_id) {
    return { error: 'INVALID_QUESTION_FOR_SESSION' };
  }

  const existing = await Answer.findOne({
    where: { session_id: sessionId, player_id: playerId, question_id: questionId },
  });
  if (existing) return { error: 'ALREADY_ANSWERED' };

  const isCorrect = choiceIndex === question.correct_choice;
  const pointsEarned = isCorrect ? 100 : 0;

  const answer = await Answer.create({
    session_id: sessionId,
    player_id: playerId,
    question_id: questionId,
    choice_index: choiceIndex,
    is_correct: isCorrect,
    points_earned: pointsEarned,
  });

  return { answer, isCorrect, pointsEarned };
}

async function getPlayerAnswers(playerId) {
  return Answer.findAll({
    where: { player_id: playerId },
    include: [{ association: 'question' }],
    order: [['answered_at', 'ASC']],
  });
}

module.exports = { submitAnswer, getPlayerAnswers };