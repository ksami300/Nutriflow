# NutriFlow

## Quick start

1. Set up `.env` files:
   - `backend/.env` based on `backend/.env.example`
   - `frontend/.env.local` based on `frontend/.env.example`
2. Run backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`
3. Run frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Production checks

- Ensure `MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY` are set in production env.
- Do NOT commit `.env` files; `.gitignore` already excludes them.

## Lint and test

- `cd backend && npm run lint`
- `cd frontend && npm run lint`
- add tests as needed.
