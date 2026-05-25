# Stage 5: Thought Entries CRUD

## Summary

Build the book detail page and the user's reading-thought journal workflow.

## Scope

- Create book detail page
- Display selected book metadata and cover
- List thought entries in chronological order
- Add create-entry flow
- Add edit-entry flow
- Add delete-entry flow with confirmation prompt
- Show timestamps clearly for each thought entry

## Deliverables

- Functional book detail page
- Entry list and editor UI
- Entry deletion confirmation flow

## Acceptance Criteria

- Multiple thought entries can be created for a book
- Entries appear in chronological order
- Entry timestamps are stored and displayed consistently
- Edit and delete actions work correctly
- Users cannot access entries belonging to other users or books they do not own

## Security Checklist

- Confirm entry ownership enforcement in all read/write paths
- Validate book ownership before entry mutations
- Confirm destructive actions cannot target cross-user records

## Testing

- CRUD flow checks for entries
- Chronological ordering checks
- Route/data access checks for wrong-owner scenarios

## Notes

- This stage completes the non-AI journal core of the product
