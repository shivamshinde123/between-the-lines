import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "@/lib/public-env";
import { getServiceRoleKey } from "@/lib/server-env";

export function createAdminClient() {
  const { url } = getPublicSupabaseEnv();

  return createClient(url, getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
