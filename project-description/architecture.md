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
- `project-description/` for persistent planning and project memory

## Data Platform

- Supabase Auth
- Supabase Postgres
- Supabase Storage for book covers

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

## Pending Technical Concern

Supabase Auth natively centers email/phone/OAuth. The user requested a username/password flow. This is feasible, but the implementation path must be chosen before auth work starts.
