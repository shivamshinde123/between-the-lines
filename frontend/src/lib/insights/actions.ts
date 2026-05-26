"use server";

import { revalidatePath } from "next/cache";
import {
  canGenerateBookShift,
  generateBookShiftReflection,
} from "@/lib/insights/deepseek";
import { getBookShiftInsight } from "@/lib/insights/queries";
import {
  DEFAULT_REFLECTION_FORM_STATE,
  type ReflectionFormState,
} from "@/lib/insights/types";
import { listThoughtEntriesForBook } from "@/lib/entries/queries";
import { requireViewer } from "@/lib/auth/session";
import { getBookForUser } from "@/lib/books/queries";
import { createClient } from "@/lib/supabase/server";

function normalizeInput(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function generateBookReflection(
  _previousState: ReflectionFormState,
  formData: FormData,
): Promise<ReflectionFormState> {
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

  return DEFAULT_REFLECTION_FORM_STATE;
}
