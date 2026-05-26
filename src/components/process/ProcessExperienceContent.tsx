import { Fragment } from 'react'
import type { ProcessChapter } from '../../types/content'
import { nb } from '../../utils/typography'

interface ProcessExperienceContentProps {
  chapter: ProcessChapter
}

function StoryBlock({
  heading,
  text,
  bullets,
}: {
  heading: string
  text: string
  bullets: string[]
}) {
  return (
    <section data-process-stagger className="rounded-[24px] border border-white/12 bg-[#081121]/92 p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">{nb(heading)}</p>
      <p className="mt-2 text-base leading-relaxed text-slate-200/92">{nb(text)}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-300/92">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blue-300" />
            <span>{nb(bullet)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ProcessExperienceContent({ chapter }: ProcessExperienceContentProps) {
  const sections = chapter.sections

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
      <article className="space-y-6">
        <StoryBlock
          heading={sections.context.heading}
          text={sections.context.text}
          bullets={sections.context.bullets}
        />
        <StoryBlock
          heading={sections.problem.heading}
          text={sections.problem.text}
          bullets={sections.problem.bullets}
        />
        <StoryBlock
          heading={sections.discovery.heading}
          text={sections.discovery.text}
          bullets={sections.discovery.bullets}
        />
        <StoryBlock
          heading={sections.processTimeline.heading}
          text={sections.processTimeline.text}
          bullets={sections.processTimeline.bullets}
        />
        <StoryBlock
          heading={sections.architecture.heading}
          text={sections.architecture.text}
          bullets={sections.architecture.bullets}
        />
        <StoryBlock
          heading={sections.frameworks.heading}
          text={sections.frameworks.text}
          bullets={sections.frameworks.bullets}
        />
        <StoryBlock
          heading={sections.outcomes.heading}
          text={sections.outcomes.text}
          bullets={sections.outcomes.bullets}
        />
        <StoryBlock
          heading={sections.collaboration.heading}
          text={sections.collaboration.text}
          bullets={sections.collaboration.bullets}
        />
        <StoryBlock
          heading={sections.result.heading}
          text={sections.result.text}
          bullets={sections.result.bullets}
        />
        <StoryBlock
          heading={sections.cta.heading}
          text={sections.cta.text}
          bullets={sections.cta.bullets}
        />
      </article>

      <aside className="space-y-5">
        <section data-process-stagger className="rounded-[24px] border border-white/12 bg-[#0a1324]/90 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Process timeline</p>
          <ol className="mt-3 space-y-3">
            {chapter.phases.map((phase) => (
              <li key={phase.phase} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100/85">{nb(`${phase.phase} ${phase.title}`)}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-300/92">{nb(phase.detail)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section data-process-stagger className="rounded-[24px] border border-white/12 bg-[#0a1324]/90 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Artifacts</p>
          <div className="mt-3 space-y-3">
            {chapter.artifacts.map((artifact) => (
              <article key={artifact.title} className="rounded-2xl border border-white/12 bg-white/[0.03] p-3">
                <h4 className="text-base font-semibold text-white">{nb(artifact.title)}</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-300/90">{nb(artifact.description)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {artifact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-blue-300/30 bg-blue-500/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-blue-100"
                    >
                      {nb(tag)}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section data-process-stagger className="rounded-[24px] border border-white/12 bg-[#0a1324]/90 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Metrics</p>
          <div className="mt-3 space-y-3">
            {chapter.metricHighlights.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">{nb(metric.label)}</p>
                <p className="mt-1 text-3xl font-semibold text-white">{nb(metric.value)}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-300/88">{nb(metric.detail)}</p>
              </div>
            ))}
          </div>
        </section>

        <section data-process-stagger className="rounded-[24px] border border-white/12 bg-[#0a1324]/90 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Chapter map</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {chapter.timelineMarkers.map((marker) => (
              <Fragment key={marker}>
                <span className="rounded-full border border-white/16 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-200">
                  {nb(marker)}
                </span>
              </Fragment>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}
