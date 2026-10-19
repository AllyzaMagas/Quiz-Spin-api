module.exports = (sequelize, DataTypes) => {
  const TournamentPlayer = sequelize.define('TournamentPlayer', {
    tournament_player_id: {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'user_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'tournament_players',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['tournament_id', 'user_id'],
        name: 'unique_tournament_user',
      },
    ],
  });

  return TournamentPlayer;
};