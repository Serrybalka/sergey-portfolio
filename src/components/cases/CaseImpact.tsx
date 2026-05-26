import type { CaseStory } from '../../types/content'
import { nb } from '../../utils/typography'

interface CaseImpactProps {
  story: CaseStory
}

export function CaseImpact({ story }: CaseImpactProps) {
  return (
    <section data-case-stagger className="rounded-[24px] border border-blue-300/24 bg-gradient-to-br from-[#0d1e3a]/90 to-[#081222]/95 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">{nb(story.sections.impact.heading)}</p>
      <p className="mt-2 text-base leading-relaxed text-slate-100">{nb(story.sections.impact.text)}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-200/90">
        {story.sections.impact.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blue-300" />
            <span>{nb(bullet)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
