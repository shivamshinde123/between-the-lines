"use server";

import { revalidatePath } from "next/cache";
import { DEFAULT_THOUGHT_ENTRY_FORM_STATE, type ThoughtEntryFormState } from "@/lib/entries/types";
import { requireViewer } from "@/lib/auth/session";
import { getBookForUser } from "@/lib/books/queries";
import { createClient } from "@/lib/supabase/server";

function normalizeInput(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function validateBookId(bookId: string) {
  if (!bookId) {
    return "Could not find that book.";
  }

  return null;
}

function validateEntryId(entryId: string) {
  if (!entryId) {
    return "Could not find that thought entry.";
  }

  return null;
}

function validateContent(content: string) {
  if (!content) {
    return "Thought entries cannot be empty.";
  }

  return null;
}

async function ensureOwnedBook(bookId: string, userId: string) {
  const book = await getBookForUser(bookId, userId);

  return Boolean(book);
}

export async function createThoughtEntry(
  _previousState: ThoughtEntryFormState,
  formData: FormData,
): Promise<ThoughtEntryFormState> {
  const viewer = await requireViewer();
  const bookId = normalizeInput(formData.get("bookId"));
  const content = normalizeInput(formData.get("content"));
  const fieldError = validateBookId(bookId) ?? validateContent(content);

  if (fieldError) {
    return { error: fieldError };
  }

  if (!(await ensureOwnedBook(bookId, viewer.id))) {
    return { error: "Could not find that book." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("thought_entries").insert({
    book_id: bookId,
    content,
    user_id: viewer.id,
  });

  if (error) {
    return { error: "Could not save that thought entry." };
  }

  revalidatePath(`/books/${bookId}`);

  return DEFAULT_THOUGHT_ENTRY_FORM_STATE;
}

export async function updateThoughtEntry(
  _previousState: ThoughtEntryFormState,
  formData: FormData,
): Promise<ThoughtEntryFormState> {
  const viewer = await requireViewer();
  const bookId = normalizeInput(formData.get("bookId"));
  const entryId = normalizeInput(formData.get("entryId"));
  const content = normalizeInput(formData.get("content"));
  const fieldError =
    validateBookId(bookId) ?? validateEntryId(entryId) ?? validateContent(content);

  if (fieldError) {
    return { error: fieldError };
  }

  if (!(await ensureOwnedBook(bookId, viewer.id))) {
    return { error: "Could not find that book." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("thought_entries")
    .update({ content })
    .eq("id", entryId)
    .eq("book_id", bookId)
    .eq("user_id", viewer.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { error: "Could not update that thought entry." };
  }

  revalidatePath(`/books/${bookId}`);

  return DEFAULT_THOUGHT_ENTRY_FORM_STATE;
}

export async function deleteThoughtEntry(formData: FormData) {
  const viewer = await requireViewer();
  const bookId = normalizeInput(formData.get("bookId"));
  const entryId = normalizeInput(formData.get("entryId"));
  const confirmation = normalizeInput(formData.get("confirmation"));
  const fieldError = validateBookId(bookId) ?? validateEntryId(entryId);

  if (confirmation !== "delete" || fieldError) {
    return;
  }

  if (!(await ensureOwnedBook(bookId, viewer.id))) {
    return;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("thought_entries")
    .delete()
    .eq("id", entryId)
    .eq("book_id", bookId)
    .eq("user_id", viewer.id)
    .select("id")
    .maybeSingle();

  if (!error && data) {
    revalidatePath(`/books/${bookId}`);
  }
}
