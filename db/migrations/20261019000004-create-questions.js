'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
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
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      choices: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      correct_answer: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};