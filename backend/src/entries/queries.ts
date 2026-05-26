import "server-only";

import type {
  LibraryThoughtEntryRecord,
  ThoughtEntryRecord,
} from "@backend/entries/types";
import { createClient } from "@/lib/supabase/server";

export async function listThoughtEntriesForBook(
  bookId: string,
  userId: string,
): Promise<ThoughtEntryRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("thought_entries")
    .select("id, book_id, user_id, content, created_at, updated_at")
    .eq("book_id", bookId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error("Could not load thought entries.");
  }

  return data satisfies ThoughtEntryRecord[];
}

type LibraryThoughtEntryRow = ThoughtEntryRecord & {
  books: Array<{
    author_name: string;
    title: string;
  }> | null;
};

export async function listThoughtEntriesForLibrary(
  userId: string,
): Promise<LibraryThoughtEntryRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("thought_entries")
    .select(
      "id, book_id, user_id, content, created_at, updated_at, books!inner(title, author_name)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error("Could not load library thought entries.");
  }

  return (data satisfies LibraryThoughtEntryRow[]).map((entry) => ({
    book_author_name: entry.books?.[0]?.author_name ?? "Unknown author",
    book_title: entry.books?.[0]?.title ?? "Unknown book",
    book_id: entry.book_id,
    content: entry.content,
    created_at: entry.created_at,
    id: entry.id,
    updated_at: entry.updated_at,
    user_id: entry.user_id,
  }));
}

