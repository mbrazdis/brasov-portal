import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const posts = await db.forumPost.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
}