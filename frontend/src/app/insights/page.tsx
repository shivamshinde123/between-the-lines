import { LibraryInsightForm } from "@/components/insights/library-insight-form";
import { SiteFrame } from "@/components/site-frame";
import {
  generateReadingVoiceLibraryInsight,
  generateRecurringThoughtLibraryInsight,
} from "@/lib/insights/actions";
import { requireViewer } from "@/lib/auth/session";
import { listBooksForUser } from "@backend/books/queries";
import { listThoughtEntriesForLibrary } from "@backend/entries/queries";
import { canGenerateLibraryInsights } from "@backend/insights/deepseek";
import { getLibraryInsight } from "@backend/insights/queries";
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
  const [books, entries, savedReadingVoice, savedRecurringThought] = await Promise.all([
    listBooksForUser(viewer.id),
    listThoughtEntriesForLibrary(viewer.id),
    getLibraryInsight("reading_voice", viewer.id),
    getLibraryInsight("recurring_thought", viewer.id),
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

  return (
    <SiteFrame
      eyebrow="Private insights"
      title="Your library in reflection"
      description="This page reads across your private shelf and journal entries to surface how your voice evolves and which thought keeps returning."
      viewer={viewer}
    >
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
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
                generationStatus.ok ? (
                  <p>
                    Your journal has enough material for cross-library insight generation.
                  </p>
                ) : (
                  <p>{generationStatus.message}</p>
                )
              ) : (
                <p>Add books to your shelf first, then write entries before generating insights.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
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
                    {readingVoiceContent.examples.map((example) => (
                      <div
                        key={`${example.bookTitle}-${example.snippet}`}
                        className="rounded-[18px] border border-panel-border bg-white/70 px-4 py-3"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          {example.bookTitle}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">“{example.snippet}”</p>
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
                    {recurringThoughtContent.examples.map((example) => (
                      <div
                        key={`${example.bookTitle}-${example.snippet}`}
                        className="rounded-[18px] border border-panel-border bg-white/70 px-4 py-3"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">
                          {example.bookTitle}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">“{example.snippet}”</p>
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
    </SiteFrame>
  );
}

