"use client";

import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

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
    <ConfirmSubmitButton
      action={action}
      body="Delete this book, remove its cover image, and clear any linked notes that belong to it."
      confirmLabel="Delete book"
      hiddenFields={[
        { name: "bookId", value: bookId },
        { name: "coverPath", value: coverPath ?? "" },
        { name: "confirmation", value: "delete" },
      ]}
      submitLabel="Delete"
      title="Remove this book?"
    />
  );
}
