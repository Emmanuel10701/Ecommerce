// pages/api/mail.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email sending function
export async function POST(request) {
  try {
    // Parse the request body
    const { subject, message, emails } = await request.json();

    // Validate input
    if (!subject || !message || !emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'Invalid input. Subject, message, and emails are required.' }, { status: 400 });
    }

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: 'Email credentials are missing.' }, { status: 500 });
    }

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail', // Default to Gmail but allows customization
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Helper function to send emails
    const sendEmail = async (recipientEmail) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <div style="background-color: #4caf50; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">${subject}</h1>
              </div>
              <div style="padding: 20px; line-height: 1.6;">
                <p style="font-size: 16px; color: #333;">${message}</p>
                <p style="margin-top: 20px; font-size: 14px; color: #555;">Thank you for being part of our community!</p>
              </div>
              <div style="background-color: #f1f1f1; padding: 15px; text-align: center;">
                <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                <a href="#" style="color: #4caf50; text-decoration: none; font-weight: bold;">Unsubscribe</a>
              </div>
            </div>
          </div>
        `,
      };

      return transporter.sendMail(mailOptions);
    };

    // Send emails concurrently using Promise.all
    await Promise.all(emails.map(recipient => sendEmail(recipient.email)));

    return NextResponse.json({ message: 'Emails sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error sending emails:', error.message || error);
    return NextResponse.json({ error: 'Failed to send emails.' }, { status: 500 });
  }
}
