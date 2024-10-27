// pages/api/users.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle GET request to retrieve all users
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    // Handle POST request to add a new user
    try {
      const { name, email }: { name: string; email: string } = req.body;
      await prisma.user.create({
        data: { name, email },
      });
      return res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
