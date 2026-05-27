"use client";

import { useEffect, useId, useRef, useState } from "react";

type HiddenField = {
  name: string;
  value: string;
};

type ConfirmSubmitButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  body: string;
  confirmLabel: string;
  hiddenFields: HiddenField[];
  submitLabel: string;
  title: string;
};

export function ConfirmSubmitButton({
  action,
  body,
  confirmLabel,
  hiddenFields,
  submitLabel,
  title,
}: ConfirmSubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <form ref={formRef} action={action}>
        {hiddenFields.map((field) => (
          <input key={field.name} type="hidden" name={field.name} value={field.value} />
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-[#9a5b4d]/25 bg-[#9a5b4d]/8 px-4 py-2 text-sm font-medium text-[#7c3f31] transition-colors hover:bg-[#9a5b4d]/12"
        >
          {submitLabel}
        </button>
      </form>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,20,15,0.28)] px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="panel w-full max-w-md rounded-[28px] px-6 py-6 md:px-7"
          >
            <p id={titleId} className="display-title text-3xl leading-none text-foreground">
              {title}
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">{body}</p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-panel-border bg-white/75 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  formRef.current?.requestSubmit();
                }}
                className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-opacity"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
