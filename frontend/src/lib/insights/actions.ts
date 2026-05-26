"use server";

import { revalidatePath } from "next/cache";
import {
  canGenerateBookShift,
  canGenerateLibraryInsights,
  generateBookShiftReflection,
  generateReadingVoiceInsight,
  generateRecurringThoughtInsight,
} from "@backend/insights/deepseek";
import { listThoughtEntriesForBook, listThoughtEntriesForLibrary } from "@backend/entries/queries";
import { getBookForUser } from "@backend/books/queries";
import { getBookShiftInsight, getLibraryInsight } from "@backend/insights/queries";
import {
  DEFAULT_INSIGHT_FORM_STATE,
  type InsightFormState,
  type LibraryInsightType,
} from "@backend/insights/types";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

function normalizeInput(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function generateBookReflection(
  _previousState: InsightFormState,
  formData: FormData,
): Promise<InsightFormState> {
  const viewer = await requireViewer();
  const bookId = normalizeInput(formData.get("bookId"));

  if (!bookId) {
    return {
      error: "Could not find that book.",
    };
  }

  const book = await getBookForUser(bookId, viewer.id);

  if (!book) {
    return {
      error: "Could not find that book.",
    };
  }

  const entries = await listThoughtEntriesForBook(book.id, viewer.id);
  const generationCheck = canGenerateBookShift(entries);

  if (!generationCheck.ok) {
    return {
      error: generationCheck.message,
    };
  }

  let reflection: string;

  try {
    reflection = await generateBookShiftReflection({
      authorName: book.author_name,
      entries,
      title: book.title,
    });
  } catch {
    return {
      error: "Could not generate the reflection right now. Please try again.",
    };
  }

  const supabase = await createClient();
  const now = new Date().toISOString();
  const existingInsight = await getBookShiftInsight(book.id, viewer.id);
  const insightPayload = {
    book_id: book.id,
    content: reflection,
    insight_type: "book_shift" as const,
    last_generated_at: now,
    scope: "book" as const,
    user_id: viewer.id,
  };
  const { error } = existingInsight
    ? await supabase
        .from("generated_insights")
        .update(insightPayload)
        .eq("id", existingInsight.id)
        .eq("user_id", viewer.id)
    : await supabase.from("generated_insights").insert(insightPayload);

  if (error) {
    return {
      error: "Could not save the reflection right now.",
    };
  }

  revalidatePath(`/books/${book.id}`);

  return DEFAULT_INSIGHT_FORM_STATE;
}

async function saveLibraryInsight(input: {
  content: string;
  insightType: LibraryInsightType;
  userId: string;
}) {
  const supabase = await createClient();
  const existingInsight = await getLibraryInsight(input.insightType, input.userId);
  const now = new Date().toISOString();
  const insightPayload = {
    book_id: null,
    content: input.content,
    insight_type: input.insightType,
    last_generated_at: now,
    scope: "library" as const,
    user_id: input.userId,
  };

  return existingInsight
    ? await supabase
        .from("generated_insights")
        .update(insightPayload)
        .eq("id", existingInsight.id)
        .eq("user_id", input.userId)
    : await supabase.from("generated_insights").insert(insightPayload);
}

export async function generateReadingVoiceLibraryInsight(
  previousState: InsightFormState,
  formData: FormData,
): Promise<InsightFormState> {
  void previousState;
  void formData;

  const viewer = await requireViewer();
  const entries = await listThoughtEntriesForLibrary(viewer.id);
  const generationCheck = canGenerateLibraryInsights(entries);

  if (!generationCheck.ok) {
    return {
      error: generationCheck.message,
    };
  }

  let content: string;

  try {
    content = JSON.stringify(await generateReadingVoiceInsight(entries));
  } catch {
    return {
      error: "Could not generate the reading voice insight right now. Please try again.",
    };
  }

  const { error } = await saveLibraryInsight({
    content,
    insightType: "reading_voice",
    userId: viewer.id,
  });

  if (error) {
    return {
      error: "Could not save the reading voice insight right now.",
    };
  }

  revalidatePath("/insights");

  return DEFAULT_INSIGHT_FORM_STATE;
}

export async function generateRecurringThoughtLibraryInsight(
  previousState: InsightFormState,
  formData: FormData,
): Promise<InsightFormState> {
  void previousState;
  void formData;

  const viewer = await requireViewer();
  const entries = await listThoughtEntriesForLibrary(viewer.id);
  const generationCheck = canGenerateLibraryInsights(entries);

  if (!generationCheck.ok) {
    return {
      error: generationCheck.message,
    };
  }

  let content: string;

  try {
    content = JSON.stringify(await generateRecurringThoughtInsight(entries));
  } catch {
    return {
      error: "Could not generate the recurring thought insight right now. Please try again.",
    };
  }

  const { error } = await saveLibraryInsight({
    content,
    insightType: "recurring_thought",
    userId: viewer.id,
  });

  if (error) {
    return {
      error: "Could not save the recurring thought insight right now.",
    };
  }

  revalidatePath("/insights");

  return DEFAULT_INSIGHT_FORM_STATE;
}
