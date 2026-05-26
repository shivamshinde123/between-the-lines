import "server-only";

import { getDeepseekApiKey } from "@backend/server-env";
import type {
  LibraryThoughtEntryRecord,
  ThoughtEntryRecord,
} from "@backend/entries/types";
import type {
  InsightExample,
  ReadingVoiceInsightContent,
  RecurringThoughtInsightContent,
} from "@backend/insights/types";

const DEEPSEEK_MODEL = "deepseek-v4-flash";
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_TIMEOUT_MS = 20_000;
const MAX_LIBRARY_PROMPT_ENTRIES = 24;
const MAX_LIBRARY_PROMPT_CHARS = 8_000;

type DeepSeekMessage = {
  content: string;
  role: "system" | "user";
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

type GenerationCheck =
  | {
      message: string;
      ok: false;
    }
  | {
      ok: true;
    };

export function canGenerateBookShift(entries: ThoughtEntryRecord[]) {
  if (entries.length < 2) {
    return {
      message: "Add at least two thought entries before generating this reflection.",
      ok: false,
    } as const;
  }

  const totalContentLength = entries.reduce((sum, entry) => sum + entry.content.length, 0);

  if (totalContentLength < 120) {
    return {
      message: "Write a little more before generating this reflection.",
      ok: false,
    } as const;
  }

  return { ok: true } as const satisfies GenerationCheck;
}

function buildBookShiftMessages(
  authorName: string,
  entries: ThoughtEntryRecord[],
  title: string,
): DeepSeekMessage[] {
  const chronology = entries
    .map(
      (entry, index) =>
        `Entry ${index + 1} | ${entry.created_at}\n${entry.content}`,
    )
    .join("\n\n");

  return [
    {
      role: "system",
      content:
        "You analyze a reader's changing perspective across a single book. Return strict JSON with one key: reflection. The reflection must be 2 short paragraphs: the first describes the early tone and perspective, the second describes how it shifts by the latest entry. Stay grounded in the user's wording without quoting more than a few words at once.",
    },
    {
      role: "user",
      content: `Book: ${title}\nAuthor: ${authorName}\n\nChronological thought entries:\n\n${chronology}\n\nWrite a concise before-and-after portrait of how this reader changed while reading the book.`,
    },
  ];
}

export function canGenerateLibraryInsights(
  entries: LibraryThoughtEntryRecord[],
): GenerationCheck {
  if (entries.length < 3) {
    return {
      message: "Add at least three thought entries before generating library insights.",
      ok: false,
    };
  }

  const distinctBooks = new Set(entries.map((entry) => entry.book_id));

  if (distinctBooks.size < 2) {
    return {
      message: "Write entries for at least two books before generating library insights.",
      ok: false,
    };
  }

  const totalContentLength = entries.reduce((sum, entry) => sum + entry.content.length, 0);

  if (totalContentLength < 220) {
    return {
      message: "Write a little more across your library before generating these insights.",
      ok: false,
    };
  }

  return { ok: true };
}

function buildLibraryChronology(entries: LibraryThoughtEntryRecord[]) {
  const recentEntries = entries.slice(-MAX_LIBRARY_PROMPT_ENTRIES);
  const trimmedEntries: LibraryThoughtEntryRecord[] = [];
  let totalLength = 0;

  // Keep the most recent entries while bounding total prompt size.
  for (let index = recentEntries.length - 1; index >= 0; index -= 1) {
    const entry = recentEntries[index];
    const nextLength =
      totalLength +
      entry.content.length +
      entry.book_title.length +
      entry.book_author_name.length +
      64;

    if (trimmedEntries.length > 0 && nextLength > MAX_LIBRARY_PROMPT_CHARS) {
      break;
    }

    trimmedEntries.push(entry);
    totalLength = nextLength;
  }

  return trimmedEntries
    .reverse()
    .map(
      (entry, index) =>
        `Entry ${index + 1} | ${entry.created_at}\nBook: ${entry.book_title}\nAuthor: ${entry.book_author_name}\n${entry.content}`,
    )
    .join("\n\n");
}

function buildReadingVoiceMessages(
  entries: LibraryThoughtEntryRecord[],
): DeepSeekMessage[] {
  return [
    {
      role: "system",
      content:
        "You analyze how a reader's voice evolves across their personal reading journal. Return strict JSON with exactly these keys: summary and examples. summary must be 2 short paragraphs describing how the reader's tone, attention, and interpretive style evolve over time. examples must be an array of 2 or 3 objects, each with bookTitle and snippet. snippet must be an exact quote from the source material and no more than 18 words. Keep the analysis specific and reflective without sounding clinical.",
    },
    {
      role: "user",
      content: `Chronological library thought entries:\n\n${buildLibraryChronology(entries)}\n\nDescribe how this reader's voice changes across the full library over time. Ground the answer in the provided entries only.`,
    },
  ];
}

function buildRecurringThoughtMessages(
  entries: LibraryThoughtEntryRecord[],
): DeepSeekMessage[] {
  return [
    {
      role: "system",
      content:
        "You identify the recurring concern or idea that keeps resurfacing across a reader's journal. Return strict JSON with exactly these keys: patternName, summary, and examples. patternName must be a short phrase naming the pattern. summary must be 1 or 2 short paragraphs explaining how the pattern recurs across books. examples must be an array of 2 or 3 objects, each with bookTitle and snippet. snippet must be an exact quote from the source material and no more than 18 words. Stay grounded in the entries and do not invent themes that are not well supported.",
    },
    {
      role: "user",
      content: `Chronological library thought entries:\n\n${buildLibraryChronology(entries)}\n\nIdentify the single recurring thought or concern that keeps showing up across this reader's books.`,
    },
  ];
}

async function requestDeepSeekJson(
  maxTokens: number,
  messages: DeepSeekMessage[],
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getDeepseekApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_tokens: maxTokens,
        messages,
        model: DEEPSEEK_MODEL,
        reasoning_effort: "high",
        response_format: { type: "json_object" },
        stream: false,
        thinking: { type: "disabled" },
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("DeepSeek timed out while generating a response.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `DeepSeek could not generate a response (${response.status}). ${responseText.slice(0, 200)}`,
    );
  }

  const payload = (await response.json()) as DeepSeekResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek returned empty JSON content.");
  }

  return JSON.parse(content) as Record<string, unknown>;
}

function isInsightExampleArray(value: unknown): value is InsightExample[] {
  return (
    Array.isArray(value) &&
    value.every((example) => {
      if (!example || typeof example !== "object") {
        return false;
      }

      const maybeExample = example as Partial<InsightExample>;

      return (
        typeof maybeExample.bookTitle === "string" &&
        maybeExample.bookTitle.trim().length > 0 &&
        typeof maybeExample.snippet === "string" &&
        maybeExample.snippet.trim().length > 0
      );
    })
  );
}

export async function generateBookShiftReflection(input: {
  authorName: string;
  entries: ThoughtEntryRecord[];
  title: string;
}) {
  const parsed = (await requestDeepSeekJson(
    300,
    buildBookShiftMessages(input.authorName, input.entries, input.title),
  )) as { reflection?: unknown };

  if (typeof parsed.reflection !== "string" || !parsed.reflection.trim()) {
    throw new Error("DeepSeek returned an invalid reflection format.");
  }

  return parsed.reflection.trim();
}

export async function generateReadingVoiceInsight(
  entries: LibraryThoughtEntryRecord[],
): Promise<ReadingVoiceInsightContent> {
  const parsed = (await requestDeepSeekJson(
    500,
    buildReadingVoiceMessages(entries),
  )) as Partial<ReadingVoiceInsightContent>;

  if (typeof parsed.summary !== "string" || !parsed.summary.trim()) {
    throw new Error("DeepSeek returned an invalid reading voice summary.");
  }

  if (!isInsightExampleArray(parsed.examples) || parsed.examples.length < 2) {
    throw new Error("DeepSeek returned invalid reading voice examples.");
  }

  return {
    examples: parsed.examples.slice(0, 3),
    summary: parsed.summary.trim(),
  };
}

export async function generateRecurringThoughtInsight(
  entries: LibraryThoughtEntryRecord[],
): Promise<RecurringThoughtInsightContent> {
  const parsed = (await requestDeepSeekJson(
    500,
    buildRecurringThoughtMessages(entries),
  )) as Partial<RecurringThoughtInsightContent>;

  if (typeof parsed.patternName !== "string" || !parsed.patternName.trim()) {
    throw new Error("DeepSeek returned an invalid recurring thought name.");
  }

  if (typeof parsed.summary !== "string" || !parsed.summary.trim()) {
    throw new Error("DeepSeek returned an invalid recurring thought summary.");
  }

  if (!isInsightExampleArray(parsed.examples) || parsed.examples.length < 2) {
    throw new Error("DeepSeek returned invalid recurring thought examples.");
  }

  return {
    examples: parsed.examples.slice(0, 3),
    patternName: parsed.patternName.trim(),
    summary: parsed.summary.trim(),
  };
}

