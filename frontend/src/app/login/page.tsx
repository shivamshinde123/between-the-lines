import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";

export default function LoginPage() {
  return (
    <SiteFrame
      eyebrow="Auth placeholder"
      title="Log back into your library"
      description="This screen will become the username and password sign-in flow backed by Supabase. In Stage 1 it exists to lock the route structure and layout direction."
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <h2 className="text-xl font-semibold">Planned fields</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[20px] border border-panel-border bg-white/55 p-4">
              <p className="text-sm text-muted">Username</p>
            </div>
            <div className="rounded-[20px] border border-panel-border bg-white/55 p-4">
              <p className="text-sm text-muted">Password</p>
            </div>
            <div className="rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white">
              Sign in action arrives in Stage 3
            </div>
          </div>
        </div>

        <div className="panel rounded-[28px] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">
            Stage notes
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
            <li>Username-first UX will hide synthetic email handling.</li>
            <li>Protected routes will redirect here once auth is implemented.</li>
            <li>Profile-backed privacy rules arrive after the database stage.</li>
          </ul>

          <Link
            href="/signup"
            className="mt-8 inline-flex rounded-full border border-panel-border px-4 py-2 text-sm font-medium"
          >
            View the signup placeholder
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}
