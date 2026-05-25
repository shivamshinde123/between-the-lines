# Stage 6: Book-Level AI Reflection

## Summary

Add the AI reflection experience on each book detail page using DeepSeek.

## Scope

- Implement the `The Book Changed You. How?` section
- Read all thought entries for a selected book in chronological order
- Generate a short before-and-after portrait of how the user's tone and perspective shifted from first entry to latest
- Trigger generation on demand
- Store:
  - generated content
  - last-generated timestamp
- Refresh generated output after regeneration
- Handle empty or too-small input states gracefully

## Deliverables

- Book-level AI insight UI
- DeepSeek integration for book analysis
- Persistence for generated result and last-generated timestamp

## Acceptance Criteria

- AI generation uses the selected book's entries only
- Entry ordering used for prompting is chronological
- Last-generated timestamp is recorded and visible
- Regeneration updates persisted output correctly
- Failure states are surfaced cleanly to the user

## Security Checklist

- Keep DeepSeek API key server-side only
- Prevent prompt generation from leaking other users' entries
- Sanitize request handling and error surfaces

## Testing

- Prompt-construction logic tests
- Generation trigger flow checks
- Empty-state and failure-path checks

## Notes

- This stage should use a recent DeepSeek model suited to concise analysis
