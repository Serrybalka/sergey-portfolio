import { useEffect, useLayoutEffect, useRef, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { useCursor } from '../../context/CursorContext'
import { nb } from '../../utils/typography'
import type { SystemDesignItem } from '../../types/content'
import {
  getIndexLayoutId,
  getShellLayoutId,
  getSummaryLayoutId,
  getTagLayoutId,
  getTitleLayoutId,
} from './SystemDesignCard'

interface SystemDesignOverlayProps {
  item: SystemDesignItem | null
  isOpen: boolean
  reducedMotion: boolean
  onClose: () => void
}

const LENS_REBUILD_EVENT = 'cursor-lens-rebuild'

function emitLensRebuild(reason: string) {
  window.dispatchEvent(new CustomEvent(LENS_REBUILD_EVENT, { detail: { reason } }))
}

export function SystemDesignOverlay({
  item,
  isOpen,
  reducedMotion,
  onClose,
}: SystemDesignOverlayProps) {
  const { setMode, reset } = useCursor()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    emitLensRebuild(isOpen ? 'system-design-modal-open' : 'system-design-modal-close')

    const rafA = requestAnimationFrame(() => emitLensRebuild('system-design-modal-raf-1'))
    const rafB = requestAnimationFrame(() => emitLensRebuild('system-design-modal-raf-2'))
    const timeout = window.setTimeout(() => emitLensRebuild('system-design-modal-post-layout'), 420)

    return () => {
      cancelAnimationFrame(rafA)
      cancelAnimationFrame(rafB)
      window.clearTimeout(timeout)
    }
  }, [isOpen, item?.id])

  useEffect(() => {
    if (!isOpen || !dialogRef.current) {
      return undefined
    }

    const dialog = dialogRef.current
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [isOpen, onClose])

  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current || reducedMotion) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-system-stagger]',
        { opacity: 0, y: 20, filter: 'blur(7px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.86,
          stagger: 0.08,
          ease: 'power3.out',
        },
      )
    }, contentRef)

    return () => {
      ctx.revert()
    }
  }, [isOpen, reducedMotion])

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return
    }

    onClose()
  }

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          key={item.id}
          className="system-design-overlay-root fixed inset-0 z-[145]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setMode('view')}
          onMouseLeave={reset}
        >
          <motion.div
            className="system-design-overlay-backdrop absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              className="system-design-overlay-gradient absolute inset-0"
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
            aria-labelledby={`system-design-title-${item.id}`}
            layoutId={getShellLayoutId(item.id)}
            className="system-design-overlay-panel absolute inset-0 overflow-y-auto"
            transition={{
              type: 'spring',
              stiffness: reducedMotion ? 380 : 240,
              damping: reducedMotion ? 42 : 30,
              mass: 0.84,
            }}
            onLayoutAnimationComplete={() => {
              emitLensRebuild('system-design-layout-complete')
            }}
          >
            <div
              data-cursor-lens-source="system-design-modal-viewport"
              className="mx-auto flex min-h-full w-full max-w-[1260px] flex-col px-5 py-6 md:px-10 md:py-8"
            >
              <header className="system-design-overlay-header sticky top-0 z-10 mb-7 rounded-3xl border border-white/12 bg-[#091121]/90 px-5 py-4 backdrop-blur-xl md:px-6">
                <div className="flex items-start justify-between gap-4">
                  <motion.p
                    layoutId={getIndexLayoutId(item.id)}
                    className="text-xs uppercase tracking-[0.2em] text-blue-100/80"
                  >
                    {item.index}
                  </motion.p>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    className="rounded-full border border-white/22 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.15em] text-slate-100 transition-colors hover:border-blue-200/60 hover:text-white"
                    onClick={onClose}
                    onMouseEnter={() => setMode('contact')}
                    onMouseLeave={() => setMode('view')}
                  >
                    Закрыть
                  </button>
                </div>
                <motion.h2
                  id={`system-design-title-${item.id}`}
                  layoutId={getTitleLayoutId(item.id)}
                  className="mt-3 text-4xl font-semibold leading-tight text-white md:text-6xl"
                >
                  {nb(item.cardTitle)}
                </motion.h2>
                <motion.p
                  layoutId={getSummaryLayoutId(item.id)}
                  className="mt-3 max-w-4xl text-lg leading-relaxed text-slate-300/92 md:text-2xl"
                >
                  {nb(item.cardSummary)}
                </motion.p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <motion.span
                      key={tag}
                      layoutId={getTagLayoutId(item.id, tagIndex)}
                      className="rounded-full border border-blue-300/35 bg-blue-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-blue-100"
                    >
                      {nb(tag)}
                    </motion.span>
                  ))}
                </div>
              </header>

              <div ref={contentRef} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <article className="rounded-3xl border border-white/12 bg-[#081020]/92 p-6 md:p-8">
                  <p className="mb-6 text-base leading-relaxed text-slate-300/85">{nb(item.narrative.subtitle)}</p>

                  <section data-system-stagger className="mb-6">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Context</p>
                    <p className="mt-2 text-base leading-relaxed text-slate-200/90">{nb(item.narrative.context)}</p>
                  </section>

                  <section data-system-stagger className="mb-6">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Challenge</p>
                    <p className="mt-2 text-base leading-relaxed text-slate-200/90">{nb(item.narrative.challenge)}</p>
                  </section>

                  <section data-system-stagger className="mb-6">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Process</p>
                    <ol className="mt-2 space-y-2 text-base leading-relaxed text-slate-200/90">
                      {item.narrative.process.map((step) => (
                        <li key={step} className="flex gap-3">
                          <span className="mt-1 text-blue-300">→</span>
                          <span>{nb(step)}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section data-system-stagger className="mb-6">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Solution</p>
                    <p className="mt-2 text-base leading-relaxed text-slate-200/90">{nb(item.narrative.solution)}</p>
                  </section>

                  <section data-system-stagger>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Impact</p>
                    <p className="mt-2 text-lg leading-relaxed text-slate-100">{nb(item.narrative.impact)}</p>
                  </section>
                </article>

                <aside className="space-y-5">
                  <section data-system-stagger className="rounded-3xl border border-white/12 bg-[#0a1324]/90 p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Product signals</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.narrative.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/16 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.13em] text-slate-200"
                        >
                          {nb(tag)}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section data-system-stagger className="rounded-3xl border border-white/12 bg-[#0a1324]/90 p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Storyline</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200/90">
                      <li className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">{nb('Context -> Challenge')}</li>
                      <li className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">{nb('Process -> Solution')}</li>
                      <li className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">{nb('Impact -> Product value')}</li>
                    </ul>
                  </section>
                </aside>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
