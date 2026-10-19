const { Router } = require('express');
const authRoutes = require('./auth.routes');
const questionSetRoutes = require('./questionSet.routes');
const gameSessionRoutes = require('./gameSession.routes');
const healthRoutes = require('./health.routes');
const gameInfoRoutes = require('./gameInfo.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/question-sets', questionSetRoutes);
router.use('/sessions', gameSessionRoutes);
router.use('/health', healthRoutes);
router.use('/game-info', gameInfoRoutes);

module.exports = router;