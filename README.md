# QuizSpin Backend API

Educational spin-the-wheel quiz game backend API.

CS313 Software Engineering 1

## Requirements

- Node.js 22+
- PostgreSQL 16+

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Set `DB_PASSWORD` and `JWT_SECRET` in `.env`, then create and populate the database:

```powershell
npm run db:create
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

The API is mounted under `/api/v1`:

- `GET http://localhost:3001/api/v1/health`
- `GET http://localhost:3001/api/v1/game-info`
- `POST http://localhost:3001/api/v1/auth/login` (Host login)
- `POST http://localhost:3001/api/v1/question-sets` (Create question set - Host)
- `GET http://localhost:3001/api/v1/question-sets` (List question sets - Host)
- `POST http://localhost:3001/api/v1/sessions` (Start game session - Host)
- `POST http://localhost:3001/api/v1/sessions/{code}/players` (Player join)
- `POST http://localhost:3001/api/v1/sessions/{code}/answers` (Submit answer)
- `GET http://localhost:3001/api/v1/sessions/{code}/leaderboard` (View leaderboard)

`db:check` reports row counts for all tables and exits unsuccessfully if any table is empty. Set `EXPECTED` to a non-empty value in `.env` to allow empty tables during development.

## Team

- **Developer:** Allyza G. magas
- **Email:** magasallyza@gmail.com
- **Course:** Bachelor of Science in Computer Science
- **Section:** 3-1
- **Instructor:** Ailen Laguda
- **Institution:** Sorsogon State University – Bulan Campus

## ERD Tables

1. hosts
2. question_sets
3. questions
4. game_sessions
5. players
6. answers

## Game Flow

1. Host logs in → gets JWT token
2. Host creates question sets with questions (multiple choice)
3. Host starts a game session → generates 6-digit join code
4. Players join using code + nickname (no account needed)
5. Player spins wheel → gets random question from set
6. Player submits answer → server validates, updates score
7. Leaderboard shows rankings