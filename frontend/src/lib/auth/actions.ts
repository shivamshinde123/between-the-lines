"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AuthFormState } from "@backend/auth/form-state";
import {
  isValidUsername,
  normalizeUsername,
  USERNAME_MIN_LENGTH,
  usernameToInternalEmail,
} from "@backend/auth/identity";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

function invalidCredentialsState(): AuthFormState {
  return {
    error: "Invalid username or password.",
  };
}

type ParsedCredentials =
  | {
      error: string;
      ok: false;
    }
  | {
      error: null;
      ok: true;
      password: string;
      username: string;
    };

function parseCredentials(formData: FormData): ParsedCredentials {
  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!isValidUsername(username)) {
    return {
      error: `Usernames must be at least ${USERNAME_MIN_LENGTH} characters and use letters, numbers, dots, underscores, or hyphens.`,
      ok: false,
    };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      error: `Passwords must be at least ${PASSWORD_MIN_LENGTH} characters.`,
      ok: false,
    };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      error: `Passwords must be ${PASSWORD_MAX_LENGTH} characters or fewer.`,
      ok: false,
    };
  }

  return {
    error: null,
    ok: true,
    password,
    username,
  };
}

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseCredentials(formData);

  if (!parsed.ok) {
    return {
      error: parsed.error,
    };
  }

  const supabase = await createClient();
  const email = usernameToInternalEmail(parsed.username);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.password,
  });

  if (error) {
    return invalidCredentialsState();
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseCredentials(formData);

  if (!parsed.ok) {
    return {
      error: parsed.error,
    };
  }

  const admin = createAdminClient();
  const email = usernameToInternalEmail(parsed.username);
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    password: parsed.password,
  });

  if (error || !data.user) {
    console.error("signup createUser failed", {
      email,
      error,
      hasUser: Boolean(data.user),
      username: parsed.username,
    });
    return {
      error: "Could not create your account with those details.",
    };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: data.user.id,
    username: parsed.username,
  });

  if (profileError) {
    console.error("signup profile insert failed", {
      email,
      profileError,
      userId: data.user.id,
      username: parsed.username,
    });
    await admin.auth.admin.deleteUser(data.user.id);

    return {
      error: "Could not create your account with those details.",
    };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.password,
  });

  if (signInError) {
    console.error("signup first sign-in failed", {
      email,
      signInError,
      userId: data.user.id,
      username: parsed.username,
    });
    return {
      error: "Account created, but the first sign-in could not be completed. Please try logging in.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
