import { useEffect, useRef } from 'react'

const SELECTOR = '.reveal, .reveal-left, .reveal-right, [data-reveal]'

/**
 * Reveals descendants as they scroll into view.
 *
 * Elements that cross the threshold in the same observer callback are treated
 * as one batch and given an incremental delay, so grids and lists cascade
 * instead of popping in together — no per-element markup needed.
 */
export function useReveal(threshold = 0.12, stagger = 75) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = Array.from(el.querySelectorAll<HTMLElement>(SELECTOR))
    if (!targets.length) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      targets.forEach(t => t.classList.add('visible', 'is-visible'))
      return
    }

    const obs = new IntersectionObserver(
      entries => {
        const entering = entries
          .filter(e => e.isIntersecting)
          .map(e => e.target as HTMLElement)
          // Top-to-bottom, then left-to-right, so the cascade follows reading order
          .sort((a, b) => {
            const ra = a.getBoundingClientRect()
            const rb = b.getBoundingClientRect()
            return ra.top - rb.top || ra.left - rb.left
          })

        entering.forEach((target, i) => {
          // Respect an explicit delay if the markup already set one
          if (!target.style.getPropertyValue('--rdelay') && !/\bd[1-6]\b/.test(target.className)) {
            target.style.setProperty('--rdelay', `${i * stagger}ms`)
          }
          target.classList.add('visible', 'is-visible')
          obs.unobserve(target)
        })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [threshold, stagger])

  return ref
}
