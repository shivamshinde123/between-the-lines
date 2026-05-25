# Stage 1: App Bootstrap And Engineering Baseline

## Summary

Create the initial application foundation for Between the Lines using the approved stack and establish the engineering baseline for all future stages.

## Scope

- Initialize a Next.js app with:
  - TypeScript
  - App Router
  - Tailwind CSS
- Establish the repository structure for:
  - app routes
  - components
  - lib
  - tests
  - configuration
- Add baseline tooling:
  - ESLint
  - TypeScript strict mode
  - test runner setup
  - basic integration/e2e scaffolding
- Create a temporary functional shell for:
  - landing/auth entry points
  - home page placeholder
  - book detail placeholder
  - insights placeholder
- Add a repository-root `.env.example` with documented required variables
- Add or improve README setup instructions for local development
- Ensure the app is structured for Vercel deployment from the start

## Deliverables

- Running Next.js application in this repository
- Clean initial folder structure
- Working lint and test commands
- Placeholder pages for the main product surfaces
- Repository-root environment variable documentation

## Acceptance Criteria

- `npm install` and local dev server run successfully
- `npm run lint` passes
- Test scaffolding runs successfully even if coverage is minimal at this stage
- App Router structure reflects planned product pages
- No secrets are committed

## Security Checklist

- Validate that no environment secrets are hardcoded
- Confirm dependency choices are current and minimal
- Avoid exposing future server-only keys in client code paths

## Testing

- Verify local app boot
- Verify lint
- Verify baseline test command

## Notes

- Visual design can remain minimal and functional in this stage
- Do not begin real feature implementation here beyond shell structure
