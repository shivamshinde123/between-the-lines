import "server-only";

import type {
  GeneratedInsightRecord,
  LibraryInsightType,
} from "@backend/insights/types";
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

export async function getLibraryInsight(
  insightType: LibraryInsightType,
  userId: string,
): Promise<GeneratedInsightRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("generated_insights")
    .select(
      "id, user_id, book_id, scope, insight_type, content, last_generated_at, updated_at",
    )
    .eq("user_id", userId)
    .eq("scope", "library")
    .eq("insight_type", insightType)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load the saved library insight.");
  }

  return data satisfies GeneratedInsightRecord | null;
}

