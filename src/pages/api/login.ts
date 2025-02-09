import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for email:', email); 
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await db.user.findUnique({ where: { email } });
      console.log('User found:', !!user); 
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Detailed login error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}