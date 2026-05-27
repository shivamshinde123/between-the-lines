"use client";

import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

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
    <ConfirmSubmitButton
      action={action}
      body="Delete this thought entry permanently. This note will disappear from the journal and cannot be restored."
      confirmLabel="Delete entry"
      hiddenFields={[
        { name: "bookId", value: bookId },
        { name: "entryId", value: entryId },
        { name: "confirmation", value: "delete" },
      ]}
      submitLabel="Delete"
      title="Remove this thought?"
    />
  );
}
