import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { caseStories } from '../../data/cases'
import { useCaseExperience } from '../../context/CaseExperienceContext'
import { useCursor } from '../../context/CursorContext'
import { useImpactModal } from '../../context/ImpactModalContext'
import { nb } from '../../utils/typography'
import { getCaseChipLayoutId, getCaseCompanyLayoutId, getCaseRoleLayoutId, getCaseShellLayoutId, getCaseTitleLayoutId } from './CaseHero'

gsap.registerPlugin(ScrollTrigger)

interface CasesRailProps {
  reducedMotion: boolean
}

export function CasesRail({ reducedMotion }: CasesRailProps) {
  const pinWrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef(new Map<string, HTMLElement | null>())
  const { setMode, reset } = useCursor()
  const { activeCaseId, isOpen, openCase } = useCaseExperience()
  const { highlightedCaseId, clearHighlightedCase } = useImpactModal()

  useEffect(() => {
    if (reducedMotion || !pinWrapRef.current || !trackRef.current) {
      return undefined
    }

    const media = gsap.matchMedia()
    media.add('(min-width: 1024px)', () => {
      const pinWrap = pinWrapRef.current
      const track = trackRef.current

      if (!pinWrap || !track) {
        return undefined
      }

      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - pinWrap.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: pinWrap,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${track.scrollWidth - pinWrap.clientWidth + window.innerHeight * 0.55}`,
          invalidateOnRefresh: true,
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => {
      media.revert()
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!highlightedCaseId) {
      return undefined
    }

    const card = cardRefs.current.get(highlightedCaseId)
    if (!card) {
      return undefined
    }

    card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })
    const timeoutId = window.setTimeout(() => {
      clearHighlightedCase()
    }, 1800)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [highlightedCaseId, clearHighlightedCase, reducedMotion])

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {caseStories.map((story) => (
          <span
            key={story.id}
            className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300"
          >
            {nb(story.company)}
          </span>
        ))}
      </div>

      <div ref={pinWrapRef} className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#050910] p-4 md:p-6">
        <div
          ref={trackRef}
          className={`flex flex-col gap-5 lg:w-max lg:flex-row ${isOpen ? 'pointer-events-none' : ''}`}
          onMouseEnter={() => setMode('drag')}
          onMouseLeave={reset}
        >
          {caseStories.map((story) => {
            const isActive = activeCaseId === story.id
            const isDimmed = isOpen && !isActive

            return (
              <motion.button
                key={story.id}
                type="button"
                layoutId={getCaseShellLayoutId(story.id)}
                data-cursor-card-hover
                className={`case-card group relative min-h-[28rem] rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f1725] to-[#090d17] p-5 text-left lg:w-[30rem] ${
                  highlightedCaseId === story.id ? 'case-card-highlighted' : ''
                }`}
                animate={
                  isDimmed
                    ? { scale: 0.96, opacity: 0, filter: 'blur(16px)', y: 20, z: -80 }
                    : { scale: 1, opacity: 1, filter: 'blur(0px)', y: 0, z: 0 }
                }
                transition={{ duration: reducedMotion ? 0.2 : 1.1, ease: [0.19, 1, 0.22, 1] }}
                onClick={() => openCase(story.id)}
                onMouseEnter={() => setMode('view')}
                onMouseLeave={() => setMode('drag')}
                ref={(node) => {
                  cardRefs.current.set(story.id, node)
                }}
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <motion.p
                    layoutId={getCaseCompanyLayoutId(story.id)}
                    className="text-xs uppercase tracking-[0.16em] text-blue-200/80"
                  >
                    {nb(story.company)}
                  </motion.p>
                  <motion.p layoutId={getCaseRoleLayoutId(story.id)} className="text-xs text-slate-400">
                    {nb(story.role)}
                  </motion.p>
                </div>

                <motion.h3
                  layoutId={getCaseTitleLayoutId(story.id)}
                  className="mb-5 text-2xl font-semibold leading-tight text-white"
                >
                  {nb(story.title)}
                </motion.h3>

                <div className="space-y-4 text-sm leading-relaxed text-slate-300/95">
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-blue-200/75">Problem</p>
                    <p>{nb(story.compactProblem)}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-blue-200/75">Process</p>
                    <ul className="space-y-1">
                      {story.compactProcess.map((step) => (
                        <li key={step} className="before:mr-2 before:text-blue-300 before:content-['•']">
                          {nb(step)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-blue-200/75">Solution</p>
                    <p>{nb(story.compactSolution)}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-blue-200/75">Impact</p>
                    <p>{nb(story.compactImpact)}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {story.compactChips.map((metric, chipIndex) => (
                    <motion.span
                      key={metric}
                      layoutId={getCaseChipLayoutId(story.id, chipIndex)}
                      className="rounded-full border border-blue-300/30 bg-blue-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-blue-100"
                    >
                      {nb(metric)}
                    </motion.span>
                  ))}
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-blue-300/0 transition-colors duration-300 group-hover:border-blue-300/50" />
              </motion.button>
            )
          })}
        </div>
      </div>
    </>
  )
}
