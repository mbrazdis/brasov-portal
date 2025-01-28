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
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  x: z.coerce.number().min(-180).max(180),
  y: z.coerce.number().min(-90).max(90),
  z: z.coerce.number().min(-180).max(180),
  image: imageSchema.refine((file: File) => file.size > 0, "Required"),
});

export async function addAttraction(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await fs.mkdir("public/attractions", { recursive: true });
  const imagePath = `/attractions/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.attraction.create({
    data: {
      id: data.id,
      name: data.name,
      description: data.description,
      location: data.location,
      x: data.x,
      y: data.y,
      z: data.z,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/attractions");

  redirect("/admin/attractions");
}

const editSchema = addSchema.extend({
  image: imageSchema.optional(),
});

export async function updateAttraction(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const attraction = await db.attraction.findUnique({ where: { id } });

  if (attraction == null) return notFound();

  let imagePath = attraction.imagePath;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${attraction.imagePath}`);
    imagePath = `/attractions/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await db.attraction.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      location: data.location,
      x: data.x,
      y: data.y,
      z: data.z,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/attractions");

  redirect("/admin/attractions");
}

export async function deleteAttraction(id: string) {
  const attraction = await db.attraction.delete({ where: { id } });

  if (attraction == null) return notFound();

  await fs.unlink(`public${attraction.imagePath}`);

  revalidatePath("/");
  revalidatePath("/attractions");
}