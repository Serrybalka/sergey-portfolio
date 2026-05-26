import { ProcessExperience } from '../process/ProcessExperience'
import { Section } from '../layout/Section'

interface ProcessSectionProps {
  reducedMotion: boolean
}

export function ProcessSection({ reducedMotion }: ProcessSectionProps) {
  return (
    <Section
      id="process"
      subtitle="Process"
      title="От неопределенности к измеримому росту продукта"
    >
      <ProcessExperience reducedMotion={reducedMotion} />
    </Section>
  )
}
