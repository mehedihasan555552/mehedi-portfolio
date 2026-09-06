'use client'
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

type Theme = 'dark' | 'light'
interface ThemeCtx { theme: Theme; toggle: () => void }

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

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      const root = document.documentElement

      // Colour transitions are enabled only for the length of the swap.
      // Leaving them on permanently makes every hover in the app feel mushy.
      root.classList.add('theme-transition')
      window.clearTimeout(swapTimer.current)
      swapTimer.current = window.setTimeout(
        () => root.classList.remove('theme-transition'),
        440
      )

      root.classList.toggle('dark', next === 'dark')
      try { localStorage.setItem('theme', next) } catch {}
      return next
    })
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
