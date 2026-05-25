# Between the Lines

Between the Lines is a personal book-tracking app with private reading journals and AI-powered reflective insights.

## Repository Layout

- `frontend/`: Next.js web application
- `backend/`: future backend-specific code and services
- `project-description/`: persistent project context, requirements, roadmap, and progress notes

## Environment

- tracked environment variable examples live at the repository root in `.env.example`
- frontend code reads values from the runtime environment rather than keeping env files inside `frontend/`

## Current Direction

- Supabase for auth, database, and storage
- DeepSeek for AI features
- Vercel for deployment

## Working Rule

App code should live in the product folders such as `frontend/` and `backend/`. Planning material stays in `project-description/`.
