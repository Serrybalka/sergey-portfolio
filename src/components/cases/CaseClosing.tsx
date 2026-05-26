import type { CaseStory } from '../../types/content'
import { nb } from '../../utils/typography'

interface CaseClosingProps {
  story: CaseStory
}

export function CaseClosing({ story }: CaseClosingProps) {
  return (
    <section
      data-case-stagger
      className="rounded-[24px] border border-white/12 bg-gradient-to-br from-[#0f1d37]/90 to-[#091221]/96 p-6"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Closing</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">{nb(story.closingTitle)}</h3>
      <p className="mt-3 text-base leading-relaxed text-slate-200/90">{nb(story.closingText)}</p>
    </section>
  )
}
