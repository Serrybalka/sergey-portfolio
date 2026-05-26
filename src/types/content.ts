export type CursorMode = 'default' | 'view' | 'drag' | 'contact'

export type MetricId =
  | 'experience'
  | 'role'
  | 'design-systems'
  | 'stakeholders'
  | 'funnel'
  | 'b2b-conversion'
  | 'b2c-orders'

export type CaseStudyId =
  | 'moscow'
  | 'tass'
  | 'rkg'
  | 'sber-health'
  | 'alfa-digital'
  | 'russkiy-svet'

export type CaseRouteSlug =
  | 'moscow'
  | 'tass'
  | 'rkg'
  | 'sber'
  | 'alfa'
  | 'russkiy-svet'

export type SystemDesignId =
  | 'systems'
  | 'architecture'
  | 'research'
  | 'metrics'
  | 'stakeholders'
  | 'motion'

export type ProcessExperienceId =
  | 'research'
  | 'hypotheses'
  | 'flows'
  | 'prototype'
  | 'test'
  | 'systemize'
  | 'ship'

export interface MetricNarrative {
  headline: string
  context: string
  problem: string
  process: string[]
  solutions: string[]
  impact: string
  methods: string[]
  impactStats: string[]
  relatedCaseIds: CaseStudyId[]
}

interface MetricBase {
  id: MetricId
  label: string
  description: string
  narrative: MetricNarrative
}

export type MetricItem =
  | (MetricBase & {
      mode: 'count'
      value: number
      prefix?: string
      suffix?: string
    })
  | (MetricBase & {
      mode: 'text'
      value: string
    })

export interface ExpertiseItem {
  id: string
  title: string
  summary: string
  tags: string[]
}

export interface SystemDesignNarrative {
  headline: string
  subtitle: string
  context: string
  challenge: string
  process: string[]
  solution: string
  impact: string
  tags: string[]
}

export interface SystemDesignItem {
  id: SystemDesignId
  index: string
  cardTitle: string
  cardSummary: string
  tags: string[]
  narrative: SystemDesignNarrative
}

export interface CaseStudy {
  id: CaseStudyId
  client: string
  title: string
  role: string
  problem: string
  process: string[]
  solution: string
  impact: string
  impactMetrics: string[]
}

export interface CaseStoryMetric {
  label: string
  value: string
  detail: string
}

export interface CaseStoryTimelineItem {
  phase: string
  title: string
  detail: string
}

export interface CaseStoryGalleryItem {
  id: string
  title: string
  caption: string
  layers: string[]
}

export interface CaseStorySectionContent {
  heading: string
  text: string
  bullets: string[]
}

export interface CaseStory {
  id: CaseStudyId
  route: CaseRouteSlug
  company: string
  role: string
  timeline: string
  title: string
  subtitle: string
  impactStatement: string
  compactProblem: string
  compactProcess: string[]
  compactSolution: string
  compactImpact: string
  compactChips: string[]
  heroKpis: string[]
  heroStack: string[]
  heroTags: string[]
  sections: {
    context: CaseStorySectionContent
    problem: CaseStorySectionContent
    research: CaseStorySectionContent
    productThinking: CaseStorySectionContent
    uxArchitecture: CaseStorySectionContent
    process: CaseStorySectionContent
    motionPrototype: CaseStorySectionContent
    collaboration: CaseStorySectionContent
    designSystem: CaseStorySectionContent
    impact: CaseStorySectionContent
    reflection: CaseStorySectionContent
  }
  metrics: CaseStoryMetric[]
  timelineItems: CaseStoryTimelineItem[]
  gallery: CaseStoryGalleryItem[]
  closingTitle: string
  closingText: string
}

export interface ProcessStep {
  id: string
  title: string
  detail: string
}

export interface ProcessChapterMetric {
  label: string
  value: string
  detail: string
}

export interface ProcessChapterPhase {
  phase: string
  title: string
  detail: string
}

export interface ProcessChapterArtifact {
  title: string
  description: string
  tags: string[]
}

export interface ProcessChapterSection {
  heading: string
  text: string
  bullets: string[]
}

export interface ProcessChapter {
  id: ProcessExperienceId
  index: string
  title: string
  summary: string
  role: string
  approach: string
  timeline: string
  heroKicker: string
  heroImpact: string
  tags: string[]
  methodology: string[]
  metricHighlights: ProcessChapterMetric[]
  timelineMarkers: string[]
  phases: ProcessChapterPhase[]
  artifacts: ProcessChapterArtifact[]
  sections: {
    context: ProcessChapterSection
    problem: ProcessChapterSection
    discovery: ProcessChapterSection
    processTimeline: ProcessChapterSection
    architecture: ProcessChapterSection
    frameworks: ProcessChapterSection
    outcomes: ProcessChapterSection
    collaboration: ProcessChapterSection
    result: ProcessChapterSection
    cta: ProcessChapterSection
  }
}

export interface ContactLink {
  id: string
  label: string
  href: string
}
