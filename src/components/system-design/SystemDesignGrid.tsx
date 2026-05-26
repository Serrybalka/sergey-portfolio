import { useCallback, useEffect, useMemo, useRef } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { systemDesignItems } from '../../data/portfolio'
import { useCursor } from '../../context/CursorContext'
import { useSystemDesignModal } from '../../context/SystemDesignModalContext'
import type { SystemDesignId } from '../../types/content'
import { SystemDesignCard } from './SystemDesignCard'
import { SystemDesignOverlay } from './SystemDesignOverlay'

interface SystemDesignGridProps {
  reducedMotion: boolean
}

export function SystemDesignGrid({ reducedMotion }: SystemDesignGridProps) {
  const { setMode } = useCursor()
  const { activeId, isOpen, openCard, closeCard } = useSystemDesignModal()
  const cardRefs = useRef(new Map<SystemDesignId, HTMLButtonElement | null>())
  const lastOpenedRef = useRef<SystemDesignId | null>(null)
  const wasOpenRef = useRef(false)

  const itemById = useMemo(
    () => new Map(systemDesignItems.map((item) => [item.id, item])),
    [],
  )
  const activeItem = activeId ? itemById.get(activeId) ?? null : null

  const setCardRef = useCallback((id: SystemDesignId, node: HTMLButtonElement | null) => {
    cardRefs.current.set(id, node)
  }, [])

  const handleOpen = useCallback(
    (id: SystemDesignId) => {
      lastOpenedRef.current = id
      openCard(id)
    },
    [openCard],
  )

  const handleClose = useCallback(() => {
    closeCard({ updateHash: true, restoreScroll: true })
  }, [closeCard])

  useEffect(() => {
    if (!isOpen && wasOpenRef.current && lastOpenedRef.current) {
      const trigger = cardRefs.current.get(lastOpenedRef.current)
      trigger?.focus()
      setMode('default')
    }

    wasOpenRef.current = isOpen
  }, [isOpen, setMode])

  return (
    <LayoutGroup id="system-design-grid">
      <motion.div
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        animate={
          isOpen && !reducedMotion
            ? { opacity: 0.22, filter: 'blur(7px)' }
            : { opacity: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: reducedMotion ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {systemDesignItems.map((item) => (
          <SystemDesignCard
            key={item.id}
            item={item}
            reducedMotion={reducedMotion}
            isModalOpen={isOpen}
            isActive={activeId === item.id}
            onOpen={handleOpen}
            setCardRef={setCardRef}
          />
        ))}
      </motion.div>

      <SystemDesignOverlay
        item={activeItem}
        isOpen={isOpen}
        reducedMotion={reducedMotion}
        onClose={handleClose}
      />
    </LayoutGroup>
  )
}
