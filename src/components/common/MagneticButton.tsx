import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { useCursor } from '../../context/CursorContext'
import { useMagnetic } from '../../hooks/useMagnetic'
import { cn } from '../../utils/cn'
import { nb } from '../../utils/typography'

interface MagneticButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string
  tone?: 'solid' | 'ghost'
}

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

export const MagneticButton = forwardRef<HTMLAnchorElement, MagneticButtonProps>(
  ({ label, className, tone = 'solid', onClick, href, ...props }, ref) => {
    const { setMode, reset } = useCursor()
    const { onMove, onLeave } = useMagnetic(26)

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)

      if (event.defaultPrevented || typeof href !== 'string' || !href.startsWith('#')) {
        return
      }

      event.preventDefault()

      const targetId = href.slice(1)
      const lenis = window.__portfolioLenis as LenisLike | undefined

      const finalize = () => {
        if (!targetId || targetId === 'hero') {
          history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
        } else {
          history.replaceState(null, '', `#${targetId}`)
        }
      }

      if (!lenis) {
        if (!targetId || targetId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          finalize()
          return
        }

        const targetElement = document.getElementById(targetId)
        targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        finalize()
        return
      }

      if (!targetId || targetId === 'hero') {
        lenis.scrollTo(0, { duration: 0.9, lock: false, onComplete: finalize })
        return
      }

      lenis.scrollTo(`#${targetId}`, { duration: 0.9, lock: false, onComplete: finalize })
    }

    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'magnetic-btn group relative inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
          tone === 'solid'
            ? 'border-blue-400/60 bg-blue-500/12 text-blue-100 hover:border-blue-300 hover:bg-blue-500/22 focus-visible:ring-blue-300'
            : 'border-white/25 bg-white/5 text-slate-100 hover:border-white/45 hover:bg-white/10 focus-visible:ring-white',
          className,
        )}
        onMouseMove={onMove}
        onMouseEnter={() => setMode('contact')}
        onMouseLeave={(event) => {
          onLeave(event)
          reset()
        }}
        onClick={handleClick}
        {...props}
      >
        <span className="transition-transform duration-300 group-hover:translate-x-1">{nb(label)}</span>
        <span className="text-xs text-blue-200/80">{'>'}</span>
      </a>
    )
  },
)

MagneticButton.displayName = 'MagneticButton'