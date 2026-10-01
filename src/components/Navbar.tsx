'use client'
import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { useTheme } from '@/context/ThemeContext'
import SocialIcon from './SocialIcon'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Blog', id: 'blog', path: '/blog' },
  { label: 'Education', id: 'education' },
  { label: 'Contact', id: 'contact' },
]

const MOBILE_SOCIALS = [
  { href: 'https://www.linkedin.com/in/mehedihasan555552/', name: 'linkedin' as const, label: 'LinkedIn' },
  { href: 'https://github.com/mehedihasan555552', name: 'github' as const, label: 'GitHub' },
  { href: 'https://x.com/ridoy123439', name: 'twitter' as const, label: 'Twitter' },
]

/* ─── Logo — a terminal prompt, matching the site's voice ─────────────── */
const MehediLogo = memo(function MehediLogo({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="1.25" y="1.25" width="37.5" height="37.5" rx="9"
        fill="var(--card)"
        stroke="var(--accent)"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      {/* > prompt */}
      <path
        d="M11 14.5 L17.5 20 L11 25.5"
        stroke="var(--accent)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* cursor underscore — blinks with the page */}
      <rect x="20.5" y="23.4" width="9" height="2.4" rx="1.2" fill="var(--accent)">
        <animate
          attributeName="opacity"
          values="1;1;0;0;1"
          keyTimes="0;0.45;0.5;0.95;1"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  )
})

/* ─── Theme toggle — sun/moon crossfade on one axis ───────────────────── */
const ThemeButton = memo(function ThemeButton({
  theme, toggle,
}: { theme: string; toggle: () => void }) {
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative w-10 h-10 rounded-md glass-card glass-card-hover grid place-items-center text-[--text-muted] hover:text-[--accent] overflow-hidden"
    >
      <span className="relative block w-[18px] h-[18px]">
        {/* Sun */}
        <svg
          className="absolute inset-0 w-[18px] h-[18px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.4)',
          }}
          fill="none" stroke="currentColor" strokeWidth={1.9} viewBox="0 0 24 24" aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.5" />
          <path strokeLinecap="round" d="M12 2v2.4M12 19.6V22M4.22 4.22l1.7 1.7M18.08 18.08l1.7 1.7M2 12h2.4M19.6 12H22M4.22 19.78l1.7-1.7M18.08 5.92l1.7-1.7" />
        </svg>
        {/* Moon */}
        <svg
          className="absolute inset-0 w-[18px] h-[18px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'rotate(90deg) scale(0.4)' : 'rotate(0deg) scale(1)',
          }}
          fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </span>
    </button>
  )
})

/* ─── Main ────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const [pill, setPill] = useState<{ left: number; width: number; on: boolean }>({
    left: 0, width: 0, on: false,
  })
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  const listRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  // Scroll state + scrollspy, rAF-throttled
  useEffect(() => {
    if (pathname.startsWith('/blog')) {
      setActive('blog')
      setScrolled(true)
      return
    }
    if (pathname.startsWith('/projects')) {
      setActive('projects')
      setScrolled(true)
      return
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        let current = ''
        for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
          const el = document.getElementById(NAV_ITEMS[i].id)
          if (el && window.scrollY >= el.offsetTop - 160) {
            current = NAV_ITEMS[i].id
            break
          }
        }
        setActive(current)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  // Slide the indicator pill to whichever link is active or hovered
  const movePill = useCallback((id: string | null) => {
    const target = id ? linkRefs.current[id] : null
    const list = listRef.current
    if (!target || !list) {
      setPill(p => ({ ...p, on: false }))
      return
    }
    const l = list.getBoundingClientRect()
    const t = target.getBoundingClientRect()
    setPill({ left: t.left - l.left, width: t.width, on: true })
  }, [])

  useEffect(() => { movePill(active || null) }, [active, movePill])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false)
      movePill(active || null)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [active, movePill])

  // Lock body scroll behind the mobile sheet
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close the sheet on Escape
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const navTo = useCallback((id: string, path?: string) => {
    setMenuOpen(false)
    if (pathname === '/') {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    if (path && (pathname.startsWith('/blog') || pathname.startsWith('/projects'))) {
      router.push(path)
    } else {
      router.push(`/#${id}`)
    }
  }, [pathname, router])

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: scrolled ? 'color-mix(in srgb, var(--bg) 78%, transparent)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          boxShadow: scrolled ? '0 8px 32px -24px rgb(0 0 0 / 0.8)' : 'none',
        }}
      >
        <div className="container-x h-[68px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="Mehedi Hasan — Home">
            <span className="relative block transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:-translate-y-0.5">
              <MehediLogo />
              <span
                className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10 pointer-events-none"
                style={{ background: 'rgb(var(--accent-rgb) / 0.28)' }}
                aria-hidden="true"
              />
            </span>
            <span className="leading-none">
              <span
                className="block font-bold text-[16px] tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
              >
                mehedi<span style={{ color: 'var(--accent)' }}>.dev</span>
              </span>
              <span className="hidden sm:block text-[9px] font-mono tracking-[0.2em] uppercase mt-[3px] text-[--text-dim]">
                Full-Stack &amp; AI
              </span>
            </span>
          </Link>

          {/* Desktop links with sliding indicator */}
          <div
            ref={listRef}
            className="hidden lg:flex items-center gap-0.5 relative"
            onMouseLeave={() => movePill(active || null)}
          >
            <span
              aria-hidden="true"
              className="absolute top-1/2 -translate-y-1/2 h-9 rounded-md pointer-events-none"
              style={{
                left: pill.left,
                width: pill.width,
                background: 'var(--accent-soft)',
                border: '1px solid var(--accent-line)',
                opacity: pill.on ? 1 : 0,
                transition:
                  'left 480ms cubic-bezier(0.16,1,0.3,1), width 480ms cubic-bezier(0.16,1,0.3,1), opacity 260ms ease',
              }}
            />
            {NAV_ITEMS.map(item => {
              const isActive = active === item.id
              return (
                <a
                  key={item.id}
                  ref={el => { linkRefs.current[item.id] = el }}
                  href={pathname === '/' ? `#${item.id}` : (item.path || `/#${item.id}`)}
                  onClick={e => { e.preventDefault(); navTo(item.id, item.path) }}
                  onMouseEnter={() => movePill(item.id)}
                  onFocus={() => movePill(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative z-10 px-3.5 py-2 text-[13px] font-mono font-medium rounded-md transition-colors duration-200"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                  onMouseOver={e => { if (!isActive) e.currentTarget.style.color = 'var(--text)' }}
                  onMouseOut={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  {item.label}
                </a>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeButton theme={theme} toggle={toggle} />

            <a
              href="#contact"
              onClick={e => { e.preventDefault(); navTo('contact') }}
              className="hidden lg:inline-flex btn btn-primary text-[13px]"
            >
              Hire Me
            </a>

            {/* Hamburger → X */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden relative z-[60] w-10 h-10 rounded-md glass-card flex flex-col items-center justify-center gap-[5px] text-[--text] transition-colors duration-200"
            >
              <span
                className="block w-[18px] h-[1.5px] rounded-full bg-current origin-center transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }}
              />
              <span
                className="block w-[18px] h-[1.5px] rounded-full bg-current transition-all duration-250 ease-out"
                style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0.2)' : 'none' }}
              />
              <span
                className="block w-[18px] h-[1.5px] rounded-full bg-current origin-center transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile sheet ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: `visibility 0ms ${menuOpen ? '0ms' : '420ms'}`,
        }}
      >
        <div
          className="absolute inset-0"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          style={{
            background: 'color-mix(in srgb, var(--bg) 92%, transparent)',
            backdropFilter: menuOpen ? 'blur(20px)' : 'blur(0px)',
            WebkitBackdropFilter: menuOpen ? 'blur(20px)' : 'blur(0px)',
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 420ms cubic-bezier(0.16,1,0.3,1), backdrop-filter 420ms ease',
          }}
        />

        <div className="grid-bg absolute inset-0 pointer-events-none opacity-60" aria-hidden="true" />

        <div className="relative flex flex-col items-center justify-center h-full px-6">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.id}
              href={pathname === '/' ? `#${item.id}` : (item.path || `/#${item.id}`)}
              onClick={e => { e.preventDefault(); navTo(item.id, item.path) }}
              className="relative py-2.5 text-[34px] font-bold tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                color: active === item.id ? 'var(--accent)' : 'var(--text)',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'none' : 'translateY(18px)',
                filter: menuOpen ? 'blur(0)' : 'blur(8px)',
                transition: `opacity 520ms cubic-bezier(0.16,1,0.3,1) ${menuOpen ? i * 55 + 90 : 0}ms,
                             transform 520ms cubic-bezier(0.16,1,0.3,1) ${menuOpen ? i * 55 + 90 : 0}ms,
                             filter 520ms cubic-bezier(0.16,1,0.3,1) ${menuOpen ? i * 55 + 90 : 0}ms,
                             color 200ms ease`,
              }}
            >
              <span className="mr-3 text-sm font-mono align-middle text-[--text-dim]">
                0{i + 1}
              </span>
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={e => { e.preventDefault(); navTo('contact') }}
            className="btn btn-primary mt-9 text-base px-9 py-3.5"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'none' : 'translateY(18px)',
              transition: `opacity 520ms cubic-bezier(0.16,1,0.3,1) ${menuOpen ? NAV_ITEMS.length * 55 + 120 : 0}ms,
                           transform 520ms cubic-bezier(0.16,1,0.3,1) ${menuOpen ? NAV_ITEMS.length * 55 + 120 : 0}ms`,
            }}
          >
            Hire Me
          </a>

          <div
            className="flex gap-3 mt-7"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'none' : 'translateY(18px)',
              transition: `opacity 520ms cubic-bezier(0.16,1,0.3,1) ${menuOpen ? NAV_ITEMS.length * 55 + 180 : 0}ms,
                           transform 520ms cubic-bezier(0.16,1,0.3,1) ${menuOpen ? NAV_ITEMS.length * 55 + 180 : 0}ms`,
            }}
          >
            {MOBILE_SOCIALS.map(s => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-md glass-card glass-card-hover grid place-items-center text-[--text-muted] hover:text-[--accent]"
              >
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
