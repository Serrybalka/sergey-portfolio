import type { CaseStory, CaseStorySectionContent } from '../../types/content'
import { nb } from '../../utils/typography'
import { CaseClosing } from './CaseClosing'
import { CaseGallery } from './CaseGallery'
import { CaseImpact } from './CaseImpact'
import { CaseMetrics } from './CaseMetrics'
import { CaseTimeline } from './CaseTimeline'

interface CaseSectionsProps {
  story: CaseStory
  reducedMotion: boolean
}

function StoryBlock({ section }: { section: CaseStorySectionContent }) {
  return (
    <section data-case-stagger className="rounded-[24px] border border-white/12 bg-[#081121]/94 p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">{nb(section.heading)}</p>
      <p className="mt-2 text-base leading-relaxed text-slate-200/90">{nb(section.text)}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-300/90">
        {section.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blue-300" />
            <span>{nb(bullet)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function CaseSections({ story, reducedMotion }: CaseSectionsProps) {
  const sections = story.sections

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,24rem)]">
      <article className="space-y-6">
        <StoryBlock section={sections.context} />
        <StoryBlock section={sections.problem} />
        <StoryBlock section={sections.research} />
        <StoryBlock section={sections.productThinking} />
        <StoryBlock section={sections.uxArchitecture} />
        <StoryBlock section={sections.process} />
        <StoryBlock section={sections.motionPrototype} />
        <StoryBlock section={sections.collaboration} />
        <StoryBlock section={sections.designSystem} />
        <StoryBlock section={sections.reflection} />
      </article>

      <aside className="space-y-5">
        <CaseMetrics story={story} />
        <CaseTimeline story={story} />
        <CaseGallery story={story} reducedMotion={reducedMotion} />
        <CaseImpact story={story} />
        <CaseClosing story={story} />
      </aside>
    </div>
  )
}
