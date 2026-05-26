"use client";

import { useActionState } from "react";
import {
  DEFAULT_REFLECTION_FORM_STATE,
  type ReflectionFormState,
} from "@backend/insights/types";

type BookReflectionFormProps = {
  action: (
    state: ReflectionFormState,
    formData: FormData,
  ) => Promise<ReflectionFormState>;
  bookId: string;
  submitLabel: string;
};

export function BookReflectionForm({
  action,
  bookId,
  submitLabel,
}: BookReflectionFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    DEFAULT_REFLECTION_FORM_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="bookId" value={bookId} />

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
        {pending ? "Generating..." : submitLabel}
      </button>
    </form>
  );
}

