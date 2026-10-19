module.exports = (sequelize, DataTypes) => {
  const TournamentSession = sequelize.define('TournamentSession', {
    session_id: {
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
    session_code: {
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
    tableName: 'tournament_sessions',
    timestamps: false,
  });

  return TournamentSession;
};