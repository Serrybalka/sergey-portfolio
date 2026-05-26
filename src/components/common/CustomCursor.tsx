import { useEffect, useRef, useState } from 'react'

interface CustomCursorProps {
  disabled?: boolean
}

const LENS_DIAMETER = 80
const LENS_RADIUS = LENS_DIAMETER / 2
const LENS_ZOOM = 2
const FOLLOW_EASING = 0.2
const MIRROR_REBUILD_THROTTLE_MS = 500
const APP_SHELL_SELECTOR = '[data-app-shell]'
const FLOATING_NAV_SELECTOR = '[data-floating-nav]'
const CARD_HOVER_SELECTOR = '[data-cursor-card-hover]'
const LENS_SOURCE_SELECTOR = '[data-cursor-lens-source]'
const LENS_REBUILD_EVENT = 'cursor-lens-rebuild'

function stripIds(root: HTMLElement) {
  if (root.hasAttribute('id')) {
    root.removeAttribute('id')
  }

  root.querySelectorAll('[id]').forEach((element) => {
    element.removeAttribute('id')
  })
}

function stripLensSourceMarkers(root: HTMLElement) {
  if (root.hasAttribute('data-cursor-lens-source')) {
    root.removeAttribute('data-cursor-lens-source')
  }

  root.querySelectorAll('[data-cursor-lens-source]').forEach((element) => {
    element.removeAttribute('data-cursor-lens-source')
  })
}

function removeLensArtifacts(root: HTMLElement) {
  root
    .querySelectorAll(
      '[data-cursor-lens-layer], [data-cursor-hide-from-lens], canvas, .hero-scene, [data-r3f-canvas]',
    )
    .forEach((element) => {
      element.remove()
    })
}

function collectElements(root: HTMLElement) {
  const nodes: HTMLElement[] = [root]
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT)
  let node = walker.nextNode()

  while (node) {
    if (node instanceof HTMLElement) {
      nodes.push(node)
    }

    node = walker.nextNode()
  }

  return nodes
}

function isStickyActive(style: CSSStyleDeclaration, element: HTMLElement) {
  if (style.position !== 'sticky') {
    return false
  }

  const stickyTop = Number.parseFloat(style.top)
  if (Number.isNaN(stickyTop)) {
    return false
  }

  return element.getBoundingClientRect().top <= stickyTop + 1
}

function normalizeFixedLayers(sourceRoot: HTMLElement, mirrorRoot: HTMLElement) {
  const sourceNodes = collectElements(sourceRoot)
  const mirrorNodes = collectElements(mirrorRoot)
  const limit = Math.min(sourceNodes.length, mirrorNodes.length)
  const rootRect = sourceRoot.getBoundingClientRect()
  const rootDocLeft = rootRect.left + window.scrollX
  const rootDocTop = rootRect.top + window.scrollY

  for (let index = 1; index < limit; index += 1) {
    const sourceNode = sourceNodes[index]
    const mirrorNode = mirrorNodes[index]
    const sourceStyle = window.getComputedStyle(sourceNode)
    const shouldNormalize =
      sourceStyle.position === 'fixed' || isStickyActive(sourceStyle, sourceNode)

    if (!shouldNormalize) {
      continue
    }

    const rect = sourceNode.getBoundingClientRect()
    const absoluteLeft = rect.left + window.scrollX - rootDocLeft
    const absoluteTop = rect.top + window.scrollY - rootDocTop

    mirrorNode.style.position = 'absolute'
    mirrorNode.style.inset = 'auto'
    mirrorNode.style.right = 'auto'
    mirrorNode.style.bottom = 'auto'
    mirrorNode.style.left = `${absoluteLeft}px`
    mirrorNode.style.top = `${absoluteTop}px`
    mirrorNode.style.width = `${rect.width}px`
    mirrorNode.style.height = `${rect.height}px`
    mirrorNode.style.margin = '0'
    mirrorNode.style.transform = 'none'
    mirrorNode.style.translate = 'none'
    mirrorNode.style.rotate = 'none'
    mirrorNode.style.scale = '1'
  }
}

function isLensSourceActive(source: HTMLElement) {
  const style = window.getComputedStyle(source)
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false
  }

  return source.getClientRects().length > 0
}

function resolveHoveredFloatingNav(cursorX: number, cursorY: number): HTMLElement | null {
  const nav = document.querySelector(FLOATING_NAV_SELECTOR)
  if (!(nav instanceof HTMLElement) || !isLensSourceActive(nav)) {
    return null
  }

  const hit = document.elementFromPoint(cursorX, cursorY)
  if (!(hit instanceof HTMLElement)) {
    return null
  }

  const hoveredNav = hit.closest(FLOATING_NAV_SELECTOR)
  if (hoveredNav instanceof HTMLElement) {
    return hoveredNav
  }

  return null
}

function resolveHoveredCard(cursorX: number, cursorY: number): HTMLElement | null {
  const hit = document.elementFromPoint(cursorX, cursorY)

  if (!(hit instanceof HTMLElement)) {
    return null
  }

  const hoveredCard = hit.closest(CARD_HOVER_SELECTOR)
  if (hoveredCard instanceof HTMLElement) {
    return hoveredCard
  }

  return null
}

function resolveLensSource(cursorX: number, cursorY: number): HTMLElement | null {
  const hoveredFloatingNav = resolveHoveredFloatingNav(cursorX, cursorY)
  if (hoveredFloatingNav) {
    return hoveredFloatingNav
  }

  return resolveDefaultLensSource()
}

function resolveDefaultLensSource(): HTMLElement | null {
  const lensSources = Array.from(document.querySelectorAll(LENS_SOURCE_SELECTOR)).filter(
    (element): element is HTMLElement => element instanceof HTMLElement && isLensSourceActive(element),
  )

  if (lensSources.length > 0) {
    return lensSources[lensSources.length - 1]
  }

  const appShell = document.querySelector(APP_SHELL_SELECTOR)
  if (appShell instanceof HTMLElement) {
    return appShell
  }

  return null
}

function buildMirrorShell(sourceShell: HTMLElement): HTMLElement {
  const mirrorShell = sourceShell.cloneNode(true) as HTMLElement

  stripIds(mirrorShell)
  stripLensSourceMarkers(mirrorShell)
  normalizeFixedLayers(sourceShell, mirrorShell)
  removeLensArtifacts(mirrorShell)

  mirrorShell.setAttribute('data-cursor-mirror-shell', 'true')
  mirrorShell.setAttribute('aria-hidden', 'true')
  mirrorShell.style.pointerEvents = 'none'
  mirrorShell.style.userSelect = 'none'
  mirrorShell.style.margin = '0'
  mirrorShell.style.position = 'absolute'
  mirrorShell.style.inset = 'auto'
  mirrorShell.style.right = 'auto'
  mirrorShell.style.bottom = 'auto'
  mirrorShell.style.left = '0'
  mirrorShell.style.top = '0'
  mirrorShell.style.width = `${Math.max(sourceShell.scrollWidth, sourceShell.clientWidth)}px`
  mirrorShell.style.height = `${Math.max(sourceShell.scrollHeight, sourceShell.clientHeight)}px`
  mirrorShell.style.minHeight = '0'
  mirrorShell.style.maxWidth = 'none'
  mirrorShell.style.transformOrigin = 'top left'
  mirrorShell.style.transform = 'translate3d(0,0,0)'
  mirrorShell.style.translate = 'none'
  mirrorShell.style.rotate = 'none'
  mirrorShell.style.scale = '1'
  mirrorShell.style.willChange = 'transform'
  mirrorShell.style.backfaceVisibility = 'hidden'
  mirrorShell.style.contentVisibility = 'visible'
  mirrorShell.style.contain = 'paint'

  return mirrorShell
}

export function CustomCursor({ disabled = false }: CustomCursorProps) {
  const lensRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const mirrorShellRef = useRef<HTMLElement | null>(null)
  const sourceShellRef = useRef<HTMLElement | null>(null)
  const observedSourceRef = useRef<HTMLElement | null>(null)
  const needsMirrorRebuildRef = useRef(false)
  const lastMirrorRebuildRef = useRef(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const usingFloatingNavSourceRef = useRef(false)
  const cardHintVisibleRef = useRef(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isCardHintVisible, setIsCardHintVisible] = useState(false)

  useEffect(() => {
    if (disabled || window.matchMedia('(pointer: coarse)').matches) {
      return undefined
    }

    const viewport = viewportRef.current

    if (!viewport) {
      return undefined
    }

    sourceShellRef.current = resolveLensSource(targetRef.current.x, targetRef.current.y)

    if (!sourceShellRef.current) {
      return undefined
    }

    const markMirrorForRebuild = () => {
      needsMirrorRebuildRef.current = true
    }

    const mountMirror = () => {
      const source = sourceShellRef.current

      if (!source) {
        return
      }

      const mirrorShell = buildMirrorShell(source)
      viewport.replaceChildren(mirrorShell)
      mirrorShellRef.current = mirrorShell
      needsMirrorRebuildRef.current = false
      lastMirrorRebuildRef.current = performance.now()
    }

    const bindObserver = () => {
      observerRef.current?.disconnect()
      observerRef.current = null
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null

      if (observedSourceRef.current) {
        observedSourceRef.current.removeEventListener('scroll', markMirrorForRebuild)
      }

      const source = sourceShellRef.current
      observedSourceRef.current = source

      if (!source) {
        return
      }

      observerRef.current = new MutationObserver(markMirrorForRebuild)

      observerRef.current.observe(source, {
        subtree: true,
        childList: true,
        characterData: true,
      })

      source.addEventListener('scroll', markMirrorForRebuild, { passive: true })

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserverRef.current = new ResizeObserver(markMirrorForRebuild)
        resizeObserverRef.current.observe(source)
      }
    }

    mountMirror()
    bindObserver()

    const teardownMirror = () => {
      viewport.replaceChildren()
      mirrorShellRef.current?.remove()
      mirrorShellRef.current = null
      needsMirrorRebuildRef.current = false
    }

    const handleMove = (event: MouseEvent) => {
      targetRef.current.x = event.clientX
      targetRef.current.y = event.clientY
      setIsVisible((prev) => prev || true)
    }

    const handleLensRebuildEvent = () => {
      const hoveredFloatingNav = resolveHoveredFloatingNav(targetRef.current.x, targetRef.current.y)
      sourceShellRef.current = hoveredFloatingNav ?? resolveDefaultLensSource()
      usingFloatingNavSourceRef.current = Boolean(hoveredFloatingNav)
      bindObserver()
      mountMirror()
    }

    const render = () => {
      const lens = lensRef.current
      const hint = hintRef.current
      const mirror = mirrorShellRef.current

      const hoveredFloatingNav = resolveHoveredFloatingNav(targetRef.current.x, targetRef.current.y)
      const preferredSource = hoveredFloatingNav ?? resolveDefaultLensSource()
      const shouldUseNavSource = Boolean(hoveredFloatingNav)
      const shouldShowCardHint = Boolean(resolveHoveredCard(targetRef.current.x, targetRef.current.y))

      if (cardHintVisibleRef.current !== shouldShowCardHint) {
        cardHintVisibleRef.current = shouldShowCardHint
        setIsCardHintVisible(shouldShowCardHint)
      }

      const easing = shouldUseNavSource ? 1 : FOLLOW_EASING
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * easing
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * easing

      if (preferredSource && preferredSource !== sourceShellRef.current) {
        const wasUsingFloatingNavSource = usingFloatingNavSourceRef.current
        usingFloatingNavSourceRef.current = shouldUseNavSource
        sourceShellRef.current = preferredSource
        bindObserver()
        mountMirror()

        if (wasUsingFloatingNavSource || shouldUseNavSource) {
          currentRef.current.x = targetRef.current.x
          currentRef.current.y = targetRef.current.y
        }
      } else {
        usingFloatingNavSourceRef.current = shouldUseNavSource
      }

      if (lens && mirror && sourceShellRef.current) {
        const cursorX = currentRef.current.x
        const cursorY = currentRef.current.y
        const source = sourceShellRef.current
        const sourceRect = source.getBoundingClientRect()
        const maxX = Math.max(source.scrollWidth - 1, 0)
        const maxY = Math.max(source.scrollHeight - 1, 0)
        const sourceX = cursorX - sourceRect.left + source.scrollLeft
        const sourceY = cursorY - sourceRect.top + source.scrollTop
        const contentX = Math.min(Math.max(sourceX, 0), maxX)
        const contentY = Math.min(Math.max(sourceY, 0), maxY)

        lens.style.left = `${cursorX - LENS_RADIUS}px`
        lens.style.top = `${cursorY - LENS_RADIUS}px`
        if (hint) {
          hint.style.left = `${cursorX}px`
          hint.style.top = `${cursorY}px`
        }

        const tx = LENS_RADIUS - contentX * LENS_ZOOM
        const ty = LENS_RADIUS - contentY * LENS_ZOOM
        mirror.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${LENS_ZOOM})`
      }

      if (
        needsMirrorRebuildRef.current &&
        performance.now() - lastMirrorRebuildRef.current >= MIRROR_REBUILD_THROTTLE_MS
      ) {
        mountMirror()
      }

      rafRef.current = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('scroll', markMirrorForRebuild, { passive: true })
    window.addEventListener('resize', markMirrorForRebuild, { passive: true })
    window.addEventListener(LENS_REBUILD_EVENT, handleLensRebuildEvent as EventListener)
    rafRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('scroll', markMirrorForRebuild)
      window.removeEventListener('resize', markMirrorForRebuild)
      window.removeEventListener(LENS_REBUILD_EVENT, handleLensRebuildEvent as EventListener)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      observerRef.current?.disconnect()
      observerRef.current = null
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null
      if (observedSourceRef.current) {
        observedSourceRef.current.removeEventListener('scroll', markMirrorForRebuild)
      }
      observedSourceRef.current = null
      sourceShellRef.current = null
      teardownMirror()
    }
  }, [disabled])

  if (disabled) {
    return null
  }

  return (
    <div
      data-cursor-hide-from-lens
      className={`pointer-events-none fixed inset-0 z-[220] hidden md:block ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150`}
      aria-hidden="true"
    >
      <div
        ref={lensRef}
        data-cursor-lens-layer
        className="pointer-events-none fixed h-20 w-20 overflow-hidden rounded-full border border-blue-100/45 bg-transparent shadow-[0_0_0_1px_rgba(147,197,253,0.2),0_0_26px_rgba(59,130,246,0.22)] [contain:layout_paint_style] [isolation:isolate] [transform:translateZ(0)]"
      >
        <div ref={viewportRef} className="absolute inset-0" />
      </div>
      <div
        ref={hintRef}
        className={`pointer-events-none fixed z-[221] transition-[opacity,transform] duration-100 ${
          isCardHintVisible ? 'translate-x-0 translate-y-0 opacity-100' : 'translate-x-1 translate-y-1 opacity-0'
        }`}
      >
        <span
          className={`absolute left-[20px] top-[-20px] origin-left -rotate-45 transition-transform duration-100 ${
            isCardHintVisible ? 'scale-x-100' : 'scale-x-0'
          }`}
        >
          <span className="block h-px w-10 bg-gradient-to-r from-blue-200/95 to-blue-100/70 shadow-[0_0_10px_rgba(96,165,250,0.65)]" />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-blue-50/70 bg-blue-200 shadow-[0_0_12px_rgba(147,197,253,0.95)]" />
        </span>
        <span className="absolute left-[52px] top-[-46px] rounded-md border border-blue-200/45 bg-[#060d19]/94 px-2 py-[3px] text-[11px] font-medium leading-none tracking-[0.02em] text-blue-50 shadow-[0_0_12px_rgba(59,130,246,0.45)]">
          Подробнее
        </span>
      </div>
    </div>
  )
}
