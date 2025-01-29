import db from "@/db/db";

export async function getAttractionData() {
  const attractions = await db.attraction.findMany();
  return attractions;
}