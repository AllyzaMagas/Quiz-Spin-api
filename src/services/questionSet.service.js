const repo = require('../repositories/questionSet.repository');

async function createQuestionSet(hostId, { title, description }) {
  if (!title || title.trim().length === 0) {
    const err = new Error('Title is required');
    err.status = 400;
    throw err;
  }
  return repo.createQuestionSet({ host_id: hostId, title: title.trim(), description: description?.trim() });
}

async function listQuestionSets(hostId) {
  return repo.findQuestionSetsByHost(hostId);
}

async function getQuestionSet(questionSetId) {
  return repo.findQuestionSetById(questionSetId);
}

module.exports = { createQuestionSet, listQuestionSets, getQuestionSet };