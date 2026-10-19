const { Router } = require('express');
const ctrl = require('../controllers/gameInfo.controller');

const router = Router();

router.get('/', ctrl.gameInfo);

module.exports = router;