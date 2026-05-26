import { Section } from '../layout/Section'
import { SystemDesignGrid } from '../system-design/SystemDesignGrid'

interface ExpertiseSectionProps {
  reducedMotion: boolean
}

export function ExpertiseSection({ reducedMotion }: ExpertiseSectionProps) {
  return (
    <Section
      id="expertise"
      subtitle="Expertise"
      title="Системный дизайн для сложной продуктовой архитектуры"
    >
      <SystemDesignGrid reducedMotion={reducedMotion} />
    </Section>
  )
}

