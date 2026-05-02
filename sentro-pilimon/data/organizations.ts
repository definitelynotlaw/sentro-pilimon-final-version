export interface Organization {
  id: string
  name: string
  slug: string
  accent_color: string
  logo_url: string | null
  short_description: string
  type: 'college_council' | 'dept_org' | 'university_org' | 'service_office'
  college?: string
}

// Departments (from offices table, filtered by college)
export const departments = [
  { id: 'cas', name: 'CAS', slug: 'cas', college: 'College of Arts & Sciences', accent_color: '#1E3A5F' },
  { id: 'cba', name: 'CBA', slug: 'cba', college: 'College of Business Administration', accent_color: '#7B3F00' },
  { id: 'ccj', name: 'CCJ', slug: 'ccj', college: 'College of Criminal Justice', accent_color: '#4A1A7A' },
  { id: 'citcs', name: 'CITCS', slug: 'citcs', college: 'College of ICT', accent_color: '#1A6B3C' },
  { id: 'con', name: 'CON', slug: 'con', college: 'College of Nursing', accent_color: '#6B0000' },
  { id: 'cte', name: 'CTE', slug: 'cte', college: 'College of Teacher Education', accent_color: '#8B1010' },
]

// Student Councils
export const studentCouncils: Organization[] = [
  { id: 'ssc', name: 'Supreme Student Council', slug: 'ssc', accent_color: '#6B0000', logo_url: null, short_description: 'Highest governing student body in PLMun', type: 'college_council' },
  { id: 'casc', name: 'CAS Student Council', slug: 'casc', accent_color: '#1E3A5F', logo_url: null, short_description: 'College of Arts & Sciences student council', type: 'college_council' },
  { id: 'cbac', name: 'CBA Student Council', slug: 'cbac', accent_color: '#7B3F00', logo_url: null, short_description: 'College of Business Administration student council', type: 'college_council' },
  { id: 'ccjc', name: 'CCJ Student Council', slug: 'ccjc', accent_color: '#4A1A7A', logo_url: null, short_description: 'College of Criminal Justice student council', type: 'college_council' },
  { id: 'citcsc', name: 'CITCS Student Council', slug: 'citcsc', accent_color: '#1A6B3C', logo_url: null, short_description: 'College of ICT student council', type: 'college_council' },
  { id: 'conc', name: 'CON Student Council', slug: 'conc', accent_color: '#6B0000', logo_url: null, short_description: 'College of Nursing student council', type: 'college_council' },
  { id: 'ctec', name: 'CTE Student Council', slug: 'ctec', accent_color: '#8B1010', logo_url: null, short_description: 'College of Teacher Education student council', type: 'college_council' },
]

// Department Organizations - grouped by college
export const departmentOrganizations: Record<string, Organization[]> = {
  CITCS: [
    { id: 'cssoc', name: 'CSSOC', slug: 'cssoc', accent_color: '#1A6B3C', logo_url: null, short_description: 'Computer Science Society', type: 'dept_org' },
    { id: 'itsoc', name: 'ITSOC', slug: 'itsoc', accent_color: '#1A6B3C', logo_url: null, short_description: 'Information Technology Society', type: 'dept_org' },
    { id: 'act', name: 'ACT Society', slug: 'act-society', accent_color: '#1A6B3C', logo_url: null, short_description: 'Associate of Computer Technology Society', type: 'dept_org' },
    { id: 'kultura', name: 'Kultura Teknika', slug: 'kultura-teknika', accent_color: '#1A6B3C', logo_url: null, short_description: 'Cultural organization for CITCS', type: 'dept_org' },
  ],
  CAS: [
    { id: 'yess', name: 'YESS', slug: 'yess', accent_color: '#1E3A5F', logo_url: null, short_description: 'Youth Environmental Science Society', type: 'dept_org' },
    { id: 'ses', name: 'Science Enthusiasts\' Society', slug: 'science-enthusiasts', accent_color: '#1E3A5F', logo_url: null, short_description: 'For science-minded students', type: 'dept_org' },
    { id: 'mws', name: 'Math Wizards\' Society', slug: 'math-wizards', accent_color: '#1E3A5F', logo_url: null, short_description: 'Mathematics enthusiasts organization', type: 'dept_org' },
    { id: 'ssas', name: 'Social Science Achievers\' Society', slug: 'social-science-achievers', accent_color: '#1E3A5F', logo_url: null, short_description: 'Social Science students organization', type: 'dept_org' },
    { id: 'usc', name: 'University Science Club', slug: 'university-science-club', accent_color: '#1E3A5F', logo_url: null, short_description: 'General science organization', type: 'dept_org' },
  ],
  CTE: [
    { id: 'beed', name: 'BEED Society', slug: 'beed-society', accent_color: '#8B1010', logo_url: null, short_description: 'Bachelor of Elementary Education Society', type: 'dept_org' },
    { id: 'eces', name: 'Early Childhood Educators\' Society', slug: 'ece-society', accent_color: '#8B1010', logo_url: null, short_description: 'ECED students organization', type: 'dept_org' },
    { id: 'ases', name: 'Advent of Special Education Student Society', slug: 'sped-society', accent_color: '#8B1010', logo_url: null, short_description: 'SPED students organization', type: 'dept_org' },
    { id: 'sope', name: 'Society of Physical Educators', slug: 'society-pe', accent_color: '#8B1010', logo_url: null, short_description: 'Physical Education students', type: 'dept_org' },
    { id: 'kataga', name: 'Kataga', slug: 'kataga', accent_color: '#8B1010', logo_url: null, short_description: 'CTE student publication', type: 'dept_org' },
  ],
  CBA: [
    { id: 'jpia', name: 'JPIA', slug: 'jpia', accent_color: '#7B3F00', logo_url: null, short_description: 'Junior Philippine Institute of Accountants', type: 'dept_org' },
    { id: 'jmap', name: 'JMAP', slug: 'jmap', accent_color: '#7B3F00', logo_url: null, short_description: 'Junior Marketing Association of the Philippines', type: 'dept_org' },
    { id: 'jpmap', name: 'JPMAP', slug: 'jpmap', accent_color: '#7B3F00', logo_url: null, short_description: 'Junior Property Management Association of the Philippines', type: 'dept_org' },
  ],
}

// University Organizations
export const universityOrganizations: Organization[] = [
  { id: 'chorale', name: 'PLMun Chorale', slug: 'plmun-chorale', accent_color: '#6B0000', logo_url: null, short_description: 'Official choir group', type: 'university_org' },
  { id: 'folkloric', name: 'PLMun Folkloric Dance Company', slug: 'plmun-folkloric', accent_color: '#6B0000', logo_url: null, short_description: 'Official folk dance company', type: 'university_org' },
  { id: 'dulangsining', name: 'PLMun Dulangsining', slug: 'plmun-dulangsining', accent_color: '#6B0000', logo_url: null, short_description: 'Official cultural dance group', type: 'university_org' },
  { id: 'ert', name: 'PLMun Emergency Response Team', slug: 'plmun-ert', accent_color: '#9B1C1C', logo_url: null, short_description: 'Emergency response and disaster readiness', type: 'university_org' },
  { id: 'redcross', name: 'PLMun Red Cross Youth', slug: 'plmun-red-cross-youth', accent_color: '#9B1C1C', logo_url: null, short_description: 'Red Cross youth chapter', type: 'university_org' },
  { id: 'biblical', name: 'Biblical Youth Link', slug: 'biblical-youth-link', accent_color: '#1E3A5F', logo_url: null, short_description: 'Christian youth organization', type: 'university_org' },
  { id: 'yabs', name: 'Youth Alliance for the Betterment of Society', slug: 'yabs', accent_color: '#1E3A5F', logo_url: null, short_description: 'Youth advocacy organization', type: 'university_org' },
  { id: 'blckmvmnt', name: 'PLMun BLCKMVMNT', slug: 'plmun-blckmvmnt', accent_color: '#1A1A18', logo_url: null, short_description: 'Official dance crew', type: 'university_org' },
  { id: 'euphoria', name: 'Euphoria', slug: 'euphoria', accent_color: '#4A1A7A', logo_url: null, short_description: 'Dance production group', type: 'university_org' },
  { id: 'nsrc', name: 'NSRC', slug: 'nsrc', accent_color: '#1A6B3C', logo_url: null, short_description: 'National Service Reserved Corps', type: 'university_org' },
  { id: 'warden', name: 'The Warden', slug: 'the-warden', accent_color: '#1A1A18', logo_url: null, short_description: 'Student publication', type: 'university_org' },
  { id: 'celestial-esports', name: 'PLMun Celestial Esports', slug: 'plmun-celestial-esports', accent_color: '#1A6B3C', logo_url: null, short_description: 'Official esports organization', type: 'university_org' },
]

// Service Offices
export const serviceOffices: Organization[] = [
  { id: 'registrar', name: 'Registrar', slug: 'registrar', accent_color: '#5A5A56', logo_url: null, short_description: 'Office of the University Registrar', type: 'service_office' },
  { id: 'osa', name: 'OSA', slug: 'osa', accent_color: '#5A5A56', logo_url: null, short_description: 'Office of Student Affairs', type: 'service_office' },
  { id: 'mis', name: 'MIS', slug: 'mis', accent_color: '#5A5A56', logo_url: null, short_description: 'Management Information System', type: 'service_office' },
]

// All organizations for lookup
export const allOrganizations = [
  ...studentCouncils,
  ...Object.values(departmentOrganizations).flat(),
  ...universityOrganizations,
  ...serviceOffices,
]

// Get org by slug
export function getOrgBySlug(slug: string): Organization | undefined {
  return allOrganizations.find(org => org.slug === slug)
}

// Get orgs by type
export function getOrgsByType(type: Organization['type']): Organization[] {
  return allOrganizations.filter(org => org.type === type)
}

// Get dept orgs by college
export function getDeptOrgsByCollege(college: string): Organization[] {
  return departmentOrganizations[college] || []
}