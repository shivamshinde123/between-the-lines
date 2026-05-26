"use client";

type DeleteEntryButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  bookId: string;
  entryId: string;
};

export function DeleteEntryButton({
  action,
  bookId,
  entryId,
}: DeleteEntryButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "Delete this thought entry? This cannot be undone.",
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="entryId" value={entryId} />
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
