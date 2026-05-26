import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type TouchEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { useCursor } from '../../context/CursorContext'
import type { ProcessChapter } from '../../types/content'
import { nb } from '../../utils/typography'
import { ProcessExperienceContent } from './ProcessExperienceContent'
import {
  getProcessIndexLayoutId,
  getProcessShellLayoutId,
  getProcessSummaryLayoutId,
  getProcessTitleLayoutId,
} from './layoutIds'

const LENS_REBUILD_EVENT = 'cursor-lens-rebuild'

function emitLensRebuild(reason: string) {
  window.dispatchEvent(new CustomEvent(LENS_REBUILD_EVENT, { detail: { reason } }))
}

interface ProcessExperienceModalProps {
  chapter: ProcessChapter | null
  isOpen: boolean
  reducedMotion: boolean
  onClose: () => void
}

export function ProcessExperienceModal({
  chapter,
  isOpen,
  reducedMotion,
  onClose,
}: ProcessExperienceModalProps) {
  const { setMode, reset } = useCursor()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const touchStartYRef = useRef<number | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [progress, setProgress] = useState(0)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 24 })

  const titleId = useMemo(
    () => (chapter ? `process-overlay-title-${chapter.id}` : 'process-overlay-title'),
    [chapter],
  )

  useEffect(() => {
    emitLensRebuild(isOpen ? 'process-overlay-open' : 'process-overlay-close')
    const rafA = requestAnimationFrame(() => emitLensRebuild('process-overlay-raf-1'))
    const rafB = requestAnimationFrame(() => emitLensRebuild('process-overlay-raf-2'))
    const timeoutId = window.setTimeout(() => emitLensRebuild('process-overlay-post-layout'), 420)

    return () => {
      cancelAnimationFrame(rafA)
      cancelAnimationFrame(rafB)
      window.clearTimeout(timeoutId)
    }
  }, [isOpen, chapter?.id])

  useEffect(() => {
    if (!isOpen || !dialogRef.current) {
      return undefined
    }

    closeButtonRef.current?.focus()

    const dialog = dialogRef.current
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
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
      const current = document.activeElement as HTMLElement | null

      if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [isOpen, onClose])

  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current || reducedMotion) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-process-stagger]',
        { opacity: 0, y: 24, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.92,
          stagger: 0.06,
          ease: 'power3.out',
        },
      )
    }, contentRef)

    return () => {
      ctx.revert()
    }
  }, [isOpen, reducedMotion, chapter?.id])

  useEffect(() => {
    if (!isOpen || !scrollRef.current) {
      return undefined
    }

    const scroller = scrollRef.current
    scroller.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const normalizeWheelDelta = (event: WheelEvent) => {
      if (event.deltaMode === 1) {
        return event.deltaY * 16
      }

      if (event.deltaMode === 2) {
        return event.deltaY * window.innerHeight
      }

      return event.deltaY
    }

    const handleScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight
      if (max <= 0) {
        setProgress(0)
        return
      }

      setProgress(scroller.scrollTop / max)
    }

    const handleWheel = (event: WheelEvent) => {
      const deltaY = normalizeWheelDelta(event)
      if (!deltaY) {
        return
      }

      event.preventDefault()
      scroller.scrollTop += deltaY
      handleScroll()
    }

    const handleResize = () => {
      handleScroll()
      emitLensRebuild('process-overlay-resize')
    }

    handleScroll()
    scroller.addEventListener('scroll', handleScroll, { passive: true })
    scroller.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('resize', handleResize)

    return () => {
      scroller.removeEventListener('scroll', handleScroll)
      scroller.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, chapter?.id])

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return
      }

      onClose()
    },
    [onClose],
  )

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: fine)').matches) {
      return
    }

    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }, [])

  const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) {
      return
    }

    const y = event.touches[0]?.clientY
    if (typeof y !== 'number') {
      return
    }

    const delta = Math.max(y - touchStartYRef.current, 0)
    setSwipeOffset(Math.min(220, delta))
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (touchStartYRef.current === null) {
      return
    }

    touchStartYRef.current = null
    if (swipeOffset > 120) {
      onClose()
      setSwipeOffset(0)
      return
    }

    setSwipeOffset(0)
  }, [onClose, swipeOffset])

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && chapter && (
        <motion.div
          key={chapter.id}
          className="process-overlay-root fixed inset-0 z-[148]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.55, ease: [0.19, 1, 0.22, 1] }}
          onMouseEnter={() => setMode('view')}
          onMouseLeave={reset}
        >
          <motion.div
            className="process-overlay-backdrop absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.2 : 0.45 }}
            onClick={handleBackdropClick}
          >
            <div
              className="process-overlay-spotlight absolute inset-0"
              style={
                {
                  '--spot-x': `${spotlight.x}%`,
                  '--spot-y': `${spotlight.y}%`,
                } as CSSProperties
              }
            />
            <div className="process-overlay-grid absolute inset-0" />
            <div className="process-overlay-noise absolute inset-0" />
          </motion.div>

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            layoutId={getProcessShellLayoutId(chapter.id)}
            className="absolute inset-0 overflow-hidden"
            transition={{
              duration: reducedMotion ? 0.2 : 1.1,
              ease: [0.19, 1, 0.22, 1],
            }}
            style={{ y: swipeOffset }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onLayoutAnimationComplete={() => {
              emitLensRebuild('process-overlay-layout-complete')
            }}
            onMouseMove={(event) => {
              const x = (event.clientX / window.innerWidth) * 100
              const y = (event.clientY / window.innerHeight) * 100
              setSpotlight({ x, y })
            }}
          >
            <div className="h-full w-full p-2 md:p-4">
              <div className="h-full overflow-hidden rounded-[30px] border border-white/12 bg-[linear-gradient(150deg,rgba(8,16,30,0.98),rgba(5,9,16,0.98),rgba(11,24,42,0.96))] shadow-[0_40px_90px_rgba(0,0,0,0.58)]">
                <div
                  ref={scrollRef}
                  data-cursor-lens-source="process-overlay-viewport"
                  data-lenis-prevent
                  data-lenis-prevent-wheel
                  className="h-full overflow-y-auto overscroll-contain [scrollbar-gutter:stable]"
                >
                  <div ref={contentRef} className="mx-auto w-full max-w-[1320px] px-5 pb-14 pt-5 md:px-8 md:pt-7">
                    <header className="process-overlay-header sticky top-0 z-20 rounded-[26px] border border-white/12 bg-[#0b1220]/88 px-5 py-5 backdrop-blur-xl md:px-7">
                      <div className="grid gap-5 xl:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,23rem)]">
                        <div data-process-stagger className="space-y-2">
                          <motion.p
                            layoutId={getProcessIndexLayoutId(chapter.id)}
                            className="text-xs uppercase tracking-[0.18em] text-blue-100/85"
                          >
                            {nb(chapter.index)}
                          </motion.p>
                          <p className="text-sm text-slate-300">{nb(chapter.role)}</p>
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{nb(chapter.timeline)}</p>
                        </div>

                        <div data-process-stagger>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/78">{nb(chapter.heroKicker)}</p>
                          <motion.h2
                            id={titleId}
                            layoutId={getProcessTitleLayoutId(chapter.id)}
                            className="mt-2 text-3xl font-semibold leading-tight text-white md:text-6xl"
                          >
                            {nb(chapter.title)}
                          </motion.h2>
                          <motion.p
                            layoutId={getProcessSummaryLayoutId(chapter.id)}
                            className="mt-3 text-lg leading-relaxed text-slate-300/92"
                          >
                            {nb(chapter.summary)}
                          </motion.p>
                          <p className="mt-3 text-sm leading-relaxed text-blue-100/90 md:text-base">
                            {nb(chapter.heroImpact)}
                          </p>
                        </div>

                        <div data-process-stagger className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {chapter.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-blue-300/35 bg-blue-500/12 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-blue-100"
                              >
                                {nb(tag)}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {chapter.methodology.map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-white/18 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-200"
                              >
                                {nb(item)}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed text-slate-300/85">{nb(chapter.approach)}</p>
                        </div>
                      </div>
                    </header>

                    <div className="process-overlay-progress-wrap">
                      <div className="process-overlay-progress-track">
                        <div className="process-overlay-progress-fill" style={{ height: `${Math.max(progress * 100, 3)}%` }} />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                      <button
                        ref={closeButtonRef}
                        type="button"
                        className="rounded-full border border-white/24 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.15em] text-slate-100 transition-colors hover:border-blue-200/70 hover:text-white"
                        onClick={onClose}
                        onMouseEnter={() => setMode('contact')}
                        onMouseLeave={() => setMode('view')}
                      >
                        Закрыть главу
                      </button>
                    </div>

                    <ProcessExperienceContent chapter={chapter} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
