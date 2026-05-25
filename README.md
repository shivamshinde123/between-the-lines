# Between the Lines

Between the Lines is a personal book-tracking web app with private reading journals and AI-powered reflective insights.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Planned platform integrations:
  - Supabase for auth, database, and storage
  - DeepSeek for AI features
  - Vercel for deployment

## Current Stage

Stage 1: App Bootstrap And Engineering Baseline

This stage establishes the application scaffold, placeholder routes, test tooling, and environment conventions.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run build
npm run lint
```

## Environment Variables

Defined in `.env.example`.

This stage documents the expected variables without wiring real integrations yet.

## Planned Routes

- `/`
- `/login`
- `/signup`
- `/books/[slug]`
- `/insights`

## Notes

- The final color palette will be decided later.
- The current priority is functionality and architecture.
- Project memory is stored in `project-description/`.
