import { useEffect, useRef, useState } from 'react'

/**
 * Eases a number from 0 to `end` once `run` flips true.
 * Uses rAF with an ease-out curve so the count decelerates like the bars do.
 */
export function useCountUp(end: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end)
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(end * eased))
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [end, run, duration])

  return value
}
