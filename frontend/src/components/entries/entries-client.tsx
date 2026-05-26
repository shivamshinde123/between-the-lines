"use client";

import { deleteThoughtEntry } from "@/lib/entries/actions";
import { EntryForm } from "@/components/entries/entry-form";
import { DeleteEntryButton } from "@/components/entries/delete-entry-button";
import type { ThoughtEntryRecord } from "@backend/entries/types";

type EntriesClientProps = {
  bookId: string;
  createAction: (
    formState: { error: string | null },
    formData: FormData,
  ) => Promise<{ error: string | null }>;
  entries: ThoughtEntryRecord[];
  updateAction: (
    formState: { error: string | null },
    formData: FormData,
  ) => Promise<{ error: string | null }>;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function EntriesClient({
  bookId,
  createAction,
  entries,
  updateAction,
}: EntriesClientProps) {
  return (
    <div className="page-grid">
      <div className="panel rounded-[28px] p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted">Reading journal</p>
            <h2 className="mt-3 text-2xl font-semibold">Capture your thoughts as they shift</h2>
          </div>
          <p className="text-sm text-muted">{entries.length} total</p>
        </div>

        <div className="mt-6">
          <EntryForm
            action={createAction}
            bookId={bookId}
            placeholder="What is this book pulling out of you right now?"
            submitLabel="Add thought"
          />
        </div>
      </div>

      <div className="panel rounded-[28px] p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted">Chronological entries</p>
            <h2 className="mt-3 text-2xl font-semibold">From first impression to latest note</h2>
          </div>
          <p className="text-sm text-muted">Oldest first</p>
        </div>

        {entries.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-dashed border-panel-border bg-white/40 px-6 py-10 text-center">
            <p className="text-lg font-medium">No thought entries yet.</p>
            <p className="mt-2 text-sm text-muted">
              Write the first reaction while the book still feels new.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {entries.map((entry, index) => (
              <article
                key={entry.id}
                className="rounded-[26px] border border-panel-border bg-white/45 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-muted">
                      Entry {index + 1}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Created {formatTimestamp(entry.created_at)}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Last updated {formatTimestamp(entry.updated_at)}
                    </p>
                  </div>
                  <DeleteEntryButton
                    action={deleteThoughtEntry}
                    bookId={bookId}
                    entryId={entry.id}
                  />
                </div>

                <div className="mt-5">
                  <EntryForm
                    action={updateAction}
                    bookId={bookId}
                    content={entry.content}
                    entryId={entry.id}
                    placeholder="Revise this thought..."
                    submitLabel="Save entry"
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

