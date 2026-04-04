// Vercel serverless function for the contact form.
// Set RESEND_API_KEY as an environment variable in your Vercel project settings.
// Once you verify samavik.com in Resend, change the "from" address to noreply@samavik.com

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

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Samavik Website <onboarding@resend.dev>',
        to: 'edward@samavik.com',
        reply_to: email,
        subject: `New enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!response.ok) throw new Error('Resend API error');
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
