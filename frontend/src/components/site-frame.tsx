import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/lib/auth/actions";
import type { Viewer } from "@/lib/auth/session";
import { plannedRoutes } from "@/lib/site";

type SiteFrameProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
  viewer?: Viewer | null;
};

export async function SiteFrame({
  children,
  description,
  eyebrow,
  title,
  viewer = null,
}: SiteFrameProps) {
  const visibleRoutes = viewer
    ? plannedRoutes.filter((route) => route.href !== "/login" && route.href !== "/signup")
    : plannedRoutes.filter((route) => route.href === "/login" || route.href === "/signup");

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

            <div className="flex flex-col gap-4 lg:items-end">
              <nav className="flex flex-wrap gap-3">
                {visibleRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="rounded-full border border-panel-border bg-white/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/80"
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>

              {viewer ? (
                <div className="flex flex-wrap items-center gap-3">
                  <p className="rounded-full border border-panel-border bg-white/55 px-4 py-2 text-sm text-muted">
                    Signed in as <span className="font-medium text-foreground">{viewer.username ?? "reader"}</span>
                  </p>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="rounded-full border border-panel-border bg-white/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-white"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border border-panel-border bg-white/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/80"
                >
                  Enter your library
                </Link>
              )}
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
