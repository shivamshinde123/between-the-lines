# Architecture

## Current Recommended Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- Supabase JavaScript client
- Vercel deployment target

## Repository Layout

- `frontend/` for the Next.js web application
- `backend/` for reusable backend/domain logic and server-side data logic
- `supabase/` for migrations and Supabase-specific project infrastructure
- `project-description/` for persistent planning and project memory

## Frontend And Backend Boundary

- `frontend/` owns pages, client components, Supabase runtime adapters, auth/session guards, and thin Next.js server action entrypoints
- `backend/` owns reusable domain types, queries, prompt generation, file-validation rules, and server-only business logic that does not need direct `next/*` coupling
- The deployed runtime remains a single Next.js app on Vercel rather than a separate frontend app plus backend service

## Environment Placement

- Keep tracked environment examples at the repository root.
- Do not keep environment variable files inside `frontend/`.
- If the frontend talks directly to Supabase in the browser, the public Supabase URL and publishable key will still be read at runtime by frontend code. Only server-only secrets must stay out of frontend code paths.

## Data Platform

- Supabase Auth
- Supabase Postgres
- Supabase Storage for book covers

## Authentication Strategy

- Username and password in the app UI
- Synthetic internal email derived from username for Supabase Auth compatibility
- Server-side signup flow using a server-only admin client to create and confirm auth users
- Cookie-backed session refresh and guarded routing through Next.js proxy and server checks

## AI Integration

- DeepSeek API
- Server-side invocation only
- No Vercel Functions requirement from user

## Initial Security Direction

- Keep third-party API keys on the server only
- Enforce per-user data isolation in both application logic and Supabase policies
- Validate file type and file size for uploaded covers
- Require confirmation prompts for destructive actions

## Expected High-Level Entities

### User/Profile

- auth identity
- username
- created timestamp

### Book

- owner id
- title
- author
- cover storage path
- created timestamp
- updated timestamp

### Thought Entry

- book id
- owner id
- content
- created timestamp
- updated timestamp

### Generated Insight

- owner id
- scope (`book` or `library`)
- target id if scope is book
- insight type
- generated content
- last generated timestamp

## Current Route Protection

- `/login` and `/signup` stay public
- `/`, `/books/[slug]`, and `/insights` require an authenticated session
- Authenticated users are redirected away from public auth pages back to the library

## Library CRUD Direction

- Books are user-scoped rows in `public.books`
- Cover uploads go to the private `book-covers` bucket under user-prefixed object paths
- The library page fetches books alphabetically and signs private cover URLs on the server
- Create, update, and delete mutations run through server actions with session checks

## Reading Journal Direction

- Thought entries are user-scoped rows in `public.thought_entries`
- Book detail pages load entry lists chronologically from oldest to newest
- Entry create, update, and delete flows run through authenticated server actions
- Entry mutations verify both book ownership and entry ownership before writes

## Book Reflection Direction

- Book-level reflections are stored in `public.generated_insights` with `scope = book` and `insight_type = book_shift`
- Reflection generation is triggered on demand from the book detail page
- Only the selected book's chronological entries are included in the DeepSeek prompt
- The current implementation uses the official DeepSeek chat endpoint with `deepseek-v4-flash` in non-thinking JSON mode for concise saved output

## Library Insights Direction

- Library-level insights are stored in `public.generated_insights` with `scope = library`
- `reading_voice` stores a structured JSON payload with a summary and supporting cross-book examples
- `recurring_thought` stores a structured JSON payload with a pattern name, summary, and supporting examples
- Generation is on demand from `/insights` and each insight regenerates independently
- Cross-library prompts use only the current user's chronological entries and include source book titles for example attribution
