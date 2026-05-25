import "server-only";

import type { BookRecord } from "@/lib/books/types";
import { createClient } from "@/lib/supabase/server";

export async function listBooksForUser(userId: string): Promise<BookRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("id, user_id, title, author_name, cover_path, created_at, updated_at")
    .eq("user_id", userId)
    .order("title_sort_key", { ascending: true })
    .order("title", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error("Could not load books.");
  }

  return data satisfies BookRecord[];
}

export async function getBookForUser(bookId: string, userId: string): Promise<BookRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("id, user_id, title, author_name, cover_path, created_at, updated_at")
    .eq("id", bookId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load that book.");
  }

  return data satisfies BookRecord | null;
}

export async function getCoverImageUrl(path: string | null) {
  if (!path) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase.storage.from("book-covers").createSignedUrl(path, 60 * 60);

  return data?.signedUrl ?? null;
}
