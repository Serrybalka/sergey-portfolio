import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined
    }

    const media = window.matchMedia(QUERY)

    const sync = () => {
      setReducedMotion(media.matches)
    }

    sync()
    media.addEventListener('change', sync)

    return () => {
      media.removeEventListener('change', sync)
    }
  }, [])

  return reducedMotion
}
