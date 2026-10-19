'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add user_id column to players
    await queryInterface.addColumn('players', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'user_id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add unique constraint: one seat per user per session
    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'user_id'],
      type: 'unique',
      name: 'unique_user_per_session',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('players', 'unique_user_per_session');
    await queryInterface.removeColumn('players', 'user_id');
  },
};