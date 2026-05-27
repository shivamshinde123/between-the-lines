import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { SiteFrame } from "@/components/site-frame";
import { login } from "@/lib/auth/actions";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <SiteFrame
      title="Log back into your library"
      description="Track books, save your thoughts as you read, and return to the patterns your library reveals."
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.65fr)]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <h2 className="text-xl font-semibold">Welcome back</h2>
          <p className="mt-3 max-w-[34ch] text-sm leading-6 text-muted">
            A private reading journal for books, thoughts, and the shifts they leave behind.
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
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Between the Lines</p>
          <p className="mt-5 max-w-[24ch] text-sm leading-7 text-muted">
            Keep your shelf, your notes, and your reading voice in one place.
          </p>

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

