module.exports = (sequelize, DataTypes) => {
  const GameSession = sequelize.define('GameSession', {
    session_id: {
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
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('waiting', 'active', 'completed'),
      allowNull: false,
      defaultValue: 'waiting',
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'game_sessions',
    timestamps: false,
  });

  return GameSession;
};