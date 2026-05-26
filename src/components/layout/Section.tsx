import type { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { nb } from '../../utils/typography'

interface SectionProps extends PropsWithChildren {
  id: string
  className?: string
  title?: string
  subtitle?: string
}

export function Section({ id, className, title, subtitle, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={cn('relative mx-auto w-full max-w-[1240px] px-5 py-24 md:px-10 md:py-32', className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-mask-reveal
    >
      {(title || subtitle) && (
        <header className="mb-14 space-y-4">
          {subtitle && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-200/70">{nb(subtitle)}</p>
          )}
          {title && (
            <h2 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">{nb(title)}</h2>
          )}
        </header>
      )}
      {children}
    </motion.section>
  )
}