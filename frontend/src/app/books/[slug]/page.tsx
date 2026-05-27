import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntriesClient } from "@/components/entries/entries-client";
import { createThoughtEntry, updateThoughtEntry } from "@/lib/entries/actions";
import { listThoughtEntriesForBook } from "@backend/entries/queries";
import { SiteFrame } from "@/components/site-frame";
import { getBookForUser, getCoverImageUrl } from "@backend/books/queries";
import { requireViewer } from "@/lib/auth/session";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const viewer = await requireViewer();
  const { slug } = await params;
  const book = await getBookForUser(slug, viewer.id);

  if (!book) {
    notFound();
  }

  let coverUrl: string | null = null;
  let entries = [];

  try {
    coverUrl = await getCoverImageUrl(book.cover_path);
  } catch (error) {
    console.error("book page cover load failed", {
      bookId: book.id,
      error,
      userId: viewer.id,
    });
    throw error;
  }

  try {
    entries = await listThoughtEntriesForBook(book.id, viewer.id);
  } catch (error) {
    console.error("book page entries load failed", {
      bookId: book.id,
      error,
      userId: viewer.id,
    });
    throw error;
  }

  return (
    <SiteFrame
      activeHref="/"
      eyebrow="Private book page"
      title={book.title}
      description={`by ${book.author_name}. Your reading journal is live, and this page can now generate a before-and-after portrait from the way your notes changed over time.`}
      viewer={viewer}
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)] 2xl:grid-cols-[minmax(340px,0.72fr)_minmax(0,1.28fr)]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Book details</p>
          <div className="mt-4 mx-auto max-w-[280px] overflow-hidden rounded-[22px] border border-panel-border bg-white/55 md:max-w-[320px]">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={`Cover of ${book.title}`}
                width={640}
                height={920}
                className="aspect-[4/6] h-full w-full object-cover"
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
          <EntriesClient
            bookId={book.id}
            createAction={createThoughtEntry}
            entries={entries}
            updateAction={updateThoughtEntry}
          />
        </div>
      </section>
    </SiteFrame>
  );
}
