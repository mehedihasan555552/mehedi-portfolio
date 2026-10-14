'use client'
import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { usePortfolioData } from '@/context/PortfolioDataContext'
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

export const MehediLogo = memo(function MehediLogo({ size = 44 }: { size?: number }) {
  return (
    <div
      className="logo-emblem-shell grid place-items-center flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mh-ai-grad" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3ddc84" />
            <stop offset="50%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="mh-core-glow" x1="12" y1="10" x2="32" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3ddc84" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <polygon
          points="22,5 36,13 36,31 22,39 8,31 8,13"
          fill="url(#mh-core-glow)"
          stroke="url(#mh-ai-grad)"
          strokeOpacity="0.45"
          strokeWidth="1"
        />

        <circle
          cx="22"
          cy="22"
          r="16.5"
          stroke="url(#mh-ai-grad)"
          strokeWidth="1.1"
          strokeDasharray="4 5"
          strokeOpacity="0.6"
        />

        <path
          d="M12.5 29.5V15.5L22 23.5L31.5 15.5V29.5"
          stroke="url(#mh-ai-grad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M22 11.5V23.5"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />

        <circle cx="12.5" cy="15.5" r="2.2" fill="#3ddc84" />
        <circle cx="31.5" cy="15.5" r="2.2" fill="#38bdf8" />
        <circle cx="22" cy="11.5" r="2.1" fill="#a78bfa" />
        <circle cx="22" cy="23.5" r="2.5" fill="#ffffff" stroke="#3ddc84" strokeWidth="1.2" />
        <circle cx="12.5" cy="29.5" r="1.9" fill="#2dd4bf" />
        <circle cx="31.5" cy="29.5" r="1.9" fill="#2dd4bf" />
      </svg>
    </div>
  )
})

const ThemeButton = memo(function ThemeButton({
  theme, toggle,
}: { theme: string; toggle: (e?: React.MouseEvent) => void }) {
  const isDark = theme === 'dark'
  return (
    <button
      onClick={(e) => toggle(e)}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative w-10 h-10 rounded-xl glass-card glass-card-hover grid place-items-center text-[--text-muted] hover:text-[--accent] overflow-hidden cursor-pointer"
    >
      <span className="relative block w-5 h-5 pointer-events-none">
        <svg
          className="absolute inset-0 w-5 h-5 transition-all duration-300"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.3)',
          }}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.5" />
          <path strokeLinecap="round" d="M12 2v2.4M12 19.6V22M4.22 4.22l1.7 1.7M18.08 18.08l1.7 1.7M2 12h2.4M19.6 12H22M4.22 19.78l1.7-1.7M18.08 5.92l1.7-1.7" />
        </svg>
        <svg
          className="absolute inset-0 w-5 h-5 transition-all duration-300"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'rotate(90deg) scale(0.3)' : 'rotate(0deg) scale(1)',
          }}
          fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </span>
    </button>
  )
})

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const [taglineIdx, setTaglineIdx] = useState(0)
  const [pill, setPill] = useState<{ left: number; width: number; on: boolean }>({
    left: 0, width: 0, on: false,
  })
  const { theme, toggle } = useTheme()
  const { db } = usePortfolioData()
  const { profile } = db
  const pathname = usePathname()
  const router = useRouter()

  const listRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  const taglines = profile.navTaglines?.length
    ? profile.navTaglines
    : ['AGENTIC AI · LLM ARCHITECT']

  useEffect(() => {
    const id = window.setInterval(() => {
      setTaglineIdx(i => (i + 1) % taglines.length)
    }, 4500)
    return () => window.clearInterval(id)
  }, [taglines.length])

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
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

  const scrollToTop = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setMenuOpen(false)
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      try {
        window.history.pushState(null, '', '/')
      } catch {}
      setActive('')
      movePill(null)
    } else {
      router.push('/')
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    }
  }, [pathname, router, movePill])

  const mobileSocials = [
    { href: profile.linkedin, name: 'linkedin' as const, label: 'LinkedIn' },
    { href: profile.github, name: 'github' as const, label: 'GitHub' },
    { href: profile.twitter, name: 'twitter' as const, label: 'Twitter' },
  ]

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300"
        style={{
          background: scrolled ? 'color-mix(in srgb, var(--bg) 88%, transparent)' : 'color-mix(in srgb, var(--bg) 60%, transparent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          boxShadow: scrolled ? 'var(--sh-1)' : 'none',
        }}
      >
        <div className="container-x h-[72px] flex items-center justify-between gap-4">

          {/* Brand Lockup — Clean (No v3.0 badge) */}
          <Link
            href="/"
            onClick={scrollToTop}
            className="flex items-center gap-3.5 flex-shrink-0 group cursor-pointer"
            aria-label={`${profile.name} — Home`}
          >
            <MehediLogo size={42} />

            <div className="flex flex-col justify-center leading-none">
              <span
                className="font-extrabold text-[19px] sm:text-[20.5px] tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
              >
                {profile.brandName}<span className="gradient-text">{profile.brandHighlight}</span>
              </span>

              <div className="mt-1.5 flex items-center gap-1.5 h-[15px] overflow-hidden">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'var(--accent)' }}
                  aria-hidden="true"
                />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={taglineIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.24 }}
                    className="text-[10px] sm:text-[10.5px] font-mono font-extrabold tracking-[0.14em] uppercase whitespace-nowrap"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {taglines[taglineIdx % taglines.length]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div
            ref={listRef}
            className="hidden lg:flex items-center gap-0.5 relative px-2 py-1 rounded-full"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--sh-1)',
            }}
            onMouseLeave={() => movePill(active || null)}
          >
            <span
              aria-hidden="true"
              className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full pointer-events-none"
              style={{
                left: pill.left,
                width: pill.width,
                background: 'var(--accent-soft)',
                border: '1px solid var(--accent-line)',
                opacity: pill.on ? 1 : 0,
                transition: 'left 360ms cubic-bezier(0.16,1,0.3,1), width 360ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease',
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
                  className="relative z-10 px-4 py-1.5 text-[14px] font-bold rounded-full transition-colors duration-200"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
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
              className="hidden lg:inline-flex btn btn-primary text-[13.5px] font-bold py-2.5 px-5"
            >
              Hire Me ↗
            </a>

            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden relative z-[60] w-10 h-10 rounded-xl glass-card flex flex-col items-center justify-center gap-[5px] text-[--text] cursor-pointer"
            >
              <span
                className="block w-[18px] h-[1.5px] rounded-full bg-current origin-center transition-transform duration-300"
                style={{ transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }}
              />
              <span
                className="block w-[18px] h-[1.5px] rounded-full bg-current transition-opacity duration-200"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="block w-[18px] h-[1.5px] rounded-full bg-current origin-center transition-transform duration-300"
                style={{ transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <div
          className="absolute inset-0"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          style={{
            background: 'color-mix(in srgb, var(--bg) 95%, transparent)',
            backdropFilter: 'blur(14px)',
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 300ms ease',
          }}
        />

        <div className="relative flex flex-col items-center justify-center h-full px-6">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.id}
              href={pathname === '/' ? `#${item.id}` : (item.path || `/#${item.id}`)}
              onClick={e => { e.preventDefault(); navTo(item.id, item.path) }}
              className="relative py-2.5 text-[30px] font-extrabold tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                color: active === item.id ? 'var(--accent)' : 'var(--text)',
              }}
            >
              <span className="mr-3 text-sm font-mono font-bold align-middle text-[--text-dim]">
                0{i + 1}
              </span>
              {item.label}
            </a>
          ))}



          <a
            href="#contact"
            onClick={e => { e.preventDefault(); navTo('contact') }}
            className="btn btn-primary mt-6 text-base font-bold px-9 py-3.5"
          >
            Hire Me
          </a>

          <div className="flex gap-3 mt-6">
            {mobileSocials.map(s => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-md glass-card grid place-items-center text-[--text-muted] hover:text-[--accent]"
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
