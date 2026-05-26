# Backend

This folder now holds the reusable server-side business and data logic for Between the Lines.

## Current Role

- `auth/` contains username and identity helpers shared by auth flows
- `books/` contains book domain types, cover validation helpers, and data queries
- `entries/` contains thought-entry types and data queries
- `insights/` contains persisted insight types, queries, and DeepSeek prompt/generation logic
- `server-env.ts` contains server-only environment access for backend modules

## Boundary With `frontend/`

The app still deploys as a single Next.js project from `frontend/`.

- `frontend/` owns UI routes, client components, and thin Next.js runtime entrypoints such as server actions, redirects, and session guards
- `backend/` owns reusable domain logic and server-side data logic that should not live beside page components

This keeps the codebase organized as separate frontend and backend folders without introducing a second runtime or API service.
