'use client'
import { useCallback, memo, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import SocialIcon from './SocialIcon'
import { useTypewriter } from '@/hooks/useTypewriter'
import me from '../../images/professional-mehedi.png'

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

/**
 * Badges sit on the circle inscribed in the orbit wrapper. The wrapper is
 * square and inset negatively from the photo, so `50 ± 50·cos/sin` lands them
 * exactly on a ring outside the portrait — no overlap, no clipping.
 * Angles skip the 60°–120° arc, which is where the name card sits.
 */
const TECH_STACK = [
  { label: 'Python',    angle: -38 },
  { label: 'Django',    angle:  16 },
  { label: 'FastAPI',   angle: 148 },
  { label: 'React',     angle: 190 },
  { label: 'LangChain', angle: 232 },
  { label: 'OpenAI',    angle: 288 },
]

const SYN = {
  kw:   'var(--accent)',
  fn:   '#7cc4f5',
  str:  'var(--signal)',
  dim:  'var(--text-dim)',
  txt:  'var(--text-muted)',
}

const CODE_LINES: { text: string; color: string }[] = [
  { text: 'class MehediHasan(SoftwareEngineer):',  color: SYN.kw  },
  { text: '    stack = ["Python", "Django", "AI"]', color: SYN.txt },
  { text: '    passion = "Building the future"',    color: SYN.txt },
  { text: '',                                        color: ''      },
  { text: '    def solve(self, problem) -> Impact:', color: SYN.fn  },
  { text: '        plan = self.architect(problem)',  color: SYN.txt },
  { text: '        code = self.craft(plan)',         color: SYN.txt },
  { text: '        return self.ship(code)',          color: SYN.str },
  { text: '',                                        color: ''      },
  { text: '>>> MehediHasan().solve("your_problem")', color: SYN.fn  },
  { text: '"Impact delivered."',                     color: SYN.kw  },
]

// Deterministic so server and client markup agree
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  size:     ((i * 7) % 3 + 1.2).toFixed(1),
  left:     ((i * 17 + 5) % 100).toFixed(1),
  top:      ((i * 13 + 8) % 100).toFixed(1),
  opacity:  ((i * 3) % 4 * 0.05 + 0.08).toFixed(2),
  duration: ((i * 1.1 % 6) + 7).toFixed(1),
  delay:    ((i * 0.7) % 6).toFixed(1),
}))

/* ─── Terminal ──────────────────────────────────────────────── */
function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [charCount, setCharCount]       = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleLines(CODE_LINES.length)
      setCharCount(999)
      return
    }

    let lineIdx = 0
    let charIdx = 0

    function tick() {
      const line = CODE_LINES[lineIdx]
      if (!line) return

      if (charIdx <= line.text.length) {
        setVisibleLines(lineIdx + 1)
        setCharCount(charIdx)
        charIdx++
        timerRef.current = setTimeout(tick, 34)
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
          }, 4200)
        } else {
          timerRef.current = setTimeout(tick, 55)
        }
      }
    }

    timerRef.current = setTimeout(tick, 700)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <div
      className="w-full overflow-hidden glass-card relative"
      style={{ borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-3)' }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-1.5 px-3.5 py-2.5 border-b"
        style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}
      >
        <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: '#ff5f57' }} />
        <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: '#febc2e' }} />
        <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: '#28c840' }} />
        <span className="ml-2.5 font-mono text-[10px] sm:text-[11px] truncate text-[--text-dim]">
          mehedi@dev ~/portfolio/engineer.py
        </span>
      </div>

      {/* Code */}
      <div
        className="relative p-4 font-mono text-[10.5px] sm:text-[11.5px] leading-[1.75] min-h-[210px] overflow-hidden"
        style={{ background: 'var(--bg-2)' }}
      >
        {/* Slow scanline for CRT feel */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-[0.35]"
          style={{
            background: 'linear-gradient(180deg, transparent, rgb(var(--accent-rgb) / 0.055), transparent)',
            animation: 'scanline 7s linear infinite',
          }}
          aria-hidden="true"
        />
        {CODE_LINES.map((line, i) => {
          const isCurrent = i === visibleLines - 1
          const isDone    = i < visibleLines - 1
          const display   = isCurrent ? line.text.slice(0, charCount) : isDone ? line.text : ''

          return (
            <div key={i} className="flex min-w-0">
              <span className="select-none mr-4 w-4 text-right flex-shrink-0 text-[9.5px] text-[--text-dim] opacity-60">
                {i + 1}
              </span>
              <span style={{ color: line.color || 'transparent', whiteSpace: 'pre' }}>
                {display}
                {isCurrent && (
                  <span
                    className="inline-block w-[7px] h-[11px] ml-[1px] align-middle"
                    style={{ background: 'var(--accent)', animation: 'blink 1.05s steps(1) infinite' }}
                  />
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Orbiting tech badge ───────────────────────────────────── */
function TechBadge({
  label, angle, index,
}: { label: string; angle: number; index: number }) {
  const rad = (angle * Math.PI) / 180
  const x = 50 + 50 * Math.cos(rad)
  const y = 50 + 50 * Math.sin(rad)

  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <span
        className="skill-pill block text-[9px] sm:text-[10px] px-2 py-1 animate-float"
        style={{
          animationDelay:    `${index * 0.55}s`,
          animationDuration: `${6.5 + index * 0.4}s`,
          background:        'color-mix(in srgb, var(--card) 88%, transparent)',
          backdropFilter:    'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

/* ─── Stat ──────────────────────────────────────────────────── */
function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <div
      className="glass-card glass-card-hover spotlight px-3 py-3.5 text-center animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="text-xl sm:text-2xl font-bold"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
      >
        {value}
      </div>
      <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] text-[--text-dim] mt-1">
        {label}
      </div>
    </div>
  )
}

const TypedRole = memo(function TypedRole({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-7 min-h-[2.25rem] sm:min-h-[2.75rem]">
      <span
        className="w-[3px] h-6 sm:h-8 rounded-full flex-shrink-0"
        style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--glow)' }}
        aria-hidden="true"
      />
      <span
        className="text-base sm:text-xl md:text-2xl font-mono font-semibold type-cursor"
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

/* ─── Main ──────────────────────────────────────────────────── */
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
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
      aria-label="Hero section"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="grid-bg absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 62% 52% at 12% 16%, rgb(var(--accent-rgb) / 0.07), transparent 62%),' +
              'radial-gradient(ellipse 52% 44% at 88% 78%, rgb(var(--signal-rgb) / 0.045), transparent 62%)',
          }}
        />
        <div
          className="absolute top-[18%] left-[10%] w-[280px] lg:w-[420px] aspect-square rounded-full animate-morph opacity-[0.05] blur-[80px]"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute bottom-[16%] right-[12%] w-[220px] lg:w-[340px] aspect-square rounded-full animate-morph opacity-[0.04] blur-[80px]"
          style={{ background: 'var(--signal)', animationDelay: '5s' }}
        />
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width:  `${p.size}px`,
              height: `${p.size}px`,
              left:   `${p.left}%`,
              top:    `${p.top}%`,
              opacity: p.opacity,
              background: 'var(--accent)',
              animationDuration: `${p.duration}s`,
              animationDelay:    `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="container-x w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-16 xl:gap-20 items-center">

          {/* ══ LEFT ══ */}
          <div className="order-1">

            <div className="announce-badge animate-fade-in-up mb-6" style={{ animationDelay: '40ms' }}>
              <span className="status-dot" aria-hidden="true" />
              Available for new projects · Dhaka, BD
            </div>

            <p
              className="font-mono text-xs sm:text-sm text-[--text-dim] mb-2 animate-fade-in-up"
              style={{ animationDelay: '110ms' }}
            >
              // Hello, I&apos;m
            </p>

            <h1
              className="word-rise text-[clamp(2.75rem,8vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.04em] mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span style={{ ['--wd' as string]: '160ms' }}>Mehedi</span>
              <br />
              <span className="gradient-text" style={{ ['--wd' as string]: '280ms' }}>Hasan</span>
            </h1>

            <p
              className="font-mono text-[11px] sm:text-xs text-[--text-dim] mb-7 animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              — crafting the future with code &amp; AI
            </p>

            <div className="animate-fade-in-up" style={{ animationDelay: '470ms' }}>
              <TypedRole text={displayed} />
            </div>

            <p
              className="text-[15px] sm:text-base leading-relaxed max-w-lg mb-8 text-[--text-muted] animate-fade-in-up"
              style={{ animationDelay: '540ms' }}
            >
              Full-Stack Python Django Developer &amp; AI/ML Consultant building{' '}
              <strong className="font-semibold" style={{ color: 'var(--text)' }}>
                intelligent web applications
              </strong>{' '}
              and advanced ML/NLP solutions for real-world impact.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8 max-w-md">
              <StatCard value="5+"  label="Yrs Exp"    delay={600} />
              <StatCard value="40+" label="Projects"   delay={670} />
              <StatCard value="99%" label="Client Sat" delay={740} />
            </div>

            <div
              className="flex flex-wrap gap-3 mb-9 animate-fade-in-up"
              style={{ animationDelay: '810ms' }}
            >
              <a href="#contact" onClick={handleScroll('contact')} className="btn btn-primary">
                &gt; Let&apos;s Work Together_
              </a>
              <a href="#projects" onClick={handleScroll('projects')} className="btn btn-ghost">
                ./view-projects.sh
              </a>
            </div>

            <div
              className="flex items-center gap-3 animate-fade-in-up"
              style={{ animationDelay: '880ms' }}
            >
              <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[--text-dim] flex-shrink-0">
                Connect
              </span>
              <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              {SOCIALS.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-md glass-card glass-card-hover grid place-items-center text-[--text-muted] hover:text-[--accent]"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div
            className="order-2 flex flex-col items-center gap-9 animate-fade-in-up"
            style={{ animationDelay: '260ms' }}
          >
            {/* Portrait + orbit */}
            <div className="relative flex flex-col items-center w-full pt-10">
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-64 lg:h-64">

                {/* Dashed rings */}
                <div
                  className="absolute rounded-full border border-dashed animate-spin-slow"
                  style={{ inset: '-30px', borderColor: 'rgb(var(--accent-rgb) / 0.16)' }}
                  aria-hidden="true"
                />
                <div
                  className="absolute rounded-full border border-dashed animate-spin-rev"
                  style={{ inset: '-15px', borderColor: 'rgb(var(--accent-rgb) / 0.09)' }}
                  aria-hidden="true"
                />

                {/* Halo */}
                <div
                  className="absolute inset-0 rounded-full blur-[60px] scale-125 animate-glow-pulse"
                  style={{ background: 'radial-gradient(circle, rgb(var(--accent-rgb) / 0.22), transparent 70%)' }}
                  aria-hidden="true"
                />

                {/* Photo */}
                <div
                  className="relative w-full h-full rounded-full overflow-hidden"
                  style={{
                    border: '1px solid var(--border-hi)',
                    boxShadow: 'var(--sh-3), 0 0 0 6px rgb(var(--accent-rgb) / 0.05)',
                  }}
                >
                  <Image
                    src={me}
                    alt="Mehedi Hasan — Full-Stack & AI Engineer"
                    fill
                    priority
                    fetchPriority="high"
                    quality={90}
                    className="object-cover"
                    sizes="(max-width:640px) 208px, (max-width:1024px) 240px, 256px"
                  />
                </div>

                {/* Badge ring — square wrapper inset from the photo */}
                <div className="absolute pointer-events-none" style={{ inset: '-36px' }} aria-hidden="true">
                  {TECH_STACK.map((t, i) => (
                    <TechBadge key={t.label} {...t} index={i} />
                  ))}
                </div>

              </div>

              {/* Name plate — kept in flow (tucked up under the portrait) so it
                  always reserves its own space and can never be overlapped. */}
              <div
                className="relative z-10 -mt-5 px-4 py-2 glass-card text-center"
                style={{ boxShadow: 'var(--sh-3)' }}
              >
                <div
                  className="font-semibold text-[11px] sm:text-xs"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
                >
                  Md Mehedi Hasan
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] mt-0.5" style={{ color: 'var(--accent)' }}>
                  Sr. Full-Stack &amp; LLM Eng.
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="w-full">
              <TerminalWindow />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#about"
        onClick={handleScroll('about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 group"
        aria-label="Scroll to About section"
      >
        <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-[--text-dim] group-hover:text-[--accent] transition-colors duration-300">
          scroll
        </span>
        <span
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5 transition-colors duration-300"
          style={{ border: '1px solid var(--border-hi)' }}
        >
          <span
            className="w-[3px] h-2 rounded-full animate-bounce-slow"
            style={{ background: 'var(--accent)' }}
          />
        </span>
      </a>
    </section>
  )
}
