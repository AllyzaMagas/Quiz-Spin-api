'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create users (1 host + 4 players)
    const passwordHash = '$2a$10$dummyhashforseeding'; // dummy hash for seeding
    const [host] = await queryInterface.bulkInsert('users', [{
      school_id: 'HOST001',
      full_name: 'Allyza G. magas',
      email: 'magasallyza@gmail.com',
      role: 'host',
      created_at: new Date(),
      updated_at: new Date(),
    }], { returning: ['user_id'] });

    const hostId = host.user_id;

    const [player1] = await queryInterface.bulkInsert('users', [{
      school_id: '2024001',
      full_name: 'Juan Dela Cruz',
      email: 'juan.dela.cruz@sorsu.edu.ph',
      role: 'player',
      created_at: new Date(),
      updated_at: new Date(),
    }], { returning: ['user_id'] });

    const [player2] = await queryInterface.bulkInsert('users', [{
      school_id: '2024002',
      full_name: 'Maria Santos',
      email: 'maria.santos@sorsu.edu.ph',
      role: 'player',
      created_at: new Date(),
      updated_at: new Date(),
    }], { returning: ['user_id'] });

    const [player3] = await queryInterface.bulkInsert('users', [{
      school_id: '2024003',
      full_name: 'Pedro Reyes',
      email: 'pedro.reyes@sorsu.edu.ph',
      role: 'player',
      created_at: new Date(),
      updated_at: new Date(),
    }], { returning: ['user_id'] });

    const [player4] = await queryInterface.bulkInsert('users', [{
      school_id: '2024004',
      full_name: 'Ana Garcia',
      email: 'ana.garcia@sorsu.edu.ph',
      role: 'player',
      created_at: new Date(),
      updated_at: new Date(),
    }], { returning: ['user_id'] });

    // 2. Create tournament
    const [tournament] = await queryInterface.bulkInsert('tournaments', [{
      title: 'QuizSpin - General Knowledge Tournament',
      description: 'A quiz tournament covering general knowledge topics for SorSU Bulan Campus students.',
      created_at: new Date(),
      updated_at: new Date(),
    }], { returning: ['tournament_id'] });

    const tournamentId = tournament.tournament_id;

    // 3. Create tournament players (seats) - satisfying unique constraint
    const players = await queryInterface.bulkInsert('tournament_players', [
      {
        tournament_id: tournamentId,
        user_id: player1.user_id,
        nickname: 'JuanD',
        score: 85,
        completed: true,
        joined_at: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        tournament_id: tournamentId,
        user_id: player2.user_id,
        nickname: 'MariaS',
        score: 92,
        completed: true,
        joined_at: new Date(Date.now() - 3500000),
      },
      {
        tournament_id: tournamentId,
        user_id: player3.user_id,
        nickname: 'PedroR',
        score: 78,
        completed: true,
        joined_at: new Date(Date.now() - 3400000),
      },
      {
        tournament_id: tournamentId,
        user_id: player4.user_id,
        nickname: 'AnaG',
        score: 65,
        completed: false,
        joined_at: new Date(Date.now() - 3300000),
      },
    ], { returning: ['tournament_player_id'] });

    const playerIds = players.map(p => p.tournament_player_id);

    // 4. Create questions
    const questions = await queryInterface.bulkInsert('questions', [
      {
        tournament_id: tournamentId,
        text: 'What is the capital of the Philippines?',
        choices: JSON.stringify(['Manila', 'Cebu', 'Davao', 'Quezon City']),
        correct_answer: 'A',
        created_at: new Date(),
      },
      {
        tournament_id: tournamentId,
        text: 'Who is the national hero of the Philippines?',
        choices: JSON.stringify(['Jose Rizal', 'Andres Bonifacio', 'Emilio Aguinaldo', 'Apolinario Mabini']),
        correct_answer: 'A',
        created_at: new Date(),
      },
      {
        tournament_id: tournamentId,
        text: 'What is the largest island in the Philippines?',
        choices: JSON.stringify(['Luzon', 'Mindanao', 'Visayas', 'Palawan']),
        correct_answer: 'A',
        created_at: new Date(),
      },
      {
        tournament_id: tournamentId,
        text: 'Which body of water is east of the Philippines?',
        choices: JSON.stringify(['Philippine Sea', 'South China Sea', 'Celebes Sea', 'Sulu Sea']),
        correct_answer: 'A',
        created_at: new Date(),
      },
      {
        tournament_id: tournamentId,
        text: 'What is the official currency of the Philippines?',
        choices: JSON.stringify(['Philippine Peso', 'Philippine Dollar', 'Philippine Ringgit', 'Philippine Baht']),
        correct_answer: 'A',
        created_at: new Date(),
      },
    ], { returning: ['question_id'] });

    const questionIds = questions.map(q => q.question_id);

    // 5. Create a completed tournament session
    const [session] = await queryInterface.bulkInsert('tournament_sessions', [{
      tournament_id: tournamentId,
      session_code: '734921',
      status: 'completed',
      started_at: new Date(Date.now() - 3600000),
      ended_at: new Date(),
      created_at: new Date(Date.now() - 3600000),
    }], { returning: ['session_id'] });

    const sessionId = session.session_id;

    // 6. Create answers - 3 completed players (player1, player2, player3) with all 5 questions answered
    // player1 (JuanD) - 4 correct, 1 wrong = 80%
    // player2 (MariaS) - 5 correct = 100%
    // player3 (PedroR) - 3 correct, 2 wrong = 60%
    // player4 (AnaG) - 0 correct, incomplete = 0%

    const answers = [];

    // JuanD answers (4 correct, 1 wrong)
    answers.push(
      { tournament_player_id: playerIds[0], question_id: questionIds[0], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3500000) },
      { tournament_player_id: playerIds[0], question_id: questionIds[1], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3480000) },
      { tournament_player_id: playerIds[0], question_id: questionIds[2], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3460000) },
      { tournament_player_id: playerIds[0], question_id: questionIds[3], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3440000) },
      { tournament_player_id: playerIds[0], question_id: questionIds[4], answer: 'B', is_correct: false, answered_at: new Date(Date.now() - 3420000) }
    );

    // MariaS answers (5 correct)
    answers.push(
      { tournament_player_id: playerIds[1], question_id: questionIds[0], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3400000) },
      { tournament_player_id: playerIds[1], question_id: questionIds[1], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3380000) },
      { tournament_player_id: playerIds[1], question_id: questionIds[2], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3360000) },
      { tournament_player_id: playerIds[1], question_id: questionIds[3], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3340000) },
      { tournament_player_id: playerIds[1], question_id: questionIds[4], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3320000) }
    );

    // PedroR answers (3 correct, 2 wrong)
    answers.push(
      { tournament_player_id: playerIds[2], question_id: questionIds[0], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3300000) },
      { tournament_player_id: playerIds[2], question_id: questionIds[1], answer: 'B', is_correct: false, answered_at: new Date(Date.now() - 3280000) },
      { tournament_player_id: playerIds[2], question_id: questionIds[2], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3260000) },
      { tournament_player_id: playerIds[2], question_id: questionIds[3], answer: 'C', is_correct: false, answered_at: new Date(Date.now() - 3240000) },
      { tournament_player_id: playerIds[2], question_id: questionIds[4], answer: 'A', is_correct: true, answered_at: new Date(Date.now() - 3220000) }
    );

    // AnaG answers (0 correct, only 2 answered, not completed)
    answers.push(
      { tournament_player_id: playerIds[3], question_id: questionIds[0], answer: 'B', is_correct: false, answered_at: new Date(Date.now() - 3200000) },
      { tournament_player_id: playerIds[3], question_id: questionIds[1], answer: 'C', is_correct: false, answered_at: new Date(Date.now() - 3180000) }
    );

    await queryInterface.bulkInsert('answers', answers);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('answers', null, {});
    await queryInterface.bulkDelete('tournament_sessions', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('tournament_players', null, {});
    await queryInterface.bulkDelete('tournaments', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};