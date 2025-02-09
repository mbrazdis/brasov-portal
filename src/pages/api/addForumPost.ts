import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import db from '@/db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = await db.forumPost.create({
      data: {
        title,
        content,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Failed to create post' });
  }
}