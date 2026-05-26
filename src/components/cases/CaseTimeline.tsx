import type { CaseStory } from '../../types/content'
import { nb } from '../../utils/typography'

interface CaseTimelineProps {
  story: CaseStory
}

export function CaseTimeline({ story }: CaseTimelineProps) {
  return (
    <section data-case-stagger className="rounded-[24px] border border-white/12 bg-[#0a1424]/90 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Timeline</p>
      <ol className="mt-3 space-y-3">
        {story.timelineItems.map((item, index) => (
          <li key={`${item.phase}-${item.title}`} className="relative rounded-xl border border-white/10 bg-white/[0.03] p-3 pl-10">
            <span className="absolute left-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full border border-blue-300/40 bg-blue-500/10 text-[10px] text-blue-100">
              {index + 1}
            </span>
            <p className="text-[10px] uppercase tracking-[0.16em] text-blue-100/75">{nb(item.phase)}</p>
            <p className="mt-1 text-sm font-semibold text-white">{nb(item.title)}</p>
            <p className="mt-1 text-sm text-slate-300/90">{nb(item.detail)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
