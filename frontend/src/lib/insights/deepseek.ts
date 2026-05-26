import "server-only";

import { getDeepseekApiKey } from "@/lib/server-env";
import type { ThoughtEntryRecord } from "@/lib/entries/types";

const DEEPSEEK_MODEL = "deepseek-v4-flash";
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

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

  return { ok: true } as const;
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

export async function generateBookShiftReflection(input: {
  authorName: string;
  entries: ThoughtEntryRecord[];
  title: string;
}) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getDeepseekApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      max_tokens: 300,
      messages: buildBookShiftMessages(input.authorName, input.entries, input.title),
      model: DEEPSEEK_MODEL,
      reasoning_effort: "high",
      response_format: { type: "json_object" },
      stream: false,
      thinking: { type: "disabled" },
    }),
  });

  if (!response.ok) {
    throw new Error("DeepSeek could not generate the reflection.");
  }

  const payload = (await response.json()) as DeepSeekResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek returned an empty reflection.");
  }

  const parsed = JSON.parse(content) as { reflection?: unknown };

  if (typeof parsed.reflection !== "string" || !parsed.reflection.trim()) {
    throw new Error("DeepSeek returned an invalid reflection format.");
  }

  return parsed.reflection.trim();
}
