"use client";

import type { ReactNode } from "react";
import { useActionState, useEffect, useRef } from "react";
import {
  BOOK_AUTHOR_MAX_LENGTH,
  BOOK_TITLE_MAX_LENGTH,
  DEFAULT_BOOK_FORM_STATE,
  type BookFormState,
} from "@backend/books/types";

type BookFormProps = {
  action: (state: BookFormState, formData: FormData) => Promise<BookFormState>;
  authorName?: string;
  bookId?: string;
  coverRequired: boolean;
  existingCoverPath?: string | null;
  footer?: ReactNode;
  onSuccess?: () => void;
  resetOnSuccess?: boolean;
  submitLabel: string;
  title?: string;
};

export function BookForm({
  action,
  authorName = "",
  bookId,
  coverRequired,
  existingCoverPath = null,
  footer,
  onSuccess,
  resetOnSuccess = false,
  submitLabel,
  title = "",
}: BookFormProps) {
  const [state, formAction, pending] = useActionState(action, DEFAULT_BOOK_FORM_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error || state.successId === 0) {
      return;
    }

    if (resetOnSuccess) {
      formRef.current?.reset();
    }

    onSuccess?.();
  }, [onSuccess, resetOnSuccess, state.error, state.successId]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {bookId ? <input type="hidden" name="bookId" value={bookId} /> : null}
      <input type="hidden" name="existingCoverPath" value={existingCoverPath ?? ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-muted" htmlFor={bookId ? `title-${bookId}` : "title-create"}>
            Book title
          </label>
          <input
            id={bookId ? `title-${bookId}` : "title-create"}
            name="title"
            defaultValue={title}
            required
            maxLength={BOOK_TITLE_MAX_LENGTH}
            className="paper-input mt-2 w-full rounded-sm px-4 py-3"
          />
        </div>

        <div>
          <label
            className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-muted"
            htmlFor={bookId ? `author-${bookId}` : "author-create"}
          >
            Author
          </label>
          <input
            id={bookId ? `author-${bookId}` : "author-create"}
            name="authorName"
            defaultValue={authorName}
            required
            maxLength={BOOK_AUTHOR_MAX_LENGTH}
            className="paper-input mt-2 w-full rounded-sm px-4 py-3"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label
            className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-muted"
            htmlFor={bookId ? `cover-${bookId}` : "cover-create"}
          >
            Cover image {coverRequired ? "" : "(Optional)"}
          </label>
          <span className="text-xs text-muted">PNG, JPEG, WebP, or AVIF up to 5 MB</span>
        </div>
        <input
          id={bookId ? `cover-${bookId}` : "cover-create"}
          name="cover"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          required={coverRequired}
          className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-sm file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-[18px] border border-[#9a5b4d]/25 bg-[#9a5b4d]/8 px-4 py-3 text-sm text-[#7c3f31]"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-accent px-5 py-3 text-sm font-medium tracking-[0.08em] text-white uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        {footer}
      </div>
    </form>
  );
}

