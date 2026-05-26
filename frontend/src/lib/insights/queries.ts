import "server-only";

import type { GeneratedInsightRecord } from "@/lib/insights/types";
import { createClient } from "@/lib/supabase/server";

export async function getBookShiftInsight(
  bookId: string,
  userId: string,
): Promise<GeneratedInsightRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("generated_insights")
    .select(
      "id, user_id, book_id, scope, insight_type, content, last_generated_at, updated_at",
    )
    .eq("book_id", bookId)
    .eq("user_id", userId)
    .eq("scope", "book")
    .eq("insight_type", "book_shift")
    .maybeSingle();

  if (error) {
    throw new Error("Could not load the saved reflection.");
  }

  return data satisfies GeneratedInsightRecord | null;
}
