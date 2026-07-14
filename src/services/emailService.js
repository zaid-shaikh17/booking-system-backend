import 'dotenv/config';

export async function sendWaitlistPromotionEmail({ to, name, resourceName, startTime }) {
  const transporter = {
    url: 'https://api.brevo.com/v3/smtp/email',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const body = {
    sender: { name: 'Coworking Booking', email: process.env.SENDER_EMAIL },
    to: [{ email: to, name }],
    subject: 'A slot opened up — you\'re booked!',
    htmlContent: `<p>Hi ${name},</p>
      <p>A slot for <b>${resourceName}</b> on ${new Date(startTime).toLocaleString()} just opened up, and you've been automatically booked from the waitlist.</p>`,
  };

  const res = await fetch(transporter.url, {
    method: 'POST',
    headers: transporter.headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo send failed: ${err}`);
  }

  return res.json();
}