import type { MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { useCursor } from '../../context/CursorContext'
import { nb } from '../../utils/typography'
import type { SystemDesignId, SystemDesignItem } from '../../types/content'

interface SystemDesignCardProps {
  item: SystemDesignItem
  reducedMotion: boolean
  isModalOpen: boolean
  isActive: boolean
  onOpen: (id: SystemDesignId) => void
  setCardRef: (id: SystemDesignId, node: HTMLButtonElement | null) => void
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

export function getShellLayoutId(id: SystemDesignId) {
  return `system-design-shell-${id}`
}

export function getIndexLayoutId(id: SystemDesignId) {
  return `system-design-index-${id}`
}

export function getTitleLayoutId(id: SystemDesignId) {
  return `system-design-title-${id}`
}

export function getSummaryLayoutId(id: SystemDesignId) {
  return `system-design-summary-${id}`
}

export function getTagLayoutId(id: SystemDesignId, tagIndex: number) {
  return `system-design-tag-${id}-${tagIndex}`
}

export function SystemDesignCard({
  item,
  reducedMotion,
  isModalOpen,
  isActive,
  onOpen,
  setCardRef,
}: SystemDesignCardProps) {
  const { setMode, reset } = useCursor()

  return (
    <motion.button
      type="button"
      layoutId={getShellLayoutId(item.id)}
      data-cursor-card-hover
      className="system-design-card group relative flex min-h-[20.5rem] flex-col overflow-hidden rounded-3xl border border-white/12 bg-[#0a111d] p-6 text-left transition-transform duration-300 will-change-transform"
      aria-haspopup="dialog"
      aria-expanded={isActive}
      onClick={() => onOpen(item.id)}
      onMouseMove={(event) => applyTilt(event, reducedMotion || isModalOpen)}
      onMouseEnter={() => setMode('view')}
      onMouseLeave={(event) => {
        resetTilt(event)
        reset()
      }}
      whileHover={
        reducedMotion || isModalOpen
          ? undefined
          : {
              scale: 1.012,
            }
      }
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      ref={(node) => setCardRef(item.id, node)}
    >
      <motion.p
        layoutId={getIndexLayoutId(item.id)}
        className="mb-3 text-sm uppercase tracking-[0.16em] text-blue-200/85"
      >
        {item.index}
      </motion.p>

      <motion.h3
        layoutId={getTitleLayoutId(item.id)}
        className="min-h-[5rem] text-2xl leading-tight font-semibold text-white"
      >
        {nb(item.cardTitle)}
      </motion.h3>

      <motion.p
        layoutId={getSummaryLayoutId(item.id)}
        className="mb-6 mt-3 min-h-[5rem] text-base leading-relaxed text-slate-300/90"
      >
        {nb(item.cardSummary)}
      </motion.p>

      <div className="mt-auto flex flex-wrap gap-2">
        {item.tags.map((tag, index) => (
          <motion.span
            key={tag}
            layoutId={getTagLayoutId(item.id, index)}
            className="rounded-full border border-white/16 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300"
          >
            {nb(tag)}
          </motion.span>
        ))}
      </div>

      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl transition-opacity duration-300 group-hover:opacity-100 md:opacity-70" />
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-blue-300/0 transition-colors group-hover:border-blue-300/35" />
    </motion.button>
  )
}
