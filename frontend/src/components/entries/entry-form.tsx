"use client";

import { useActionState } from "react";
import {
  DEFAULT_THOUGHT_ENTRY_FORM_STATE,
  type ThoughtEntryFormState,
} from "@backend/entries/types";

type EntryFormProps = {
  action: (
    state: ThoughtEntryFormState,
    formData: FormData,
  ) => Promise<ThoughtEntryFormState>;
  bookId: string;
  content?: string;
  entryId?: string;
  placeholder: string;
  submitLabel: string;
};

export function EntryForm({
  action,
  bookId,
  content = "",
  entryId,
  placeholder,
  submitLabel,
}: EntryFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    DEFAULT_THOUGHT_ENTRY_FORM_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="bookId" value={bookId} />
      {entryId ? <input type="hidden" name="entryId" value={entryId} /> : null}

      <div>
        <label
          className="text-xs uppercase tracking-[0.22em] text-muted"
          htmlFor={entryId ? `entry-${entryId}` : `entry-create-${bookId}`}
        >
          {entryId ? "Edit thought" : "New thought"}
        </label>
        <textarea
          id={entryId ? `entry-${entryId}` : `entry-create-${bookId}`}
          name="content"
          defaultValue={content}
          placeholder={placeholder}
          required
          rows={entryId ? 5 : 6}
          className="mt-2 w-full resize-y rounded-[18px] border border-panel-border bg-white/70 px-4 py-3 outline-none transition focus:border-accent"
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

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

