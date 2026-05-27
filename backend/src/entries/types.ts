export type ThoughtEntryRecord = {
  book_id: string;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  user_id: string;
};

export type LibraryThoughtEntryRecord = ThoughtEntryRecord & {
  book_author_name: string;
  book_title: string;
};

export type ThoughtEntryFormState = {
  error: string | null;
  successId: number;
};

export const DEFAULT_THOUGHT_ENTRY_FORM_STATE: ThoughtEntryFormState = {
  error: null,
  successId: 0,
};

export const THOUGHT_ENTRY_MAX_LENGTH = 5_000;
