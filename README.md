# Between the Lines

Between the Lines is a personal book-tracking app with private reading journals and AI-powered reflective insights.

# Current deployed URL:

- https://between-the-lines-app.vercel.app/login

## The Idea

Between the Lines is a quiet personal reading space. It is built for keeping track of books you read, writing down thoughts as you move through them, and noticing how your voice and perspective shift over time.

The app is private and reflective rather than social. It is meant to feel like your own reading room, not a public bookshelf.

## What You Can Do

- create a private account with a username and password
- add books to your library
- optionally upload a cover image for each book
- browse your books on the home page in alphabetical order
- search your library in real time
- edit or delete books
- open a book and add multiple thought entries as you read
- edit or delete each thought entry individually
- keep your notes in chronological order with timestamps

## Insights

Between the Lines also includes AI-powered reflective features built from your own journal entries.

- **The Book Changed You. How?**
  Generate a short reflection for each book based on the thoughts you have written about it.

- **Your Reading Voice Over Time**
  Look across your library and see how your tone, attention, and way of reading evolve.

- **The Thought You Keep Having**
  Surface the recurring idea or concern that keeps appearing across different books and entries.

These insights are generated on demand and are based on your private notes.

## Run Locally

1. Go into the app folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `frontend/.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
```

4. Start the app:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3000
```

## Deploy on Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. When Vercel asks for the framework, select:

```text
Next.js
```

4. Set the project Root Directory to:

```text
frontend
```

5. Enable including files outside the root directory during the build.
   This app needs that because `frontend/` imports shared code from `backend/`.
6. Add these environment variables in Vercel Project Settings:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
```

7. Deploy the project.

