"use client";

import { useState } from "react";
import { deleteThoughtEntry } from "@/lib/entries/actions";
import { EntryForm } from "@/components/entries/entry-form";
import { DeleteEntryButton } from "@/components/entries/delete-entry-button";
import type { ThoughtEntryFormState, ThoughtEntryRecord } from "@backend/entries/types";

type EntriesClientProps = {
  bookId: string;
  createAction: (
    formState: ThoughtEntryFormState,
    formData: FormData,
  ) => Promise<ThoughtEntryFormState>;
  entries: ThoughtEntryRecord[];
  updateAction: (
    formState: ThoughtEntryFormState,
    formData: FormData,
  ) => Promise<ThoughtEntryFormState>;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getPreviewText(content: string, expanded: boolean, limit = 180) {
  if (expanded || content.length <= limit) {
    return content;
  }

  return content.slice(0, limit).trimEnd();
}

export function EntriesClient({
  bookId,
  createAction,
  entries,
  updateAction,
}: EntriesClientProps) {
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [expandedEntryIds, setExpandedEntryIds] = useState<string[]>([]);

  return (
    <div className="page-grid">
      <div className="panel rounded-[28px] p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
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
            resetOnSuccess
            placeholder="What is this book pulling out of you right now?"
            submitLabel="Add thought"
          />
        </div>
      </div>

      <div className="panel rounded-[28px] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted">Chronological entries</p>
            <h2 className="mt-3 text-2xl font-semibold">From first impression to latest note</h2>
          </div>
          <p className="text-sm text-muted">Oldest first</p>
        </div>

        {entries.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-panel-border bg-white/40 px-6 py-8 text-center">
            <p className="text-lg font-medium">No thought entries yet.</p>
            <p className="mt-2 text-sm text-muted">
              Write the first reaction while the book still feels new.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {entries.map((entry, index) => (
              <article
                key={entry.id}
                className={`rounded-[24px] border p-4 transition-colors ${
                  index % 2 === 0
                    ? "border-panel-border bg-white/55"
                    : "border-[rgba(122,96,63,0.18)] bg-[rgba(245,238,228,0.82)]"
                }`}
              >
                <div className="border-b border-panel-border pb-3">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted">
                    Entry {index + 1}
                  </p>
                  <div className="mt-1.5 flex flex-col gap-1 text-sm text-muted md:flex-row md:flex-wrap md:items-center md:gap-x-5">
                    <p>Created {formatTimestamp(entry.created_at)}</p>
                    <p>Last updated {formatTimestamp(entry.updated_at)}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                  <div className="rounded-[18px] border border-[rgba(122,96,63,0.12)] bg-white/78 px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">Saved thought</p>
                      <span className="rounded-full bg-[rgba(122,96,63,0.08)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                        Thought {index + 1}
                      </span>
                    </div>
                    <p className="mt-2.5 whitespace-pre-wrap text-sm leading-7 text-foreground">
                      {getPreviewText(entry.content, expandedEntryIds.includes(entry.id))}
                      {entry.content.length > 180 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedEntryIds((current) =>
                              current.includes(entry.id)
                                ? current.filter((id) => id !== entry.id)
                                : [...current, entry.id],
                            )
                          }
                          className="ml-2 inline text-sm font-medium text-accent transition-opacity hover:opacity-75"
                        >
                          {expandedEntryIds.includes(entry.id) ? "hide..." : "more..."}
                        </button>
                      ) : null}
                    </p>
                  </div>

                  <div className="flex flex-row gap-3 md:flex-col">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingEntryId((current) => (current === entry.id ? null : entry.id))
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        editingEntryId === entry.id
                          ? "bg-accent text-white"
                          : "border border-panel-border bg-white/75 text-foreground hover:bg-white"
                      }`}
                    >
                      {editingEntryId === entry.id ? "Close editor" : "Edit"}
                    </button>
                    <DeleteEntryButton
                      action={deleteThoughtEntry}
                      bookId={bookId}
                      entryId={entry.id}
                    />
                  </div>
                </div>

                {editingEntryId === entry.id ? (
                    <div className="mt-4 border-t border-panel-border pt-4">
                      <EntryForm
                        action={updateAction}
                        bookId={bookId}
                        content={entry.content}
                        entryId={entry.id}
                        onSuccess={() => setEditingEntryId(null)}
                        placeholder="Revise this thought..."
                        submitLabel="Save entry"
                      />
                    </div>
                  ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

