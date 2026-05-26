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
- `backend/` for backend-specific code if and when it is separated from the web app
- `supabase/` for migrations and Supabase-specific project infrastructure
- `project-description/` for persistent planning and project memory

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
