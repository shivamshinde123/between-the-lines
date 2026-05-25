# Stage 4: Books Library CRUD

## Summary

Build the core book management experience for the user's private library.

## Scope

- Create the home/library page
- Show books alphabetically by title
- Implement real-time search by book name
- Add create-book flow with:
  - title
  - author
  - cover image upload
- Add edit-book flow
- Add delete-book flow with confirmation prompt
- Display uploaded covers in the library UI

## Deliverables

- Functional library page
- Book create/edit UI
- Book deletion confirmation flow
- Cover upload integration

## Acceptance Criteria

- Books render alphabetically
- Search updates results in real time
- Valid cover images upload successfully
- Invalid file types and oversize files are rejected cleanly
- Edit and delete actions work correctly and update the UI

## Security Checklist

- Validate upload file type and size server-side where applicable
- Ensure users cannot mutate books they do not own
- Confirm delete actions are user-scoped

## Testing

- CRUD flow checks for books
- Upload validation tests
- Search behavior checks

## Notes

- This stage should leave the library fully usable even before entries or AI are added
