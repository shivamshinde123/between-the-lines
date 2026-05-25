# Workflow

## Required Delivery Path

1. Create the GitHub repository.
2. Divide the project into stages.
3. Create a detailed GitHub issue for each stage.
4. Add labels to each issue.
5. Pick issues one by one.
6. For each issue:
   - create a new git branch
   - implement the work
   - test it
   - check security problems
   - fix anything broken
7. Push code to GitHub.
8. Open a pull request.
9. When the user asks, fetch GitHub Copilot review comments.
10. Split comments into:
    - required fixes
    - not required / not actionable
11. Fix required comments and push again.
12. User merges the PR and deletes the branch.
13. Move to the next stage.

## Default Issue Labels

- `stage`
- `frontend`
- `backend`
- `database`
- `auth`
- `ai`
- `security`
- `testing`
- `deployment`
- `bug`
- `enhancement`

## Working Rules

- Do not touch other repositories on the user's GitHub account.
- Keep all project context written to this folder.
- Save meaningful project progress to the Obsidian vault.
- Keep product code separated by concern:
  - `frontend/` for the web app
  - `backend/` for backend-specific code
- Avoid ugly numbered folder naming for implementation areas.
- At the end of each stage, clean up:
  - generated folders
  - empty folders
  - temporary scaffolding that is not part of the actual app
