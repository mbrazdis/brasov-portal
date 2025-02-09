import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const posts = await db.forumPost.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true, 
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' }, 
      });

      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      res.status(500).json({ error: 'Failed to fetch forum posts' });
    }
  } else {
    res.status(405).end(); 
  }
}