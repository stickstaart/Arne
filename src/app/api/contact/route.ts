import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Valideer verplichte velden
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Naam, e-mailadres en bericht zijn verplicht.' },
        { status: 400 }
      )
    }

    // Verstuur de mail via Resend
    // TESTFASE: Versturen naar stickstaart@gmail.com
    const data = await resend.emails.send({
      from: 'Doodle Contactformulier <onboarding@resend.dev>', // Standaard testafzender van Resend
      to: ['stickstaart@gmail.com'], // Zodra alles werkt veranderen naar arne@doodle.nl
      replyTo: email, // Zodat je direct op de afzender kunt reageren
      subject: `Nieuw bericht via Doodle.nl van ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="border-b: 1px solid #ccc; padding-bottom: 10px;">Nieuw bericht via het contactformulier</h2>
          <p><strong>Naam:</strong> ${name}</p>
          <p><strong>E-mailadres:</strong> ${email}</p>
          <p><strong>Telefoonnummer:</strong> ${phone || 'Niet opgegeven'}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Bericht:</strong></p>
          <p style="white-space: pre-line; background-color: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Fout bij versturen e-mail:', error)
    return NextResponse.json(
      { error: 'Er is iets fout gegaan bij het versturen van de e-mail.' },
      { status: 500 }
    )
  }
}
