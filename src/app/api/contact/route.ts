import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, honeypot } = body

    // 1. Spam-beveiliging: als de verborgen honeypot is ingevuld, is het een bot
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Bot detected' })
    }

    // 2. E-mail versturen via Web3forms API
    // 2. E-mail versturen via Web3forms API
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        from_name: 'Doodle Contact',
        subject: `Nieuw bericht via website van ${name}`,
        replyto: email,
        message: `
Naam: ${name}
E-mailadres: ${email}
Telefoonnummer: ${phone || 'Niet opgegeven'}

Bericht:
${message}
    `,
      }),
    })

// Controleer of Web3forms wel JSON teruggeeft
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const rawText = await response.text()
      console.error('Web3forms gaf geen JSON terug:', rawText)
      return NextResponse.json(
        { error: 'Ongeldige respons van mailserver. Controleer de WEB3FORMS_ACCESS_KEY.' },
        { status: 500 }
      )
    }

    const result = await response.json()

    if (!result.success) {
      console.error('Web3forms API Error:', result)
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('Server Catch Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Fout bij het versturen van e-mail' },
      { status: 500 }
    )
  }
}
