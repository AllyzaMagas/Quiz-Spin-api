'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tournament_sessions', {
      session_id: {
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
      session_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('waiting', 'active', 'completed'),
        allowNull: false,
        defaultValue: 'waiting',
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tournament_sessions');
  },
};