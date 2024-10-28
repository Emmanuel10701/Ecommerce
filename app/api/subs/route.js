// pages/api/subscription.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '../../../libs/prismadb'; // Adjust the import according to your project structure

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can change this to your SMTP service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

export async function POST(request) {
  const { email } = await request.json();

  // Validate email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  try {
    // Check if the email already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return NextResponse.json({ error: 'Email already exists.' }, { status: 409 }); // Conflict status
    }

    // Create a new subscription
    const subscription = await prisma.subscription.create({
      data: {
        email,
      },
    });

    // Send "Thank You" email after subscription creation
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use environment variable for the email address
      to: email, // The email of the new subscriber
      subject: 'Thank you for subscribing!',
      html: `
        <div style="background-color: #f0f8ff; padding: 20px; color: #333;">
          <h2 style="color: #4CAF50;">Thank you for subscribing to our newsletter!</h2>
          <p>We are excited to have you with us. Explore our latest products and offers by clicking the link below.</p>
          <a href="http://localhost:3000/Productslistpage" style="background-color: #4CAF50; padding: 10px 20px; color: #fff; text-decoration: none; border-radius: 5px;">Explore Products</a>
          <p>Feel free to reach out to us for any questions or feedback.</p>
          <p>Best regards,</p>
          <p>The Team at Your Website</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Subscription successful!', subscription }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Subscription failed. Please try again later.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all subscriptions ordered from the latest to the oldest
    const subscriptions = await prisma.subscription.findMany({
      orderBy: {
        createdAt: 'desc', // Assuming you have a `createdAt` field for timestamps
      },
    });

    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions.' }, { status: 500 });
  }
}
