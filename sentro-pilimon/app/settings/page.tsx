'use client'

import { Settings, Type, Eye, Zap, Globe, Clock } from 'lucide-react'

const commonTimezones = [
  'Asia/Manila',
  'Asia/Tokyo',
  'Asia/Singapore',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Australia/Sydney',
]

export default function SettingsPage() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-2xl font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1A1A18' }}
        >
          Settings
        </h1>

        {/* Regional Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5" style={{ color: '#6B0000' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1A1A18' }}>Regional</h2>
          </div>
          <div
            className="bg-white rounded-xl divide-y"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5F5F3' }}>
                  <Clock className="h-5 w-5" style={{ color: '#5A5A56' }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#1A1A18' }}>Timezone</p>
                  <p className="text-sm" style={{ color: '#9A9A95' }}>Set your local timezone for event times</p>
                </div>
              </div>
              <select
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#D4D4CF', backgroundColor: 'white', color: '#1A1A18' }}
                defaultValue="Asia/Manila"
                onChange={(e) => { localStorage.setItem('plmun-timezone', e.target.value) }}
              >
                {commonTimezones.map(tz => (
                  <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Accessibility Info */}
        <section className="mb-8">
          <div className="rounded-xl p-6" style={{ backgroundColor: '#FDF6E3', border: '1px solid #C9972C' }}>
            <h3 className="font-semibold mb-2" style={{ color: '#1A1A18' }}>Accessibility</h3>
            <p className="text-sm mb-3" style={{ color: '#5A5A56' }}>
              This app supports keyboard navigation. Press <kbd className="px-2 py-1 rounded" style={{ backgroundColor: '#EBEBEA', fontFamily: 'monospace' }}>Tab</kbd> to navigate and <kbd className="px-2 py-1 rounded" style={{ backgroundColor: '#EBEBEA', fontFamily: 'monospace' }}>Enter</kbd> to select.
            </p>
            <p className="text-xs" style={{ color: '#9A9A95' }}>
              For screen reader users, the app uses proper ARIA labels and semantic HTML throughout.
            </p>
          </div>
        </section>

        {/* App Info */}
        <section className="text-center pt-4" style={{ borderTop: '1px solid #EBEBEA' }}>
          <p className="text-sm" style={{ color: '#9A9A95' }}>Sentro Pilimon v1.0</p>
          <p className="text-xs mt-1" style={{ color: '#D4D4CF' }}>Pamantasan ng Lungsod ng Muntinlupa</p>
        </section>
      </div>
    </main>
  )
}
