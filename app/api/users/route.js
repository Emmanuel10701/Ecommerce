// pages/api/users.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function handler(req) {
  if (req.method === 'GET') {
    // Handle GET request to retrieve all users
    try {
      const users = await prisma.user.findMany();
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  } else if (req.method === 'POST') {
    // Handle POST request to add a new user
    try {
      const { name, email } = await req.json();
      await prisma.user.create({
        data: { name, email },
      });
      return NextResponse.json({ message: 'User added successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error adding user:', error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}
