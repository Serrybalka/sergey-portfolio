import { useEffect, useRef } from 'react'

interface LenisLike {
  stop?: () => void
  start?: () => void
}

interface LockBodyScrollOptions {
  restoreOnUnlock?: boolean
}

export function useLockBodyScroll(
  isLocked: boolean,
  options: LockBodyScrollOptions = {},
) {
  const { restoreOnUnlock = true } = options
  const restoreOnUnlockRef = useRef(restoreOnUnlock)
  const isAppliedRef = useRef(false)
  const savedScrollRef = useRef(0)

  useEffect(() => {
    restoreOnUnlockRef.current = restoreOnUnlock
  }, [restoreOnUnlock])

  useEffect(() => {
    const lenis = window.__portfolioLenis as LenisLike | undefined

    if (isLocked && !isAppliedRef.current) {
      savedScrollRef.current = window.scrollY
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }

      lenis?.stop?.()
      isAppliedRef.current = true
      return
    }

    if (!isLocked && isAppliedRef.current) {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.body.style.paddingRight = ''

      lenis?.start?.()

      if (restoreOnUnlockRef.current) {
        window.scrollTo({ top: savedScrollRef.current, left: 0, behavior: 'auto' })
      }

      isAppliedRef.current = false
    }
  }, [isLocked])

  useEffect(
    () => () => {
      if (!isAppliedRef.current) {
        return
      }

      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.body.style.paddingRight = ''

      const lenis = window.__portfolioLenis as LenisLike | undefined
      lenis?.start?.()
      isAppliedRef.current = false
    },
    [],
  )
}
