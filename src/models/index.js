// ONE Sequelize instance (one connection pool) for the whole API.
// Every other file imports it from here - nobody opens a second one.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Load models
const User = require('./user')(sequelize, DataTypes);
const Tournament = require('./tournament')(sequelize, DataTypes);
const TournamentPlayer = require('./tournamentPlayer')(sequelize, DataTypes);
const Question = require('./question')(sequelize, DataTypes);
const Answer = require('./answer')(sequelize, DataTypes);
const TournamentSession = require('./tournamentSession')(sequelize, DataTypes);

// Associations
// User <-> TournamentPlayer
User.hasMany(TournamentPlayer, { foreignKey: 'user_id', as: 'tournamentPlayers' });
TournamentPlayer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Tournament <-> TournamentPlayer
Tournament.hasMany(TournamentPlayer, { foreignKey: 'tournament_id', as: 'players' });
TournamentPlayer.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

// Tournament <-> Question
Tournament.hasMany(Question, { foreignKey: 'tournament_id', as: 'questions' });
Question.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

// Tournament <-> TournamentSession
Tournament.hasMany(TournamentSession, { foreignKey: 'tournament_id', as: 'sessions' });
TournamentSession.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

// TournamentPlayer <-> Answer
TournamentPlayer.hasMany(Answer, { foreignKey: 'tournament_player_id', as: 'answers' });
Answer.belongsTo(TournamentPlayer, { foreignKey: 'tournament_player_id', as: 'tournamentPlayer' });

// Question <-> Answer
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// TournamentSession <-> TournamentPlayer
TournamentSession.hasMany(TournamentPlayer, { foreignKey: 'tournament_id', as: 'players', sourceKey: 'tournament_id' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  Tournament,
  TournamentPlayer,
  Question,
  Answer,
  TournamentSession,
};