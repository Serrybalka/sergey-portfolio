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
import { caseStudies, metrics } from '../data/portfolio'
import type { CaseStudyId, MetricId } from '../types/content'

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

interface ImpactModalState {
  activeMetricId: MetricId | null
  isOpen: boolean
  highlightedCaseId: CaseStudyId | null
  openMetric: (metricId: MetricId) => void
  closeMetric: (options?: { updateHash?: boolean; restoreScroll?: boolean }) => void
  navigateToCase: (caseId: CaseStudyId) => void
  clearHighlightedCase: () => void
}

const ImpactModalContext = createContext<ImpactModalState | null>(null)

const metricIdSet = new Set<MetricId>(metrics.map((metric) => metric.id))
const caseIdSet = new Set<CaseStudyId>(caseStudies.map((caseStudy) => caseStudy.id))

function toMetricId(value: string | null): MetricId | null {
  if (!value || !metricIdSet.has(value as MetricId)) {
    return null
  }

  return value as MetricId
}

function toCaseId(value: string | null): CaseStudyId | null {
  if (!value || !caseIdSet.has(value as CaseStudyId)) {
    return null
  }

  return value as CaseStudyId
}

function readHashState() {
  const hash = window.location.hash

  if (hash.startsWith('#impact/')) {
    return {
      type: 'impact' as const,
      metricId: toMetricId(hash.replace('#impact/', '')),
      caseId: null,
    }
  }

  if (hash.startsWith('#cases/')) {
    return {
      type: 'cases' as const,
      metricId: null,
      caseId: toCaseId(hash.replace('#cases/', '')),
    }
  }

  return {
    type: 'none' as const,
    metricId: null,
    caseId: null,
  }
}

export function ImpactModalProvider({ children }: PropsWithChildren) {
  const [activeMetricId, setActiveMetricId] = useState<MetricId | null>(null)
  const [highlightedCaseId, setHighlightedCaseId] = useState<CaseStudyId | null>(null)
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

  const scrollToCasesSection = useCallback(() => {
    const run = () => {
      const section = document.getElementById('cases')
      if (!section) {
        return
      }

      const lenis = window.__portfolioLenis as LenisLike | undefined

      if (lenis) {
        lenis.start?.()
        lenis.scrollTo('#cases', {
          duration: 0.9,
          lock: false,
        })
        return
      }

      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(run)
    })
  }, [])

  const openMetric = useCallback((metricId: MetricId) => {
    shouldRestoreScrollRef.current = true
    setHighlightedCaseId(null)
    setActiveMetricId(metricId)
    history.pushState(null, '', `#impact/${metricId}`)
  }, [])

  const closeMetric = useCallback((options?: { updateHash?: boolean; restoreScroll?: boolean }) => {
    const shouldUpdateHash = options?.updateHash ?? true
    const shouldRestore = options?.restoreScroll ?? true

    shouldRestoreScrollRef.current = shouldRestore
    setActiveMetricId(null)

    if (shouldUpdateHash) {
      history.pushState(null, '', '#impact')
    }
  }, [])

  const navigateToCase = useCallback(
    (caseId: CaseStudyId) => {
      shouldRestoreScrollRef.current = false
      setActiveMetricId(null)
      setHighlightedCaseId(caseId)
      history.pushState(null, '', `#cases/${caseId}`)
      window.dispatchEvent(new Event('hashchange'))
      scrollToCasesSection()
    },
    [scrollToCasesSection],
  )

  const clearHighlightedCase = useCallback(() => {
    setHighlightedCaseId(null)
  }, [])

  useEffect(() => {
    if (activeMetricId) {
      lockScroll()
      return
    }

    unlockScroll(shouldRestoreScrollRef.current)
  }, [activeMetricId, lockScroll, unlockScroll])

  useEffect(() => {
    const syncWithHash = () => {
      const hashState = readHashState()

      if (hashState.type === 'impact') {
        if (hashState.metricId) {
          shouldRestoreScrollRef.current = true
          setHighlightedCaseId(null)
          setActiveMetricId(hashState.metricId)
          return
        }

        shouldRestoreScrollRef.current = true
        setActiveMetricId(null)
        return
      }

      if (hashState.type === 'cases' && hashState.caseId) {
        shouldRestoreScrollRef.current = false
        setActiveMetricId(null)
        setHighlightedCaseId(hashState.caseId)
        scrollToCasesSection()
        return
      }

      shouldRestoreScrollRef.current = true
      setActiveMetricId(null)
      setHighlightedCaseId(null)
    }

    syncWithHash()
    window.addEventListener('hashchange', syncWithHash)
    window.addEventListener('popstate', syncWithHash)

    return () => {
      window.removeEventListener('hashchange', syncWithHash)
      window.removeEventListener('popstate', syncWithHash)
    }
  }, [scrollToCasesSection])

  useEffect(() => {
    return () => {
      unlockScroll(false)
    }
  }, [unlockScroll])

  const value = useMemo<ImpactModalState>(
    () => ({
      activeMetricId,
      isOpen: Boolean(activeMetricId),
      highlightedCaseId,
      openMetric,
      closeMetric,
      navigateToCase,
      clearHighlightedCase,
    }),
    [activeMetricId, highlightedCaseId, openMetric, closeMetric, navigateToCase, clearHighlightedCase],
  )

  return <ImpactModalContext.Provider value={value}>{children}</ImpactModalContext.Provider>
}

export function useImpactModal() {
  const context = useContext(ImpactModalContext)

  if (!context) {
    throw new Error('useImpactModal must be used inside ImpactModalProvider')
  }

  return context
}
