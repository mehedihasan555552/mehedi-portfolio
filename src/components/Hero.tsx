'use client'
import { useCallback, memo } from 'react'
import Image from 'next/image'
import SocialIcon from './SocialIcon'
import { useTypewriter } from '@/hooks/useTypewriter'
import me from '../../images/1.jpg'

const ROLES = ['Full-Stack Developer', 'AI/ML Engineer', 'LLM Architect', 'Python Expert', 'Backend Craftsman']

/**
 * Static particle positions — deterministic, computed once at module load.
 * Using modular arithmetic instead of Math.random() ensures the exact same
 * values on server and client, preventing hydration mismatches.
 */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  w:        ((i * 7)  % 4 + 2).toFixed(1),
  left:     ((i * 17 + 5) % 100).toFixed(1),
  top:      ((i * 13 + 8) % 100).toFixed(1),
  opacity:  ((i * 3)  % 4 * 0.08 + 0.1).toFixed(2),
  duration: ((i * 1.1 % 5) + 5).toFixed(1),
  delay:    ((i * 0.7) % 5).toFixed(1),
}))

const SOCIALS = [
  { href: 'https://www.linkedin.com/in/mehedihasan555552/', name: 'linkedin' as const, label: 'LinkedIn' },
  { href: 'https://github.com/mehedihasan555552',           name: 'github'   as const, label: 'GitHub'   },
  { href: 'https://x.com/ridoy123439',                      name: 'twitter'  as const, label: 'Twitter'  },
  { href: 'https://www.facebook.com/mehedihasan555552/',    name: 'facebook' as const, label: 'Facebook' },
]

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

// Memoised so parent re-renders don't re-render the typing text unnecessarily
const TypedRole = memo(function TypedRole({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-8 min-h-[2.75rem]">
      <div className="w-1 h-9 bg-gradient-to-b from-[#4f7fff] to-[#9b5de5] rounded-full flex-shrink-0" />
      <span
        className="text-xl md:text-2xl lg:text-3xl font-mono font-semibold text-[#4f7fff] type-cursor"
        aria-live="polite"
        aria-label={`Current role: ${text}`}
      >
        {text}
      </span>
    </div>
  )
})

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
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      aria-label="Hero section"
    >
      {/* ── Static background (no hydration-sensitive state) ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 15% 30%, rgba(79,127,255,0.12) 0%, transparent 60%),' +
              'radial-gradient(ellipse 60% 50% at 85% 70%, rgba(155,93,229,0.1) 0%, transparent 60%)',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-morph opacity-[0.05] bg-[#4f7fff] blur-3xl" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full animate-morph opacity-[0.04] bg-[#9b5de5] blur-3xl"
          style={{ animationDelay: '4s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Particles — deterministic positions, no random values */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#4f7fff] animate-float"
            style={{
              width:             `${p.w}px`,
              height:            `${p.w}px`,
              left:              `${p.left}%`,
              top:               `${p.top}%`,
              opacity:           p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay:    `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── Left: Copy ── */}
          {/*
           * No `loaded` state here — that caused a className mismatch between
           * server (loaded=false → opacity-0) and client (loaded=true → opacity-100).
           * The section is always visible; CSS handles the entrance animation.
           */}
          <div className="order-2 lg:order-1 animate-fade-in-up">

            

            <div className="mb-6 space-y-1">
              <p
                className="text-xl md:text-2xl dark:text-white/60 text-[#3b3860] italic font-semibold"
                style={{ fontFamily: 'var(--font-italic)' }}
              >
                Hello, I&apos;m
              </p>
              <h1
                className="text-6xl md:text-7xl xl:text-8xl font-black dark:text-white text-[#0e0c1f] leading-[1.0]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Mehedi
                <br />
                <span className="gradient-text">Hasan</span>
              </h1>
              <p
                className="text-xl md:text-2xl dark:text-white/60 text-[#3b3860] italic mt-2 font-semibold"
                style={{ fontFamily: 'var(--font-italic)' }}
              >
                — crafting the future with code &amp; AI
              </p>
            </div>

            <TypedRole text={displayed} />

            <p className="text-lg md:text-xl dark:text-white/70 text-[#1a1640] leading-relaxed max-w-lg mb-10 font-medium">
              Full-Stack Python Django Developer &amp; AI/ML Consultant in Dhaka, Bangladesh — building{' '}
              <strong className="dark:text-white text-[#0e0c1f] font-bold">intelligent web applications</strong> and
              advanced ML/NLP solutions for real-world impact.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10" aria-label="Career statistics">
              {[
                { value: '3+', label: 'Years Exp' },
                { value: '50+', label: 'Projects' },
                { value: '20+', label: 'Clients' },
              ].map(s => (
                <div key={s.label}>
                  <div
                    className="text-4xl md:text-5xl font-black dark:text-white text-[#0e0c1f]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {s.value}
                  </div>
                  <div className="text-sm dark:text-white/60 text-[#3b3860] font-bold tracking-wide uppercase mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="#contact"
                onClick={handleScroll('contact')}
                className="px-7 py-3.5 bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] text-white font-bold text-lg rounded-2xl transition-[transform,box-shadow] duration-300 hover:shadow-2xl hover:shadow-[#4f7fff]/30 hover:-translate-y-1"
              >
                Let&apos;s Work Together →
              </a>
              <a
                href="#projects"
                onClick={handleScroll('projects')}
                className="px-7 py-3.5 glass-card glass-card-hover dark:text-white text-[#0e0c1f] font-bold text-lg rounded-2xl"
              >
                View Projects
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              <span className="text-xs dark:text-white/30 text-[#6b689a] uppercase tracking-widest font-mono font-bold">
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
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center dark:text-white/50 text-[#3b3860] hover:text-[--accent] hover:border-[--accent] transition-[color,border-color,transform] duration-200 hover:scale-110 hover:-translate-y-0.5"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: Avatar ── */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 xl:w-96 xl:h-96">
              <div
                className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-[#4f7fff]/20"
                style={{ margin: '-28px' }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 animate-spin-rev rounded-full border border-dashed border-[#9b5de5]/20"
                style={{ margin: '-16px' }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4f7fff]/15 to-[#9b5de5]/15 blur-3xl scale-125 animate-glow-pulse"
                aria-hidden="true"
              />
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[--border] shadow-2xl">
                <Image
                  src={me}
                  alt="Mehedi Hasan — Full-Stack & AI Engineer"
                  fill
                  priority
                  fetchPriority="high"
                  quality={100}
                  className="object-cover [image-rendering:-webkit-optimize-contrast]"
                  sizes="(max-width:640px) 256px,(max-width:1280px) 320px,384px"
                />
                {/* Reduced overlay opacity from /25 → /10 for better clarity */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" aria-hidden="true" />
              </div>

              {(['💻', '🤖', '⚛️', '🔥'] as const).map((emoji, i) => (
                <div
                  key={i}
                  className="absolute w-10 h-10 rounded-full glass-card flex items-center justify-center text-lg shadow-xl animate-float"
                  style={{
                    top:               `${[10, -5, 85, 95][i]}%`,
                    left:              `${[-8, 92, 95, -10][i]}%`,
                    animationDelay:    `${i * 1.5}s`,
                    animationDuration: `${6 + i}s`,
                  }}
                  aria-hidden="true"
                >
                  {emoji}
                </div>
              ))}

              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-max px-5 py-2.5 glass-card rounded-2xl shadow-2xl text-center">
                <div
                  className="font-bold dark:text-white text-[#0e0c1f] text-sm"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Md Mehedi Hasan
                </div>
                <div className="font-mono text-xs text-[--accent] font-semibold">
                  Sr. Full-Stack &amp; LLM Eng.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#about"
        onClick={handleScroll('about')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow cursor-pointer group"
        aria-label="Scroll to About section"
      >
        <span className="text-xs dark:text-white/30 text-[#6b689a] font-mono uppercase tracking-widest group-hover:text-[--accent] transition-colors font-bold">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border border-[--border] flex items-start justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-[--accent] animate-bounce" />
        </div>
      </a>
    </section>
  )
}
