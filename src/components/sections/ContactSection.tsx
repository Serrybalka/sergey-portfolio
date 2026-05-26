import { contactLinks } from '../../data/portfolio'
import { nb } from '../../utils/typography'
import { MagneticButton } from '../common/MagneticButton'
import { Section } from '../layout/Section'

export function ContactSection() {
  return (
    <Section id="contact" subtitle="Contact" title="Давайте проектировать продукты, которые масштабируются.">
      <div className="rounded-3xl border border-blue-300/25 bg-gradient-to-br from-blue-500/12 via-[#0a1220] to-[#050911] p-8 md:p-10">
        <p className="mb-7 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
          {nb(
            'Если вам нужен Lead Designer для сложного продукта, дизайн-системы или конверсионной пересборки, напишите в удобный канал и обсудим контекст задачи.',
          )}
        </p>

        <div className="mb-8 flex flex-wrap gap-3">
          {contactLinks.map((link) => (
            <MagneticButton key={link.id} href={link.href} label={nb(link.label)} tone={link.id === 'mail' ? 'solid' : 'ghost'} />
          ))}
        </div>

        <a
          href="mailto:serrybalka@gmail.com"
          className="inline-block text-sm uppercase tracking-[0.16em] text-blue-100 hover:text-white"
        >
          serrybalka@gmail.com
        </a>
      </div>
    </Section>
  )
}