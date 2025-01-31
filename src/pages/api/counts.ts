import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const eventCount = await db.event.count();
    const attractionCount = await db.attraction.count();
    const forumPostCount = await db.forumPost.count();
    const reviewCount = await db.review.count();

    res.status(200).json({
      eventCount,
      attractionCount,
      forumPostCount,
      reviewCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
}