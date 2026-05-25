# Stage 3: Authentication Flows

## Summary

Build the user-facing authentication experience and private session handling for Between the Lines.

## Scope

- Implement signup flow with:
  - username
  - password
- Implement login flow with:
  - username
  - password
- Translate username to the internal synthetic email strategy safely
- Add logout flow
- Add session persistence and guarded routes
- Redirect unauthenticated users away from protected app pages
- Ensure authenticated users land in their own library area

## Deliverables

- Signup page
- Login page
- Auth guards / middleware strategy
- Session-aware navigation behavior

## Acceptance Criteria

- User can sign up with username and password
- User can log in with username and password
- Protected pages reject unauthenticated access
- Authenticated user session persists correctly across navigation
- No other user's data is exposed through auth or routing mistakes

## Security Checklist

- Avoid user enumeration leaks in auth messaging where practical
- Ensure username lookup logic does not expose broader profile data
- Keep auth transitions server-safe

## Testing

- Manual and automated checks for signup/login/logout
- Protected route coverage
- Invalid credential path coverage

## Notes

- Email verification and password reset are explicitly out of scope for this first version
