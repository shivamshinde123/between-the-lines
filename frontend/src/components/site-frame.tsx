import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/lib/auth/actions";
import type { Viewer } from "@/lib/auth/session";
import { plannedRoutes } from "@/lib/site";

type SiteFrameProps = {
  activeHref?: string;
  children: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
  viewer?: Viewer | null;
};

function AuthShell({
  children,
  description,
  eyebrow,
  title,
}: Omit<SiteFrameProps, "viewer">) {
  return (
    <div className="page-shell px-5 py-10 md:px-8">
      <div className="w-full">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(720px,860px)]">
          <div className="hidden px-8 xl:block">
            <p className="display-title text-5xl italic">Between the Lines</p>
            <div className="mt-12 max-w-[640px]">
              {eyebrow ? <p className="editorial-kicker">{eyebrow}</p> : null}
              <h1 className="display-title mt-5 text-6xl leading-[0.95] text-foreground 2xl:text-[5.25rem]">
                {title}
              </h1>
              <p className="mt-6 max-w-[560px] text-lg leading-8 text-muted">{description}</p>
            </div>
          </div>

          <div className="panel rounded-[34px] px-6 py-8 md:px-10 md:py-10 xl:px-12 xl:py-12">
            <div className="xl:hidden">
              <p className="display-title text-4xl italic">Between the Lines</p>
              {eyebrow ? <p className="mt-4 editorial-kicker">{eyebrow}</p> : null}
              <h1 className="display-title mt-3 text-5xl leading-[0.94]">{title}</h1>
              <p className="mt-4 text-base leading-7 text-muted">{description}</p>
            </div>
            <div className="mt-0 lg:mt-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function SiteFrame({
  activeHref,
  children,
  description,
  eyebrow = "",
  title,
  viewer = null,
}: SiteFrameProps) {
  if (!viewer) {
    return (
      <AuthShell description={description} eyebrow={eyebrow} title={title}>
        {children}
      </AuthShell>
    );
  }

  const routes = plannedRoutes.filter((route) => route.href !== "/login" && route.href !== "/signup");

  return (
    <div className="page-shell">
      <div className="min-h-screen lg:grid lg:grid-cols-[212px_minmax(0,1fr)]">
        <aside className="border-panel-border px-5 py-6 lg:min-h-screen lg:border-r lg:bg-sidebar lg:px-6 lg:py-7">
          <div className="lg:sticky lg:top-0 lg:flex lg:min-h-[calc(100vh-3.5rem)] lg:flex-col">
            <div>
              <Link href="/" className="display-title text-[2.05rem] leading-none">
                Reading Room
              </Link>
            </div>

            <nav className="mt-10 grid gap-2">
              {routes.map((route) => {
                const isPrimary = route.href === activeHref;

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`rounded-sm px-3 py-3 text-[0.98rem] transition-colors ${
                      isPrimary
                        ? "bg-[rgba(61,47,36,0.08)] font-medium text-foreground"
                        : "text-[rgba(47,36,29,0.78)] hover:bg-[rgba(61,47,36,0.05)]"
                    }`}
                  >
                    {route.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-10 lg:mt-auto lg:border-t lg:border-panel-border lg:pt-6">
              <p className="text-sm text-muted">
                Signed in as{" "}
                <span className="font-medium text-foreground">{viewer.username ?? "reader"}</span>
              </p>
              <form action={logout} className="mt-4">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-sm border border-panel-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-[rgba(61,47,36,0.05)]"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="px-5 py-6 md:px-8 lg:px-12 lg:py-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-6">
              <Link href="/" className="display-title text-4xl italic md:text-[3rem]">
                Between the Lines
              </Link>
            </div>

            <header className="max-w-5xl">
              {eyebrow ? <p className="editorial-kicker">{eyebrow}</p> : null}
              <h1 className="display-title mt-4 text-5xl leading-[0.94] md:text-[4.25rem]">
                {title}
              </h1>
              <p className="mt-6 max-w-4xl text-base leading-8 text-muted md:text-lg">
                {description}
              </p>
            </header>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
