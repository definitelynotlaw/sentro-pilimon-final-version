import Link from 'next/link'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { COPY } from '@/constants/copy'

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div
        className="py-8 px-4"
        style={{ backgroundColor: '#6B0000' }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <Link href="/" className="inline-block mb-4">
            <PLMunLogo size="xl" />
          </Link>
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {COPY.appName}
          </h1>
          <p className="text-sm opacity-80">{COPY.appTagline}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* About Section */}
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1A1A18' }}
          >
            About
          </h2>
          <div
            className="bg-white rounded-xl p-6"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <p className="mb-4" style={{ color: '#5A5A56', lineHeight: 1.6 }}>
              {COPY.appName} is the official campus bulletin system of Pamantasan ng Lungsod ng Muntinlupa (PLMun).
              It serves as the central hub for campus-wide announcements, events, and information from various
              departments and student organizations.
            </p>
            <p style={{ color: '#5A5A56', lineHeight: 1.6 }}>
              Whether you&apos;re looking for academic events, extracurricular activities, or administrative
              announcements, Sentro Pilimon keeps you informed about everything happening across campus.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1A1A18' }}
          >
            Features
          </h2>
          <div className="grid gap-4">
            {[
              { title: 'Browse by Channel', desc: 'Explore announcements from specific departments or organizations' },
              { title: 'Event Details', desc: 'View comprehensive event information including date, time, and venue' },
              { title: 'RSVP Tracking', desc: 'Keep track of events you are interested in or attending' },
              { title: 'QR Codes', desc: 'Scan QR codes on event posters to quickly access details' },
              { title: 'Categories', desc: 'Filter announcements by type: Academic, Sports, Cultural, and more' },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4"
                style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                <h3 className="font-semibold mb-1" style={{ color: '#1A1A18' }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: '#5A5A56' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* University Info */}
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1A1A18' }}
          >
            University
          </h2>
          <div
            className="bg-white rounded-xl p-6"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <h3 className="font-semibold mb-2" style={{ color: '#1A1A18' }}>
              Pamantasan ng Lungsod ng Muntinlupa
            </h3>
            <p className="text-sm mb-4" style={{ color: '#5A5A56' }}>
              NBP Reservation, Brgy. Tunasan, Muntinlupa City, Metro Manila, Philippines 1773
            </p>
            <div className="grid gap-2 text-sm" style={{ color: '#5A5A56' }}>
              <p>Email: info@plmun.edu.ph</p>
              <p>Phone: (02) 8771-0600</p>
              <p>Website: www.plmun.edu.ph</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8" style={{ borderTop: '1px solid #EBEBEA' }}>
          <p className="text-sm" style={{ color: '#9A9A95' }}>
            {COPY.footer.copyright}
          </p>
          <p className="text-xs mt-1" style={{ color: '#9A9A95' }}>
            {COPY.footer.rightsReserved}
          </p>
        </footer>
      </div>
    </main>
  )
}