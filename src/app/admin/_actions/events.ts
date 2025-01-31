"use server";

import db from "@/db/db";
import { z } from "zod";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const addSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().transform((str) => new Date(str)),
  location: z.string().min(1),
});

export async function addEvent(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await db.event.create({
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      location: data.location,
      isActive: true, // Set default value for isActive
    },
  });

  revalidatePath("/");
  revalidatePath("/events");

  redirect("/admin/events");
}

const editSchema = addSchema;

export async function updateEvent(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const event = await db.event.findUnique({ where: { id } });

  if (event == null) return notFound();

  await db.event.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      location: data.location,
    },
  });

  revalidatePath("/");
  revalidatePath("/events");

  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  const event = await db.event.delete({ where: { id } });

  if (event == null) return notFound();

  revalidatePath("/");
  revalidatePath("/events");
}