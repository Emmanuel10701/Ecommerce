// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

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
      subject: `New Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h2 style="color: #004b87;">New Inquiry from ${name}</h2>
          <p style="color: #555;">You have received a new message regarding healthcare services:</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 20px;">This email was sent from the Prescripto contact form.</p>
        </div>
      `,
    };

    // Email options for the user notification
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We Received Your Message!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e9f5ff; padding: 20px; border-radius: 8px; border: 1px solid #007BFF;">
          <h2 style="color: #007BFF; font-size: 24px;">Hello ${name},</h2>
          <p style="color: #333; font-size: 16px;">Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently.</p>
          <p style="color: #333; font-size: 16px;">Thank you for reaching out to us! Our team is currently reviewing your message, and we will get back to you as soon as possible.</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-top: 20px;">
            <p><strong>Your Message:</strong></p>
            <p style="color: #555;">${message}</p>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 20px;">Best regards,<br>The Prescripto Team</p>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(mailOptionsToAdmin);
    await transporter.sendMail(mailOptionsToUser);

    return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
