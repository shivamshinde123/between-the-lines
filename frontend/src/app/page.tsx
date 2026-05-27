import { LibraryClient } from "@/components/books/library-client";
import { SiteFrame } from "@/components/site-frame";
import { requireViewer } from "@/lib/auth/session";
import { getCoverImageUrl, listBooksForUser } from "@backend/books/queries";

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
      activeHref="/"
      eyebrow="Private library"
      title={`Good evening, ${viewer.username ?? "Archivist"}. Your shelves await your curiosity.`}
      description="Add books, search your collection, and keep each reading thread close enough to return to later."
      viewer={viewer}
    >
      <LibraryClient books={booksWithCoverUrls} />
    </SiteFrame>
  );
}

