import Link from "next/link";
import type { ReactNode } from "react";
import { plannedRoutes } from "@/lib/site";

type SiteFrameProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

export function SiteFrame({
  children,
  description,
  eyebrow,
  title,
}: SiteFrameProps) {
  return (
    <div className="page-shell">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="panel rounded-[32px] px-6 py-6 md:px-8 md:py-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-muted">
                {eyebrow}
              </p>
              <h1 className="display-title mt-3 text-5xl leading-none md:text-6xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
                {description}
              </p>
            </div>

            <nav className="flex flex-wrap gap-3">
              {plannedRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="rounded-full border border-panel-border bg-white/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/80"
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
