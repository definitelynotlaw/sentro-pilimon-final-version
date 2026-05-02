import { NextRequest, NextResponse } from 'next/server'
import { generateQRBuffer } from '@/lib/qr'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const announcementId = searchParams.get('announcementId')

  if (!announcementId) {
    return NextResponse.json({ error: 'Announcement ID required' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const pngBuffer = await generateQRBuffer(announcementId, baseUrl)

    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 })
  }
}
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 })
    }
    const { generateChannelQR } = await import('@/lib/qr')
    const { qrDataUrl } = await generateChannelQR(url)
    return NextResponse.json({ qrDataUrl })
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 })
  }
}
