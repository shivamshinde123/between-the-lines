export const INTERNAL_AUTH_DOMAIN = "auth.between-the-lines.invalid";
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{1,28}[a-z0-9])?$/;

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function isValidUsername(username: string) {
  const normalized = normalizeUsername(username);

  return (
    normalized.length >= USERNAME_MIN_LENGTH &&
    normalized.length <= USERNAME_MAX_LENGTH &&
    USERNAME_PATTERN.test(normalized)
  );
}

export function usernameToInternalEmail(username: string) {
  const normalized = normalizeUsername(username);

  if (!isValidUsername(normalized)) {
    throw new Error("Username does not match the supported format.");
  }

  return `${normalized}@${INTERNAL_AUTH_DOMAIN}`;
}
