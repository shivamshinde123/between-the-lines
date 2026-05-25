# Frontend

This folder contains the Next.js web app for Between the Lines.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase JS
- `@supabase/ssr`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Set the required environment variables outside `frontend/`.
   Use your shell session or a repo-root `.env.local` workflow that you load before running the app. Do not create `.env` files inside `frontend/`.

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DEEPSEEK_API_KEY=...
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

The required values are documented in the repository root `.env.example`.
They are managed at the repo root or deployment platform level, not inside `frontend/`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DEEPSEEK_API_KEY`

## Supabase Foundation

- App-side Supabase utilities live in `src/lib/supabase/`
- Username and internal-auth-email helpers live in `src/lib/auth/`
- Cover upload validation lives in `src/lib/books/`
- Database migrations live in the root `supabase/migrations/` folder

## Current Routes

- `/`
- `/login`
- `/signup`
- `/books/[slug]`
- `/insights`
