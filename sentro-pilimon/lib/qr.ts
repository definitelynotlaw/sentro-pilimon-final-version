import QRCode from 'qrcode'
import { createHmac, randomBytes } from 'crypto'

const PLMUN_MAROON = '#4A0000'
const PLMUN_CREAM = '#FAFAF7'

export async function generateAnnouncementQR(
  announcementId: string,
  baseUrl: string
): Promise<{ qrDataUrl: string; targetUrl: string }> {
  const targetUrl = `${baseUrl}/announcement/${announcementId}`

  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    width: 400,
    margin: 2,
    color: {
      dark: PLMUN_MAROON,
      light: PLMUN_CREAM,
    },
    errorCorrectionLevel: 'H',
  })

  return { qrDataUrl, targetUrl }
}

export async function generateQRBuffer(
  announcementId: string,
  baseUrl: string
): Promise<Buffer> {
  const targetUrl = `${baseUrl}/announcement/${announcementId}`

  return QRCode.toBuffer(targetUrl, {
    width: 400,
    margin: 2,
    color: {
      dark: PLMUN_MAROON,
      light: PLMUN_CREAM,
    },
    errorCorrectionLevel: 'H',
    type: 'png',
  })
}

export function generateCheckinToken(rsvpId: string): {
  token: string
  expiresAt: Date
} {
  const secret = process.env.CHECKIN_TOKEN_SECRET || 'development-secret-key'
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const payload = `${rsvpId}:${expiresAt.getTime()}`
  const token = createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
    .slice(0, 32)
  return { token, expiresAt }
}

export function validateCheckinToken(
  token: string,
  rsvpId: string,
  expiresAt: Date
): boolean {
  if (new Date() > expiresAt) return false

  const secret = process.env.CHECKIN_TOKEN_SECRET || 'development-secret-key'
  const payload = `${rsvpId}:${expiresAt.getTime()}`
  const expectedToken = createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
    .slice(0, 32)

  return token === expectedToken
}

export function generateSecureToken(): string {
  return randomBytes(32).toString('hex')
}