import { useCallback, useRef, type MouseEvent } from 'react'

interface MagneticStyle {
  transform: string
}

export function useMagnetic(intensity = 22) {
  const styleRef = useRef<MagneticStyle>({ transform: 'translate3d(0px, 0px, 0px)' })

  const onMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const element = event.currentTarget
      const rect = element.getBoundingClientRect()
      const offsetX = event.clientX - rect.left - rect.width / 2
      const offsetY = event.clientY - rect.top - rect.height / 2

      styleRef.current.transform = `translate3d(${(offsetX / rect.width) * intensity}px, ${(offsetY / rect.height) * intensity}px, 0)`
      element.style.transform = styleRef.current.transform
    },
    [intensity],
  )

  const onLeave = useCallback((event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.transform = 'translate3d(0px, 0px, 0px)'
  }, [])

  return { onMove, onLeave }
}
