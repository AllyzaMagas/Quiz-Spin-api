'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      answer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tournament_player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tournament_players', key: 'tournament_player_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      answer: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      answered_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('answers');
  },
};