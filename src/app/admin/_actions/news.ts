"use server";

import db from "@/db/db";
import { z } from "zod";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const addSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.string().transform((str) => new Date(str)),
  imagePath: z.string().min(1),
});

export async function addNews(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await db.news.create({
    data: {
      id: data.id,
      title: data.title,
      content: data.content,
      date: data.date,
      imagePath: data.imagePath,
      isActive: true, // Set default value for isActive
    },
  });

  revalidatePath("/");
  revalidatePath("/news");

  redirect("/admin/news");
}

const editSchema = addSchema;

export async function updateNews(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const news = await db.news.findUnique({ where: { id } });

  if (news == null) return notFound();

  await db.news.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      date: data.date,
      imagePath: data.imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/news");

  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  const news = await db.news.delete({ where: { id } });

  if (news == null) return notFound();

  revalidatePath("/");
  revalidatePath("/news");
}