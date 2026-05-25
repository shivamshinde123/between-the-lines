"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { DEFAULT_BOOK_FORM_STATE, type BookFormState } from "@/lib/books/types";

type BookFormProps = {
  action: (state: BookFormState, formData: FormData) => Promise<BookFormState>;
  authorName?: string;
  bookId?: string;
  coverRequired: boolean;
  existingCoverPath?: string | null;
  footer?: ReactNode;
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
  submitLabel,
  title = "",
}: BookFormProps) {
  const [state, formAction, pending] = useActionState(action, DEFAULT_BOOK_FORM_STATE);

  return (
    <form action={formAction} className="space-y-4">
      {bookId ? <input type="hidden" name="bookId" value={bookId} /> : null}
      <input type="hidden" name="existingCoverPath" value={existingCoverPath ?? ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-muted" htmlFor={bookId ? `title-${bookId}` : "title-create"}>
            Book title
          </label>
          <input
            id={bookId ? `title-${bookId}` : "title-create"}
            name="title"
            defaultValue={title}
            required
            className="mt-2 w-full rounded-[18px] border border-panel-border bg-white/70 px-4 py-3 outline-none transition focus:border-accent"
          />
        </div>

        <div>
          <label
            className="text-xs uppercase tracking-[0.22em] text-muted"
            htmlFor={bookId ? `author-${bookId}` : "author-create"}
          >
            Author
          </label>
          <input
            id={bookId ? `author-${bookId}` : "author-create"}
            name="authorName"
            defaultValue={authorName}
            required
            className="mt-2 w-full rounded-[18px] border border-panel-border bg-white/70 px-4 py-3 outline-none transition focus:border-accent"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label
            className="text-xs uppercase tracking-[0.22em] text-muted"
            htmlFor={bookId ? `cover-${bookId}` : "cover-create"}
          >
            Cover image
          </label>
          <span className="text-xs text-muted">PNG, JPEG, WebP, or AVIF up to 5 MB</span>
        </div>
        <input
          id={bookId ? `cover-${bookId}` : "cover-create"}
          name="cover"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          required={coverRequired}
          className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        {footer}
      </div>
    </form>
  );
}
