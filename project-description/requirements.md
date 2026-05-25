# Requirements

## Core Features

### Authentication

- User signup
- User login
- Password-based authentication
- User requested username/password UX instead of email/password

### Books

- Add a book with:
  - book name
  - author name
  - cover photo upload
- Display books alphabetically on the home page
- Search books by name in real time
- Edit books
- Delete books with confirmation prompt

### Thought Entries

- Add multiple free-form thought entries per book
- Each entry must store a timestamp
- Edit thought entries
- Delete thought entries with confirmation prompt

## AI Features

### Book Detail Page

Section title: `The Book Changed You. How?`

- Reads all thought entries for the selected book in chronological order
- Generates a short before-and-after portrait describing how the user's tone and perspective shifted from the first entry to the latest entry
- Regenerates on demand
- Stores the timestamp of the last generation

### Insights Page

#### Your Reading Voice Over Time

- Looks across all books and thought entries
- Tracks how the user's thinking and writing style evolves as a reader
- Example dimensions: sharper, more emotional, more analytical
- Regenerates on demand
- Stores the timestamp of the last generation

#### The Thought You Keep Having

- Finds one recurring idea, concern, or pattern across the user's entries
- Names the pattern
- Pulls examples from the user's own words
- Regenerates on demand
- Stores the timestamp of the last generation

## Data and Platform Requirements

- Supabase for authentication, database, and photo storage
- DeepSeek API for all LLM features
- Vercel as the deployment platform
- Public GitHub repository

## Testing Expectations

- Unit tests for utility logic
- Integration tests for key server-side behavior
- Minimal end-to-end coverage for auth, books, and entries

## Security Expectations

- Review each stage for security risks before opening the PR
- Fix discovered problems before pushing

## Current UX Direction

- Final color palette will be decided later
- Current priority is functionality over full visual styling
