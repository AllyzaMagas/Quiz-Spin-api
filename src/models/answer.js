module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    answer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tournament_player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tournament_players', key: 'tournament_player_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'questions', key: 'question_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    answer: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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