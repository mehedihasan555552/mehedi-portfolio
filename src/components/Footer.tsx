import FooterSocials from '@/components/FooterSocials'

const YEAR = 2026
const QUICK_LINKS = ['About', 'Experience', 'Skills', 'Projects', 'Education', 'Contact']

export default function Footer() {
  return (
    <footer className="relative border-t border-[--border] overflow-hidden" role="contentinfo">

      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: 'linear-gradient(90deg,#4f7fff,#9b5de5)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-8">
        <div className="grid md:grid-cols-3 gap-10 mb-12">

          {/* ── Brand ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg,#4f7fff,#9b5de5)' }}
                aria-hidden="true"
              >
                MH
              </div>
              <div>
                <div
                  className="font-bold text-lg dark:text-white text-[#0e0c1f] leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Mehedi Hasan
                </div>
                <div className="text-xs font-mono dark:text-white/40 text-[#6b689a] font-semibold mt-0.5">
                  Sr. Full-Stack &amp; LLM Engineer
                </div>
              </div>
            </div>

            <p
              className="text-sm dark:text-white/50 text-[#3b3860] leading-relaxed italic font-semibold"
              style={{ fontFamily: 'var(--font-italic)' }}
            >
              Building smart solutions with code &amp; AI.
              <br />
              Full-Stack · AI/ML · Automation.
            </p>

            {/* Availability badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold"
              style={{
                background:   'rgba(34,197,94,0.08)',
                borderColor:  'rgba(34,197,94,0.25)',
                color:        '#22c55e',
              }}
            >
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" aria-hidden="true" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" aria-hidden="true" />
              </span>
              Available for new projects
            </div>
          </div>

          {/* ── Quick Links ── */}
          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-black dark:text-white text-[#0e0c1f] mb-5 font-mono uppercase tracking-widest flex items-center gap-2">
              <span className="inline-block w-1 h-3.5 rounded-full bg-[--accent]" aria-hidden="true" />
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {QUICK_LINKS.map(l => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="group flex items-center gap-2 text-sm dark:text-white/55 text-[#3b3860] hover:text-[--accent] transition-colors duration-200 font-semibold"
                >
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0 dark:bg-white/20 bg-[#3b3860]/30 group-hover:bg-[--accent] transition-colors duration-200"
                    aria-hidden="true"
                  />
                  {l}
                </a>
              ))}
            </div>
          </nav>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-xs font-black dark:text-white text-[#0e0c1f] mb-5 font-mono uppercase tracking-widest flex items-center gap-2">
              <span className="inline-block w-1 h-3.5 rounded-full bg-[--accent]" aria-hidden="true" />
              Contact
            </h3>
            <address className="not-italic space-y-3">
              {[
                { icon: '✉️', value: 'mehediswpu@gmail.com',    href: 'mailto:mehediswpu@gmail.com' },
                { icon: '📞', value: '+8801521-333362',          href: 'tel:+8801521333362'          },
                { icon: '📍', value: 'Savar, Dhaka, Bangladesh', href: null                          },
              ].map(item => (
                <div key={item.value} className="flex items-center gap-2.5">
                  <span className="text-sm flex-shrink-0" aria-hidden="true">{item.icon}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm dark:text-white/55 text-[#3b3860] hover:text-[--accent] transition-colors font-semibold break-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm dark:text-white/55 text-[#3b3860] font-semibold">
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </address>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="h-px w-full mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent)' }}
          aria-hidden="true"
        />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

          <p className="text-xs dark:text-white/30 text-[#6b689a] font-semibold font-mono order-2 sm:order-1">
            © {YEAR} Md Mehedi Hasan. All rights reserved.
          </p>

          {/* ✅ Client island — all event handlers live here */}
          <div className="order-1 sm:order-2">
            <FooterSocials />
          </div>

          <p className="text-xs dark:text-white/25 text-[#9997bb] font-mono order-3 hidden sm:block">
            Built with Next.js &amp; ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}