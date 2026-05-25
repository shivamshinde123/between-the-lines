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
};

export const DEFAULT_BOOK_FORM_STATE: BookFormState = {
  error: null,
};
