import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCursor } from '../../context/CursorContext'
import { nb } from '../../utils/typography'
import { MagneticButton } from '../common/MagneticButton'
import { WordReveal } from '../common/WordReveal'

gsap.registerPlugin(ScrollTrigger)

const LazyHeroScene = lazy(() => import('./HeroScene'))

interface HeroProps {
  reducedMotion: boolean
}

function SceneFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(148,163,184,0.2),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(37,99,235,0.2),transparent_40%),#04070f]">
      <div className="hero-fallback-layer left-[22%] top-[33%] h-16 w-72 -rotate-[10deg]" />
      <div className="hero-fallback-layer hero-fallback-layer-delay left-[48%] top-[40%] h-14 w-80 rotate-[8deg]" />
      <div className="hero-fallback-layer hero-fallback-layer-slow left-[35%] top-[55%] h-20 w-64 -rotate-[14deg]" />
    </div>
  )
}

const MAX_WEBGL_RECOVERY_ATTEMPTS = 3

export function Hero({ reducedMotion }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const remountTimerRef = useRef<number | null>(null)
  const recoveryAttemptsRef = useRef(0)
  const [sceneReady, setSceneReady] = useState(false)
  const [sceneVersion, setSceneVersion] = useState(0)
  const [sceneContextLost, setSceneContextLost] = useState(false)
  const { setMode, reset } = useCursor()

  const logSceneState = useCallback((label: string) => {
    if (!import.meta.env.DEV || !sceneRef.current) {
      return
    }

    const scene = sceneRef.current
    const styles = window.getComputedStyle(scene)
    const trigger = ScrollTrigger.getById('hero-scene-timeline')

    console.log('[HeroSceneState]', label, {
      opacity: styles.opacity,
      visibility: styles.visibility,
      display: styles.display,
      zIndex: styles.zIndex,
      transform: styles.transform,
      filter: styles.filter,
      pointerEvents: styles.pointerEvents,
      rect: scene.getBoundingClientRect(),
      canvas: scene.querySelector('canvas') ? 'exists' : 'missing',
      scrollY: window.scrollY,
      triggerProgress: trigger ? trigger.progress : null,
    })
  }, [])

  const safeRefresh = useCallback(
    (label: string) => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        logSceneState(`after-refresh:${label}`)
      })
    },
    [logSceneState],
  )

  const markSceneReady = useCallback(
    (label: string) => {
      requestAnimationFrame(() => {
        if (!sceneRef.current) {
          return
        }

        const hasCanvas = Boolean(sceneRef.current.querySelector('canvas'))
        if (hasCanvas) {
          setSceneReady(true)
        }

        logSceneState(label)
      })
    },
    [logSceneState],
  )

  const handleSceneReady = useCallback(() => {
    if (remountTimerRef.current !== null) {
      window.clearTimeout(remountTimerRef.current)
      remountTimerRef.current = null
    }
    recoveryAttemptsRef.current = 0
    setSceneContextLost(false)
    markSceneReady('on-ready')
    safeRefresh('scene-ready')
  }, [markSceneReady, safeRefresh])

  const handleSceneContextLost = useCallback(() => {
    setSceneContextLost(true)
    setSceneReady(false)
    logSceneState('context-lost')

    if (remountTimerRef.current !== null) {
      window.clearTimeout(remountTimerRef.current)
      remountTimerRef.current = null
    }

    if (recoveryAttemptsRef.current >= MAX_WEBGL_RECOVERY_ATTEMPTS) {
      return
    }

    recoveryAttemptsRef.current += 1

    remountTimerRef.current = window.setTimeout(() => {
      setSceneVersion((prev) => prev + 1)
      logSceneState(`remount-attempt-${recoveryAttemptsRef.current}`)
      remountTimerRef.current = null
    }, 450)
  }, [logSceneState])

  const handleSceneContextRestored = useCallback(() => {
    setSceneContextLost(false)
    markSceneReady('context-restored')
    safeRefresh('context-restored')
  }, [markSceneReady, safeRefresh])

  useEffect(() => {
    return () => {
      if (remountTimerRef.current !== null) {
        window.clearTimeout(remountTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    logSceneState('mount')

    const onLoad = () => {
      logSceneState('window-load')
      safeRefresh('window-load')
    }

    const timers = [500, 1500, 3000].map((delay) =>
      window.setTimeout(() => {
        logSceneState(`timer-${delay}`)
      }, delay),
    )

    window.addEventListener('load', onLoad)
    safeRefresh('initial-effect')

    return () => {
      window.removeEventListener('load', onLoad)
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [logSceneState, safeRefresh])

  useLayoutEffect(() => {
    if (
      reducedMotion ||
      !heroRef.current ||
      !titleRef.current ||
      !introRef.current ||
      !layerRef.current ||
      !sceneRef.current
    ) {
      return undefined
    }

    const hero = heroRef.current
    const title = titleRef.current
    const intro = introRef.current
    const scene = sceneRef.current
    const layers = Array.from(layerRef.current.children)

    const ctx = gsap.context(() => {
      gsap.set(scene, {
        autoAlpha: 1,
        opacity: 1,
        visibility: 'visible',
        scale: 1,
        filter: 'blur(0px)',
        clearProps: 'display',
      })
      gsap.set(title, {
        autoAlpha: 1,
        opacity: 1,
        visibility: 'visible',
        yPercent: 0,
        filter: 'blur(0px)',
      })
      gsap.set(intro, { autoAlpha: 1, opacity: 1, yPercent: 0 })
      gsap.set(layers, { opacity: 1, x: 0, y: 0, rotate: 0 })

      gsap.from(intro, {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: 'power3.out',
        immediateRender: false,
        overwrite: 'auto',
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'hero-scene-timeline',
          trigger: hero,
          start: 'top top',
          end: '+=130%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .to(
          title,
          {
            yPercent: -60,
            opacity: 0,
            filter: 'blur(10px)',
            ease: 'none',
          },
          0,
        )
        .to(
          layers,
          {
            x: (index) => (index % 2 === 0 ? -180 - index * 12 : 180 + index * 12),
            y: (index) => (index % 2 === 0 ? -110 : 110),
            opacity: 0,
            rotate: (index) => (index % 2 === 0 ? -16 : 16),
            stagger: 0.03,
            ease: 'none',
          },
          0,
        )
        .to(
          scene,
          {
            scale: 1.08,
            opacity: 0.25,
            filter: 'blur(4px)',
            ease: 'none',
          },
          0.35,
        )
    }, hero)

    safeRefresh('hero-layout')

    return () => {
      ctx.revert()
    }
  }, [reducedMotion, safeRefresh])

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen overflow-hidden">
      <div className="hero-grid absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(52,132,255,0.28),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(108,155,255,0.14),transparent_45%)]" />
      <div
        className={`pointer-events-none absolute inset-0 z-[2] transition-opacity duration-500 ${sceneReady ? 'opacity-0' : 'opacity-100'} ${sceneContextLost ? 'animate-pulse' : ''}`}
      >
        <SceneFallback />
      </div>

      <div
        ref={sceneRef}
        data-cursor-hide-from-lens
        className="hero-scene absolute inset-0 z-[1]"
      >
        <Suspense fallback={null}>
          <LazyHeroScene
            key={sceneVersion}
            reducedMotion={reducedMotion}
            onReady={handleSceneReady}
            onContextLost={handleSceneContextLost}
            onContextRestored={handleSceneContextRestored}
          />
        </Suspense>
      </div>

      <div ref={layerRef} className="pointer-events-none absolute inset-0 z-10">
        <div className="hero-layer left-[9%] top-[16%]" />
        <div className="hero-layer right-[8%] top-[25%]" />
        <div className="hero-layer left-[15%] bottom-[22%]" />
        <div className="hero-layer right-[14%] bottom-[18%]" />
      </div>

      <div
        ref={titleRef}
        className="relative z-20 mx-auto flex min-h-screen w-full max-w-[1240px] flex-col items-center justify-center px-6 text-center"
      >
        <div ref={introRef} className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <p className="mb-5 rounded-full border border-blue-300/35 bg-blue-500/10 px-5 py-2 text-xs uppercase tracking-[0.2em] text-blue-100/90">
            Senior / Lead Product Designer
          </p>

          <h1 className="mb-5 w-full text-balance text-center text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-7xl">
            <WordReveal
              text="Sergey Rybalka — проектирование сложных продуктов и систем"
              className="w-full justify-center text-center"
            />
          </h1>

          <p className="mb-10 max-w-3xl text-center text-lg text-slate-200/85 md:text-2xl">
            {nb('Дизайн-системы, сложный UX, многоролевые интерфейсы и решения, влияющие на бизнес-метрики.')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <MagneticButton
              href="#cases"
              label="Смотреть кейсы"
              onMouseEnter={() => setMode('view')}
              onMouseLeave={reset}
            />
            <MagneticButton
              href="#contact"
              label="Обсудить задачу"
              tone="ghost"
              onMouseEnter={() => setMode('contact')}
              onMouseLeave={reset}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
