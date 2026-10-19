// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
const pkg = require('../../package.json');

module.exports = {
  slug: 'quizspin',              // your group's game, lower case with hyphens
  name: 'QuizSpin',              // the name players will see
  team: 'Team C3 (3-1)',         // your group's name and section
  developer: 'magasallyza',      // YOUR GitHub username: this build is yours
  description: 'An educational spin-the-wheel quiz game where players spin a wheel, receive randomized questions, and earn points for correct answers.', // one sentence about how the game is played
  min_players: 2,                // change to the limits your game is designed for
  max_players: 10,
  version: pkg.version,          // read from package.json, do not edit here
};