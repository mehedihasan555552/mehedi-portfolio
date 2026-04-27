/**
 * Footer is a pure Server Component.
 * We hardcode the year to avoid server/client mismatch.
 * Update once a year or use a client component wrapper if needed.
 */
const YEAR = 2025

const QUICK_LINKS = ['About', 'Experience', 'Skills', 'Projects', 'Education', 'Contact']
const SOCIALS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/mehedihasan555552/' },
  { name: 'GitHub',   href: 'https://github.com/mehedihasan555552' },
  { name: 'Twitter',  href: 'https://x.com/ridoy123439' },
  { name: 'Facebook', href: 'https://www.facebook.com/mehedihasan555552/' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[--border] py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f7fff] to-[#9b5de5] flex items-center justify-center text-sm font-bold text-white"
                aria-hidden="true"
              >
                MH
              </div>
              <div>
                <div
                  className="font-bold text-lg dark:text-white text-[#0e0c1f]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Mehedi Hasan
                </div>
                <div className="text-xs font-mono dark:text-white/40 text-[#6b689a] font-semibold">
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
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-black dark:text-white text-[#0e0c1f] mb-4 font-mono uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map(l => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="text-sm dark:text-white/55 text-[#3b3860] hover:text-[--accent] transition-colors font-semibold"
                >
                  {l}
                </a>
              ))}
            </div>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-black dark:text-white text-[#0e0c1f] mb-4 font-mono uppercase tracking-wider">
              Contact
            </h3>
            <address className="not-italic space-y-1.5 text-sm dark:text-white/55 text-[#3b3860] font-semibold">
              <div>
                <a href="mailto:mehediswpu@gmail.com" className="hover:text-[--accent] transition-colors">
                  mehediswpu@gmail.com
                </a>
              </div>
              <div>
                <a href="tel:+8801521333362" className="hover:text-[--accent] transition-colors">
                  +8801521-333362
                </a>
              </div>
              <div>Savar, Dhaka, Bangladesh</div>
            </address>
          </div>
        </div>

        <div className="pt-8 border-t border-[--border] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm dark:text-white/35 text-[#6b689a] font-semibold">
            © {YEAR} Md Mehedi Hasan. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {SOCIALS.map(s => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="text-xs dark:text-white/35 text-[#6b689a] hover:text-[--accent] transition-colors font-bold"
              >
                {s.name}
              </a>
            ))}
          </div>
          <p className="text-xs dark:text-white/35 text-[#6b689a] font-semibold">
            Built with <span className="text-[--accent] font-bold">Next.js 14</span> &amp;{' '}
            <span className="text-[--accent] font-bold">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
