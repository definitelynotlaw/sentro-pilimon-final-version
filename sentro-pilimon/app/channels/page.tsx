import Link from 'next/link'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { Organization, departments, studentCouncils, departmentOrganizations, universityOrganizations, serviceOffices } from '@/data/organizations'

function HorizontalCard({ href, accent, initials, name, sub }: {
  href: string
  accent: string
  initials: string
  name: string
  sub?: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white transition-shadow hover:shadow-md"
      style={{ border: '1px solid #EBEBEA' }}
    >
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: accent }}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm leading-tight truncate" style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}>
          {name}
        </p>
        {sub && (
          <p className="text-xs mt-0.5 truncate" style={{ color: '#9A9A95' }}>{sub}</p>
        )}
      </div>
    </Link>
  )
}

function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold" style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}>
        {title}
      </h2>
      {badge && (
        <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}>
          {badge}
        </span>
      )}
    </div>
  )
}

export default function ChannelsPage() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}>
          Channels
        </h1>

        {/* Pilimon Bulletin */}
        <Link
          href="/"
          className="block mb-8 p-6 rounded-xl text-white transition-transform hover:scale-[1.01]"
          style={{ backgroundColor: '#6B0000' }}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <PLMunLogo size="lg" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Pilimon Bulletin</h2>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  Official
                </span>
              </div>
              <p className="text-sm opacity-80">Campus-wide announcements and official updates</p>
            </div>
          </div>
        </Link>

        {/* Departments */}
        <section className="mb-8">
          <SectionHeader title="Departments" badge={`${departments.length} colleges`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {departments.map((dept) => (
              <HorizontalCard
                key={dept.id}
                href={`/channels/dept/${dept.slug}`}
                accent={dept.accent_color || '#6B0000'}
                initials={dept.name.slice(0, 2)}
                name={dept.name}
                sub={dept.college}
              />
            ))}
          </div>
        </section>

        {/* Student Councils */}
        <section className="mb-8">
          <SectionHeader title="Student Councils" badge={`${studentCouncils.length} councils`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {studentCouncils.map((council) => (
              <HorizontalCard
                key={council.id}
                href={`/channels/org/${council.slug}`}
                accent={council.accent_color}
                initials={council.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                name={council.name}
                sub={council.short_description}
              />
            ))}
          </div>
        </section>

        {/* Department Organizations */}
        <section className="mb-8">
          <SectionHeader title="Department Organizations" />
          {Object.entries(departmentOrganizations).map(([college, orgs]) => (
            <div key={college} className="mb-6">
              <h3 className="text-sm font-medium mb-3 px-1" style={{ color: '#5A5A56' }}>{college}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {orgs.map((org) => (
                  <HorizontalCard
                    key={org.id}
                    href={`/channels/org/${org.slug}`}
                    accent={org.accent_color}
                    initials={org.name.slice(0, 2)}
                    name={org.name}
                    sub={org.short_description}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* University Organizations */}
        <section className="mb-8">
          <SectionHeader title="University Organizations" badge={`${universityOrganizations.length} orgs`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {universityOrganizations.map((org) => (
              <HorizontalCard
                key={org.id}
                href={`/channels/org/${org.slug}`}
                accent={org.accent_color}
                initials={org.name.slice(0, 2)}
                name={org.name}
                sub={org.short_description}
              />
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-8">
          <SectionHeader title="Services" badge={`${serviceOffices.length} offices`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {serviceOffices.map((service) => (
              <HorizontalCard
                key={service.id}
                href={`/channels/org/${service.slug}`}
                accent={service.accent_color}
                initials={service.name.slice(0, 2)}
                name={service.name}
                sub={service.short_description}
              />
            ))}
          </div>
        </section>
      </div>

      <BottomTabBar />
    </main>
  )
}
