"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookForm } from "@/components/books/book-form";
import { DeleteBookButton } from "@/components/books/delete-book-button";
import { createBook, deleteBook, updateBook } from "@/lib/books/actions";
import type { BookRecord } from "@/lib/books/types";

type LibraryBook = BookRecord & {
  coverUrl: string | null;
};

type LibraryClientProps = {
  books: LibraryBook[];
};

export function LibraryClient({ books }: LibraryClientProps) {
  const [query, setQuery] = useState("");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) => book.title.toLowerCase().includes(normalizedQuery));
  }, [books, query]);

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="page-grid">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-muted">Add a book</p>
              <h2 className="mt-3 text-2xl font-semibold">Start a new shelf entry</h2>
            </div>
            <p className="text-sm text-muted">{books.length} total</p>
          </div>

          <div className="mt-6">
            <BookForm
              action={createBook}
              coverRequired
              submitLabel="Add to library"
              footer={<p className="text-sm text-muted">Books are stored privately and sorted alphabetically.</p>}
            />
          </div>
        </div>

        <div className="panel rounded-[28px] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Live search</p>
          <label className="mt-4 block">
            <span className="sr-only">Search books by title</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-[18px] border border-panel-border bg-white/70 px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <p className="mt-3 text-sm text-muted">
            {filteredBooks.length === books.length
              ? "Results update as you type."
              : `${filteredBooks.length} matching book${filteredBooks.length === 1 ? "" : "s"}.`}
          </p>
        </div>
      </div>

      <div className="panel rounded-[28px] p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted">Library</p>
            <h2 className="mt-3 text-2xl font-semibold">Alphabetized shelf</h2>
          </div>
          <p className="text-sm text-muted">{filteredBooks.length} visible</p>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-dashed border-panel-border bg-white/40 px-6 py-10 text-center">
            <p className="text-lg font-medium">
              {books.length === 0 ? "No books yet." : "No books match that search."}
            </p>
            <p className="mt-2 text-sm text-muted">
              {books.length === 0
                ? "Add your first title to make this shelf feel lived in."
                : "Try a different title fragment or clear the search box."}
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {filteredBooks.map((book) => (
              <article
                key={book.id}
                className="rounded-[26px] border border-panel-border bg-white/45 p-5"
              >
                <div className="grid gap-5 lg:grid-cols-[150px_1fr]">
                  <div className="overflow-hidden rounded-[20px] border border-panel-border bg-white/55">
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={`Cover of ${book.title}`}
                        width={300}
                        height={420}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-[210px] items-center justify-center px-4 text-center text-sm text-muted">
                        No cover uploaded
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <Link href={`/books/${book.id}`} className="text-2xl font-semibold hover:text-accent">
                          {book.title}
                        </Link>
                        <p className="mt-2 text-sm leading-6 text-muted">by {book.author_name}</p>
                      </div>
                      <DeleteBookButton
                        action={deleteBook}
                        bookId={book.id}
                        coverPath={book.cover_path}
                      />
                    </div>

                    <BookForm
                      action={updateBook}
                      authorName={book.author_name}
                      bookId={book.id}
                      coverRequired={false}
                      existingCoverPath={book.cover_path}
                      submitLabel="Save changes"
                      title={book.title}
                      footer={
                        <p className="text-sm text-muted">
                          Upload a new cover only if you want to replace the current one.
                        </p>
                      }
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
