"use client";

type DeleteBookButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  bookId: string;
  coverPath: string | null;
};

export function DeleteBookButton({
  action,
  bookId,
  coverPath,
}: DeleteBookButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "Delete this book? Its cover image and any linked future notes will be removed.",
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="coverPath" value={coverPath ?? ""} />
      <input type="hidden" name="confirmation" value="delete" />
      <button
        type="submit"
        className="rounded-full border border-[#9a5b4d]/25 bg-[#9a5b4d]/8 px-4 py-2 text-sm font-medium text-[#7c3f31] transition-colors hover:bg-[#9a5b4d]/12"
      >
        Delete
      </button>
    </form>
  );
}
