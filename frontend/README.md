# Frontend

This folder contains the Next.js web app for Between the Lines.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run build
npm run lint
```

## Current Routes

- `/`
- `/login`
- `/signup`
- `/books/[slug]`
- `/insights`
