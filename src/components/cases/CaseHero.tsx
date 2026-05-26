import { motion } from 'framer-motion'
import type { CaseStory } from '../../types/content'
import { nb } from '../../utils/typography'

interface CaseHeroProps {
  story: CaseStory
}

export function getCaseShellLayoutId(id: string) {
  return `case-shell-${id}`
}

export function getCaseCompanyLayoutId(id: string) {
  return `case-company-${id}`
}

export function getCaseRoleLayoutId(id: string) {
  return `case-role-${id}`
}

export function getCaseTitleLayoutId(id: string) {
  return `case-title-${id}`
}

export function getCaseChipLayoutId(id: string, index: number) {
  return `case-chip-${id}-${index}`
}

export function CaseHero({ story }: CaseHeroProps) {
  return (
    <header className="case-overlay-header sticky top-0 z-20 rounded-[26px] border border-white/12 bg-[#0b1220]/85 px-5 py-5 backdrop-blur-xl md:px-7">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,24rem)]">
        <div data-case-stagger className="space-y-2">
          <motion.p
            layoutId={getCaseCompanyLayoutId(story.id)}
            className="text-xs uppercase tracking-[0.18em] text-blue-100/85"
          >
            {nb(story.company)}
          </motion.p>
          <motion.p layoutId={getCaseRoleLayoutId(story.id)} className="text-sm text-slate-300">
            {nb(story.role)}
          </motion.p>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{nb(story.timeline)}</p>
        </div>

        <div data-case-stagger>
          <motion.h2
            id={`case-overlay-title-${story.id}`}
            layoutId={getCaseTitleLayoutId(story.id)}
            className="text-3xl font-semibold leading-tight text-white md:text-6xl"
          >
            {nb(story.title)}
          </motion.h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300/92 md:text-lg">{nb(story.subtitle)}</p>
          <p className="mt-3 text-sm leading-relaxed text-blue-100/90 md:text-base">
            {nb(story.impactStatement)}
          </p>
        </div>

        <div data-case-stagger className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {story.heroKpis.map((kpi) => (
              <span
                key={kpi}
                className="rounded-full border border-white/24 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-100"
              >
                {nb(kpi)}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {story.heroStack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-blue-300/35 bg-blue-500/12 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-blue-100"
              >
                {nb(item)}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {story.heroTags.map((tag, index) => (
              <motion.span
                key={tag}
                layoutId={getCaseChipLayoutId(story.id, index)}
                className="rounded-full border border-white/16 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-300"
              >
                {nb(tag)}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
