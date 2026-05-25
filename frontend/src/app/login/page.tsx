import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { SiteFrame } from "@/components/site-frame";
import { login } from "@/lib/auth/actions";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <SiteFrame
      eyebrow="Private access"
      title="Log back into your library"
      description="Sign in with the username you chose for Between the Lines. The app handles the internal auth email behind the scenes."
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <h2 className="text-xl font-semibold">Welcome back</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Your library, entries, and later insights all stay scoped to your own account.
          </p>
          <div className="mt-6">
            <AuthForm
              action={login}
              mode="login"
              title="Log in"
              footer={
                <p className="text-sm text-muted">
                  New here?{" "}
                  <Link href="/signup" className="font-medium text-accent">
                    Create an account
                  </Link>
                </p>
              }
            />
          </div>
        </div>

        <div className="panel rounded-[28px] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">How this works</p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
            <li>Username-first sign-in keeps email out of the normal product flow.</li>
            <li>Protected routes redirect here when there is no valid session.</li>
            <li>Book data remains private through session checks and Supabase RLS.</li>
          </ul>

          <Link
            href="/signup"
            className="mt-8 inline-flex rounded-full border border-panel-border px-4 py-2 text-sm font-medium"
          >
            Need an account?
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}
