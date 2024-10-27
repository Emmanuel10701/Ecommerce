import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  name: string;  // Added name to the interface
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const { name, email, message }: EmailRequest = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Email options for the admin
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Message from ' + name,
      text: `Message from: ${name}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333;">New Message from ${name}</h2>
          <p style="color: #555;">You have received a new message:</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 20px;">This email was sent from your contact form.</p>
        </div>
      `,
    };

    // Email options for the user notification
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We Received Your Message!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e9f5ff; padding: 20px; border-radius: 5px;">
          <h2 style="color: #007BFF; font-size: 24px;">Hello ${name},</h2>
          <p style="color: #333; font-size: 16px;">Thank you for reaching out to us! We have received your message and our team is currently reviewing it. We will get back to you as soon as possible.</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-top: 20px;">
            <p><strong>Your Message:</strong></p>
            <p style="color: #555;">${message}</p>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 20px;">Best regards,<br>Your Company Name</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptionsToAdmin); // Send email to admin
    await transporter.sendMail(mailOptionsToUser); // Send confirmation to user

    return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
