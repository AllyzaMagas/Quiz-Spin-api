require('./config/env');
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 QuizSpin API listening on http://localhost:${PORT}`);
  console.log(`   Health:       GET http://localhost:${PORT}/api/v1/health`);
  console.log(`   Game Info:    GET http://localhost:${PORT}/api/v1/game-info`);
  console.log(`   Auth Login:   POST http://localhost:${PORT}/api/v1/auth/login`);
  console.log(`   Question Sets: CRUD http://localhost:${PORT}/api/v1/question-sets`);
  console.log(`   Sessions:     CRUD http://localhost:${PORT}/api/v1/sessions`);
});