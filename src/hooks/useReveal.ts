import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Unobserve after reveal — no need to keep watching
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )

    el.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el))

    return () => obs.disconnect()
  }, [threshold])

  return ref
}
