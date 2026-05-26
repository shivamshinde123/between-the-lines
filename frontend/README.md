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
# Server-only:
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

## Vercel Deployment

- create the Vercel project from this repository
- set the project root directory to `frontend/`
- configure the values from the repo-root `.env.example` in the Vercel project settings
- only expose the two `NEXT_PUBLIC_SUPABASE_*` values to browser code

## Environment Variables

The required values are documented in the repository root `.env.example`.
They are managed at the repo root or deployment platform level, not inside `frontend/`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Server-only: `SUPABASE_SERVICE_ROLE_KEY`
- Server-only: `DEEPSEEK_API_KEY`

## Supabase Foundation

- App-side Supabase utilities live in `src/lib/supabase/`
- Next.js-specific auth/session entrypoints live in `src/lib/auth/`
- Next.js-specific mutation entrypoints live in `src/lib/books/`, `src/lib/entries/`, and `src/lib/insights/`
- Shared backend business logic lives in `../backend/src/`
- Database migrations live in the root `supabase/migrations/` folder
- Session refresh and route guards run through `proxy.ts`

## Authentication

- Username/password UX is exposed on `/login` and `/signup`
- Supabase Auth still uses a synthetic internal email behind the scenes
- Protected routes redirect unauthenticated users back to `/login`

## Library CRUD

- The home page now serves as the private library management screen
- Books load alphabetically by title and can be filtered in real time by title
- Create and edit flows support private cover image uploads
- Delete actions require confirmation before submitting

## Thought Entries

- Book detail pages now load real thought entries in chronological order
- Entries can be created, edited, and deleted per book
- Entry timestamps are stored in Supabase and displayed on each entry card

## Book Reflection

- Each book detail page now has a `The Book Changed You. How?` reflection section
- Reflection generation runs on demand and persists the saved output plus the last-generated timestamp
- The reflection prompt uses only the selected book's chronological thought entries

## Current Routes

- `/`
- `/login`
- `/signup`
- `/books/[slug]`
- `/insights`
