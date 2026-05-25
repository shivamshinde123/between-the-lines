import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/site-frame";
import { getBookForUser, getCoverImageUrl } from "@/lib/books/queries";
import { requireViewer } from "@/lib/auth/session";

type BookPageProps = {
  params: {
    slug: string;
  };
};

export default async function BookPage({ params }: BookPageProps) {
  const viewer = await requireViewer();
  const { slug } = params;
  const book = await getBookForUser(slug, viewer.id);

  if (!book) {
    notFound();
  }

  const coverUrl = await getCoverImageUrl(book.cover_path);

  return (
    <SiteFrame
      eyebrow="Private book page"
      title={book.title}
      description={`by ${book.author_name}. Thought entries and the book-level reflection arrive in the next stages, but the library ownership and metadata are already live.`}
      viewer={viewer}
    >
      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Book details</p>
          <div className="mt-4 overflow-hidden rounded-[22px] border border-panel-border bg-white/55">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={`Cover of ${book.title}`}
                width={640}
                height={920}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[320px] items-center justify-center px-6 text-center text-sm text-muted">
                No cover uploaded for this book.
              </div>
            )}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Added {new Date(book.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-full border border-panel-border px-4 py-2 text-sm font-medium"
          >
            Back to library
          </Link>
        </div>

        <div className="page-grid">
          <div className="panel rounded-[28px] p-6 md:p-8">
            <h2 className="text-xl font-semibold">Thought entries</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Timestamped entries for {book.title} will be listed chronologically here in Stage 5.
            </p>
          </div>

          <div className="panel rounded-[28px] p-6 md:p-8">
            <h2 className="text-xl font-semibold">The Book Changed You. How?</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              DeepSeek-powered before-and-after reflection arrives in Stage 6.
            </p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
