'use client'
import { useCallback, memo, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import SocialIcon from './SocialIcon'
import { useTypewriter } from '@/hooks/useTypewriter'
import me from '../../images/1.jpg'

/* ─── Constants ─────────────────────────────────────────────── */
const ROLES = [
  'Full-Stack Developer',
  'AI/ML Engineer',
  'LLM Architect',
  'Python Expert',
  'Backend Craftsman',
]

const SOCIALS = [
  { href: 'https://www.linkedin.com/in/mehedihasan555552/', name: 'linkedin' as const, label: 'LinkedIn' },
  { href: 'https://github.com/mehedihasan555552',           name: 'github'   as const, label: 'GitHub'   },
  { href: 'https://x.com/ridoy123439',                      name: 'twitter'  as const, label: 'Twitter'  },
  { href: 'https://www.facebook.com/mehedihasan555552/',    name: 'facebook' as const, label: 'Facebook' },
]

const TECH_STACK = [
  { label: 'Python',    color: '#3b82f6' },
  { label: 'Django',    color: '#22c55e' },
  { label: 'React',     color: '#38bdf8' },
  { label: 'LangChain', color: '#a78bfa' },
  { label: 'FastAPI',   color: '#34d399' },
  { label: 'OpenAI',    color: '#f472b6' },
]

const CODE_LINES = [
  { text: 'class MehediHasan(SoftwareEngineer):',   color: '#22c55e' },
  { text: '    stack = ["Python", "Django", "AI"]',  color: '#94a3b8' },
  { text: '    passion = "Building the future"',     color: '#94a3b8' },
  { text: '',                                         color: '' },
  { text: '    def solve(self, problem) -> Impact:',  color: '#38bdf8' },
  { text: '        plan = self.architect(problem)',   color: '#94a3b8' },
  { text: '        code = self.craft(plan)',          color: '#94a3b8' },
  { text: '        return self.ship(code)  # 🚀',     color: '#f472b6' },
  { text: '',                                         color: '' },
  { text: '>>> MehediHasan().solve("your_problem")',  color: '#fbbf24' },
  { text: '> "Impact delivered." ✓',                 color: '#22c55e' },
]

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  w:        ((i * 7)  % 3 + 1.5).toFixed(1),
  left:     ((i * 17 + 5) % 100).toFixed(1),
  top:      ((i * 13 + 8) % 100).toFixed(1),
  opacity:  ((i * 3)  % 4 * 0.06 + 0.06).toFixed(2),
  duration: ((i * 1.1 % 5) + 5).toFixed(1),
  delay:    ((i * 0.7) % 5).toFixed(1),
  color:    i % 3 === 0 ? 'var(--accent)' : i % 3 === 1 ? '#38bdf8' : '#a78bfa',
}))

/* ─── Sub-components ────────────────────────────────────────── */

function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [charCount, setCharCount]       = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let lineIdx = 0
    let charIdx = 0

    function tick() {
      const line = CODE_LINES[lineIdx]
      if (!line) return

      if (charIdx <= line.text.length) {
        setVisibleLines(lineIdx + 1)
        setCharCount(charIdx)
        charIdx++
        timerRef.current = setTimeout(tick, 36)
      } else {
        lineIdx++
        charIdx = 0
        if (lineIdx >= CODE_LINES.length) {
          timerRef.current = setTimeout(() => {
            setVisibleLines(0)
            setCharCount(0)
            lineIdx = 0
            charIdx = 0
            timerRef.current = setTimeout(tick, 60)
          }, 3800)
        } else {
          timerRef.current = setTimeout(tick, 55)
        }
      }
    }

    timerRef.current = setTimeout(tick, 400)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-[--border] shadow-2xl"
      style={{ background: '#0d1117' }}
    >
      <div
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[--border]"
        style={{ background: '#161b22' }}
      >
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57] flex-shrink-0" />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#febc2e] flex-shrink-0" />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840] flex-shrink-0" />
        <span className="ml-2 font-mono text-[9px] sm:text-[10px] md:text-xs text-[#8b949e] truncate">
          mehedi@dev ~ /portfolio/engineer.py
        </span>
      </div>

      <div className="p-3 sm:p-4 font-mono text-[10px] sm:text-[11px] lg:text-[12px] leading-5 sm:leading-[1.6] min-h-[170px] sm:min-h-[205px] overflow-x-auto">
        {CODE_LINES.map((line, i) => {
          const isCurrentLine = i === visibleLines - 1
          const isVisible     = i < visibleLines - 1
          const displayText   = isCurrentLine
            ? line.text.slice(0, charCount)
            : isVisible ? line.text : ''

          return (
            <div key={i} className="flex min-w-0">
              <span className="select-none mr-3 sm:mr-4 text-[#3d444d] w-4 text-right flex-shrink-0 text-[9px] sm:text-[10px]">
                {i + 1}
              </span>
              <span style={{ color: line.color || 'transparent', whiteSpace: 'pre' }}>
                {displayText}
                {isCurrentLine && (
                  <span className="inline-block w-[2px] h-[10px] sm:h-[12px] bg-[#22c55e] ml-[1px] align-middle animate-pulse" />
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Tech badge — shifted upward via a tighter vertical ellipse (yRadius 32 instead of 40)
 * and a vertical offset of -8% so badges sit higher and don't overlap the photo bottom.
 */
function TechBadge({
  label, color, index, total,
}: { label: string; color: string; index: number; total: number }) {
  const angle = (index / total) * 360
  const rad   = (angle * Math.PI) / 180
  // Wider horizontal spread (55), smaller vertical spread (32), shifted up (-8%)
  const x     = 50 + 55 * Math.cos(rad)
  const y     = 42 + 32 * Math.sin(rad)   // ← was: 50 + 40 * sin

  return (
    <div
      className="absolute skill-pill text-[8px] sm:text-[9px] md:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 animate-float whitespace-nowrap"
      style={{
        left:              `${x}%`,
        top:               `${y}%`,
        transform:         'translate(-50%, -50%)',
        borderColor:       `${color}40`,
        color,
        animationDelay:    `${index * 0.4}s`,
        animationDuration: `${5 + index * 0.35}s`,
      }}
    >
      {label}
    </div>
  )
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div
      className="glass-card glass-card-hover rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-center"
      style={{ borderTop: `2px solid ${color}` }}
    >
      <div
        className="font-black text-lg sm:text-xl md:text-2xl"
        style={{ color, fontFamily: 'var(--font-display)' }}
      >
        {value}
      </div>
      <div className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-[--text-muted] uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  )
}

const TypedRole = memo(function TypedRole({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 min-h-[2rem] sm:min-h-[2.75rem]">
      <div
        className="w-[3px] h-6 sm:h-9 rounded-full flex-shrink-0"
        style={{ background: 'var(--accent)' }}
      />
      <span
        className="text-sm sm:text-xl md:text-2xl font-mono font-semibold type-cursor"
        style={{ color: 'var(--accent)' }}
        aria-live="polite"
        aria-label={`Current role: ${text}`}
      >
        {text}
      </span>
    </div>
  )
})

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

/* ─── Main Component ─────────────────────────────────────────── */
export default function Hero() {
  const displayed = useTypewriter(ROLES)

  const handleScroll = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault()
      scrollTo(id)
    },
    []
  )

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20"
      aria-label="Hero section"
    >
      {/* ── Background decorations ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--accent) 1px, transparent 1px),' +
              'linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 10% 20%, rgba(34,197,94,0.07) 0%, transparent 60%),' +
              'radial-gradient(ellipse 55% 45% at 90% 80%, rgba(56,189,248,0.05) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute top-1/4 left-[15%] w-[200px] sm:w-[320px] lg:w-[400px] h-[200px] sm:h-[320px] lg:h-[400px] rounded-full animate-morph opacity-[0.04] blur-3xl"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute bottom-1/4 right-[15%] w-[160px] sm:w-[260px] lg:w-[340px] h-[160px] sm:h-[260px] lg:h-[340px] rounded-full animate-morph opacity-[0.03] blur-3xl"
          style={{ background: '#38bdf8', animationDelay: '4s' }}
        />
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width:             `${p.w}px`,
              height:            `${p.w}px`,
              left:              `${p.left}%`,
              top:               `${p.top}%`,
              opacity:           p.opacity,
              background:        p.color,
              animationDuration: `${p.duration}s`,
              animationDelay:    `${p.delay}s`,
            }}
          />
        ))}
      </div>{/* END background */}

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-center">

          {/* ════ LEFT — always order-1 on mobile so text comes first ════ */}
          <div className="order-1 lg:order-1 animate-fade-in-up">

            {/* Availability badge */}
            <div
              className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[--border] font-mono text-[9px] sm:text-xs text-[--text-muted]"
              style={{ background: 'var(--card)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[--accent] animate-pulse flex-shrink-0" />
              Available for new projects · Dhaka, BD
            </div>

            {/* Name block */}
            <div className="mb-4 sm:mb-5 space-y-0.5">
              <p className="text-xs sm:text-sm md:text-base dark:text-white/50 text-[#3b3860] font-mono">
                // Hello, I&apos;m
              </p>
              <h1
                className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl xl:text-7xl font-black dark:text-white text-[#0e0c1f] leading-[1.05]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Mehedi
                <br />
                <span className="gradient-text">Hasan</span>
              </h1>
              <p className="font-mono text-[10px] sm:text-xs text-[--text-muted] mt-1.5">
                — crafting the future with code &amp; AI
              </p>
            </div>

            <TypedRole text={displayed} />

            <p className="text-sm sm:text-base md:text-lg dark:text-white/70 text-[#1a1640] leading-relaxed max-w-lg mb-6 sm:mb-8 font-medium">
              Full-Stack Python Django Developer &amp; AI/ML Consultant building{' '}
              <strong className="dark:text-white text-[#0e0c1f] font-bold">
                intelligent web applications
              </strong>{' '}
              and advanced ML/NLP solutions for real-world impact.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-8">
              <StatCard value="5+"  label="Yrs Exp"    color="var(--accent)" />
              <StatCard value="40+" label="Projects"   color="#38bdf8" />
              <StatCard value="99%" label="Client Sat" color="#a78bfa" />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-8">
              <a
                href="#contact"
                onClick={handleScroll('contact')}
                className="px-4 sm:px-6 py-2.5 sm:py-3 font-bold text-xs sm:text-sm font-mono rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'var(--accent)', color: '#000' }}
              >
                &gt; Let&apos;s Work Together_
              </a>
              <a
                href="#projects"
                onClick={handleScroll('projects')}
                className="px-4 sm:px-6 py-2.5 sm:py-3 glass-card glass-card-hover dark:text-white text-[#0e0c1f] font-bold text-xs sm:text-sm font-mono rounded-lg sm:rounded-xl"
              >
                ./view-projects.sh
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-[8px] sm:text-[10px] dark:text-white/30 text-[#6b689a] uppercase tracking-widest font-mono font-bold flex-shrink-0">
                Connect
              </span>
              <div className="flex-1 h-px bg-[--border]" />
              {SOCIALS.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg glass-card flex items-center justify-center dark:text-white/50 text-[#3b3860] hover:text-[--accent] hover:border-[--accent] transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>{/* ════ END LEFT ════ */}

          {/* ════ RIGHT — order-2 on mobile so image+terminal come AFTER text ════ */}
          <div
            className="order-2 lg:order-2 flex flex-col items-center gap-6 sm:gap-8 lg:gap-6 animate-fade-in-up"
            style={{ animationDelay: '0.15s' }}
          >
            {/* Avatar orbit — extra top padding so badges have room above */}
            <div className="relative flex justify-center w-full pt-10 sm:pt-12 lg:pt-10">
              <div className="relative w-44 h-44 xs:w-52 xs:h-52 sm:w-60 sm:h-60 lg:w-64 lg:h-64 xl:w-72 xl:h-72">

                {/* Dashed orbit rings */}
                <div
                  className="absolute inset-0 animate-spin-slow rounded-full border border-dashed"
                  style={{ margin: '-28px', borderColor: 'rgba(34,197,94,0.15)' }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 animate-spin-rev rounded-full border border-dashed"
                  style={{ margin: '-16px', borderColor: 'rgba(56,189,248,0.12)' }}
                  aria-hidden="true"
                />

                {/* Floating tech badges */}
                <div className="absolute" style={{ inset: '-56px' }} aria-hidden="true">
                  {TECH_STACK.map((t, i) => (
                    <TechBadge key={t.label} {...t} index={i} total={TECH_STACK.length} />
                  ))}
                </div>

                {/* Glow halo */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl scale-125 animate-glow-pulse"
                  style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.14), rgba(56,189,248,0.07))' }}
                  aria-hidden="true"
                />

                {/* Photo */}
                <div
                  className="relative w-full h-full rounded-full overflow-hidden border-2 shadow-2xl"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Image
                    src={me}
                    alt="Mehedi Hasan — Full-Stack & AI Engineer"
                    fill
                    priority
                    fetchPriority="high"
                    quality={100}
                    className="object-cover"
                    sizes="(max-width:480px) 176px, (max-width:640px) 208px, (max-width:1024px) 240px, (max-width:1280px) 256px, 288px"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                {/* Name card */}
                <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 w-max px-3 sm:px-4 py-1.5 sm:py-2 glass-card rounded-lg sm:rounded-xl shadow-2xl text-center">
                  <div className="font-bold dark:text-white text-[#0e0c1f] text-[9px] sm:text-xs font-mono">
                    Md Mehedi Hasan
                  </div>
                  <div
                    className="font-mono text-[8px] sm:text-[10px] font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    Sr. Full-Stack &amp; LLM Eng.
                  </div>
                </div>

              </div>
            </div>{/* END avatar orbit */}

            {/* Terminal window */}
            <div className="w-full mt-8 sm:mt-10 lg:mt-8">
              <TerminalWindow />
            </div>

          </div>{/* ════ END RIGHT ════ */}

        </div>{/* END grid */}
      </div>{/* END max-w-7xl */}

      {/* Scroll hint */}
      <a
        href="#about"
        onClick={handleScroll('about')}
        className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-2 animate-bounce-slow cursor-pointer group"
        aria-label="Scroll to About section"
      >
        <span className="text-[8px] sm:text-[10px] dark:text-white/30 text-[#6b689a] font-mono uppercase tracking-widest group-hover:text-[--accent] transition-colors">
          scroll
        </span>
        <div className="w-4 sm:w-5 h-6 sm:h-8 rounded-full border border-[--border] flex items-start justify-center pt-1 sm:pt-1.5">
          <div
            className="w-0.5 h-1.5 sm:h-2.5 rounded-full animate-bounce"
            style={{ background: 'var(--accent)' }}
          />
        </div>
      </a>

    </section>
  )
}