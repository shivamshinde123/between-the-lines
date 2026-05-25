# Stage 7: Library Insights Page

## Summary

Add the cross-library AI insights page that reflects how the user reads and what patterns recur across their entries.

## Scope

- Build a dedicated Insights page
- Implement `Your Reading Voice Over Time`
- Implement `The Thought You Keep Having`
- Aggregate the user's entries across all books
- Generate each insight on demand
- Store:
  - generated insight content
  - last-generated timestamp
- Present supporting examples drawn from the user's own entries where appropriate

## Deliverables

- Insights page
- Two library-level AI insight flows
- Persistence for generated outputs and timestamps

## Acceptance Criteria

- Both insight types use only the current user's data
- Generated outputs are stored and can be re-rendered without immediate regeneration
- Last-generated timestamps are visible
- Regeneration updates each insight independently
- Empty-library and low-data states are handled well

## Security Checklist

- Prevent cross-user aggregation bugs
- Keep DeepSeek credentials server-side
- Review prompts and stored outputs for accidental leakage

## Testing

- Aggregation logic tests
- Independent generation flow checks for both insight types
- Empty-state and failure-path checks

## Notes

- Output should feel reflective and specific, not generic
