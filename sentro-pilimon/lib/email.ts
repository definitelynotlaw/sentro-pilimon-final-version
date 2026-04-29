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

// Create Resend client only if key is valid
const resend = resendApiKey && resendApiKey !== 'placeholder_resend_key'
  ? new Resend(resendApiKey)
  : null

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!resend) {
    console.warn('Resend not configured. Email not sent.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const recipients = Array.isArray(to) ? to : [to]

    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: recipients,
      subject,
      html,
    })

    if (error) {
      console.error('Resend email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Email send exception:', err)
    return { success: false, error: err }
  }
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset for your Sentro Pilimon account.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6B0000; color: white; text-decoration: none; border-radius: 8px;">
      Reset Password
    </a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `

  return sendEmail({
    to,
    subject: 'Sentro Pilimon - Password Reset',
    html,
  })
}

export async function sendEmailVerification(to: string, verifyToken: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verifyToken}`

  const html = `
    <h1>Verify Your Email</h1>
    <p>Thank you for registering with Sentro Pilimon!</p>
    <p>Click the link below to verify your email address:</p>
    <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6B0000; color: white; text-decoration: none; border-radius: 8px;">
      Verify Email
    </a>
    <p>This link will expire in 24 hours.</p>
  `

  return sendEmail({
    to,
    subject: 'Sentro Pilimon - Verify Your Email',
    html,
  })
}

export async function sendRSVPConfirmation(to: string, eventTitle: string, status: 'going' | 'interested') {
  const statusText = status === 'going' ? 'attending' : 'interested in'

  const html = `
    <h1>RSVP Confirmed</h1>
    <p>You've marked yourself as ${statusText}: <strong>${eventTitle}</strong></p>
    <p>We'll send you updates as the event date approaches.</p>
    <p>See you there!</p>
    <hr style="border: none; border-top: 1px solid #EBEBEA; margin: 24px 0;" />
    <p style="color: #9A9A95; font-size: 12px;">
      Sentro Pilimon - Pamantasan ng Lungsod ng Muntinlupa
    </p>
  `

  return sendEmail({
    to,
    subject: `Sentro Pilimon - RSVP for ${eventTitle}`,
    html,
  })
}

export async function sendAnnouncementApprovalEmail(to: string, announcementTitle: string) {
  const html = `
    <h1>Announcement Approved!</h1>
    <p>Your announcement <strong>"${announcementTitle}"</strong> has been approved and is now published.</p>
    <p>Students can now view and RSVP to your event.</p>
    <hr style="border: none; border-top: 1px solid #EBEBEA; margin: 24px 0;" />
    <p style="color: #9A9A95; font-size: 12px;">
      Sentro Pilimon - Pamantasan ng Lungsod ng Muntinlupa
    </p>
  `

  return sendEmail({
    to,
    subject: `Sentro Pilimon - Announcement Published: ${announcementTitle}`,
    html,
  })
}

export async function sendAnnouncementRejectionEmail(to: string, announcementTitle: string, reason?: string) {
  const html = `
    <h1>Announcement Returned</h1>
    <p>Your announcement <strong>"${announcementTitle}"</strong> requires revisions.</p>
    ${reason ? `<p><strong>Feedback:</strong> ${reason}</p>` : ''}
    <p>Please review the feedback and resubmit your announcement.</p>
    <hr style="border: none; border-top: 1px solid #EBEBEA; margin: 24px 0;" />
    <p style="color: #9A9A95; font-size: 12px;">
      Sentro Pilimon - Pamantasan ng Lungsod ng Muntinlupa
    </p>
  `

  return sendEmail({
    to,
    subject: `Sentro Pilimon - Announcement Needs Revision: ${announcementTitle}`,
    html,
  })
}