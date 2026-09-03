import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    // 1. Initialiseer Resend PAS binnen de functie zelf
    const resend = new Resend(process.env.RESEND_API_KEY)

    const body = await request.json()
    const { name, email, message } = body

    // 2. Verstuur de e-mail
    const data = await resend.emails.send({
      from: 'Doodle <onboarding@resend.dev>', // Of je eigen domein
      to: ['arne@doodle.nl'],
      subject: `Nieuw bericht van ${name}`,
      replyTo: email,
      text: message,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Fout bij het versturen van e-mail' }, { status: 500 })
  }
}
