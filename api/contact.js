// Vercel serverless function for the contact form.
// Needs RESEND_API_KEY in the Vercel project's environment variables (Production). Without it every message fails.
// CONTACT_FROM is the sender. Until samavik.com is verified in Resend it must stay Resend's test sender, which only
// delivers to the address the Resend account was opened with; after that set it to an address at samavik.com.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return res.status(400).json({ error: 'Input too long' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY is not set, so no message can be sent');
    return res.status(500).json({ error: 'Failed to send message' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Samavik Website <onboarding@resend.dev>',
        to: 'edward@samavik.com',
        reply_to: email,
        subject: `New enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!response.ok) {
      // The provider's own reason (never the sender's words), so a failure can be read in the function's log.
      const reason = await response.text().catch(() => '');
      console.error(`contact: the email provider refused the message (${response.status}) ${reason.slice(0, 300)}`);
      throw new Error('Resend API error');
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error?.message !== 'Resend API error') console.error(`contact: could not reach the email provider: ${error?.message}`);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
