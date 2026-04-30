'use client'
import { useState, useEffect, useCallback, memo } from 'react'
import { useTheme } from '@/context/ThemeContext'
import SocialIcon from './SocialIcon'
import Link from 'next/link'

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Education', id: 'education' },
  { label: 'Contact', id: 'contact' },
]

// ─── Custom SVG Logo ──────────────────────────────────────────────────────────
const MehediLogo = memo(function MehediLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f7fff" />
          <stop offset="100%" stopColor="#9b5de5" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f7fff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9b5de5" stopOpacity="0.1" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer rounded square */}
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#glowGrad)" />
      <rect x="1" y="1" width="38" height="38" rx="11" stroke="url(#logoGrad)" strokeWidth="1.5" strokeOpacity="0.6" />

      {/* Inner geometric mark — stylized "M" built from nodes + connecting lines */}
      <g filter="url(#logoGlow)">
        {/* Left vertical bar */}
        <rect x="9" y="11" width="3.5" height="18" rx="1.75" fill="url(#logoGrad)" />
        {/* Right vertical bar */}
        <rect x="27.5" y="11" width="3.5" height="18" rx="1.75" fill="url(#logoGrad)" />
        {/* Left diagonal */}
        <path
          d="M9 11.5 L20 20.5"
          stroke="url(#logoGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Right diagonal */}
        <path
          d="M31 11.5 L20 20.5"
          stroke="url(#logoGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Center diamond node */}
        <circle cx="20" cy="20.5" r="2.8" fill="#9b5de5" opacity="0.9" />
        <circle cx="20" cy="20.5" r="1.4" fill="white" opacity="0.9" />
      </g>

      {/* Subtle corner accent dots */}
      <circle cx="7" cy="7" r="1.2" fill="#4f7fff" opacity="0.4" />
      <circle cx="33" cy="33" r="1.2" fill="#9b5de5" opacity="0.4" />
    </svg>
  )
})

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
const ThemeButton = memo(function ThemeButton({
  theme,
  toggle,
}: {
  theme: string
  toggle: () => void
}) {
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="
        relative w-10 h-10 rounded-xl glass-card
        flex items-center justify-center
        text-[#64627a] dark:text-[#9d9ab8] hover:text-[#4f7fff] dark:hover:text-[#4f7fff]
        transition-all duration-300
        hover:scale-110 hover:shadow-md hover:shadow-[#4f7fff]/20
        overflow-hidden group
      "
    >
      {/* Hover bg fill */}
      <span className="absolute inset-0 bg-gradient-to-br from-[#4f7fff]/10 to-[#9b5de5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      {theme === 'dark' ? (
        <svg
          className="w-[18px] h-[18px] relative z-10 transition-transform duration-500 group-hover:rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          className="w-[18px] h-[18px] relative z-10 transition-transform duration-500 group-hover:-rotate-12"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
})

// ─── Active Indicator Pill ────────────────────────────────────────────────────
function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number]
  isActive: boolean
  onClick: (id: string) => void
}) {
  return (
    <a
      href={`#${item.id}`}
      onClick={(e) => {
        e.preventDefault()
        onClick(item.id)
      }}
      aria-current={isActive ? 'page' : undefined}
      className={`
        relative nav-ul px-3.5 py-2 text-[14.5px] font-medium rounded-lg
        transition-all duration-200
        ${isActive
          ? 'text-[#4f7fff]'
          : 'text-[#64627a] dark:text-[#9d9ab8] hover:text-[#1a1830] dark:hover:text-white'
        }
      `}
    >
      {isActive && (
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#4f7fff]/12 to-[#9b5de5]/12 pointer-events-none" />
      )}
      {item.label}
      {isActive && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4f7fff]" />
      )}
    </a>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const { theme, toggle } = useTheme()

  // Throttled scroll handler
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50)
        for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
          const el = document.getElementById(NAV_ITEMS[i].id)
          if (el && window.scrollY >= el.offsetTop - 140) {
            setActive(NAV_ITEMS[i].id)
            break
          }
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize ≥ md
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navTo = useCallback((id: string) => {
    setMenuOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [])

  return (
    <>
      {/* ── Desktop / Scrolled Nav ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-[background,border-color,box-shadow,padding] duration-500
          ${scrolled
            ? 'dark:bg-[#080810]/90 bg-white/90 backdrop-blur-xl dark:border-b dark:border-[#1c1c2e]/80 border-b border-[#dddaf5]/80 shadow-sm'
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="Mehedi Hassan – Home">
            {/* Logo mark with hover lift */}
            <div className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
              <MehediLogo />
              {/* Glow blob under logo on hover */}
              <span className="absolute -inset-1 rounded-2xl bg-[#4f7fff]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-400 -z-10 pointer-events-none" />
            </div>

            {/* Wordmark */}
            <div className="leading-none hidden sm:block">
              <div
                className="font-extrabold text-[17px] dark:text-white text-[#1a1830] tracking-tight transition-colors duration-200"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Mehedi
                <span className="bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] bg-clip-text text-transparent">
                  .dev
                </span>
              </div>
              <div className="text-[9.5px] font-mono text-[#9d9ab8] dark:text-[#6e6b88] tracking-[0.18em] uppercase mt-[2px]">
                Full‑Stack &amp; AI
              </div>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-0.5" role="list">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.id} item={item} isActive={active === item.id} onClick={navTo} />
            ))}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <ThemeButton theme={theme} toggle={toggle} />

            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); navTo('contact') }}
              className="
                hidden md:inline-flex items-center gap-1.5
                px-4 py-2 text-sm font-semibold
                bg-gradient-to-r from-[#4f7fff] to-[#9b5de5]
                text-white rounded-xl
                transition-all duration-300
                hover:shadow-lg hover:shadow-[#4f7fff]/30 hover:-translate-y-0.5 hover:brightness-110
                relative overflow-hidden group
              "
            >
              {/* Shimmer sweep on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
              Hire Me
              <span className="text-[11px] opacity-80">✦</span>
            </a>

            {/* ── Hamburger ── */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden w-10 h-10 rounded-xl glass-card flex flex-col items-center justify-center gap-[5px] transition-all duration-200 hover:scale-105 text-[#1a1830] dark:text-white"
            >
              <span
                className={`block w-5 h-[2px] rounded-full bg-current transition-transform duration-300 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block w-4 h-[2px] rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? 'opacity-0 scale-x-0' : 'opacity-70'
                }`}
              />
              <span
                className={`block w-5 h-[2px] rounded-full bg-current transition-transform duration-300 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-40 md:hidden transition-[opacity,visibility] duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 dark:bg-[#060610]/97 bg-white/97 backdrop-blur-2xl"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Decorative blobs */}
        <div aria-hidden="true" className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-[#4f7fff]/10 blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-[#9b5de5]/10 blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center h-full gap-0 px-6">

          {/* Logo in mobile menu */}
          <div className={`mb-8 transition-all duration-500 ${menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{ transitionDelay: '0ms' }}
          >
            <MehediLogo />
          </div>

          {/* Nav links */}
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); navTo(item.id) }}
              className={`
                relative text-[38px] font-black py-2.5 tracking-tight
                transition-all duration-400
                ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                ${active === item.id
                  ? 'bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] bg-clip-text text-transparent'
                  : 'text-[#1a1830] dark:text-white hover:bg-gradient-to-r hover:from-[#4f7fff] hover:to-[#9b5de5] hover:bg-clip-text hover:text-transparent'
                }
              `}
              style={{
                fontFamily: 'var(--font-display)',
                transitionDelay: `${i * 50 + 50}ms`,
              }}
            >
              {active === item.id && (
                <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#4f7fff] to-[#9b5de5]" />
              )}
              {item.label}
            </a>
          ))}

          {/* CTA button */}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); navTo('contact') }}
            className={`
              mt-8 px-10 py-3.5 font-bold text-lg rounded-2xl text-white
              bg-gradient-to-r from-[#4f7fff] to-[#9b5de5]
              shadow-lg shadow-[#4f7fff]/25
              transition-all duration-400
              ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: `${NAV_ITEMS.length * 50 + 80}ms` }}
          >
            Hire Me ✦
          </a>

          {/* Social icons */}
          <div
            className={`flex gap-3.5 mt-6 transition-all duration-400 ${
              menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${(NAV_ITEMS.length + 1) * 50 + 80}ms` }}
          >
            {(
              [
                { href: 'https://www.linkedin.com/in/mehedihasan555552/', name: 'linkedin' as const, label: 'LinkedIn' },
                { href: 'https://github.com/mehedihasan555552', name: 'github' as const, label: 'GitHub' },
                { href: 'https://x.com/ridoy123439', name: 'twitter' as const, label: 'Twitter' },
              ] as const
            ).map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-[#64627a] dark:text-[#9d9ab8] hover:text-[#4f7fff] dark:hover:text-[#4f7fff] hover:scale-110 transition-all duration-200"
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