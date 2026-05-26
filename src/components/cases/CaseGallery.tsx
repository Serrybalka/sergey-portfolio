import { useMemo, useState, type MouseEvent } from 'react'
import type { CaseStory } from '../../types/content'
import { nb } from '../../utils/typography'

interface CaseGalleryProps {
  story: CaseStory
  reducedMotion: boolean
}

interface PointerState {
  x: number
  y: number
}

export function CaseGallery({ story, reducedMotion }: CaseGalleryProps) {
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 })

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
    setPointer({ x, y })
  }

  const cards = useMemo(() => story.gallery.slice(0, 3), [story.gallery])

  return (
    <section data-case-stagger className="rounded-[24px] border border-white/12 bg-[#081121]/94 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/75">Gallery</p>
      <div className="mt-3 flex flex-col gap-4" onMouseMove={handleMove}>
        {cards.map((item, cardIndex) => (
          <article
            key={item.id}
            className="case-gallery-card relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1629] p-4"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(96,165,250,0.26),transparent_55%)]" />

            <p className="relative text-sm font-semibold text-white">{nb(item.title)}</p>
            <p className="relative mt-1 text-xs leading-relaxed text-slate-300/85">{nb(item.caption)}</p>

            <div className="relative mt-3 space-y-2">
              {item.layers.map((layer, layerIndex) => {
                const depth = reducedMotion ? 0 : (cardIndex + 1) * (layerIndex + 1) * 1.4
                const tx = pointer.x * depth
                const ty = pointer.y * depth

                return (
                  <div
                    key={layer}
                    className="rounded-lg border border-blue-300/24 bg-blue-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-blue-100 transition-transform duration-300"
                    style={{ transform: `translate3d(${tx}px, ${ty}px, 0)` }}
                  >
                    {nb(layer)}
                  </div>
                )
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
