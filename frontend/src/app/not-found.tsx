import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center">
        <div className="panel w-full rounded-[32px] px-6 py-8 md:px-8">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Not found</p>
          <h1 className="display-title mt-3 text-4xl leading-none md:text-5xl">
            This shelf entry is missing.
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted">
            The page you asked for does not exist anymore, or you do not have access to it from
            this account.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white"
          >
            Back to library
          </Link>
        </div>
      </div>
    </div>
  );
}
