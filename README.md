# Between the Lines

Between the Lines is a personal book-tracking app with private reading journals and AI-powered reflective insights.

## Repository Layout

- `frontend/`: Next.js web application
- `backend/`: reusable backend/domain logic and server-side data logic used by the app
- `project-description/`: persistent project context, requirements, roadmap, and progress notes

## Frontend/Backend Boundary

- `frontend/` owns UI routes, client components, Supabase runtime adapters, session guards, and thin Next.js server action entrypoints
- `backend/` owns reusable domain types, queries, prompt generation, file validation, and other server-side business logic
- deployment still runs as a single Next.js app rather than separate frontend and backend runtimes

## Environment

- tracked environment variable examples live at the repository root in `.env.example`
- frontend code reads values from the runtime environment rather than keeping env files inside `frontend/`
- only `NEXT_PUBLIC_*` values are browser-safe; all other keys must stay server-only

## Current Direction

- Supabase for auth, database, and storage
- DeepSeek for AI features
- Vercel for deployment

## Vercel Setup

- set the Vercel project root directory to `frontend/`
- configure the four environment variables from `.env.example` in the Vercel project settings
- keep `SUPABASE_SERVICE_ROLE_KEY` and `DEEPSEEK_API_KEY` server-only

## Working Rule

App code should live in the product folders such as `frontend/` and `backend/`. Planning material stays in `project-description/`.
