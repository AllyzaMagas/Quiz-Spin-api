const { sequelize } = require('../src/models');

const TABLES = [
  'users',
  'hosts',
  'question_sets',
  'questions',
  'game_sessions',
  'players',
  'answers',
];

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Database connection: OK');
  } catch (err) {
    console.error('Database connection: FAILED');
    console.error(err.message);
    process.exit(1);
  }

  const allowEmpty = process.env.EXPECTED !== undefined;
  let allOk = true;

  for (const table of TABLES) {
    try {
      const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM "${table}"`);
      const count = parseInt(results[0].count, 10);
      const status = count > 0 || allowEmpty ? 'OK' : 'EMPTY';
      if (status === 'EMPTY') allOk = false;
      console.log(`  ${table}: ${count} rows [${status}]`);
    } catch (err) {
      console.error(`  ${table}: ERROR - ${err.message}`);
      allOk = false;
    }
  }

  if (!allOk && !allowEmpty) {
    console.error('\nSome tables are empty. Run `npm run db:seed` or set EXPECTED=1 in .env');
    process.exit(1);
  }

  console.log('\nAll checks passed!');
  process.exit(0);
}

check();