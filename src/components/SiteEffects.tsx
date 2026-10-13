'use client'
import { useEffect } from 'react'

/**
 * Page-level motion engine:
 *   • Scroll-progress bar
 *   • Spotlight illumination tracking
 *   • Interactive 3D perspective tilt for `.tilt-3d` cards
 *   • Normalized pointer coordinates (--mouse-x, --mouse-y) for ambient 3D depth
 */
export default function SiteEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bar = document.getElementById('scroll-progress')
    const doc = document.documentElement
    let frame = 0
    let queued = false

    const paint = () => {
      queued = false
      if (!bar) return
      const max = doc.scrollHeight - window.innerHeight
      bar.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      frame = requestAnimationFrame(paint)
    }

    let pointerQueued = false
    let lastEvent: PointerEvent | null = null
    let activeTiltTarget: HTMLElement | null = null

    const paintPointer = () => {
      pointerQueued = false
      const e = lastEvent
      if (!e) return

      // Global normalized cursor coordinates (-1 to 1) for ambient 3D depth
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      doc.style.setProperty('--mouse-x', nx.toFixed(3))
      doc.style.setProperty('--mouse-y', ny.toFixed(3))

      // Spotlight tracking
      const spotlight = (e.target as Element | null)?.closest?.('.spotlight') as HTMLElement | null
      if (spotlight) {
        const rect = spotlight.getBoundingClientRect()
        spotlight.style.setProperty('--mx', `${e.clientX - rect.left}px`)
        spotlight.style.setProperty('--my', `${e.clientY - rect.top}px`)
      }

      // 3D Tilt tracking on .tilt-3d elements
      const tiltTarget = (e.target as Element | null)?.closest?.('.tilt-3d') as HTMLElement | null
      if (activeTiltTarget && activeTiltTarget !== tiltTarget) {
        // Reset previous tilt target
        activeTiltTarget.style.setProperty('--rx', '0deg')
        activeTiltTarget.style.setProperty('--ry', '0deg')
        activeTiltTarget.style.setProperty('--tz', '0px')
      }

      if (tiltTarget) {
        activeTiltTarget = tiltTarget
        const rect = tiltTarget.getBoundingClientRect()
        const px = e.clientX - rect.left
        const py = e.clientY - rect.top
        const cx = rect.width / 2
        const cy = rect.height / 2
        const dx = (px - cx) / cx
        const dy = (py - cy) / cy

        // Gentle, responsive 3D tilt
        tiltTarget.style.setProperty('--rx', `${(-dy * 7.5).toFixed(2)}deg`)
        tiltTarget.style.setProperty('--ry', `${(dx * 7.5).toFixed(2)}deg`)
        tiltTarget.style.setProperty('--tz', '10px')
        tiltTarget.style.setProperty('--glare-x', `${px.toFixed(1)}px`)
        tiltTarget.style.setProperty('--glare-y', `${py.toFixed(1)}px`)
      } else {
        activeTiltTarget = null
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      lastEvent = e
      if (pointerQueued) return
      pointerQueued = true
      requestAnimationFrame(paintPointer)
    }

    const onPointerLeave = () => {
      if (activeTiltTarget) {
        activeTiltTarget.style.setProperty('--rx', '0deg')
        activeTiltTarget.style.setProperty('--ry', '0deg')
        activeTiltTarget.style.setProperty('--tz', '0px')
        activeTiltTarget = null
      }
    }

    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return <div id="scroll-progress" className="scroll-progress" aria-hidden="true" />
}
