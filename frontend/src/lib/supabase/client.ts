import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnv } from "@/lib/env";

export function createClient() {
  const { publishableKey, url } = getPublicSupabaseEnv();

  return createBrowserClient(url, publishableKey);
}
