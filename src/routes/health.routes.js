const { Router } = require('express');
const ctrl = require('../controllers/health.controller');

const router = Router();

router.get('/', ctrl.health);

module.exports = router;