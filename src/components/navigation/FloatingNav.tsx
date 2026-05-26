import { useEffect, useState, type MouseEvent } from 'react'
import { navItems } from '../../data/portfolio'
import { useCaseExperience } from '../../context/CaseExperienceContext'
import { useCursor } from '../../context/CursorContext'
import { useProcessExperience } from '../../context/ProcessExperienceContext'
import { nb } from '../../utils/typography'

const LENS_REBUILD_EVENT = 'cursor-lens-rebuild'

interface LenisLike {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      duration?: number
      lock?: boolean
      immediate?: boolean
      onComplete?: () => void
    },
  ) => void
}

export function FloatingNav() {
  const [activeId, setActiveId] = useState('hero')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { setMode, reset } = useCursor()
  const { isOpen: isCaseOpen } = useCaseExperience()
  const { isOpen: isProcessOpen } = useProcessExperience()
  const shouldHideNav = isCaseOpen || isProcessOpen
  const thirdSectionId = navItems[2]?.id ?? 'expertise'

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(LENS_REBUILD_EVENT, { detail: { reason: 'floating-nav-state' } }))
  }, [activeId, showBackToTop, shouldHideNav])

  useEffect(() => {
    const observers = navItems.map((item) => {
      const section = document.getElementById(item.id)

      if (!section) {
        return null
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(item.id)
            }
          })
        },
        { threshold: 0.45 },
      )

      observer.observe(section)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  useEffect(() => {
    const thirdSection = document.getElementById(thirdSectionId)

    if (!thirdSection) {
      return undefined
    }

    let rafId = 0

    const updateVisibility = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const threshold = Math.max(thirdSection.offsetTop - window.innerHeight * 0.45, 0)
        setShowBackToTop(window.scrollY >= threshold)
      })
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [thirdSectionId])

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()

    const lenis = window.__portfolioLenis as LenisLike | undefined

    const finalize = () => {
      if (id === 'hero') {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      } else {
        history.replaceState(null, '', `#${id}`)
      }
    }

    if (!lenis) {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        finalize()
        return
      }

      const targetElement = document.getElementById(id)
      targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      finalize()
      return
    }

    if (id === 'hero') {
      lenis.scrollTo(0, {
        duration: 0.9,
        lock: false,
        onComplete: finalize,
      })
      return
    }

    lenis.scrollTo(`#${id}`, {
      duration: 0.9,
      lock: false,
      onComplete: finalize,
    })
  }

  return (
    <>
      <button
        type="button"
        aria-label="Наверх"
        aria-hidden={shouldHideNav}
        className={`fixed bottom-6 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-blue-300/40 bg-[#0b1423]/85 text-xl text-blue-100 shadow-[0_18px_42px_rgba(8,20,40,0.45)] backdrop-blur-md transition-all duration-500 md:bottom-24 md:right-8 ${
          showBackToTop ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-4 scale-95 opacity-0'
        } ${shouldHideNav ? 'pointer-events-none opacity-0' : ''}`}
        onClick={() => {
          const lenis = window.__portfolioLenis as LenisLike | undefined

          if (!lenis) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
            return
          }

          lenis.scrollTo(0, {
            duration: 0.9,
            lock: false,
            onComplete: () => {
              history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
            },
          })
        }}
        onMouseEnter={() => setMode('contact')}
        onMouseLeave={reset}
      >
        <span aria-hidden="true">↑</span>
      </button>

      <nav
        data-floating-nav
        aria-hidden={shouldHideNav}
        className={`fixed bottom-5 left-1/2 z-50 hidden -translate-x-1/2 rounded-full border border-white/10 bg-[#090d15]/90 p-2 backdrop-blur-md transition-opacity duration-300 md:flex ${shouldHideNav ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        onMouseEnter={() => {
          window.dispatchEvent(new CustomEvent(LENS_REBUILD_EVENT, { detail: { reason: 'floating-nav-enter' } }))
        }}
        onMouseLeave={() => {
          window.dispatchEvent(new CustomEvent(LENS_REBUILD_EVENT, { detail: { reason: 'floating-nav-leave' } }))
        }}
      >
        {navItems.map((item) => {
          const isActive = item.id === activeId

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                isActive ? 'bg-blue-500/20 text-blue-100' : 'text-slate-300 hover:text-white'
              }`}
              onClick={(event) => handleNavClick(event, item.id)}
              onMouseEnter={() => setMode('view')}
              onMouseLeave={reset}
            >
              {nb(item.label)}
            </a>
          )
        })}
      </nav>
    </>
  )
}
