import FooterSocials from '@/components/FooterSocials'

const YEAR = 2026
const QUICK_LINKS = ['About', 'Experience', 'Skills', 'Projects', 'Education', 'Contact']

const CONTACT = [
  { value: 'mehediswpu@gmail.com',    href: 'mailto:mehediswpu@gmail.com' },
  { value: '+8801521-333362',          href: 'tel:+8801521333362' },
  { value: 'Savar, Dhaka, Bangladesh', href: null },
]

export default function Footer() {
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
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-md grid place-items-center font-mono text-[13px] font-bold flex-shrink-0"
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
                  className="block font-bold text-[16px] leading-tight"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
                >
                  Mehedi Hasan
                </span>
                <span className="block text-[11px] font-mono text-[--text-dim] mt-0.5">
                  Sr. Full-Stack &amp; LLM Engineer
                </span>
              </span>
            </div>

            <p className="text-[13.5px] leading-relaxed text-[--text-muted]">
              Building smart solutions with code &amp; AI.
              <br />
              Full-Stack · AI/ML · Automation.
            </p>

            <div className="announce-badge" style={{ borderColor: 'var(--accent-line)', color: 'var(--accent)' }}>
              <span className="status-dot" aria-hidden="true" />
              Available for new projects
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[--text-muted] mb-5">
              <span className="w-1 h-3.5 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {QUICK_LINKS.map(l => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="group inline-flex items-center gap-2 text-[13.5px] text-[--text-muted] hover:text-[--accent] transition-colors duration-200"
                >
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-300 group-hover:w-3"
                    style={{ background: 'currentColor', opacity: 0.5 }}
                    aria-hidden="true"
                  />
                  {l}
                </a>
              ))}
            </div>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[--text-muted] mb-5">
              <span className="w-1 h-3.5 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              Contact
            </h3>
            <address className="not-italic space-y-2.5">
              {CONTACT.map(item => (
                <div key={item.value}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-[13.5px] text-[--text-muted] hover:text-[--accent] transition-colors duration-200 break-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-[13.5px] text-[--text-muted]">{item.value}</span>
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
          <p className="text-[11.5px] font-mono text-[--text-dim] order-2 sm:order-1">
            © {YEAR} Md Mehedi Hasan. All rights reserved.
          </p>

          <div className="order-1 sm:order-2">
            <FooterSocials />
          </div>

          <p className="text-[11.5px] font-mono text-[--text-dim] order-3 hidden sm:block">
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
