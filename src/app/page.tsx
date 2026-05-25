import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";
import { plannedRoutes, stageMilestones } from "@/lib/site";

export default function Home() {
  return (
    <SiteFrame
      eyebrow="Stage 1 foundation"
      title="Between the Lines"
      description="A private reading journal for book notes, evolving thoughts, and later AI reflections. This bootstrap stage establishes the product shell and route structure before real data flows arrive."
    >
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">
            Product surfaces
          </p>
          <div className="mt-5 grid gap-3">
            {plannedRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="rounded-[22px] border border-panel-border bg-white/50 px-5 py-4 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{route.label}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {route.description}
                    </p>
                  </div>
                  <span className="text-sm text-accent">Open</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="page-grid">
          <div className="panel rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-muted">
              Current milestone
            </p>
            <ul className="mt-5 space-y-4">
              {stageMilestones.map((milestone) => (
                <li key={milestone} className="border-l-2 border-accent-soft pl-4">
                  <p className="text-sm leading-6">{milestone}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-muted">
              Planned integrations
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {["Supabase Auth", "Supabase Storage", "DeepSeek", "Vercel"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-panel-border bg-white/60 px-3 py-2"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
