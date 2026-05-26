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
import { caseStoryById } from '../../data/cases'
import { useCaseExperience } from '../../context/CaseExperienceContext'
import { useCursor } from '../../context/CursorContext'
import { CaseHero, getCaseShellLayoutId } from './CaseHero'
import { CaseSections } from './CaseSections'

interface CaseOverlayProps {
  reducedMotion: boolean
}

const LENS_REBUILD_EVENT = 'cursor-lens-rebuild'

function emitLensRebuild(reason: string) {
  window.dispatchEvent(new CustomEvent(LENS_REBUILD_EVENT, { detail: { reason } }))
}

export function CaseOverlay({ reducedMotion }: CaseOverlayProps) {
  const {
    activeCaseId,
    isOpen,
    closeCase,
    markOverlayOpened,
    markOverlayClosed,
  } = useCaseExperience()
  const { setMode, reset } = useCursor()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const touchStartYRef = useRef<number | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [progress, setProgress] = useState(0)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 24 })

  const story = useMemo(
    () => (activeCaseId ? caseStoryById.get(activeCaseId) ?? null : null),
    [activeCaseId],
  )

  useEffect(() => {
    emitLensRebuild(isOpen ? 'case-overlay-open' : 'case-overlay-close')

    const rafA = requestAnimationFrame(() => emitLensRebuild('case-overlay-raf-1'))
    const rafB = requestAnimationFrame(() => emitLensRebuild('case-overlay-raf-2'))
    const timeoutId = window.setTimeout(() => emitLensRebuild('case-overlay-post-layout'), 420)

    return () => {
      cancelAnimationFrame(rafA)
      cancelAnimationFrame(rafB)
      window.clearTimeout(timeoutId)
    }
  }, [isOpen, activeCaseId])

  useEffect(() => {
    if (!isOpen || !dialogRef.current) {
      return undefined
    }

    closeButtonRef.current?.focus()

    const dialog = dialogRef.current
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeCase()
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
  }, [isOpen, closeCase])

  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current || reducedMotion) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-case-stagger]',
        { opacity: 0, y: 26, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.95,
          stagger: 0.06,
          ease: 'power3.out',
        },
      )
    }, contentRef)

    return () => {
      ctx.revert()
    }
  }, [isOpen, reducedMotion, activeCaseId])

  useEffect(() => {
    if (!isOpen || !scrollRef.current) {
      return undefined
    }

    const scroller = scrollRef.current
    scroller.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const handleScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight
      if (max <= 0) {
        setProgress(0)
        return
      }

      setProgress(scroller.scrollTop / max)
    }

    const handleResize = () => {
      emitLensRebuild('case-overlay-resize')
      handleScroll()
    }

    const normalizeWheelDelta = (event: WheelEvent) => {
      if (event.deltaMode === 1) {
        return event.deltaY * 16
      }

      if (event.deltaMode === 2) {
        return event.deltaY * window.innerHeight
      }

      return event.deltaY
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

    handleScroll()
    scroller.addEventListener('scroll', handleScroll, { passive: true })
    scroller.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('resize', handleResize)

    return () => {
      scroller.removeEventListener('scroll', handleScroll)
      scroller.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, activeCaseId])

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return
      }

      closeCase()
    },
    [closeCase],
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
      closeCase()
      setSwipeOffset(0)
      return
    }

    setSwipeOffset(0)
  }, [closeCase, swipeOffset])

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        markOverlayClosed()
        emitLensRebuild('case-overlay-exit-complete')
      }}
    >
      {isOpen && story && (
        <motion.div
          key={story.id}
          className="case-overlay-root fixed inset-0 z-[150]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.55, ease: [0.19, 1, 0.22, 1] }}
          onMouseEnter={() => setMode('view')}
          onMouseLeave={reset}
        >
          <motion.div
            className="case-overlay-backdrop absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={handleBackdropClick}
          >
            <div
              className="case-overlay-spotlight absolute inset-0"
              style={
                {
                  '--spot-x': `${spotlight.x}%`,
                  '--spot-y': `${spotlight.y}%`,
                } as CSSProperties
              }
            />
            <div className="case-overlay-grid absolute inset-0" />
          </motion.div>

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`case-overlay-title-${story.id}`}
            layoutId={getCaseShellLayoutId(story.id)}
            className="absolute inset-0 overflow-hidden"
            transition={{
              duration: reducedMotion ? 0.2 : 1.15,
              ease: [0.19, 1, 0.22, 1],
            }}
            style={{ y: swipeOffset }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onLayoutAnimationComplete={() => {
              markOverlayOpened()
              emitLensRebuild('case-overlay-layout-complete')
            }}
            onMouseMove={(event) => {
              const x = (event.clientX / window.innerWidth) * 100
              const y = (event.clientY / window.innerHeight) * 100
              setSpotlight({ x, y })
            }}
          >
            <div className="h-full w-full p-2 md:p-4">
              <div className="h-full overflow-hidden rounded-[30px] border border-white/12 bg-[linear-gradient(150deg,rgba(9,16,30,0.98),rgba(5,9,16,0.98),rgba(11,24,42,0.96))] shadow-[0_40px_90px_rgba(0,0,0,0.55)]">
                <div
                  ref={scrollRef}
                  data-cursor-lens-source="case-overlay-viewport"
                  data-lenis-prevent
                  data-lenis-prevent-wheel
                  className="h-full overflow-y-auto overscroll-contain [scrollbar-gutter:stable]"
                >
                  <div ref={contentRef} className="mx-auto w-full max-w-[1320px] px-5 pb-12 pt-5 md:px-8 md:pt-7">
                    <CaseHero story={story} />

                    <div className="case-overlay-progress-wrap">
                      <div className="case-overlay-progress-track">
                        <div className="case-overlay-progress-fill" style={{ height: `${Math.max(progress * 100, 3)}%` }} />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                      <button
                        ref={closeButtonRef}
                        type="button"
                        className="rounded-full border border-white/24 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.15em] text-slate-100 transition-colors hover:border-blue-200/70 hover:text-white"
                        onClick={() => closeCase()}
                        onMouseEnter={() => setMode('contact')}
                        onMouseLeave={() => setMode('view')}
                      >
                        Закрыть кейс
                      </button>
                    </div>

                    <CaseSections story={story} reducedMotion={reducedMotion} />
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
