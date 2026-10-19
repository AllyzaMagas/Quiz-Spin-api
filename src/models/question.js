module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tournaments', key: 'tournament_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    choices: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'questions',
    timestamps: false,
  });

  return Question;
};