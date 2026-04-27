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

const ThemeButton = memo(function ThemeButton({ theme, toggle }: { theme: string; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-[--text-muted] hover:text-[--accent] transition-colors duration-200 hover:scale-110"
    >
      {theme === 'dark' ? (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  )
})

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
        // Find active section
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

  // Close on resize ≥ md
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navTo = useCallback((id: string) => {
    setMenuOpen(false)
    // Small delay lets overlay fade before scroll
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [])

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-[background,border,shadow] duration-500 ${
          scrolled
            ? 'dark:bg-[#080810]/90 bg-white/90 backdrop-blur-xl dark:border-b dark:border-[#1c1c2e] border-b border-[#dddaf5] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f7fff] to-[#9b5de5] flex items-center justify-center text-sm font-bold text-white shadow-lg">
              MH
            </div>
            <div className="leading-none hidden sm:block">
              <div className="font-bold text-lg dark:text-white text-[#1a1830]" style={{ fontFamily: 'var(--font-display)' }}>
                Mehedi<span className="text-[--accent]">.</span>
              </div>
              <div className="text-[10px] font-mono text-[--text-dim] tracking-widest uppercase">Full-Stack &amp; AI</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1" role="list">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={e => { e.preventDefault(); navTo(item.id) }}
                className={`nav-ul px-3 py-2 text-[15px] font-medium rounded-lg transition-colors duration-200 ${
                  active === item.id
                    ? 'text-[--accent] active'
                    : 'text-[--text-muted] hover:dark:text-white hover:text-[#1a1830]'
                }`}
                aria-current={active === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeButton theme={theme} toggle={toggle} />

            <a
              href="#contact"
              onClick={e => { e.preventDefault(); navTo('contact') }}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] text-white rounded-xl transition-[transform,box-shadow] duration-200 hover:shadow-lg hover:shadow-[#4f7fff]/30 hover:-translate-y-0.5"
            >
              Hire Me ✦
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden w-10 h-10 rounded-xl glass-card flex flex-col items-center justify-center gap-[5px]"
            >
              <span className={`block w-5 h-[2px] rounded-full bg-current transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-5 h-[2px] rounded-full bg-current transition-[opacity,transform] duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-[2px] rounded-full bg-current transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-40 md:hidden transition-[opacity,visibility] duration-350 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 dark:bg-[#080810]/96 bg-white/96 backdrop-blur-2xl"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
        {/* Links */}
        <div className="relative flex flex-col items-center justify-center h-full gap-1 px-6">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={e => { e.preventDefault(); navTo(item.id) }}
              className={`text-4xl font-black py-3 transition-[opacity,transform,color] duration-300 ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              } ${active === item.id ? 'text-[--accent]' : 'dark:text-white text-[#1a1830] hover:text-[--accent]'}`}
              style={{ fontFamily: 'var(--font-display)', transitionDelay: `${i * 55}ms` }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); navTo('contact') }}
            className={`mt-6 px-8 py-3.5 bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] text-white font-bold text-lg rounded-2xl transition-[opacity,transform] duration-300 ${
              menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${NAV_ITEMS.length * 55}ms` }}
          >
            Hire Me ✦
          </a>
          {/* Social row */}
          <div className={`flex gap-4 mt-6 transition-[opacity,transform] duration-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${(NAV_ITEMS.length + 1) * 55}ms` }}
          >
            {([
              { href: 'https://www.linkedin.com/in/mehedihasan555552/', name: 'linkedin' as const, label: 'LinkedIn' },
              { href: 'https://github.com/mehedihasan555552', name: 'github' as const, label: 'GitHub' },
              { href: 'https://x.com/ridoy123439', name: 'twitter' as const, label: 'Twitter' },
            ]).map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-[--text-muted] hover:text-[--accent] transition-colors"
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
