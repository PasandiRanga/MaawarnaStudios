import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// nodemailer opens raw TCP sockets, so this handler must not run on the edge runtime.
export const runtime = 'nodejs';

// A real send measures ~4s, and the platform default is 10s. That leaves too little
// room for a slow SMTP handshake: the function would be killed mid-send and the
// visitor would get a platform 504 instead of the error message we return below.
// 30s comfortably clears the transporter's own 15s socket timeout, so nodemailer
// always loses the race and we stay in control of the response.
export const maxDuration = 30;

const NOTIFY_TO = 'manuchandrasekare@gmail.com';

// Built per-request rather than at module scope: on a cold serverless instance an
// unreachable SMTP host would otherwise poison the cached transporter for every
// later invocation on that instance. The timeouts keep a hung Gmail handshake from
// eating the whole function budget — we would rather fail fast and report it.
function createTransporter() {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        throw new Error(
            'Missing GMAIL_USER and/or GMAIL_APP_PASSWORD in the environment. ' +
            'Set both in the Vercel project settings for this environment.'
        );
    }

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
    });
}

// The visitor's name goes into the From display name, so strip anything that could
// break out of the header. Nodemailer encodes the display name for us when it is
// passed as an object, but CR/LF has to go before it ever reaches that point.
function sanitizeHeaderText(value) {
    return String(value).replace(/[\r\n]+/g, ' ').trim().slice(0, 78);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Sent alongside the HTML as a multipart/alternative. An HTML-only message is a
// spam signal in its own right — genuine mail clients send both parts — and a new
// Gmail sender has no reputation to spare. No escaping here: it is not markup.
function buildText({ name, email, phone, company, service, message }) {
    return [
        `New Message from ${name} via Maawarna Studios`,
        '',
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Phone:   ${phone || 'N/A'}`,
        `Company: ${company || 'N/A'}`,
        `Service: ${service || 'N/A'}`,
        '',
        'Message:',
        message,
        '',
        '---',
        'Reply to this email to respond directly to the customer.',
    ].join('\n');
}

function buildHtml({ name, email, phone, company, service, message }) {
    const e = escapeHtml;
    return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #000; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Message from ${e(name)} via Maawarna Studios</h2>
      <p><strong>Name:</strong> ${e(name)}</p>
      <p><strong>Email:</strong> ${e(email)}</p>
      <p><strong>Phone:</strong> ${e(phone || 'N/A')}</p>
      <p><strong>Company:</strong> ${e(company || 'N/A')}</p>
      <p><strong>Service:</strong> ${e(service || 'N/A')}</p>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${e(message)}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #999;">
        Tip: Click "Reply" to respond directly to the customer.
      </p>
    </div>
  `;
}

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

        // The email is the only delivery path for an enquiry, so a send failure has to
        // surface to the visitor — otherwise the form claims success and the message
        // is simply gone.
        console.log(`Forwarding message from ${name} to ${NOTIFY_TO}...`);

        // Shared by both bodies so the text and HTML parts can never drift apart.
        const fields = {
            name,
            email,
            phone: data.phone,
            company: data.company,
            service,
            message,
        };

        const info = await createTransporter().sendMail({
            // Gmail only lets us send as the authenticated account, so the address stays
            // ours and the visitor's name rides along in the display name — the inbox list
            // then reads "Jane Doe via Maawarna Studios" instead of a wall of identical rows.
            from: {
                name: `${sanitizeHeaderText(name)} via Maawarna Studios`,
                address: process.env.GMAIL_USER,
            },
            to: NOTIFY_TO,
            replyTo: email,
            subject: `${name} - New Inquiry: ${service || 'General'}`,
            text: buildText(fields),
            html: buildHtml(fields),
        });

        // info.response carries Gmail's queue id, which is what makes a message
        // traceable if one goes missing. messageId is generated locally and cannot.
        console.log('Email sent successfully:', info.response);
        console.log('--- Submission Processed ---');

        return NextResponse.json(
            { message: 'Message received successfully!' },
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
