module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    answer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'game_sessions', key: 'session_id' },
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'players', key: 'player_id' },
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'questions', key: 'question_id' },
    },
    choice_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    points_earned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    answered_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'answers',
    timestamps: false,
  });

  return Answer;
};