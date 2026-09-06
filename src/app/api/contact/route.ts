import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const body = await request.json()
    const { name, email, phone, message, honeypot } = body

    // 1. Spam-beveiliging: als de verborgen honeypot is ingevuld, is het een bot
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Bot detected' })
    }

    // 2. E-mail versturen
    const data = await resend.emails.send({
      // LET OP: Pas 'contact@doodle.nl' aan naar je geverifieerde domein zodra het domein gekoppeld is in Resend.
      // Zolang je onboarding gebruikt, werkt 'to' ALLEEN naar het e-mailadres van de Resend-accounthouder!
      from: 'Doodle Contact <onboarding@resend.dev>',
      // to: ['arne@doodle.nl'],
      to: ['stickstaart@gmail.com'],
      subject: `Nieuw bericht via website van ${name}`,
      replyTo: email,
      text: `
Naam: ${name}
E-mailadres: ${email}
Telefoonnummer: ${phone || 'Niet opgegeven'}

Bericht:
${message}
      `,
    })

    if (data.error) {
      console.error('Resend API Error:', data.error)
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Server Catch Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Fout bij het versturen van e-mail' },
      { status: 500 }
    )
  }
}
