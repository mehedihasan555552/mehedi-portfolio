'use client'
import { useEffect } from 'react'

/**
 * One mounted client island for page-level motion that CSS cannot express:
 *   • the scroll-progress bar (an element this component owns)
 *   • cursor tracking for `.spotlight` surfaces
 *
 * Parallax deliberately lives in CSS (`animation-timeline: view()`), not here.
 * Driving it from JS meant writing inline transforms onto nodes React owns,
 * which broke hydration for the lazily-imported sections.
 *
 * Both handlers share a single rAF-throttled path, so adding more spotlight
 * surfaces costs nothing.
 */
export default function SiteEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bar = document.getElementById('scroll-progress')
    let frame = 0
    let queued = false

    const paint = () => {
      queued = false
      if (!bar) return
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      bar.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      frame = requestAnimationFrame(paint)
    }

    // Spotlight: write --mx/--my on whichever .spotlight is under the cursor.
    // React never owns these custom properties, so it leaves them alone on
    // re-render, and the writes only happen well after hydration.
    let pointerQueued = false
    let lastEvent: PointerEvent | null = null

    const paintPointer = () => {
      pointerQueued = false
      const e = lastEvent
      if (!e) return
      const target = (e.target as Element | null)?.closest?.('.spotlight') as HTMLElement | null
      if (!target) return
      const rect = target.getBoundingClientRect()
      target.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      target.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }

    const onPointerMove = (e: PointerEvent) => {
      lastEvent = e
      if (pointerQueued) return
      pointerQueued = true
      requestAnimationFrame(paintPointer)
    }

    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return <div id="scroll-progress" className="scroll-progress" aria-hidden="true" />
}
