const service = require('../services/questionSet.service');

async function createQuestionSet(req, res) {
  const { title, description } = req.body;
  const result = await service.createQuestionSet(req.authHost.hostId, { title, description });
  res.status(201).json(result);
}

async function listQuestionSets(req, res) {
  const result = await service.listQuestionSets(req.authHost.hostId);
  res.json(result);
}

async function getQuestionSet(req, res) {
  const { questionSetId } = req.params;
  const result = await service.getQuestionSet(Number(questionSetId));
  if (!result) {
    return res.status(404).json({ error: 'Question set not found' });
  }
  // Don't expose correct answers to host
  const safeQuestions = (result.questions || []).map(q => ({
    question_id: q.question_id,
    text: q.text,
    choices: q.choices,
  }));
  res.json({ ...result.toJSON(), questions: safeQuestions });
}

module.exports = { createQuestionSet, listQuestionSets, getQuestionSet };