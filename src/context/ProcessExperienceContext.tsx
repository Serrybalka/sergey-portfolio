/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { processChapterById, processChapterIdSet } from '../data/processExperienceData'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useProcessRoute } from '../hooks/useProcessRoute'
import type { ProcessExperienceId } from '../types/content'

interface OpenChapterOptions {
  updateHash?: boolean
  useReplace?: boolean
}

interface CloseChapterOptions {
  updateHash?: boolean
  restoreScroll?: boolean
  useReplace?: boolean
}

interface ProcessExperienceState {
  activeId: ProcessExperienceId | null
  isOpen: boolean
  openChapter: (id: ProcessExperienceId, options?: OpenChapterOptions) => void
  closeChapter: (options?: CloseChapterOptions) => void
  openFromHash: () => void
}

const ProcessExperienceContext = createContext<ProcessExperienceState | null>(null)

function toProcessId(value: string | null): ProcessExperienceId | null {
  if (!value || !processChapterIdSet.has(value as ProcessExperienceId)) {
    return null
  }

  return value as ProcessExperienceId
}

function readProcessHash() {
  const hash = window.location.hash

  if (hash.startsWith('#process/')) {
    return {
      type: 'chapter' as const,
      id: toProcessId(hash.replace('#process/', '')),
    }
  }

  if (hash === '#process') {
    return {
      type: 'section' as const,
      id: null,
    }
  }

  return {
    type: 'none' as const,
    id: null,
  }
}

export function ProcessExperienceProvider({ children }: PropsWithChildren) {
  const [activeId, setActiveId] = useState<ProcessExperienceId | null>(null)
  const [restoreScrollOnUnlock, setRestoreScrollOnUnlock] = useState(true)

  useLockBodyScroll(Boolean(activeId), { restoreOnUnlock: restoreScrollOnUnlock })

  const openChapter = useCallback(
    (id: ProcessExperienceId, options?: OpenChapterOptions) => {
      if (!processChapterById.has(id)) {
        return
      }

      const shouldUpdateHash = options?.updateHash ?? true
      const useReplace = options?.useReplace ?? false

      setRestoreScrollOnUnlock(true)
      setActiveId(id)

      if (!shouldUpdateHash) {
        return
      }

      const nextHash = `#process/${id}`
      if (useReplace) {
        history.replaceState(null, '', nextHash)
      } else {
        history.pushState(null, '', nextHash)
      }
    },
    [],
  )

  const closeChapter = useCallback((options?: CloseChapterOptions) => {
    const shouldUpdateHash = options?.updateHash ?? true
    const restoreScroll = options?.restoreScroll ?? true
    const useReplace = options?.useReplace ?? false

    setRestoreScrollOnUnlock(restoreScroll)
    setActiveId(null)

    if (!shouldUpdateHash) {
      return
    }

    if (useReplace) {
      history.replaceState(null, '', '#process')
    } else {
      history.pushState(null, '', '#process')
    }
  }, [])

  const openFromHash = useCallback(() => {
    const hashState = readProcessHash()

    if (hashState.type === 'chapter' && hashState.id) {
      setRestoreScrollOnUnlock(true)
      setActiveId((current) => (current === hashState.id ? current : hashState.id))
      return
    }

    if (hashState.type === 'chapter' && !hashState.id) {
      history.replaceState(null, '', '#process')
      setRestoreScrollOnUnlock(true)
      setActiveId(null)
      return
    }

    if (hashState.type === 'section' && activeId) {
      setRestoreScrollOnUnlock(true)
      setActiveId(null)
      return
    }

    if (hashState.type === 'none' && activeId) {
      setRestoreScrollOnUnlock(true)
      setActiveId(null)
    }
  }, [activeId])

  useProcessRoute(openFromHash)

  const value = useMemo<ProcessExperienceState>(
    () => ({
      activeId,
      isOpen: Boolean(activeId),
      openChapter,
      closeChapter,
      openFromHash,
    }),
    [activeId, openChapter, closeChapter, openFromHash],
  )

  return (
    <ProcessExperienceContext.Provider value={value}>
      {children}
    </ProcessExperienceContext.Provider>
  )
}

export function useProcessExperience() {
  const context = useContext(ProcessExperienceContext)

  if (!context) {
    throw new Error('useProcessExperience must be used inside ProcessExperienceProvider')
  }

  return context
}
