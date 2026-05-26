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
import { caseStoryById, caseStoryByRoute } from '../data/cases'
import type { CaseRouteSlug, CaseStudyId } from '../types/content'

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

type OverlayPhase = 'closed' | 'opening' | 'open' | 'closing'

interface OpenCaseOptions {
  updateHash?: boolean
  useReplace?: boolean
}

interface CloseCaseOptions {
  updateHash?: boolean
  restoreScroll?: boolean
  useReplace?: boolean
}

interface CaseExperienceState {
  activeCaseId: CaseStudyId | null
  activeRoute: CaseRouteSlug | null
  isOpen: boolean
  overlayPhase: OverlayPhase
  openCase: (caseId: CaseStudyId, options?: OpenCaseOptions) => void
  closeCase: (options?: CloseCaseOptions) => void
  openFromHash: () => void
  markOverlayOpened: () => void
  markOverlayClosed: () => void
}

const CaseExperienceContext = createContext<CaseExperienceState | null>(null)

function readHashCase() {
  const hash = window.location.hash

  if (hash.startsWith('#case/')) {
    const routeValue = hash.replace('#case/', '') as CaseRouteSlug
    const story = caseStoryByRoute.get(routeValue)
    if (!story) {
      return { id: null as CaseStudyId | null, route: null as CaseRouteSlug | null, legacy: false }
    }

    return { id: story.id, route: story.route, legacy: false }
  }

  if (hash.startsWith('#cases/')) {
    const rawId = hash.replace('#cases/', '')
    const storyById = caseStoryById.get(rawId as CaseStudyId)
    const storyByRoute = caseStoryByRoute.get(rawId as CaseRouteSlug)
    const story = storyById ?? storyByRoute
    if (!story) {
      return { id: null as CaseStudyId | null, route: null as CaseRouteSlug | null, legacy: true }
    }

    return { id: story.id, route: story.route, legacy: true }
  }

  return { id: null as CaseStudyId | null, route: null as CaseRouteSlug | null, legacy: false }
}

export function CaseExperienceProvider({ children }: PropsWithChildren) {
  const [activeCaseId, setActiveCaseId] = useState<CaseStudyId | null>(null)
  const [activeRoute, setActiveRoute] = useState<CaseRouteSlug | null>(null)
  const [overlayPhase, setOverlayPhase] = useState<OverlayPhase>('closed')
  const savedScrollRef = useRef(0)
  const isLockedRef = useRef(false)
  const shouldRestoreScrollRef = useRef(true)
  const syncingFromHashRef = useRef(false)

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

  const openCase = useCallback(
    (caseId: CaseStudyId, options?: OpenCaseOptions) => {
      const story = caseStoryById.get(caseId)
      if (!story) {
        return
      }

      const shouldUpdateHash = options?.updateHash ?? true
      const useReplace = options?.useReplace ?? false

      setActiveCaseId(caseId)
      setActiveRoute(story.route)
      setOverlayPhase('opening')
      shouldRestoreScrollRef.current = true

      if (!shouldUpdateHash) {
        return
      }

      const nextHash = `#case/${story.route}`
      if (useReplace) {
        history.replaceState(null, '', nextHash)
      } else {
        history.pushState(null, '', nextHash)
      }
    },
    [],
  )

  const closeCase = useCallback(
    (options?: CloseCaseOptions) => {
      const shouldUpdateHash = options?.updateHash ?? true
      const shouldRestore = options?.restoreScroll ?? true
      const useReplace = options?.useReplace ?? false

      shouldRestoreScrollRef.current = shouldRestore
      setOverlayPhase('closing')
      setActiveCaseId(null)
      setActiveRoute(null)

      if (!shouldUpdateHash) {
        return
      }

      if (useReplace) {
        history.replaceState(null, '', '#cases')
      } else {
        history.pushState(null, '', '#cases')
      }
    },
    [],
  )

  const openFromHash = useCallback(() => {
    const { id, legacy } = readHashCase()

    if (!id) {
      if (activeCaseId) {
        closeCase({ updateHash: false, restoreScroll: true })
      }
      return
    }

    syncingFromHashRef.current = true
    openCase(id, { updateHash: false })
    syncingFromHashRef.current = false

    if (legacy) {
      const mapped = caseStoryById.get(id)
      if (mapped) {
        history.replaceState(null, '', `#case/${mapped.route}`)
      }
    }
  }, [activeCaseId, closeCase, openCase])

  const markOverlayOpened = useCallback(() => {
    setOverlayPhase('open')
  }, [])

  const markOverlayClosed = useCallback(() => {
    setOverlayPhase('closed')
  }, [])

  useEffect(() => {
    if (activeCaseId) {
      lockScroll()
      return
    }

    unlockScroll(shouldRestoreScrollRef.current)
  }, [activeCaseId, lockScroll, unlockScroll])

  useEffect(() => {
    openFromHash()

    const handleHashSync = () => {
      openFromHash()
    }

    window.addEventListener('hashchange', handleHashSync)
    window.addEventListener('popstate', handleHashSync)

    return () => {
      window.removeEventListener('hashchange', handleHashSync)
      window.removeEventListener('popstate', handleHashSync)
    }
  }, [openFromHash])

  useEffect(() => {
    if (!syncingFromHashRef.current && !activeCaseId && overlayPhase === 'closing') {
      const timeoutId = window.setTimeout(() => {
        setOverlayPhase('closed')
      }, 30)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }

    return undefined
  }, [activeCaseId, overlayPhase])

  useEffect(() => {
    return () => {
      unlockScroll(false)
    }
  }, [unlockScroll])

  const value = useMemo<CaseExperienceState>(
    () => ({
      activeCaseId,
      activeRoute,
      isOpen: Boolean(activeCaseId),
      overlayPhase,
      openCase,
      closeCase,
      openFromHash,
      markOverlayOpened,
      markOverlayClosed,
    }),
    [
      activeCaseId,
      activeRoute,
      overlayPhase,
      openCase,
      closeCase,
      openFromHash,
      markOverlayOpened,
      markOverlayClosed,
    ],
  )

  return <CaseExperienceContext.Provider value={value}>{children}</CaseExperienceContext.Provider>
}

export function useCaseExperience() {
  const context = useContext(CaseExperienceContext)

  if (!context) {
    throw new Error('useCaseExperience must be used inside CaseExperienceProvider')
  }

  return context
}
