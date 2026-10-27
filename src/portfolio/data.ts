import raw from './content.json'

// Production builds strip draft cases in vite.config.ts before importing JSON.
// Dev serves this public-safe source as-is; runtime filtering is a UI fallback,
// never permission to put private material in this file or in public/.

export type CaseSection = { heading: string; text: string }
export type PortfolioCase = {
  slug: string
  title: string
  summary: string
  role: string
  projectStatus: string
  pageStatus: 'preview' | 'published' | 'draft'
  confidentiality: 'nda' | 'open-concept'
  kind: string
  period?: string
  tags: string[]
  sections: CaseSection[]
  media: { src: string; kind: 'placeholder' | 'artifact'; label: string; alt: string; caption: string; originalArtifact: boolean }
  cta: string
  order: number
}

export const content = raw
export const cases = raw.cases as PortfolioCase[]
export const visibleCases = cases.filter(item => item.pageStatus !== 'draft').sort((a, b) => a.order - b.order)
export const getCase = (slug: string) => visibleCases.find(item => item.slug === slug)
export const email = 'serrybalka@gmail.com'

export function validateContent() {
  const slugs = new Set<string>()
  for (const item of cases) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || slugs.has(item.slug)) throw new Error(`Invalid/duplicate case slug: ${item.slug}`)
    slugs.add(item.slug)
    for (const key of ['title', 'summary', 'role', 'projectStatus'] as const) {
      if (!item[key]?.trim()) throw new Error(`Missing ${key}: ${item.slug}`)
    }
    if (!item.media.src.startsWith('/media/') || !item.media.alt.trim() || !item.media.caption.trim()) throw new Error(`Incomplete media: ${item.slug}`)
    if (item.media.kind === 'placeholder' && item.media.originalArtifact) throw new Error(`Placeholder misrepresented as an artifact: ${item.slug}`)
    if (item.confidentiality === 'nda' && item.media.kind !== 'placeholder') throw new Error(`NDA media requires explicit new approval: ${item.slug}`)
  }
  return { caseCount: cases.length, visibleCount: visibleCases.length }
}

validateContent()
