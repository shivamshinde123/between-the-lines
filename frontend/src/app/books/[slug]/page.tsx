import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntriesClient } from "@/components/entries/entries-client";
import { createThoughtEntry, updateThoughtEntry } from "@/lib/entries/actions";
import { listThoughtEntriesForBook } from "@/lib/entries/queries";
import { BookReflectionForm } from "@/components/insights/book-reflection-form";
import { generateBookReflection } from "@/lib/insights/actions";
import { canGenerateBookShift } from "@/lib/insights/deepseek";
import { getBookShiftInsight } from "@/lib/insights/queries";
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
  const entries = await listThoughtEntriesForBook(book.id, viewer.id);
  const savedReflection = await getBookShiftInsight(book.id, viewer.id);
  const reflectionStatus = canGenerateBookShift(entries);

  return (
    <SiteFrame
      eyebrow="Private book page"
      title={book.title}
      description={`by ${book.author_name}. Your reading journal is live, and this page can now generate a before-and-after portrait from the way your notes changed over time.`}
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
          <EntriesClient
            bookId={book.id}
            createAction={createThoughtEntry}
            entries={entries}
            updateAction={updateThoughtEntry}
          />

          <div className="panel rounded-[28px] p-6 md:p-8">
            <h2 className="text-xl font-semibold">The Book Changed You. How?</h2>
            {savedReflection?.last_generated_at ? (
              <p className="mt-3 text-sm leading-6 text-muted">
                Last generated{" "}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(savedReflection.last_generated_at))}
              </p>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted">
                Generate a short before-and-after portrait from your earliest and latest entries.
              </p>
            )}

            <div className="mt-5 rounded-[22px] border border-panel-border bg-white/50 p-5">
              {savedReflection?.content ? (
                <div className="space-y-4">
                  {savedReflection.content.split("\n\n").map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-7 text-muted">
                  No saved reflection yet. Generate one after you have enough journal material.
                </p>
              )}
            </div>

            {!reflectionStatus.ok ? (
              <p className="mt-4 text-sm text-muted">{reflectionStatus.message}</p>
            ) : null}

            <div className="mt-5">
              <BookReflectionForm
                action={generateBookReflection}
                bookId={book.id}
                submitLabel={savedReflection ? "Regenerate reflection" : "Generate reflection"}
              />
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
