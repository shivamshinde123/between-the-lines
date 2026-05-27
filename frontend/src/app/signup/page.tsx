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
      description="Track books, save your thoughts as you read, and build a private library that remembers how each one stayed with you."
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.65fr)]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <h2 className="text-xl font-semibold">Create your account</h2>
          <p className="mt-3 max-w-[34ch] text-sm leading-6 text-muted">
            Start a personal reading journal for the books you finish and the thoughts they leave behind.
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
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Between the Lines</p>
          <p className="mt-5 max-w-[24ch] text-sm leading-7 text-muted">
            A quiet place for your books, your notes, and the patterns that return across them.
          </p>

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

