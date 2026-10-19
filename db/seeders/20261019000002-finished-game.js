'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('demo123', 10);

    // Create users (host + 3 players)
    const [hostUser] = await queryInterface.bulkInsert('users', [{
      username: 'demo_host',
      password_hash: passwordHash,
      role: 'host',
      created_at: new Date(),
    }], { returning: ['user_id'] });

    const hostUserId = hostUser.user_id;

    const [player1User] = await queryInterface.bulkInsert('users', [{
      username: 'player_alice',
      password_hash: passwordHash,
      role: 'player',
      created_at: new Date(),
    }], { returning: ['user_id'] });

    const [player2User] = await queryInterface.bulkInsert('users', [{
      username: 'player_bob',
      password_hash: passwordHash,
      role: 'player',
      created_at: new Date(),
    }], { returning: ['user_id'] });

    const [player3User] = await queryInterface.bulkInsert('users', [{
      username: 'player_carol',
      password_hash: passwordHash,
      role: 'player',
      created_at: new Date(),
    }], { returning: ['user_id'] });

    const player1UserId = player1User.user_id;
    const player2UserId = player2User.user_id;
    const player3UserId = player3User.user_id;

    // Create host profile
    const [host] = await queryInterface.bulkInsert('hosts', [{
      user_id: hostUserId,
      created_at: new Date(),
    }], { returning: ['host_id'] });

    const hostId = host.host_id;

    // Create question set
    const [questionSet] = await queryInterface.bulkInsert('question_sets', [{
      host_id: hostId,
      title: 'General Knowledge',
      description: 'A mix of general knowledge questions for testing',
      created_at: new Date(),
    }], { returning: ['question_set_id'] });

    const questionSetId = questionSet.question_set_id;

    // Create questions
    const questions = await queryInterface.bulkInsert('questions', [
      {
        question_set_id: questionSetId,
        text: 'What is the capital of France?',
        choices: JSON.stringify(['London', 'Paris', 'Berlin', 'Madrid']),
        correct_choice: 1,
        created_at: new Date(),
      },
      {
        question_set_id: questionSetId,
        text: 'Which planet is known as the Red Planet?',
        choices: JSON.stringify(['Venus', 'Mars', 'Jupiter', 'Saturn']),
        correct_choice: 1,
        created_at: new Date(),
      },
      {
        question_set_id: questionSetId,
        text: 'What is 2 + 2?',
        choices: JSON.stringify(['3', '4', '5', '6']),
        correct_choice: 1,
        created_at: new Date(),
      },
      {
        question_set_id: questionSetId,
        text: 'Who wrote "Romeo and Juliet"?',
        choices: JSON.stringify(['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain']),
        correct_choice: 1,
        created_at: new Date(),
      },
      {
        question_set_id: questionSetId,
        text: 'What is the largest ocean on Earth?',
        choices: JSON.stringify(['Atlantic', 'Indian', 'Arctic', 'Pacific']),
        correct_choice: 3,
        created_at: new Date(),
      },
    ], { returning: ['question_id'] });

    // Create game session (completed)
    const [session] = await queryInterface.bulkInsert('game_sessions', [{
      question_set_id: questionSetId,
      code: 'FINISH',  // 6 characters
      status: 'completed',
      started_at: new Date(Date.now() - 3600000), // 1 hour ago
      ended_at: new Date(),
      created_at: new Date(Date.now() - 3600000),
    }], { returning: ['session_id'] });

    const sessionId = session.session_id;

    // Create players with scores (completed game)
    const players = await queryInterface.bulkInsert('players', [
      {
        session_id: sessionId,
        user_id: player1UserId,
        nickname: 'Alice',
        score: 500,
        joined_at: new Date(Date.now() - 3500000),
      },
      {
        session_id: sessionId,
        user_id: player2UserId,
        nickname: 'Bob',
        score: 300,
        joined_at: new Date(Date.now() - 3400000),
      },
      {
        session_id: sessionId,
        user_id: player3UserId,
        nickname: 'Carol',
        score: 400,
        joined_at: new Date(Date.now() - 3300000),
      },
    ], { returning: ['player_id'] });

    const player1Id = players[0].player_id;
    const player2Id = players[1].player_id;
    const player3Id = players[2].player_id;

    // Create answers for all questions (all players answered all 5 questions)
    const allQuestions = [1, 2, 3, 4, 5].map((q, i) => questions[i]?.question_id || q);
    
    // Alice answers all 5 correctly (500 points)
    // Bob answers 3 correctly (300 points) 
    // Carol answers 4 correctly (400 points)
    const answers = [];
    
    // Alice - all 5 correct
    for (const qId of allQuestions) {
      answers.push({
        session_id: sessionId,
        player_id: player1Id,
        question_id: qId,
        choice_index: 1, // All correct choices are index 1 except last
        is_correct: true,
        points_earned: 100,
        answered_at: new Date(Date.now() - 3000000 + Math.random() * 100000),
      });
    }
    // Fix last question for Alice (correct_choice is 3)
    answers[4].choice_index = 3;

    // Bob - 3 correct (questions 1, 2, 3)
    for (let i = 0; i < 3; i++) {
      answers.push({
        session_id: sessionId,
        player_id: player2Id,
        question_id: allQuestions[i],
        choice_index: 1,
        is_correct: true,
        points_earned: 100,
        answered_at: new Date(Date.now() - 2900000 + Math.random() * 100000),
      });
    }
    // Bob - 2 wrong (questions 4, 5)
    for (let i = 3; i < 5; i++) {
      answers.push({
        session_id: sessionId,
        player_id: player2Id,
        question_id: allQuestions[i],
        choice_index: 0,
        is_correct: false,
        points_earned: 0,
        answered_at: new Date(Date.now() - 2900000 + Math.random() * 100000),
      });
    }

    // Carol - 4 correct (questions 1, 2, 3, 4)
    for (let i = 0; i < 4; i++) {
      answers.push({
        session_id: sessionId,
        player_id: player3Id,
        question_id: allQuestions[i],
        choice_index: i === 4 ? 3 : 1,
        is_correct: true,
        points_earned: 100,
        answered_at: new Date(Date.now() - 2800000 + Math.random() * 100000),
      });
    }
    // Fix question 5 for Carol
    answers[answers.length - 1].question_id = allQuestions[4];
    answers[answers.length - 1].choice_index = 3;
    
    // Carol - 1 wrong (question 5 already correct above, so add a wrong one for question... wait)
    // Carol has 4 correct, so she got question 5 wrong
    answers.push({
      session_id: sessionId,
      player_id: player3Id,
      question_id: allQuestions[4],
      choice_index: 0,
      is_correct: false,
      points_earned: 0,
      answered_at: new Date(Date.now() - 2800000 + Math.random() * 100000),
    });

    await queryInterface.bulkInsert('answers', answers);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('answers', null, {});
    await queryInterface.bulkDelete('players', null, {});
    await queryInterface.bulkDelete('game_sessions', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('question_sets', null, {});
    await queryInterface.bulkDelete('hosts', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};