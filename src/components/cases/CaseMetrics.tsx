import type { CaseStory } from '../../types/content'
import { nb } from '../../utils/typography'

interface CaseMetricsProps {
  story: CaseStory
}

export function CaseMetrics({ story }: CaseMetricsProps) {
  return (
    <section data-case-stagger className="rounded-[24px] border border-white/12 bg-[#0a1424]/90 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Metrics</p>
      <div className="mt-3 space-y-3">
        {story.metrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{nb(metric.label)}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{nb(metric.value)}</p>
            <p className="mt-1 text-sm text-slate-300/90">{nb(metric.detail)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
