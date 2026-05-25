"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BOOK_COVER_BUCKET, buildCoverObjectPath, validateCoverFile } from "@/lib/books/covers";
import { DEFAULT_BOOK_FORM_STATE, type BookFormState } from "@/lib/books/types";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

function normalizeBookInput(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function getOptionalFile(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function validateBookFields(title: string, authorName: string) {
  if (!title) {
    return "Book title is required.";
  }

  if (!authorName) {
    return "Author name is required.";
  }

  return null;
}

async function uploadCover(userId: string, coverFile: File) {
  const validation = validateCoverFile(coverFile);

  if (!validation.ok) {
    return {
      error: validation.message,
      path: null,
    };
  }

  const objectPath = buildCoverObjectPath(userId, coverFile.name);
  const supabase = await createClient();
  const arrayBuffer = await coverFile.arrayBuffer();
  const { error } = await supabase.storage.from(BOOK_COVER_BUCKET).upload(objectPath, arrayBuffer, {
    contentType: coverFile.type,
    upsert: false,
  });

  if (error) {
    return {
      error: "Cover upload failed. Please try again.",
      path: null,
    };
  }

  return {
    error: null,
    path: objectPath,
  };
}

async function removeCover(path: string | null) {
  if (!path) {
    return;
  }

  const supabase = await createClient();
  await supabase.storage.from(BOOK_COVER_BUCKET).remove([path]);
}

export async function createBook(
  _previousState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const viewer = await requireViewer();
  const title = normalizeBookInput(formData.get("title"));
  const authorName = normalizeBookInput(formData.get("authorName"));
  const coverFile = getOptionalFile(formData, "cover");

  const fieldError = validateBookFields(title, authorName);

  if (fieldError) {
    return { error: fieldError };
  }

  if (!coverFile) {
    return { error: "A cover image is required." };
  }

  const uploadedCover = await uploadCover(viewer.id, coverFile);

  if (uploadedCover.error) {
    return { error: uploadedCover.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("books").insert({
    author_name: authorName,
    cover_path: uploadedCover.path,
    title,
    user_id: viewer.id,
  });

  if (error) {
    await removeCover(uploadedCover.path);

    return { error: "Could not save that book." };
  }

  revalidatePath("/");

  return DEFAULT_BOOK_FORM_STATE;
}

export async function updateBook(
  _previousState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const viewer = await requireViewer();
  const bookId = normalizeBookInput(formData.get("bookId"));
  const title = normalizeBookInput(formData.get("title"));
  const authorName = normalizeBookInput(formData.get("authorName"));
  const existingCoverPath = normalizeBookInput(formData.get("existingCoverPath")) || null;
  const coverFile = getOptionalFile(formData, "cover");

  const fieldError = validateBookFields(title, authorName);

  if (fieldError) {
    return { error: fieldError };
  }

  let nextCoverPath = existingCoverPath;

  if (coverFile) {
    const uploadedCover = await uploadCover(viewer.id, coverFile);

    if (uploadedCover.error) {
      return { error: uploadedCover.error };
    }

    nextCoverPath = uploadedCover.path;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("books")
    .update({
      author_name: authorName,
      cover_path: nextCoverPath,
      title,
    })
    .eq("id", bookId)
    .eq("user_id", viewer.id);

  if (error) {
    if (coverFile && nextCoverPath && nextCoverPath !== existingCoverPath) {
      await removeCover(nextCoverPath);
    }

    return { error: "Could not update that book." };
  }

  if (coverFile && existingCoverPath && nextCoverPath !== existingCoverPath) {
    await removeCover(existingCoverPath);
  }

  revalidatePath("/");
  revalidatePath(`/books/${bookId}`);

  return DEFAULT_BOOK_FORM_STATE;
}

export async function deleteBook(formData: FormData) {
  const viewer = await requireViewer();
  const bookId = normalizeBookInput(formData.get("bookId"));
  const coverPath = normalizeBookInput(formData.get("coverPath")) || null;
  const confirmation = normalizeBookInput(formData.get("confirmation"));

  if (confirmation !== "delete") {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", bookId)
    .eq("user_id", viewer.id);

  if (!error) {
    await removeCover(coverPath);
  }

  revalidatePath("/");
  redirect("/");
}
