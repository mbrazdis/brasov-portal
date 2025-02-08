"use server";

import fs from "fs/promises";
import crypto from "crypto";
import db from "@/db/db";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { z } from "zod";

const imageSchema = z.instanceof(File, { message: "Required" });
const addSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  camera_x: z.preprocess((val) => parseFloat(val as string), z.number()),
  camera_y: z.preprocess((val) => parseFloat(val as string), z.number()),
  camera_z: z.preprocess((val) => parseFloat(val as string), z.number()),
  target_x: z.preprocess((val) => parseFloat(val as string), z.number()),
  target_y: z.preprocess((val) => parseFloat(val as string), z.number()),
  target_z: z.preprocess((val) => parseFloat(val as string), z.number()),
  map_name: z.string().min(1),
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
      camera_x: data.camera_x,
      camera_y: data.camera_y,
      camera_z: data.camera_z,
      target_x: data.target_x,
      target_y: data.target_y,
      target_z: data.target_z,
      map_name: data.map_name,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/attractions");

  redirect("/admin/places");
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
      camera_x: data.camera_x,
      camera_y: data.camera_y,
      camera_z: data.camera_z,
      target_x: data.target_x,
      target_y: data.target_y,
      target_z: data.target_z,
      map_name: data.map_name,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/attractions");

  redirect("/admin/places");
}

export async function deleteAttraction(id: string) {
  const attraction = await db.attraction.delete({ where: { id } });

  if (attraction == null) return notFound();

  await fs.unlink(`public${attraction.imagePath}`);

  revalidatePath("/");
  revalidatePath("/attractions");
}