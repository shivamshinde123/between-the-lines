import "server-only";

import type { ThoughtEntryRecord } from "@backend/entries/types";
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

