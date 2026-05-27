export type BookRecord = {
  author_name: string;
  cover_path: string | null;
  created_at: string;
  id: string;
  title: string;
  updated_at: string;
  user_id: string;
};

export type BookFormState = {
  error: string | null;
  successId: number;
};

export const DEFAULT_BOOK_FORM_STATE: BookFormState = {
  error: null,
  successId: 0,
};

export const BOOK_TITLE_MAX_LENGTH = 160;
export const BOOK_AUTHOR_MAX_LENGTH = 120;
