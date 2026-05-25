"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import type { AuthFormState } from "@/lib/auth/form-state";
import { DEFAULT_AUTH_FORM_STATE } from "@/lib/auth/form-state";
import { SubmitButton } from "@/components/auth/submit-button";

type AuthFormProps = {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  footer: ReactNode;
  mode: "login" | "signup";
  title: string;
};

export function AuthForm({ action, footer, mode, title }: AuthFormProps) {
  const [state, formAction] = useActionState(action, DEFAULT_AUTH_FORM_STATE);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor={`${mode}-username`}
          className="text-xs uppercase tracking-[0.22em] text-muted"
        >
          Username
        </label>
        <input
          id={`${mode}-username`}
          name="username"
          type="text"
          autoCapitalize="none"
          autoComplete="username"
          autoCorrect="off"
          required
          minLength={3}
          maxLength={30}
          className="mt-2 w-full rounded-[18px] border border-panel-border bg-white/70 px-4 py-3 outline-none transition focus:border-accent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={`${mode}-password`}
            className="text-xs uppercase tracking-[0.22em] text-muted"
          >
            Password
          </label>
          <span className="text-xs text-muted">Minimum 8 characters</span>
        </div>
        <input
          id={`${mode}-password`}
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={8}
          className="mt-2 w-full rounded-[18px] border border-panel-border bg-white/70 px-4 py-3 outline-none transition focus:border-accent"
        />
      </div>

      {state.error ? (
        <p className="rounded-[18px] border border-[#9a5b4d]/25 bg-[#9a5b4d]/8 px-4 py-3 text-sm text-[#7c3f31]">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton
          idleLabel={title}
          pendingLabel={mode === "login" ? "Signing in..." : "Creating account..."}
        />
        {footer}
      </div>
    </form>
  );
}
