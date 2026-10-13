'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import FooterSocials from '@/components/FooterSocials'

const YEAR = 2026
const QUICK_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Education', href: '/#education' },
  { label: 'Contact', href: '/#contact' },
]

const CONTACT = [
  { value: 'mehediswpu@gmail.com',    href: 'mailto:mehediswpu@gmail.com' },
  { value: '+8801521-333362',          href: 'tel:+8801521333362' },
  { value: 'Savar, Dhaka, Bangladesh', href: null },
]

export default function Footer() {
  const pathname = usePathname()
  const router = useRouter()

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      try {
        window.history.pushState(null, '', '/')
      } catch {}
    } else {
      router.push('/')
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    }
  }

  return (
    <footer className="relative overflow-hidden" role="contentinfo" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Top edge glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-40 opacity-[0.06] blur-[80px] pointer-events-none"
        style={{ background: 'var(--accent)' }}
        aria-hidden="true"
      />

      <div className="container-x pt-14 pb-8 relative">
        <div className="grid md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              onClick={scrollToTop}
              className="inline-flex items-center gap-3 group cursor-pointer"
              aria-label="Mehedi Hasan — Back to top"
            >
              <span
                className="footer-mh-badge w-10 h-10 rounded-xl grid place-items-center font-extrabold text-[13.5px] flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5"
                style={{
                  background: 'var(--accent-soft)',
                  border: '1px solid var(--accent-line)',
                  color: 'var(--accent)',
                }}
                aria-hidden="true"
              >
                MH
              </span>
              <span>
                <span
                  className="block font-extrabold text-[19px] tracking-[-0.015em] leading-tight transition-colors duration-200 group-hover:text-[--accent]"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
                >
                  Mehedi Hasan
                </span>
                <span className="block text-[12.5px] font-mono font-bold text-[--text-dim] mt-0.5">
                  Sr. Full-Stack &amp; LLM Engineer
                </span>
              </span>
            </Link>

            <p className="text-[15px] font-medium leading-relaxed text-[--text-muted]">
              Building smart solutions with code &amp; AI.
              <br />
              Full-Stack · AI/ML · Automation.
            </p>

            <div className="announce-badge font-bold" style={{ borderColor: 'var(--accent-line)', color: 'var(--accent)' }}>
              <span className="status-dot" aria-hidden="true" />
              Available for new projects
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="flex items-center gap-2 text-[11.5px] font-mono font-bold uppercase tracking-[0.2em] text-[--text-muted] mb-5">
              <span className="w-1 h-3.5 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {QUICK_LINKS.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[--text-muted] hover:text-[--accent] transition-colors duration-200"
                >
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-300 group-hover:w-3"
                    style={{ background: 'currentColor', opacity: 0.5 }}
                    aria-hidden="true"
                  />
                  {l.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="flex items-center gap-2 text-[11.5px] font-mono font-bold uppercase tracking-[0.2em] text-[--text-muted] mb-5">
              <span className="w-1 h-3.5 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              Contact
            </h3>
            <address className="not-italic space-y-2.5">
              {CONTACT.map(item => (
                <div key={item.value}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-[15px] font-semibold text-[--text-muted] hover:text-[--accent] transition-colors duration-200 break-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-[15px] font-medium text-[--text-muted]">{item.value}</span>
                  )}
                </div>
              ))}
            </address>
          </div>
        </div>

        <div
          className="h-px w-full mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--border) 18%, var(--border) 82%, transparent)' }}
          aria-hidden="true"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-[12.5px] font-mono font-medium text-[--text-dim] order-2 sm:order-1">
            © {YEAR} Md Mehedi Hasan. All rights reserved.
          </p>

          <div className="order-1 sm:order-2">
            <FooterSocials />
          </div>

          <div className="order-3 flex items-center gap-4">
            <span className="text-[12.5px] font-mono font-medium text-[--text-dim] hidden md:inline">
              Built with Next.js 16 &amp; React 19
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-mono font-bold text-[--text-muted] hover:text-[--accent] transition-colors duration-200 group cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
