import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { nb } from '../../utils/typography'

interface CountUpProps {
  value: number
  prefix?: string
  suffix?: string
}

export function CountUp({ value, prefix = '', suffix = '' }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' })

  useEffect(() => {
    if (!isInView) {
      return undefined
    }

    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest))
      },
    })

    return () => {
      controls.stop()
    }
  }, [isInView, value])

  const formattedValue = nb(`${prefix}${displayValue}${suffix}`)

  return <span ref={ref}>{formattedValue}</span>
}