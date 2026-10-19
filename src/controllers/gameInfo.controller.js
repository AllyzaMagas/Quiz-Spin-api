const gameInfo = require('../config/game-info');

async function gameInfoHandler(req, res) {
  res.json(gameInfo);
}

module.exports = { gameInfo: gameInfoHandler };