import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { SiteFrame } from "@/components/site-frame";
import { signup } from "@/lib/auth/actions";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <SiteFrame
      eyebrow="Private access"
      title="Start a private shelf"
      description="Create a username and password for your private reading journal. The app creates the internal auth identity without exposing email in the UI."
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <h2 className="text-xl font-semibold">Create your account</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Usernames become the visible identity for your library. Passwords stay internal to Supabase Auth.
          </p>
          <div className="mt-6">
            <AuthForm
              action={signup}
              mode="signup"
              title="Create account"
              footer={
                <p className="text-sm text-muted">
                  Already have one?{" "}
                  <Link href="/login" className="font-medium text-accent">
                    Log in
                  </Link>
                </p>
              }
            />
          </div>
        </div>

        <div className="panel rounded-[28px] p-6 md:p-8">
          <h2 className="text-xl font-semibold">Account protections</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
            <li>Every account gets its own profile row and private session.</li>
            <li>Books, entries, and insights stay isolated by user ID.</li>
            <li>Server-only keys remain out of browser code paths.</li>
          </ul>

          <Link
            href="/login"
            className="mt-8 inline-flex rounded-full border border-panel-border px-4 py-2 text-sm font-medium"
          >
            I already have an account
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}
