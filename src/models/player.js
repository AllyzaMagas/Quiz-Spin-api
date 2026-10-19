module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    player_id: {
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
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'players',
    timestamps: false,
  });

  return Player;
};