import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSectionMotion(disabled: boolean) {
  useEffect(() => {
    if (disabled) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-mask-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          {
            clipPath: 'inset(0 0 100% 0 round 24px)',
            opacity: 0,
          },
          {
            clipPath: 'inset(0 0 0% 0 round 24px)',
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              once: true,
            },
          },
        )
      })
    })

    return () => {
      ctx.revert()
    }
  }, [disabled])
}
