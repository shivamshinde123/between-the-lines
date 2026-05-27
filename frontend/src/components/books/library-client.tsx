"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookForm } from "@/components/books/book-form";
import { DeleteBookButton } from "@/components/books/delete-book-button";
import { createBook, deleteBook, updateBook } from "@/lib/books/actions";
import type { BookRecord } from "@backend/books/types";

type LibraryBook = BookRecord & {
  coverUrl: string | null;
};

type LibraryClientProps = {
  books: LibraryBook[];
};

export function LibraryClient({ books }: LibraryClientProps) {
  const [query, setQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) => book.title.toLowerCase().includes(normalizedQuery));
  }, [books, query]);

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <button
          type="button"
          onClick={() => setShowAddForm((current) => !current)}
          className="inline-flex w-full items-center justify-center rounded-sm bg-accent px-5 py-4 text-sm font-medium uppercase tracking-[0.14em] text-white xl:w-auto"
        >
          {showAddForm ? "Close add book" : "Add new book"}
        </button>

        <label className="block w-full max-w-[320px] xl:ml-auto">
          <span className="sr-only">Search books by title</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your collection..."
            className="paper-input h-12 w-full rounded-sm px-4"
          />
        </label>
      </div>

      {showAddForm ? (
        <section className="border-b border-t border-panel-border py-6">
          <div className="max-w-4xl">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-muted">
              Add a book
            </p>
            <h2 className="display-title mt-3 text-3xl">Start a new shelf entry.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Add a title, its author, and an optional cover. The shelf stays alphabetized as your collection grows.
            </p>
            <div className="mt-6">
              <BookForm
                action={createBook}
                coverRequired={false}
                onSuccess={() => setShowAddForm(false)}
                resetOnSuccess
                submitLabel="Add to library"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="display-title text-[2.25rem] leading-none">The Collection</h2>
            <span className="rounded-full bg-[rgba(84,63,45,0.06)] px-3 py-1 text-xs text-muted">
              {books.length} {books.length === 1 ? "Volume" : "Volumes"}
            </span>
          </div>

          <div className="flex items-center gap-5 text-sm uppercase tracking-[0.14em]">
            <span className="border-b border-foreground pb-1 font-medium text-foreground">Alphabetical</span>
          </div>
        </div>

        <div className="mt-6 faint-rule" />

        {filteredBooks.length === 0 ? (
          <div className="py-16">
            <p className="display-title text-4xl">
              {books.length === 0 ? "Your shelves are still empty." : "No book matches that search."}
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted">
              {books.length === 0
                ? "Add your first title to begin building the room."
                : "Try a different title fragment or clear the search field."}
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredBooks.map((book) => {
              const isEditing = editingBookId === book.id;

              return (
                <article key={book.id} className="group">
                  <div className="book-shadow relative overflow-hidden bg-panel">
                    <Link href={`/books/${book.id}`} className="block">
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={`Cover of ${book.title}`}
                          width={400}
                          height={600}
                          className="aspect-[4/6] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex aspect-[4/6] items-center justify-center bg-[rgba(89,67,50,0.08)] px-6 text-center text-sm uppercase tracking-[0.16em] text-muted">
                          No cover found
                        </div>
                      )}
                    </Link>

                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(31,27,24,0.24)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/books/${book.id}`}
                          className="rounded-full bg-[rgba(255,248,241,0.92)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-foreground"
                        >
                          Open
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingBookId((current) => (current === book.id ? null : book.id))
                          }
                          className="rounded-full bg-[rgba(255,248,241,0.92)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-foreground"
                        >
                          {isEditing ? "Close" : "Edit"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link href={`/books/${book.id}`} className="display-title text-[2rem] leading-[1.02]">
                      {book.title}
                    </Link>
                    <p className="mt-2 text-[0.98rem] italic text-muted">{book.author_name}</p>
                  </div>

                  {isEditing ? (
                    <div className="mt-5 border-t border-panel-border pt-5">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-muted">
                          Edit book
                        </p>
                        <DeleteBookButton
                          action={deleteBook}
                          bookId={book.id}
                          coverPath={book.cover_path}
                        />
                      </div>
                      <div className="mt-4">
                        <BookForm
                          action={updateBook}
                          authorName={book.author_name}
                          bookId={book.id}
                          coverRequired={false}
                          existingCoverPath={book.cover_path}
                          onSuccess={() => setEditingBookId(null)}
                          submitLabel="Save changes"
                          title={book.title}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setEditingBookId(book.id)}
                        className="text-sm uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
                      >
                        Edit
                      </button>
                      <DeleteBookButton
                        action={deleteBook}
                        bookId={book.id}
                        coverPath={book.cover_path}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
