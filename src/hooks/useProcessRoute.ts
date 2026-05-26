import { useEffect } from 'react'

export function useProcessRoute(openFromHash: () => void) {
  useEffect(() => {
    openFromHash()

    const sync = () => {
      openFromHash()
    }

    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)

    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [openFromHash])
}
