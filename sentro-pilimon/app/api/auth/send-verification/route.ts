import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@sentropilimon.com'

// For testing when domain is not verified, use Resend's test sender
const getFromEmail = () => {
  if (fromEmail.includes('@sentropilimon.com')) {
    return 'resend@resend.dev'
  }
  return fromEmail
}

export async function POST(request: Request) {
  try {
    const { email, fullName } = await request.json()

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    if (!resendApiKey || resendApiKey === 'placeholder_resend_key') {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const resend = new Resend(resendApiKey)

    // Generate a simple verification token
    const verifyToken = Buffer.from(`${email}:${Date.now()}`).toString('base64url')
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirmed?token=${verifyToken}&email=${encodeURIComponent(email)}`

    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: email,
      subject: 'Sentro Pilimon - Confirm Your Email Registration',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #FAFAF7; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
            <div style="max-width: 480px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #6B0000; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; margin: 0 0 8px 0;">
                  Sentro Pilimon
                </h1>
                <p style="color: #5A5A56; font-size: 14px; margin: 0;">Pamantasan ng Lungsod ng Muntinlupa</p>
              </div>

              <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 24px;">
                  <div style="width: 64px; height: 64px; background-color: #EDF7F0; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                    <svg style="width: 32px; height: 32px; color: #1A6B3C;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h2 style="color: #1A1A18; font-size: 24px; text-align: center; margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, serif;">
                  Welcome to Sentro Pilimon, ${fullName}!
                </h2>

                <p style="color: #5A5A56; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                  Thank you for registering. Please click the button below to confirm your email address and activate your account.
                </p>

                <div style="text-align: center; margin-bottom: 24px;">
                  <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background-color: #6B0000; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Confirm Email Address
                  </a>
                </div>

                <p style="color: #9A9A95; font-size: 12px; text-align: center; margin: 0;">
                  This confirmation link will expire in 24 hours.<br/>
                  If you didn't create an account, please ignore this email.
                </p>
              </div>

              <div style="text-align: center; margin-top: 32px;">
                <p style="color: #9A9A95; font-size: 12px; margin: 0;">
                  © 2024 Sentro Pilimon. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send verification email:', error)
      return NextResponse.json(
        { success: false, error: JSON.stringify(error) },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Send verification email error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}