import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { cn } from '../../utils/cn'
import { nb } from '../../utils/typography'

interface WordRevealProps {
  text: string
  className?: string
}

export function WordReveal({ text, className }: WordRevealProps) {
  const words = useMemo(() => nb(text).split(' '), [text])

  return (
    <span className={cn('inline-flex flex-wrap justify-center', className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="mr-[0.35em] inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: index * 0.035,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
