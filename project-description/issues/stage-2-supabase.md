# Stage 2: Supabase Foundation And Data Model

## Summary

Set up the full Supabase foundation for auth, database, storage, and per-user data isolation.

## Scope

- Integrate Supabase client configuration into the app
- Define database schema for:
  - profiles
  - books
  - thought entries
  - generated insights
- Add migrations for all initial tables, indexes, and constraints
- Create storage strategy for book cover uploads
- Implement row-level security policies for all private user data
- Implement the username UX strategy backed by internal synthetic email for Supabase Auth compatibility
- Define file validation rules:
  - image-only uploads
  - file size threshold
  - allowed MIME types

## Deliverables

- Supabase setup documented
- Initial database schema and migrations
- RLS policies for private libraries
- Storage bucket setup conventions
- Shared validation utilities/constants for uploads

## Acceptance Criteria

- Schema supports all currently defined features
- Users can only access their own rows by policy
- Books and entries are relationally consistent
- Generated insight records support:
  - per-book scope
  - full-library scope
  - last-generated timestamp
- Upload validation rules are clearly defined in code

## Security Checklist

- Review RLS for every table
- Ensure storage paths are user-scoped
- Prevent direct cross-user access by guessed IDs
- Keep service-role credentials out of browser code

## Testing

- Validate migrations apply cleanly
- Validate basic CRUD access expectations through policy-aware tests where practical
- Validate upload rule helpers

## Notes

- This stage should focus on infrastructure and data correctness, not final UI polish
