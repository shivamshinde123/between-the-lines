export const BOOK_COVER_BUCKET = "book-covers";
export const BOOK_COVER_MAX_FILE_SIZE = 5 * 1024 * 1024;
export const BOOK_COVER_ALLOWED_MIME_TYPES = [
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

type CoverValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function isAllowedCoverMimeType(mimeType: string) {
  return BOOK_COVER_ALLOWED_MIME_TYPES.includes(
    mimeType as (typeof BOOK_COVER_ALLOWED_MIME_TYPES)[number],
  );
}

export function validateCoverFile(file: File): CoverValidationResult {
  if (!isAllowedCoverMimeType(file.type)) {
    return {
      message: "Cover images must be PNG, JPEG, WebP, or AVIF.",
      ok: false,
    };
  }

  if (file.size > BOOK_COVER_MAX_FILE_SIZE) {
    return {
      message: "Cover images must be 5 MB or smaller.",
      ok: false,
    };
  }

  return { ok: true };
}

export function buildCoverObjectPath(userId: string, fileName: string) {
  const sanitizedFileName = fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-");

  return `${userId}/${Date.now()}-${sanitizedFileName}`;
}
