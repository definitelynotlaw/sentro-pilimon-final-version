import Link from 'next/link'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { Organization, departments, studentCouncils, departmentOrganizations, universityOrganizations, serviceOffices } from '@/data/organizations'
import { ChevronRight } from 'lucide-react'

interface OrganizationCardProps {
  org: Organization
  size?: 'sm' | 'md'
}

function OrganizationCard({ org, size = 'sm' }: OrganizationCardProps) {
  return (
    <Link
      href={`/channels/org/${org.slug}`}
      className="rounded-xl bg-white text-center transition-shadow hover:shadow-md flex flex-col items-center p-3"
      style={{ border: '1px solid #EBEBEA' }}
    >
      <div
        className={`rounded-full flex items-center justify-center text-white font-bold overflow-hidden mb-2 ${size === 'sm' ? 'w-12 h-12' : 'w-16 h-16'}`}
        style={{ backgroundColor: org.accent_color || '#6B0000' }}
      >
        {org.logo_url ? (
          <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
        ) : (
          <span className={`font-bold ${size === 'sm' ? 'text-sm' : 'text-lg'}`}>{org.name.slice(0, 2)}</span>
        )}
      </div>
      <p className={`font-medium truncate w-full ${size === 'sm' ? 'text-xs' : 'text-sm'}`} style={{ color: '#1A1A18' }}>
        {org.name}
      </p>
    </Link>
  )
}

interface DepartmentCardProps {
  dept: typeof departments[0]
}

function DepartmentCard({ dept }: DepartmentCardProps) {
  return (
    <Link
      href={`/channels/dept/${dept.slug}`}
      className="p-4 rounded-xl bg-white text-center transition-shadow hover:shadow-md"
      style={{ border: '1px solid #EBEBEA' }}
    >
      <div
        className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: dept.accent_color || '#6B0000' }}
      >
        {dept.name.slice(0, 2)}
      </div>
      <p className="font-medium text-sm" style={{ color: '#1A1A18' }}>{dept.name}</p>
      <p className="text-xs mt-1 truncate" style={{ color: '#9A9A95' }}>{dept.college}</p>
    </Link>
  )
}

interface SectionHeaderProps {
  title: string
  badge?: string
}

function SectionHeader({ title, badge }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold" style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}>
        {title}
      </h2>
      {badge && (
        <span
          className="px-2 py-1 text-xs font-medium rounded-full"
          style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}
        >
          {badge}
        </span>
      )}
    </div>
  )
}

interface ChannelSubsectionProps {
  title: string
  orgs: Organization[]
}

function ChannelSubsection({ title, orgs }: ChannelSubsectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3 px-1" style={{ color: '#5A5A56' }}>{title}</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {orgs.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>
    </div>
  )
}

export default function ChannelsPage() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
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
                <span
                  className="px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  Official
                </span>
              </div>
              <p className="text-sm opacity-80">Campus-wide announcements and official updates</p>
            </div>
            <ChevronRight className="h-5 w-5 opacity-60" />
          </div>
        </Link>

        {/* Departments */}
        <section className="mb-8">
          <SectionHeader title="Departments" badge={`${departments.length} colleges`} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} dept={dept} />
            ))}
          </div>
        </section>

        {/* Student Councils */}
        <section className="mb-8">
          <SectionHeader title="Student Councils" badge={`${studentCouncils.length} councils`} />
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EBEBEA' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#EBEBEA]">
              {studentCouncils.map((council) => (
                <Link
                  key={council.id}
                  href={`/channels/org/${council.slug}`}
                  className="bg-white p-4 text-center transition-shadow hover:shadow-md"
                >
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: council.accent_color }}
                  >
                    {council.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <p className="text-xs font-medium" style={{ color: '#1A1A18' }}>{council.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Department Organizations */}
        <section className="mb-8">
          <SectionHeader title="Department Organizations" />
          <div
            className="rounded-xl p-4 bg-white"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            {Object.entries(departmentOrganizations).map(([college, orgs]) => (
              <ChannelSubsection key={college} title={college} orgs={orgs} />
            ))}
          </div>
        </section>

        {/* University Organizations */}
        <section className="mb-8">
          <SectionHeader title="University Organizations" badge={`${universityOrganizations.length} orgs`} />
          <div
            className="rounded-xl p-4 bg-white"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {universityOrganizations.map((org) => (
                <OrganizationCard key={org.id} org={org} size="md" />
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mb-8">
          <SectionHeader title="Services" badge={`${serviceOffices.length} offices`} />
          <div className="grid grid-cols-3 gap-4">
            {serviceOffices.map((service) => (
              <Link
                key={service.id}
                href={`/channels/org/${service.slug}`}
                className="p-4 rounded-xl bg-white text-center transition-shadow hover:shadow-md"
                style={{ border: '1px solid #EBEBEA' }}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: service.accent_color }}
                >
                  {service.name.slice(0, 2)}
                </div>
                <p className="font-medium text-sm" style={{ color: '#1A1A18' }}>{service.name}</p>
                <p className="text-xs mt-1 truncate" style={{ color: '#9A9A95' }}>{service.short_description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <BottomTabBar />
    </main>
  )
}