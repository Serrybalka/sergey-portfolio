import { Suspense, lazy } from 'react'
import { CursorProvider } from '../context/CursorContext'
import { ImpactModalProvider } from '../context/ImpactModalContext'
import { SystemDesignModalProvider } from '../context/SystemDesignModalContext'
import { CaseExperienceProvider } from '../context/CaseExperienceContext'
import { ProcessExperienceProvider } from '../context/ProcessExperienceContext'
import { useLenisScroll } from '../hooks/useLenisScroll'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useSectionMotion } from '../hooks/useSectionMotion'
import { CustomCursor } from '../components/common/CustomCursor'
import { Hero } from '../components/hero/Hero'
import { FloatingNav } from '../components/navigation/FloatingNav'
import { ImpactMetrics } from '../components/sections/ImpactMetrics'
import { ExpertiseSection } from '../components/sections/Expertise'
import { ProcessSection } from '../components/sections/ProcessSection'
import { AboutSection } from '../components/sections/AboutSection'
import { ContactSection } from '../components/sections/ContactSection'

const CasesSection = lazy(() => import('../components/sections/CasesSection').then((module) => ({ default: module.CasesSection })))

function CasesFallback() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-5 py-24 md:px-10 md:py-32">
      <div className="h-64 animate-pulse rounded-3xl border border-white/10 bg-[#0a111e]" />
    </section>
  )
}

function AppShell() {
  const reducedMotion = usePrefersReducedMotion()

  useLenisScroll(reducedMotion)
  useSectionMotion(reducedMotion)

  return (
    <div data-app-shell className="relative min-h-screen overflow-x-clip bg-[#05070d] text-slate-200">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.25),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.14),transparent_36%),#04060d]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-45 [background-image:linear-gradient(to_right,rgba(148,163,184,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.09)_1px,transparent_1px)] [background-size:72px_72px]" />

      <Hero reducedMotion={reducedMotion} />
      <main>
        <ImpactMetrics reducedMotion={reducedMotion} />
        <ExpertiseSection reducedMotion={reducedMotion} />
        <Suspense fallback={<CasesFallback />}>
          <CasesSection reducedMotion={reducedMotion} />
        </Suspense>
        <ProcessSection reducedMotion={reducedMotion} />
        <AboutSection />
        <ContactSection />
      </main>

      <footer className="mx-auto mb-20 w-full max-w-[1240px] px-5 text-xs uppercase tracking-[0.16em] text-slate-500 md:px-10">
        Sergey Rybalka Portfolio v1
      </footer>

      <FloatingNav />
      <CustomCursor disabled />
    </div>
  )
}

export default function App() {
  return (
    <CursorProvider>
      <ImpactModalProvider>
        <CaseExperienceProvider>
          <ProcessExperienceProvider>
            <SystemDesignModalProvider>
              <AppShell />
            </SystemDesignModalProvider>
          </ProcessExperienceProvider>
        </CaseExperienceProvider>
      </ImpactModalProvider>
    </CursorProvider>
  )
}

