const { QuestionSet, Question } = require('../models');

async function createQuestionSet(data) {
  return QuestionSet.create(data);
}

async function findQuestionSetsByHost(hostId) {
  return QuestionSet.findAll({
    where: { host_id: hostId },
    order: [['created_at', 'DESC']],
  });
}

async function findQuestionSetById(questionSetId) {
  return QuestionSet.findByPk(questionSetId, {
    include: [{ association: 'questions' }],
  });
}

module.exports = { createQuestionSet, findQuestionSetsByHost, findQuestionSetById };