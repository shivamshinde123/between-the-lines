import { LibraryInsightForm } from "@/components/insights/library-insight-form";
import { BookReflectionForm } from "@/components/insights/book-reflection-form";
import { SiteFrame } from "@/components/site-frame";
import {
  generateBookReflection,
  generateReadingVoiceLibraryInsight,
  generateRecurringThoughtLibraryInsight,
} from "@/lib/insights/actions";
import { requireViewer } from "@/lib/auth/session";
import { listBooksForUser } from "@backend/books/queries";
import { listThoughtEntriesForBook, listThoughtEntriesForLibrary } from "@backend/entries/queries";
import { canGenerateLibraryInsights } from "@backend/insights/deepseek";
import { getLibraryInsight, listBookShiftInsightsForUser } from "@backend/insights/queries";
import {
  parseReadingVoiceInsightContent,
  parseRecurringThoughtInsightContent,
} from "@backend/insights/types";

function formatGeneratedAt(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function splitParagraphs(content: string) {
  return content.split("\n\n").filter((paragraph) => paragraph.trim().length > 0);
}

export default async function InsightsPage() {
  const viewer = await requireViewer();
  const [books, entries, savedReadingVoice, savedRecurringThought, savedBookReflections] = await Promise.all([
    listBooksForUser(viewer.id),
    listThoughtEntriesForLibrary(viewer.id),
    getLibraryInsight("reading_voice", viewer.id),
    getLibraryInsight("recurring_thought", viewer.id),
    listBookShiftInsightsForUser(viewer.id),
  ]);
  const readingVoiceContent = savedReadingVoice?.content
    ? parseReadingVoiceInsightContent(savedReadingVoice.content)
    : null;
  const recurringThoughtContent = savedRecurringThought?.content
    ? parseRecurringThoughtInsightContent(savedRecurringThought.content)
    : null;
  const generationStatus = canGenerateLibraryInsights(entries);
  const hasBooks = books.length > 0;
  const distinctBooksWithEntries = new Set(entries.map((entry) => entry.book_id)).size;
  const savedBookReflectionByBookId = new Map(
    savedBookReflections
      .filter((reflection) => reflection.book_id)
      .map((reflection) => [reflection.book_id as string, reflection]),
  );
  const bookEntriesByBookId = new Map(
    await Promise.all(
      books.map(async (book) => [book.id, await listThoughtEntriesForBook(book.id, viewer.id)] as const),
    ),
  );

  return (
    <SiteFrame
      activeHref="/insights"
      eyebrow="Private insights"
      title="Your library in reflection"
      description="This page reads across your private shelf and journal entries to surface how your voice evolves and which thought keeps returning."
      viewer={viewer}
    >
      <section className="space-y-8">
        <article className="panel rounded-[28px] p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">The Book Changed You. How?</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                Generate a before-and-after portrait for any book from the notes you have written so far.
              </p>
            </div>
            <p className="text-sm text-muted">{books.length} book{books.length === 1 ? "" : "s"}</p>
          </div>

          {books.length === 0 ? (
            <div className="mt-6 rounded-[22px] border border-dashed border-panel-border bg-white/40 px-5 py-6 text-sm leading-7 text-muted">
              Add a book first, then generate its reflection here.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 xl:grid-cols-2">
              {books.map((book) => {
                const savedReflection = savedBookReflectionByBookId.get(book.id) ?? null;
                const hasSavedReflection = Boolean(
                  savedReflection?.content?.trim() || savedReflection?.last_generated_at,
                );
                const entryCount = bookEntriesByBookId.get(book.id)?.length ?? 0;

                return (
                  <div key={book.id} className="rounded-[24px] border border-panel-border bg-white/52 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="display-title text-[2rem] leading-none">{book.title}</h3>
                        <p className="mt-2 text-sm italic text-muted">{book.author_name}</p>
                      </div>
                      <p className="text-sm text-muted">{entryCount} entr{entryCount === 1 ? "y" : "ies"}</p>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted">
                      {savedReflection?.last_generated_at
                        ? `Last generated ${formatGeneratedAt(savedReflection.last_generated_at)}`
                        : "No saved reflection yet."}
                    </p>

                    <div className="mt-4 rounded-[20px] border border-panel-border bg-white/70 p-4">
                      {savedReflection?.content ? (
                        <div className="space-y-4">
                          {splitParagraphs(savedReflection.content).map((paragraph, index) => (
                            <p key={`${book.id}-${index}-${paragraph.length}`} className="text-sm leading-7 text-foreground">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm leading-7 text-muted">
                          Generate a reflection to see how this book changed your perspective.
                        </p>
                      )}
                    </div>

                    <div className="mt-5">
                      <BookReflectionForm
                        action={generateBookReflection}
                        bookId={book.id}
                        submitLabel={hasSavedReflection ? "Regenerate reflection" : "Generate reflection"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <section className="grid gap-6 2xl:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.22fr)]">
        <div className="page-grid">
          <div className="panel rounded-[28px] p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-muted">Library signals</p>
            <div className="mt-5 grid gap-3 text-sm">
              <p className="rounded-[20px] border border-panel-border bg-white/60 px-4 py-3">
                {books.length} book{books.length === 1 ? "" : "s"} on your shelf
              </p>
              <p className="rounded-[20px] border border-panel-border bg-white/60 px-4 py-3 text-muted">
                {entries.length} thought entr{entries.length === 1 ? "y" : "ies"} across{" "}
                {distinctBooksWithEntries} book{distinctBooksWithEntries === 1 ? "" : "s"}
              </p>
            </div>

            <div className="mt-6 rounded-[22px] border border-dashed border-panel-border bg-white/40 px-5 py-5 text-sm leading-7 text-muted">
              {hasBooks ? (
                <p>Generate cross-library insights whenever you want from the shelf and notes you have so far.</p>
              ) : (
                <p>You can generate insights at any time, though richer notes will usually produce sharper results.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 2xl:grid-cols-2">
          <article className="panel rounded-[28px] p-6 md:p-8">
            <h2 className="text-2xl font-semibold">Your Reading Voice Over Time</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              Tracks how your tone, attention, and interpretive style evolve as your notes accumulate.
            </p>

            <div className="mt-5 rounded-[22px] border border-panel-border bg-white/50 p-5">
              {readingVoiceContent ? (
                <div className="space-y-5">
                  <div className="space-y-4">
                    {splitParagraphs(readingVoiceContent.summary).map((paragraph, index) => (
                      <p key={`${index}-${paragraph.length}`} className="text-sm leading-7 text-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">Examples</p>
                    {readingVoiceContent.examples.map((example, index) => (
                      <div
                        key={`${index}-${example.bookTitle}-${example.snippet}`}
                        className="rounded-[18px] border border-panel-border bg-white/70 px-4 py-3"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          {example.bookTitle}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          &quot;{example.snippet}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-7 text-muted">
                  No saved insight yet. Generate one once your journal has enough range across books.
                </p>
              )}
            </div>

            <p className="mt-4 text-sm leading-6 text-muted">
              {savedReadingVoice?.last_generated_at
                ? `Last generated ${formatGeneratedAt(savedReadingVoice.last_generated_at)}`
                : "Saved output will appear here once generated."}
            </p>

            <div className="mt-5">
              <LibraryInsightForm
                action={generateReadingVoiceLibraryInsight}
                disabled={!generationStatus.ok}
                submitLabel={readingVoiceContent ? "Regenerate insight" : "Generate insight"}
              />
            </div>
          </article>

          <article className="panel rounded-[28px] p-6 md:p-8">
            <h2 className="text-2xl font-semibold">The Thought You Keep Having</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              Surfaces the recurring idea or concern your entries keep circling without you fully naming it.
            </p>

            <div className="mt-5 rounded-[22px] border border-panel-border bg-white/50 p-5">
              {recurringThoughtContent ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">Pattern name</p>
                    <p className="mt-2 text-lg font-medium text-foreground">
                      {recurringThoughtContent.patternName}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {splitParagraphs(recurringThoughtContent.summary).map((paragraph, index) => (
                      <p key={`${index}-${paragraph.length}`} className="text-sm leading-7 text-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">Examples</p>
                    {recurringThoughtContent.examples.map((example, index) => (
                      <div
                        key={`${index}-${example.bookTitle}-${example.snippet}`}
                        className="rounded-[18px] border border-panel-border bg-white/70 px-4 py-3"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          {example.bookTitle}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          &quot;{example.snippet}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-7 text-muted">
                  No saved pattern yet. Generate one when your library has enough journal overlap.
                </p>
              )}
            </div>

            <p className="mt-4 text-sm leading-6 text-muted">
              {savedRecurringThought?.last_generated_at
                ? `Last generated ${formatGeneratedAt(savedRecurringThought.last_generated_at)}`
                : "Saved output will appear here once generated."}
            </p>

            <div className="mt-5">
              <LibraryInsightForm
                action={generateRecurringThoughtLibraryInsight}
                disabled={!generationStatus.ok}
                submitLabel={recurringThoughtContent ? "Regenerate insight" : "Generate insight"}
              />
            </div>
          </article>
        </div>
      </section>
      </section>
    </SiteFrame>
  );
}
