import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";

export default function SignupPage() {
  return (
    <SiteFrame
      eyebrow="Auth placeholder"
      title="Start a private shelf"
      description="Signup will eventually create the user profile, hidden internal email, and private library. This route is in place now so future auth work slots in without structural churn."
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <h2 className="text-xl font-semibold">Planned signup flow</h2>
          <ol className="mt-5 space-y-4 text-sm leading-6 text-muted">
            <li>1. Choose a username.</li>
            <li>2. Set a password.</li>
            <li>3. Create the profile and private library space.</li>
          </ol>
        </div>

        <div className="panel rounded-[28px] p-6 md:p-8">
          <h2 className="text-xl font-semibold">Future protections</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
            <li>Per-user storage paths for cover uploads.</li>
            <li>Row-level security for books, entries, and generated insights.</li>
            <li>Server-only secret handling for AI integrations.</li>
          </ul>

          <Link
            href="/login"
            className="mt-8 inline-flex rounded-full border border-panel-border px-4 py-2 text-sm font-medium"
          >
            Back to login placeholder
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}
