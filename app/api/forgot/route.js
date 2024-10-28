import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '../../../libs/prismadb'; // Adjust the path as needed
import { v4 as uuidv4 } from 'uuid';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    const token = uuidv4(); // Generate a unique token
    const resetLink = `${process.env.NEXTAUTH_URL}/reset?token=${token}`;

    // Set expiration to 1 hour from now
    const expires = new Date(Date.now() + 3600000); // 1 hour in milliseconds

    // Store the token and associate it with the user in the database
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333333;">Password Reset Request</h2>
            <p style="color: #555555;">Hello,</p>
            <p style="color: #555555;">You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
            <p style="color: #555555;">If you didn't request this, please ignore this email.</p>
            <p style="color: #777777; font-size: 12px;">This link will expire in 1 hour.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
