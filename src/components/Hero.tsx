'use client'
import { useCallback, memo, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SocialIcon from './SocialIcon'
import HeroAvatar3D from './HeroAvatar3D'
import { useTypewriter } from '@/hooks/useTypewriter'

/* ─── Constants ─────────────────────────────────────────────── */
const ROLES = [
  'Senior AI/LLM Engineer',
  'Multi-Agent Systems Architect',
  'Agent Orchestration & RAG Expert',
  'AI Evals & Guardrails Specialist',
  'Scalable Python Backend Craftsman',
]

const SOCIALS = [
  { href: 'https://www.linkedin.com/in/mehedihasan555552/', name: 'linkedin' as const, label: 'LinkedIn' },
  { href: 'https://github.com/mehedihasan555552',           name: 'github'   as const, label: 'GitHub'   },
  { href: 'https://x.com/ridoy123439',                      name: 'twitter'  as const, label: 'Twitter'  },
  { href: 'https://www.facebook.com/mehedihasan555552/',    name: 'facebook' as const, label: 'Facebook' },
]


const SYN = {
  kw:   'var(--syn-kw, var(--accent))',
  fn:   'var(--syn-fn, #7cc4f5)',
  str:  'var(--syn-str, var(--signal))',
  dim:  'var(--text-dim)',
  txt:  'var(--text-muted)',
}


const CODE_LINES: { text: string; color: string }[] = [
  { text: 'class AgenticSystem(Orchestrator):',           color: SYN.kw  },
  { text: '    stack = ["Python", "LangGraph", "FastAPI"]', color: SYN.txt },
  { text: '    agents = [Supervisor(), RAG(), Evals()]',   color: SYN.txt },
  { text: '',                                              color: ''      },
  { text: '    async def deploy(self, goal) -> System:',   color: SYN.fn  },
  { text: '        graph = self.compose_agents(goal)',     color: SYN.txt },
  { text: '        score = await self.evals.audit(graph)', color: SYN.txt },
  { text: '        return self.ship_with_guardrails()',    color: SYN.str },
  { text: '',                                              color: ''      },
  { text: '>>> AgenticSystem().deploy("Enterprise AI")',   color: SYN.fn  },
  { text: '"Production Ready. 99.4% Verified."',          color: SYN.kw  },
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
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
      className="w-full overflow-hidden glass-card terminal-window tilt-3d relative"
      style={{ borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-3)', transformStyle: 'preserve-3d' }}
    >
      <div className="tilt-glare" />
      {/* Title bar */}
      <div
        className="flex items-center gap-1.5 px-3.5 py-2.5 border-b terminal-titlebar"
        style={{ background: 'var(--bg-2)', borderColor: 'var(--border)', transform: 'translateZ(12px)' }}
      >
        <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: '#ff5f57' }} />
        <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: '#febc2e' }} />
        <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: '#28c840' }} />
        <span className="ml-2.5 font-mono text-[11px] sm:text-[12px] truncate text-[--text-dim] font-medium">
          mehedi@dev ~/portfolio/engineer.py
        </span>
      </div>

      {/* Code */}
      <div
        className="relative p-4 sm:p-5 font-mono text-[11.5px] sm:text-[13px] leading-[1.8] min-h-[225px] overflow-hidden terminal-body"
        style={{ background: 'var(--bg-2)', transform: 'translateZ(18px)' }}
      >
        {/* Slow scanline for CRT feel */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-[0.35] terminal-scanline"
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
    </motion.div>
  )
}


/* ─── Stat ──────────────────────────────────────────────────── */
function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, scale: 1.04, transition: { type: 'spring', stiffness: 450, damping: 25 } }}
      className="glass-card glass-card-hover spotlight tilt-3d px-3.5 py-4 text-center cursor-default"
    >
      <div className="tilt-glare" />
      <div
        className="text-2xl sm:text-3xl font-extrabold"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
      >
        {value}
      </div>
      <div className="text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.14em] text-[--text-dim] mt-1 font-bold">
        {label}
      </div>
    </motion.div>
  )
}

const TypedRole = memo(function TypedRole({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-7 min-h-[2.4rem] sm:min-h-[3rem]">
      <span
        className="w-[3.5px] h-7 sm:h-9 rounded-full flex-shrink-0"
        style={{ background: 'var(--accent)', boxShadow: '0 0 14px var(--glow)' }}
        aria-hidden="true"
      />
      <span
        className="text-lg sm:text-2xl md:text-[26px] font-mono font-extrabold type-cursor leading-tight"
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

        {/* ── 3D Floating Ambient Geometries ── */}
        <div
          className="floating-3d-geom hidden md:block top-[20%] right-[6%] w-24 h-24 opacity-35 border-2 rounded-2xl pointer-events-none"
          style={{ borderColor: 'var(--accent)', animationDelay: '1s' }}
          aria-hidden="true"
        />
        <div
          className="floating-3d-geom hidden lg:block bottom-[22%] left-[4%] w-32 h-32 opacity-25 border-2 border-dashed rounded-full pointer-events-none"
          style={{ borderColor: 'var(--signal)', animationDelay: '4s' }}
          aria-hidden="true"
        />
        <div
          className="floating-3d-geom hidden sm:block top-[68%] right-[18%] w-16 h-16 opacity-30 border-2 rounded-lg rotate-45 pointer-events-none"
          style={{ borderColor: 'var(--c-2)', animationDelay: '2.5s' }}
          aria-hidden="true"
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

            <div className="announce-badge animate-fade-in-up mb-6 text-xs sm:text-[13px] py-1.5 px-4 font-bold" style={{ animationDelay: '40ms' }}>
              <span className="status-dot" aria-hidden="true" />
              Available for new projects · Dhaka, BD
            </div>

            <p
              className="font-mono text-sm sm:text-[15.5px] text-[--text-dim] mb-2.5 animate-fade-in-up font-bold"
              style={{ animationDelay: '110ms' }}
            >
              // Hello, I&apos;m
            </p>

            <h1
              className="word-rise text-[clamp(3.1rem,8.8vw,5.35rem)] font-extrabold leading-[1.03] tracking-[-0.02em] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span style={{ ['--wd' as string]: '160ms' }}>Mehedi</span>
              <br />
              <span className="gradient-text" style={{ ['--wd' as string]: '280ms' }}>Hasan</span>
            </h1>

            <p
              className="font-mono text-xs sm:text-[14px] text-[--text-dim] mb-7 animate-fade-in-up font-semibold"
              style={{ animationDelay: '400ms' }}
            >
              — crafting the future with code &amp; AI
            </p>

            <div className="animate-fade-in-up" style={{ animationDelay: '470ms' }}>
              <TypedRole text={displayed} />
            </div>

            <p
              className="text-[17px] sm:text-[18.5px] font-medium leading-[1.8] max-w-xl mb-8 text-[--text-muted] animate-fade-in-up"
              style={{ animationDelay: '540ms' }}
            >
              Senior AI/LLM Engineer with{' '}
              <strong className="font-bold" style={{ color: 'var(--text)' }}>
                5+ years building production AI systems
              </strong>{' '}
              and scalable Python backends. Specialised in LLM-powered multi-agent systems, RAG pipelines, agent orchestration, and AI evaluation frameworks.
            </p>

            <div className="grid grid-cols-3 gap-3.5 mb-8 max-w-md">
              <StatCard value="5+"  label="Yrs Exp"    delay={600} />
              <StatCard value="40+" label="Projects"   delay={670} />
              <StatCard value="99%" label="Client Sat" delay={740} />
            </div>

            <div
              className="flex flex-wrap gap-3.5 mb-9 animate-fade-in-up items-center"
              style={{ animationDelay: '810ms' }}
            >
              <motion.a
                href="#contact"
                onClick={handleScroll('contact')}
                whileHover={{ scale: 1.035, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="btn btn-primary text-[15px] sm:text-[16px] font-bold py-3.5 px-6"
              >
                &gt; Let&apos;s Work Together_
              </motion.a>
              <motion.a
                href="#blog"
                onClick={handleScroll('blog')}
                whileHover={{ scale: 1.035, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="btn btn-ghost text-[14.5px] sm:text-[15.5px] font-bold py-3.5 px-5"
              >
                ./read-insights.sh
              </motion.a>
              <motion.a
                href="#projects"
                onClick={handleScroll('projects')}
                whileHover={{ scale: 1.035, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="btn btn-ghost text-[13.5px] sm:text-[14.5px] font-bold py-3.5 px-4.5"
              >
                ./projects.sh
              </motion.a>
            </div>

            <div
              className="flex items-center gap-3 animate-fade-in-up"
              style={{ animationDelay: '880ms' }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-[--text-dim] flex-shrink-0">
                Connect
              </span>
              <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              {SOCIALS.map(s => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="w-9 h-9 rounded-md glass-card glass-card-hover grid place-items-center text-[--text-muted] hover:text-[--accent]"
                >
                  <SocialIcon name={s.name} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div
            className="order-2 flex flex-col items-center gap-9 animate-fade-in-up"
            style={{ animationDelay: '260ms' }}
          >
            {/* 3D Interactive Portrait Stage with Live Orbiting Badges */}
            <HeroAvatar3D />

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
