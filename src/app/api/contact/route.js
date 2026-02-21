import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(request) {
    try {
        const data = await request.json();
        console.log('--- Contact API Submission (Gmail/Nodemailer) ---');

        // Basic validation
        const { name, email, message, service } = data;
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required fields.' },
                { status: 400 }
            );
        }

        // 1. Save to database
        let contactMessage;
        try {
            contactMessage = await prisma.contactMessage.create({
                data: {
                    name,
                    email,
                    message,
                    service: service || 'not specified',
                    company: data.company || null,
                    phone: data.phone || null,
                },
            });
            console.log('Database persistence successful. ID:', contactMessage.id);
        } catch (dbError) {
            console.error('CRITICAL: Database error during contact submission:', dbError);
            throw dbError; // Rethrow to be caught by the outer catch block
        }

        // 2. Send email notification via Nodemailer (Gmail)
        try {
            console.log(`Forwarding message from ${name} to manuchandrasekare@gmail.com...`);

            const mailOptions = {
                from: `Maawarna Studios <${process.env.GMAIL_USER}>`,
                to: 'manuchandrasekare@gmail.com',
                replyTo: email,
                subject: `${name} - New Inquiry: ${service || 'General'}`,
                html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #000; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Message from Maawarna Studios</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
            <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
            <p><strong>Service:</strong> ${service || 'N/A'}</p>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #999;">
              Database Reference ID: ${contactMessage.id}<br />
              Tip: Click "Reply" to respond directly to the customer.
            </p>
          </div>
        `,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
        } catch (emailError) {
            console.error('ERROR: Failed to send email via Nodemailer:', emailError);
            // We don't fail the whole request because the data is already saved in the DB
        }

        console.log('--- Submission Processed ---');
        return NextResponse.json(
            { message: 'Message received successfully!', id: contactMessage?.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('FINAL ERROR in /api/contact:', error);
        return NextResponse.json(
            { error: 'There was an error processing your message. Please try again later.' },
            { status: 500 }
        );
    }
}
