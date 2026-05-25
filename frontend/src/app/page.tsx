import { LibraryClient } from "@/components/books/library-client";
import { SiteFrame } from "@/components/site-frame";
import { requireViewer } from "@/lib/auth/session";
import { getCoverImageUrl, listBooksForUser } from "@/lib/books/queries";
import { stageMilestones } from "@/lib/site";

export default async function Home() {
  const viewer = await requireViewer();
  const books = await listBooksForUser(viewer.id);
  const booksWithCoverUrls = await Promise.all(
    books.map(async (book) => ({
      ...book,
      coverUrl: await getCoverImageUrl(book.cover_path),
    })),
  );

  return (
    <SiteFrame
      eyebrow="Private library"
      title="Between the Lines"
      description={`Welcome, ${viewer.username ?? "reader"}. Your shelf is alphabetized, searchable, and ready for new books, cover uploads, and the reading notes that come next.`}
      viewer={viewer}
    >
      <div className="page-grid">
        <div className="panel rounded-[28px] p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Current milestone</p>
          <ul className="mt-5 space-y-4">
            {stageMilestones.map((milestone) => (
              <li key={milestone} className="border-l-2 border-accent-soft pl-4">
                <p className="text-sm leading-6">{milestone}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel rounded-[28px] p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Shelf rules</p>
          <div className="mt-4 grid gap-3 text-sm">
            <p className="rounded-[20px] border border-panel-border bg-white/60 px-4 py-3">
              Books are listed alphabetically by title.
            </p>
            <p className="rounded-[20px] border border-panel-border bg-white/60 px-4 py-3 text-muted">
              Covers stay private in user-scoped storage paths and are validated before upload.
            </p>
            <p className="rounded-[20px] border border-panel-border bg-white/60 px-4 py-3 text-muted">
              Unauthenticated requests are redirected to `/login`.
            </p>
          </div>
        </div>

        <LibraryClient books={booksWithCoverUrls} />
      </div>
    </SiteFrame>
  );
}
