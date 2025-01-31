"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file: File) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.string().transform((str) => new Date(str)),
  image: imageSchema.refine((file: File) => file.size > 0, "Required"),
});

export async function addNews(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await fs.mkdir("public/news", { recursive: true });
  const imagePath = `/news/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.news.create({
    data: {
      id: data.id,
      title: data.title,
      content: data.content,
      date: data.date,
      imagePath,
      isActive: true, 
    },
  });

  revalidatePath("/");
  revalidatePath("/news");

  redirect("/admin/news");
}

const editSchema = addSchema.extend({
  image: imageSchema.optional(),
});

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

  let imagePath = news.imagePath;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${news.imagePath}`);
    imagePath = `/news/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await db.news.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      date: data.date,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/news");

  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  const news = await db.news.delete({ where: { id } });

  if (news == null) return notFound();

  await fs.unlink(`public${news.imagePath}`);

  revalidatePath("/");
  revalidatePath("/news");
}