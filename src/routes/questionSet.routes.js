const { Router } = require('express');
const ctrl = require('../controllers/questionSet.controller');
const { requireAuth } = require('../middlewares/auth');

const router = Router();

router.use(requireAuth);

router.post('/', ctrl.createQuestionSet);
router.get('/', ctrl.listQuestionSets);
router.get('/:questionSetId', ctrl.getQuestionSet);

module.exports = router;