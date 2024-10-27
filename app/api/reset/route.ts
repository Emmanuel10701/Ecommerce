import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../libs/prismadb'; // Adjust the path as needed

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  try {
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRequest) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: resetRequest.userId },
      data: { hashedPassword },
    });

    // Optionally, delete the reset request from the database
    await prisma.passwordReset.delete({
      where: { token },
    });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
