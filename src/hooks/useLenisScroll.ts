import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    __portfolioLenis?: Lenis
  }
}

export function useLenisScroll(disabled: boolean) {
  useEffect(() => {
    if (disabled) {
      return undefined
    }

    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
      smoothWheel: true,
      autoRaf: false,
      stopInertiaOnNavigate: true,
    })

    window.__portfolioLenis = lenis
    lenis.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => {
      lenis.scrollTo(0, { immediate: true, force: true })
      window.scrollTo(0, 0)
      ScrollTrigger.refresh()
    }

    window.addEventListener('load', refresh)
    requestAnimationFrame(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(update)
      lenis.destroy()
      delete window.__portfolioLenis
      window.history.scrollRestoration = previousScrollRestoration ?? 'auto'
      ScrollTrigger.refresh()
    }
  }, [disabled])
}
