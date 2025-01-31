import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const attractions = await db.attraction.findMany();
    res.status(200).json(attractions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attractions" });
  }
}