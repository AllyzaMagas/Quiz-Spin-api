module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    question_set_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'question_sets', key: 'question_set_id' },
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    choices: {
      type: DataTypes.JSONB,
      allowNull: false,
      // Array of strings: ["Choice A", "Choice B", "Choice C", "Choice D"]
    },
    correct_choice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Index of correct answer (0-3)
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