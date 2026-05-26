# Staged Delivery Plan

## Stage 1: App Bootstrap And Engineering Baseline

- Initialize the Next.js application with TypeScript, App Router, and Tailwind CSS.
- Set up project structure, linting, formatting, test scaffolding, and environment variable conventions.
- Add shared layout primitives and a temporary functional visual shell for the app.
- Prepare Vercel-ready configuration and documentation for local setup.

## Stage 2: Supabase Foundation And Data Model

- Configure Supabase integration for the app.
- Define database schema, migrations, storage bucket strategy, and row-level security.
- Implement the username-based profile model on top of Supabase Auth.
- Establish file validation rules for book cover uploads.

## Stage 3: Authentication Flows

- Build signup, login, and logout flows using username/password UX backed by internal synthetic email handling.
- Add guarded routes and session handling.
- Ensure each user only reaches their own private library.

## Stage 4: Books Library CRUD

- Build the home page that lists books alphabetically.
- Add real-time client-side search by book name.
- Implement create, edit, and delete book flows.
- Support image-only cover upload with file size threshold enforcement.

## Stage 5: Thought Entries CRUD

- Build the book detail page.
- Add create, edit, and delete flows for timestamped free-form thought entries.
- Present entries in chronological order with confirmation prompts for deletes.

## Stage 6: Book-Level AI Reflection

- Build the `The Book Changed You. How?` section on the book detail page.
- Integrate DeepSeek to generate the before-and-after reflection from chronological thought entries.
- Store generated output and last-generated timestamp.
- Support manual regeneration on demand.

## Refactor Before Stage 7

- Complete Issue `#15`: folder-level frontend/backend separation refactor.
- Move reusable server-oriented logic out of `frontend/` and into `backend/` without changing runtime architecture.
- Keep Next.js-specific runtime entrypoints in `frontend/` so the app stays deployable as one Next.js project.
- Preserve current behavior while making Stage 7 and Stage 8 code organization cleaner.

## Stage 7: Library Insights Page

- Build the dedicated insights page.
- Add `Your Reading Voice Over Time`.
- Add `The Thought You Keep Having`.
- Use DeepSeek across the user's full library, storing output and last-generated timestamp for each insight.

## Stage 8: Quality, Security, And Deployment Readiness

- Expand automated coverage across auth, books, entries, and AI flows.
- Run a structured security pass and fix identified problems.
- Finalize Vercel deployment readiness, environment setup notes, and production hardening.

## Branching Rule

Every stage is completed on its own branch and reviewed through its own pull request before the next stage begins.
