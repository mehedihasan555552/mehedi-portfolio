'use client'
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

type Theme = 'dark' | 'light'
interface ThemeCtx { theme: Theme; toggle: (event?: React.MouseEvent | MouseEvent) => void }

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with 'dark' to match what the server renders.
  // The inline script in layout.tsx ensures the HTML class is already
  // correct before React hydrates, so there's no visible flash.
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)
  const swapTimer = useRef(0)

  useEffect(() => {
    // Read the class that the inline script already set on <html>
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
    setMounted(true)
  }, [])

  const toggle = useCallback((event?: React.MouseEvent | MouseEvent) => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    const next: Theme = isDark ? 'light' : 'dark'

    // View Transitions API circular ripple when supported
    const hasViewTransition =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (hasViewTransition) {
      let x = event?.clientX ?? window.innerWidth - 60
      let y = event?.clientY ?? 34

      // Use the center of the trigger element if available
      const target = (event?.currentTarget || event?.target) as HTMLElement | undefined
      if (target?.getBoundingClientRect) {
        const rect = target.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const transition = (document as any).startViewTransition(() => {
        root.classList.toggle('dark', next === 'dark')
        setTheme(next)
        try { localStorage.setItem('theme', next) } catch {}
      })

      transition.ready
        .then(() => {
          root.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 520,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        })
        .catch(() => {})
      return
    }

    // Fallback: smooth temporary transition class for standard browsers
    root.classList.add('theme-transition')
    window.clearTimeout(swapTimer.current)
    swapTimer.current = window.setTimeout(
      () => root.classList.remove('theme-transition'),
      480
    )

    root.classList.toggle('dark', next === 'dark')
    setTheme(next)
    try { localStorage.setItem('theme', next) } catch {}
  }, [])

  useEffect(() => () => window.clearTimeout(swapTimer.current), [])

  // Provide mounted so children can suppress hydration if needed
  return (
    <Ctx.Provider value={{ theme: mounted ? theme : 'dark', toggle }}>
      {children}
    </Ctx.Provider>
  )
}

export const useTheme = () => useContext(Ctx)
