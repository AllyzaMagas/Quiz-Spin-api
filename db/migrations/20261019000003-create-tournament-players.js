'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tournament_players', {
      tournament_player_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tournament_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tournaments', key: 'tournament_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Add unique constraint for one seat per account per game
    await queryInterface.addConstraint('tournament_players', {
      fields: ['tournament_id', 'user_id'],
      type: 'unique',
      name: 'unique_tournament_user',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('tournament_players', 'unique_tournament_user');
    await queryInterface.dropTable('tournament_players');
  },
};