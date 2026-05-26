import {
  type MouseEvent,
  type TouchEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { Section } from '../layout/Section'
import { caseStudies, metrics } from '../../data/portfolio'
import { CountUp } from '../common/CountUp'
import { WordReveal } from '../common/WordReveal'
import { useCursor } from '../../context/CursorContext'
import { useImpactModal } from '../../context/ImpactModalContext'
import { nb } from '../../utils/typography'
import type { MetricId, MetricItem } from '../../types/content'

gsap.registerPlugin(Flip)
const LENS_REBUILD_EVENT = 'cursor-lens-rebuild'

interface ImpactMetricsProps {
  reducedMotion: boolean
}

interface FlipSnapshot {
  metricId: MetricId
  state: ReturnType<typeof Flip.getState>
}

function applyTilt(event: MouseEvent<HTMLElement>, disabled: boolean) {
  if (disabled) {
    return
  }

  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const rotateY = ((x / rect.width) * 2 - 1) * 8
  const rotateX = ((y / rect.height) * -2 + 1) * 8

  el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`
}

function resetTilt(event: MouseEvent<HTMLElement>) {
  event.currentTarget.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)'
}

function formatMetricValue(item: MetricItem) {
  if (item.mode === 'text') {
    return nb(item.value)
  }

  return nb(`${item.prefix ?? ''}${item.value}${item.suffix ?? ''}`)
}

function emitLensRebuild(reason: string) {
  window.dispatchEvent(new CustomEvent(LENS_REBUILD_EVENT, { detail: { reason } }))
}

export function ImpactMetrics({ reducedMotion }: ImpactMetricsProps) {
  const { setMode, reset } = useCursor()
  const {
    activeMetricId,
    isOpen,
    openMetric,
    closeMetric,
    navigateToCase,
  } = useImpactModal()

  const metricById = useMemo(
    () => new Map(metrics.map((metric) => [metric.id, metric])),
    [],
  )

  const caseById = useMemo(
    () => new Map(caseStudies.map((caseStudy) => [caseStudy.id, caseStudy])),
    [],
  )

  const activeMetric = activeMetricId ? metricById.get(activeMetricId) ?? null : null
  const relatedCases = useMemo(() => {
    if (!activeMetric) {
      return []
    }

    return activeMetric.narrative.relatedCaseIds
      .map((caseId) => caseById.get(caseId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
  }, [activeMetric, caseById])

  const cardRefs = useRef(new Map<MetricId, HTMLButtonElement | null>())
  const lastOpenedMetricRef = useRef<MetricId | null>(null)
  const flipStateRef = useRef<FlipSnapshot | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const touchStartYRef = useRef<number | null>(null)
  const wasOpenRef = useRef(false)

  const closeOverlay = useCallback(() => {
    setSwipeOffset(0)
    closeMetric({ updateHash: true, restoreScroll: true })
  }, [closeMetric])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    emitLensRebuild(isOpen ? 'impact-modal-open' : 'impact-modal-close')

    const rafA = requestAnimationFrame(() => emitLensRebuild('impact-modal-raf-1'))
    const rafB = requestAnimationFrame(() => emitLensRebuild('impact-modal-raf-2'))
    const timeout = window.setTimeout(() => emitLensRebuild('impact-modal-post-layout'), 420)

    return () => {
      cancelAnimationFrame(rafA)
      cancelAnimationFrame(rafB)
      window.clearTimeout(timeout)
    }
  }, [isOpen, activeMetricId])

  useEffect(() => {
    if (!isOpen && wasOpenRef.current && lastOpenedMetricRef.current) {
      const trigger = cardRefs.current.get(lastOpenedMetricRef.current)
      trigger?.focus()
      setMode('default')
    }

    wasOpenRef.current = isOpen
  }, [isOpen, setMode])

  useEffect(() => {
    if (!isOpen || !dialogRef.current) {
      return undefined
    }

    const dialog = dialogRef.current
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeOverlay()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => !node.hasAttribute('disabled') && !node.getAttribute('aria-hidden'))

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeElement = document.activeElement as HTMLElement | null

      if (event.shiftKey && activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeOverlay, isOpen])

  useLayoutEffect(() => {
    if (!isOpen || !activeMetricId || reducedMotion) {
      return undefined
    }

    const snapshot = flipStateRef.current
    if (!snapshot || snapshot.metricId !== activeMetricId) {
      return undefined
    }

    const targetSelector = `[data-flip-id='impact-number-${activeMetricId}']`

    requestAnimationFrame(() => {
      Flip.from(snapshot.state, {
        targets: targetSelector,
        duration: 0.72,
        ease: 'power3.inOut',
        absolute: true,
        fade: true,
        prune: true,
      })
    })

    flipStateRef.current = null
    return undefined
  }, [activeMetricId, isOpen, reducedMotion])

  useLayoutEffect(() => {
    if (!isOpen || !modalContentRef.current || reducedMotion) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-impact-stagger]',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.64,
          stagger: 0.08,
          ease: 'power3.out',
        },
      )
    }, modalContentRef)

    return () => {
      ctx.revert()
    }
  }, [isOpen, reducedMotion])

  const handleOpen = useCallback(
    (metric: MetricItem) => {
      if (!reducedMotion) {
        flipStateRef.current = {
          metricId: metric.id,
          state: Flip.getState(`[data-flip-id='impact-number-${metric.id}']`),
        }
      }

      lastOpenedMetricRef.current = metric.id
      openMetric(metric.id)
      setMode('view')
    },
    [openMetric, reducedMotion, setMode],
  )

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return
      }

      closeOverlay()
    },
    [closeOverlay],
  )

  const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: fine)').matches) {
      return
    }

    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }, [])

  const onTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) {
      return
    }

    const currentY = event.touches[0]?.clientY
    if (typeof currentY !== 'number') {
      return
    }

    const delta = Math.max(currentY - touchStartYRef.current, 0)
    setSwipeOffset(Math.min(delta, 220))
  }, [])

  const onTouchEnd = useCallback(() => {
    if (touchStartYRef.current === null) {
      return
    }

    touchStartYRef.current = null
    if (swipeOffset > 120) {
      closeOverlay()
      return
    }

    setSwipeOffset(0)
  }, [closeOverlay, swipeOffset])

  return (
    <LayoutGroup id="impact-metrics">
      <Section
        id="impact"
        subtitle="Impact metrics"
        title="Результаты дизайна, которые читаются в продуктовых цифрах"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              layoutId={`impact-card-${item.id}`}
              data-cursor-card-hover
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#101726] to-[#080c14] p-6 text-left transition-transform duration-300 will-change-transform"
              aria-haspopup="dialog"
              aria-expanded={isOpen && activeMetricId === item.id}
              onClick={() => handleOpen(item)}
              onMouseMove={(event) => applyTilt(event, reducedMotion || isOpen)}
              onMouseEnter={() => setMode('view')}
              onMouseLeave={(event) => {
                resetTilt(event)
                reset()
              }}
              ref={(node) => {
                cardRefs.current.set(item.id, node)
              }}
            >
              <motion.p
                layoutId={`impact-label-${item.id}`}
                className="mb-4 text-xs uppercase tracking-[0.18em] text-blue-200/75"
              >
                {nb(item.label)}
              </motion.p>

              <div
                className="mb-4 text-3xl font-semibold text-white md:text-4xl"
                data-impact-number-flip={item.id}
                data-flip-id={`impact-number-${item.id}`}
              >
                {item.mode === 'count' ? (
                  <CountUp value={item.value} prefix={item.prefix} suffix={item.suffix} />
                ) : (
                  <span>{nb(item.value)}</span>
                )}
              </div>

              <motion.p layoutId={`impact-description-${item.id}`} className="text-sm leading-relaxed text-slate-300/85">
                {nb(item.description)}
              </motion.p>

              <div className="pointer-events-none absolute inset-0 rounded-2xl border border-blue-300/0 transition-colors group-hover:border-blue-300/35" />
            </motion.button>
          ))}
        </div>
      </Section>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && activeMetric && (
              <motion.div
                key={activeMetric.id}
                className="impact-modal-root fixed inset-0 z-[140]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setMode('view')}
                onMouseLeave={reset}
              >
                <motion.div
                  className="impact-modal-backdrop absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  onClick={handleBackdropClick}
                >
                  <motion.div
                    className="impact-modal-gradient absolute inset-0"
                    animate={
                      reducedMotion
                        ? undefined
                        : {
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                          }
                    }
                    transition={
                      reducedMotion
                        ? undefined
                        : {
                            duration: 14,
                            repeat: Infinity,
                            ease: 'linear',
                          }
                    }
                  />
                </motion.div>

                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`impact-modal-title-${activeMetric.id}`}
                  layoutId={`impact-card-${activeMetric.id}`}
                  className="impact-modal-panel absolute inset-0 overflow-y-auto"
                  transition={{
                    type: 'spring',
                    stiffness: reducedMotion ? 360 : 240,
                    damping: reducedMotion ? 42 : 30,
                    mass: 0.8,
                  }}
                  style={{ y: swipeOffset }}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onLayoutAnimationComplete={() => {
                    emitLensRebuild('impact-modal-layout-complete')
                  }}
                >
                  <div
                    data-cursor-lens-source="impact-modal-viewport"
                    className="mx-auto flex min-h-full w-full max-w-[1240px] flex-col px-5 py-6 md:px-10 md:py-8"
                  >
                    <header className="impact-modal-header sticky top-0 z-10 mb-8 rounded-2xl border border-white/10 bg-[#0b1221]/90 px-5 py-4 backdrop-blur-xl md:px-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <motion.p
                            layoutId={`impact-label-${activeMetric.id}`}
                            className="mb-2 text-[11px] uppercase tracking-[0.18em] text-blue-100/85"
                          >
                            {nb(activeMetric.label)}
                          </motion.p>
                          <div
                            className="text-3xl font-semibold text-white md:text-5xl"
                            data-impact-number-flip={activeMetric.id}
                            data-flip-id={`impact-number-${activeMetric.id}`}
                          >
                            {formatMetricValue(activeMetric)}
                          </div>
                        </div>

                        <button
                          ref={closeButtonRef}
                          type="button"
                          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.15em] text-slate-100 transition-colors hover:border-blue-200/60 hover:text-white"
                          onClick={closeOverlay}
                          onMouseEnter={() => setMode('contact')}
                          onMouseLeave={() => setMode('view')}
                        >
                          Закрыть
                        </button>
                      </div>
                    </header>

                    <div ref={modalContentRef} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
                      <section className="rounded-3xl border border-white/10 bg-[#091121]/92 p-6 md:p-8">
                        <div className="space-y-6">
                          <div data-impact-stagger>
                            <h3 id={`impact-modal-title-${activeMetric.id}`} className="text-3xl font-semibold leading-tight text-white md:text-5xl">
                              {reducedMotion ? (
                                nb(activeMetric.narrative.headline)
                              ) : (
                                <WordReveal
                                  text={activeMetric.narrative.headline}
                                  className="justify-start text-left"
                                />
                              )}
                            </h3>
                          </div>

                          <div data-impact-stagger>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Контекст</p>
                            <p className="mt-2 text-base leading-relaxed text-slate-200/90">
                              {nb(activeMetric.narrative.context)}
                            </p>
                          </div>

                          <div data-impact-stagger>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Проблема</p>
                            <p className="mt-2 text-base leading-relaxed text-slate-200/90">
                              {nb(activeMetric.narrative.problem)}
                            </p>
                          </div>

                          <div data-impact-stagger>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Процесс</p>
                            <ol className="mt-2 space-y-2 text-base leading-relaxed text-slate-200/90">
                              {activeMetric.narrative.process.map((step) => (
                                <li key={step} className="flex gap-3">
                                  <span className="mt-1 text-blue-300">→</span>
                                  <span>{nb(step)}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div data-impact-stagger>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Решения</p>
                            <ul className="mt-2 space-y-2 text-base leading-relaxed text-slate-200/90">
                              {activeMetric.narrative.solutions.map((solution) => (
                                <li key={solution} className="flex gap-3">
                                  <span className="mt-1 text-blue-300">•</span>
                                  <span>{nb(solution)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div data-impact-stagger>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Impact</p>
                            <p className="mt-2 text-base leading-relaxed text-slate-100">{nb(activeMetric.narrative.impact)}</p>
                          </div>
                        </div>
                      </section>

                      <aside className="space-y-5">
                        <section data-impact-stagger className="rounded-3xl border border-white/10 bg-[#0b1323]/90 p-5">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Методы</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {activeMetric.narrative.methods.map((method) => (
                              <span
                                key={method}
                                className="rounded-full border border-blue-300/30 bg-blue-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-blue-100"
                              >
                                {nb(method)}
                              </span>
                            ))}
                          </div>
                        </section>

                        <section data-impact-stagger className="rounded-3xl border border-white/10 bg-[#0b1323]/90 p-5">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Ключевые сигналы</p>
                          <div className="mt-3 space-y-2">
                            {activeMetric.narrative.impactStats.map((stat) => (
                              <div key={stat} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100">
                                {nb(stat)}
                              </div>
                            ))}
                          </div>
                        </section>

                        <section data-impact-stagger className="rounded-3xl border border-white/10 bg-[#0b1323]/90 p-5">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Related cases</p>
                          <div className="mt-3 space-y-3">
                            {relatedCases.map((relatedCase) => (
                              <div key={relatedCase.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                                <p className="text-xs uppercase tracking-[0.16em] text-blue-100/80">{nb(relatedCase.client)}</p>
                                <p className="mt-1 text-sm font-medium text-slate-100">{nb(relatedCase.title)}</p>
                                <button
                                  type="button"
                                  className="mt-3 inline-flex rounded-full border border-blue-300/35 bg-blue-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-blue-100 transition-colors hover:border-blue-100/80"
                                  onClick={() => navigateToCase(relatedCase.id)}
                                  onMouseEnter={() => setMode('contact')}
                                  onMouseLeave={() => setMode('view')}
                                >
                                  Смотреть кейс
                                </button>
                              </div>
                            ))}
                          </div>
                        </section>
                      </aside>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </LayoutGroup>
  )
}

