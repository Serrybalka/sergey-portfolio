import { Section } from '../layout/Section'
import { CaseOverlay } from '../cases/CaseOverlay'
import { CasesRail } from '../cases/CasesRail'
import { LayoutGroup } from 'framer-motion'

interface CasesSectionProps {
  reducedMotion: boolean
}

export function CasesSection({ reducedMotion }: CasesSectionProps) {
  return (
    <Section
      id="cases"
      subtitle="Featured cases"
      title="Кейсы, где дизайн стал рычагом системного и бизнес-результата"
      className="overflow-hidden"
    >
      <LayoutGroup id="cases-rail-layout">
        <CasesRail reducedMotion={reducedMotion} />
        <CaseOverlay reducedMotion={reducedMotion} />
      </LayoutGroup>
    </Section>
  )
}
