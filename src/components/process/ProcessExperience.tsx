import { useCallback, useEffect, useMemo, useRef, type MouseEvent } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { processChapterById, processChapters } from '../../data/processExperienceData'
import { useCursor } from '../../context/CursorContext'
import { useProcessExperience } from '../../context/ProcessExperienceContext'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { ProcessExperienceId } from '../../types/content'
import { nb } from '../../utils/typography'
import { ProcessExperienceModal } from './ProcessExperienceModal'
import {
  getProcessIndexLayoutId,
  getProcessShellLayoutId,
  getProcessSummaryLayoutId,
  getProcessTitleLayoutId,
} from './layoutIds'

interface ProcessExperienceProps {
  reducedMotion: boolean
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

export function ProcessExperience({ reducedMotion }: ProcessExperienceProps) {
  const { setMode, reset } = useCursor()
  const { activeId, isOpen, openChapter, closeChapter } = useProcessExperience()
  const localReducedMotion = useReducedMotion()
  const motionReduced = reducedMotion || localReducedMotion
  const cardRefs = useRef(new Map<ProcessExperienceId, HTMLButtonElement | null>())
  const lastOpenedRef = useRef<ProcessExperienceId | null>(null)
  const wasOpenRef = useRef(false)

  const activeChapter = useMemo(
    () => (activeId ? processChapterById.get(activeId) ?? null : null),
    [activeId],
  )

  const setCardRef = useCallback((id: ProcessExperienceId, node: HTMLButtonElement | null) => {
    cardRefs.current.set(id, node)
  }, [])

  const handleOpen = useCallback(
    (id: ProcessExperienceId) => {
      lastOpenedRef.current = id
      openChapter(id)
    },
    [openChapter],
  )

  const handleClose = useCallback(() => {
    closeChapter({ updateHash: true, restoreScroll: true })
  }, [closeChapter])

  useEffect(() => {
    if (!isOpen && wasOpenRef.current && lastOpenedRef.current) {
      cardRefs.current.get(lastOpenedRef.current)?.focus()
      setMode('default')
    }

    wasOpenRef.current = isOpen
  }, [isOpen, setMode])

  return (
    <LayoutGroup id="process-experience-layout">
      <motion.div
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        animate={
          isOpen && !motionReduced
            ? { opacity: 0.22, filter: 'blur(7px)' }
            : { opacity: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: motionReduced ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {processChapters.map((chapter) => (
          <motion.button
            key={chapter.id}
            type="button"
            layoutId={getProcessShellLayoutId(chapter.id)}
            data-cursor-card-hover
            aria-haspopup="dialog"
            aria-expanded={activeId === chapter.id}
            className="group relative flex min-h-[20.5rem] flex-col overflow-hidden rounded-3xl border border-white/12 bg-[#0a111d] p-6 text-left transition-transform duration-300 will-change-transform"
            onClick={() => handleOpen(chapter.id)}
            onMouseMove={(event) => applyTilt(event, motionReduced || isOpen)}
            onMouseEnter={() => setMode('view')}
            onMouseLeave={(event) => {
              resetTilt(event)
              reset()
            }}
            whileHover={
              motionReduced || isOpen
                ? undefined
                : {
                    scale: 1.012,
                  }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            ref={(node) => setCardRef(chapter.id, node)}
          >
            <motion.p
              layoutId={getProcessIndexLayoutId(chapter.id)}
              className="mb-3 text-sm uppercase tracking-[0.16em] text-blue-200/85"
            >
              {nb(chapter.index)}
            </motion.p>

            <motion.h3
              layoutId={getProcessTitleLayoutId(chapter.id)}
              className="min-h-[5rem] text-2xl leading-tight font-semibold text-white"
            >
              {nb(chapter.title)}
            </motion.h3>

            <motion.p
              layoutId={getProcessSummaryLayoutId(chapter.id)}
              className="mb-6 mt-3 min-h-[5rem] text-base leading-relaxed text-slate-300/90"
            >
              {nb(chapter.summary)}
            </motion.p>
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl transition-opacity duration-300 group-hover:opacity-100 md:opacity-70" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-blue-300/0 transition-colors group-hover:border-blue-300/35" />
          </motion.button>
        ))}
      </motion.div>

      <ProcessExperienceModal
        chapter={activeChapter}
        isOpen={isOpen}
        reducedMotion={motionReduced}
        onClose={handleClose}
      />
    </LayoutGroup>
  )
}
