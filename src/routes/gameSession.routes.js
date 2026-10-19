const { Router } = require('express');
const ctrl = require('../controllers/gameSession.controller');
const { requireAuth } = require('../middlewares/auth');

const router = Router();

// Host routes - require auth
router.post('/', requireAuth, ctrl.createSession);
router.post('/:sessionId/start', requireAuth, ctrl.startSession);

// Player routes - no auth needed (join by code)
router.post('/:code/players', ctrl.joinSession);

// Gameplay routes - identify player via session (simple approach)
// In production, use proper player session/token
router.post('/:sessionId/spin', ctrl.spinWheel);
router.post('/:sessionId/answers', ctrl.submitAnswer);

// Public routes
router.get('/:sessionId/leaderboard', ctrl.getLeaderboard);

module.exports = router;