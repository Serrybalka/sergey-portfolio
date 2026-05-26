/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { systemDesignItems } from '../data/portfolio'
import type { SystemDesignId } from '../types/content'

interface LenisLike {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      duration?: number
      lock?: boolean
      immediate?: boolean
      force?: boolean
      onComplete?: () => void
    },
  ) => void
  stop?: () => void
  start?: () => void
}

interface SystemDesignModalState {
  activeId: SystemDesignId | null
  isOpen: boolean
  openCard: (id: SystemDesignId) => void
  closeCard: (options?: { updateHash?: boolean; restoreScroll?: boolean }) => void
}

const SystemDesignModalContext = createContext<SystemDesignModalState | null>(null)

const cardIdSet = new Set<SystemDesignId>(systemDesignItems.map((item) => item.id))

function toSystemDesignId(value: string | null): SystemDesignId | null {
  if (!value || !cardIdSet.has(value as SystemDesignId)) {
    return null
  }

  return value as SystemDesignId
}

function readHashState() {
  const hash = window.location.hash

  if (hash.startsWith('#expertise/')) {
    return {
      type: 'overlay' as const,
      id: toSystemDesignId(hash.replace('#expertise/', '')),
    }
  }

  if (hash === '#expertise') {
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

export function SystemDesignModalProvider({ children }: PropsWithChildren) {
  const [activeId, setActiveId] = useState<SystemDesignId | null>(null)
  const savedScrollRef = useRef(0)
  const isLockedRef = useRef(false)
  const shouldRestoreScrollRef = useRef(true)

  const lockScroll = useCallback(() => {
    if (isLockedRef.current) {
      return
    }

    const lenis = window.__portfolioLenis as LenisLike | undefined
    savedScrollRef.current = window.scrollY
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    lenis?.stop?.()
    isLockedRef.current = true
  }, [])

  const unlockScroll = useCallback((restoreScroll: boolean) => {
    if (!isLockedRef.current) {
      return
    }

    document.body.style.overflow = ''
    document.body.style.touchAction = ''
    document.body.style.paddingRight = ''

    const lenis = window.__portfolioLenis as LenisLike | undefined
    lenis?.start?.()

    if (restoreScroll) {
      window.scrollTo({ top: savedScrollRef.current, left: 0, behavior: 'auto' })
    }

    isLockedRef.current = false
  }, [])

  const openCard = useCallback((id: SystemDesignId) => {
    shouldRestoreScrollRef.current = true
    setActiveId(id)
    history.pushState(null, '', `#expertise/${id}`)
  }, [])

  const closeCard = useCallback((options?: { updateHash?: boolean; restoreScroll?: boolean }) => {
    const shouldUpdateHash = options?.updateHash ?? true
    const shouldRestore = options?.restoreScroll ?? true

    shouldRestoreScrollRef.current = shouldRestore
    setActiveId(null)

    if (shouldUpdateHash) {
      history.pushState(null, '', '#expertise')
    }
  }, [])

  useEffect(() => {
    if (activeId) {
      lockScroll()
      return
    }

    unlockScroll(shouldRestoreScrollRef.current)
  }, [activeId, lockScroll, unlockScroll])

  useEffect(() => {
    const syncWithHash = () => {
      const hashState = readHashState()

      if (hashState.type === 'overlay' && hashState.id) {
        shouldRestoreScrollRef.current = true
        setActiveId(hashState.id)
        return
      }

      shouldRestoreScrollRef.current = true
      setActiveId(null)
    }

    syncWithHash()
    window.addEventListener('hashchange', syncWithHash)
    window.addEventListener('popstate', syncWithHash)

    return () => {
      window.removeEventListener('hashchange', syncWithHash)
      window.removeEventListener('popstate', syncWithHash)
    }
  }, [])

  useEffect(() => {
    return () => {
      unlockScroll(false)
    }
  }, [unlockScroll])

  const value = useMemo<SystemDesignModalState>(
    () => ({
      activeId,
      isOpen: Boolean(activeId),
      openCard,
      closeCard,
    }),
    [activeId, openCard, closeCard],
  )

  return <SystemDesignModalContext.Provider value={value}>{children}</SystemDesignModalContext.Provider>
}

export function useSystemDesignModal() {
  const context = useContext(SystemDesignModalContext)

  if (!context) {
    throw new Error('useSystemDesignModal must be used inside SystemDesignModalProvider')
  }

  return context
}
