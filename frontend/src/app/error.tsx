"use client";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center">
        <div className="panel w-full rounded-[32px] px-6 py-8 md:px-8">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Application error</p>
          <h1 className="display-title mt-3 text-4xl leading-none md:text-5xl">
            The library lost its place.
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted">
            Something failed while loading this page. Try again. If the problem keeps happening,
            check your environment variables and Supabase configuration.
          </p>
          {error.digest ? (
            <p className="mt-4 rounded-[18px] border border-panel-border bg-white/50 px-4 py-3 text-sm text-muted">
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
