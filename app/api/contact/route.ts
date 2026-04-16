import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { name, email, message } = await request.json()

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    // TODO: Replace with Kris's actual email address
    to: 'krisprofessionalcuts@gmail.com',
    subject: `New Appointment Request from ${name}`,
    html: `
      <h2>New Appointment Request — Kris Professional Cuts</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  })

  return NextResponse.json({ success: true })
}
