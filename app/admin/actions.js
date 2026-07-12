"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createDog, addPhotoEntry } from "@/lib/blob";

export async function logout() {
  cookies().delete("admin_auth");
  redirect("/admin/login");
}

export async function createDogAction(formData) {
  const name = formData.get("name")?.toString().trim();
  const owner = formData.get("owner")?.toString().trim();
  if (!name || !owner) return;

  const slug = await createDog({ name, owner });
  redirect(`/admin/dogs/${slug}`);
}

export async function uploadPhotoAction(slug, formData) {
  const file = formData.get("photo");
  const caption = formData.get("caption")?.toString().trim();

  if (!file || typeof file === "string" || file.size === 0) {
    redirect(`/admin/dogs/${slug}?error=nofile`);
  }

  await addPhotoEntry(slug, file, caption);
  redirect(`/admin/dogs/${slug}?success=1`);
}
