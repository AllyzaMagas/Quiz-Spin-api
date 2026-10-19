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
const Host = require('./host')(sequelize, DataTypes);
const QuestionSet = require('./questionSet')(sequelize, DataTypes);
const Question = require('./question')(sequelize, DataTypes);
const GameSession = require('./gameSession')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);
const Answer = require('./answer')(sequelize, DataTypes);

// Associations
User.hasMany(Host, { foreignKey: 'user_id', as: 'hostProfile' });
Host.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Host.hasMany(QuestionSet, { foreignKey: 'host_id', as: 'questionSets' });
QuestionSet.belongsTo(Host, { foreignKey: 'host_id', as: 'host' });

QuestionSet.hasMany(Question, { foreignKey: 'question_set_id', as: 'questions' });
Question.belongsTo(QuestionSet, { foreignKey: 'question_set_id', as: 'questionSet' });

QuestionSet.hasMany(GameSession, { foreignKey: 'question_set_id', as: 'sessions' });
GameSession.belongsTo(QuestionSet, { foreignKey: 'question_set_id', as: 'questionSet' });

GameSession.hasMany(Player, { foreignKey: 'session_id', as: 'players' });
Player.belongsTo(GameSession, { foreignKey: 'session_id', as: 'session' });

User.hasMany(Player, { foreignKey: 'user_id', as: 'gamePlayers' });
Player.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

GameSession.hasMany(Answer, { foreignKey: 'session_id', as: 'answers' });
Answer.belongsTo(GameSession, { foreignKey: 'session_id', as: 'session' });

Player.hasMany(Answer, { foreignKey: 'player_id', as: 'answers' });
Answer.belongsTo(Player, { foreignKey: 'player_id', as: 'player' });

Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  Host,
  QuestionSet,
  Question,
  GameSession,
  Player,
  Answer,
};