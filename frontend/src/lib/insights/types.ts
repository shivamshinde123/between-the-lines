export type GeneratedInsightRecord = {
  book_id: string | null;
  content: string;
  id: string;
  insight_type: "book_shift" | "reading_voice" | "recurring_thought";
  last_generated_at: string | null;
  scope: "book" | "library";
  updated_at: string;
  user_id: string;
};

export type ReflectionFormState = {
  error: string | null;
};

export const DEFAULT_REFLECTION_FORM_STATE: ReflectionFormState = {
  error: null,
};
