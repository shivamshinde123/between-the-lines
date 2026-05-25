import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string;
  username: string | null;
};

export async function getViewer(): Promise<Viewer | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    username: profile?.username ?? null,
  };
}

export async function requireViewer() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/login");
  }

  return viewer;
}

export async function redirectIfAuthenticated() {
  const viewer = await getViewer();

  if (viewer) {
    redirect("/");
  }
}
