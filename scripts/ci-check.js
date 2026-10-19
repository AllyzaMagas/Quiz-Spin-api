const { sequelize } = require('../src/models');

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Database connection: OK');
  } catch (err) {
    console.error('Database connection: FAILED');
    console.error(err.message);
    process.exit(1);
  }

  const TABLES = [
    'users',
    'hosts',
    'question_sets',
    'questions',
    'game_sessions',
    'players',
    'answers',
  ];

  for (const table of TABLES) {
    try {
      await sequelize.query(`SELECT 1 FROM "${table}" LIMIT 1`);
      console.log(`  ${table}: EXISTS`);
    } catch (err) {
      console.error(`  ${table}: MISSING`);
      process.exit(1);
    }
  }

  console.log('\nAll tables exist!');
  process.exit(0);
}

check();