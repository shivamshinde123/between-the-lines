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

export type InsightExample = {
  bookTitle: string;
  snippet: string;
};

export type ReadingVoiceInsightContent = {
  examples: InsightExample[];
  summary: string;
};

export type RecurringThoughtInsightContent = {
  examples: InsightExample[];
  patternName: string;
  summary: string;
};

export type LibraryInsightType = "reading_voice" | "recurring_thought";

export type InsightFormState = {
  error: string | null;
};

export const DEFAULT_INSIGHT_FORM_STATE: InsightFormState = {
  error: null,
};

export type ReflectionFormState = InsightFormState;

export const DEFAULT_REFLECTION_FORM_STATE = DEFAULT_INSIGHT_FORM_STATE;

function isInsightExample(value: unknown): value is InsightExample {
  if (!value || typeof value !== "object") {
    return false;
  }

  const example = value as Partial<InsightExample>;

  return (
    typeof example.bookTitle === "string" &&
    example.bookTitle.trim().length > 0 &&
    typeof example.snippet === "string" &&
    example.snippet.trim().length > 0
  );
}

function parseJsonContent(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function parseReadingVoiceInsightContent(
  content: string,
): ReadingVoiceInsightContent | null {
  const parsed = parseJsonContent(content);

  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const value = parsed as Partial<ReadingVoiceInsightContent>;

  if (typeof value.summary !== "string" || !value.summary.trim()) {
    return null;
  }

  if (!Array.isArray(value.examples) || !value.examples.every(isInsightExample)) {
    return null;
  }

  return {
    examples: value.examples,
    summary: value.summary.trim(),
  };
}

export function parseRecurringThoughtInsightContent(
  content: string,
): RecurringThoughtInsightContent | null {
  const parsed = parseJsonContent(content);

  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const value = parsed as Partial<RecurringThoughtInsightContent>;

  if (typeof value.patternName !== "string" || !value.patternName.trim()) {
    return null;
  }

  if (typeof value.summary !== "string" || !value.summary.trim()) {
    return null;
  }

  if (!Array.isArray(value.examples) || !value.examples.every(isInsightExample)) {
    return null;
  }

  return {
    examples: value.examples,
    patternName: value.patternName.trim(),
    summary: value.summary.trim(),
  };
}
