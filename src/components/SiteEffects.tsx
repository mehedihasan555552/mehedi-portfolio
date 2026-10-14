'use client'
import { useEffect } from 'react'

/**
 * Lightweight, zero-lag page effects:
 *   • Scroll-progress bar (rAF throttled)
 *   • Card-scoped 3D tilt & spotlight (only updates the hovered card, never mutates documentElement)
 *   • No custom mouse cursor ring/dot (native OS cursor only)
 */
export default function SiteEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bar = document.getElementById('scroll-progress')
    const doc = document.documentElement
    let frame = 0
    let queued = false

    const paintScroll = () => {
      queued = false
      if (!bar) return
      const max = doc.scrollHeight - window.innerHeight
      bar.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      frame = requestAnimationFrame(paintScroll)
    }

    let pointerQueued = false
    let lastEvent: PointerEvent | null = null
    let activeTiltTarget: HTMLElement | null = null

    const paintPointer = () => {
      pointerQueued = false
      const e = lastEvent
      if (!e) return

      const targetEl = e.target as Element | null
      const tiltTarget = targetEl?.closest?.('.tilt-3d') as HTMLElement | null

      if (activeTiltTarget && activeTiltTarget !== tiltTarget) {
        activeTiltTarget.style.setProperty('--rx', '0deg')
        activeTiltTarget.style.setProperty('--ry', '0deg')
        activeTiltTarget.style.setProperty('--tz', '0px')
      }

      if (tiltTarget) {
        activeTiltTarget = tiltTarget
        const rect = tiltTarget.getBoundingClientRect()
        const px = e.clientX - rect.left
        const py = e.clientY - rect.top
        const cx = rect.width * 0.5
        const cy = rect.height * 0.5
        const dx = (px - cx) / Math.max(1, cx)
        const dy = (py - cy) / Math.max(1, cy)

        tiltTarget.style.setProperty('--rx', `${(-dy * 5.5).toFixed(2)}deg`)
        tiltTarget.style.setProperty('--ry', `${(dx * 5.5).toFixed(2)}deg`)
        tiltTarget.style.setProperty('--tz', '6px')
        tiltTarget.style.setProperty('--mx', `${px.toFixed(0)}px`)
        tiltTarget.style.setProperty('--my', `${py.toFixed(0)}px`)
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

    paintScroll()
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
