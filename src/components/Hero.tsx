'use client'
import { useCallback, memo, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SocialIcon from './SocialIcon'
import HeroAvatar3D from './HeroAvatar3D'
import { useTypewriter } from '@/hooks/useTypewriter'
import { usePortfolioData } from '@/context/PortfolioDataContext'

const SYN = {
  kw:   'var(--syn-kw, var(--accent))',
  fn:   'var(--syn-fn, #7cc4f5)',
  str:  'var(--syn-str, var(--signal))',
  dim:  'var(--text-dim)',
  txt:  'var(--text-muted)',
}

const TERMINAL_TABS: Record<string, { label: string; lines: { text: string; color: string }[] }> = {
  orchestrator: {
    label: 'engineer.py',
    lines: [
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
    ],
  },
  rag: {
    label: 'hybrid_rag.py',
    lines: [
      { text: 'async def retrieve_hybrid(query: str) -> Context:', color: SYN.fn },
      { text: '    dense, sparse = await asyncio.gather(',         color: SYN.txt },
      { text: '        qdrant.search_dense(query, top_k=50),',     color: SYN.txt },
      { text: '        bm25.search_lexical(query, top_k=50)',      color: SYN.txt },
      { text: '    )',                                             color: SYN.txt },
      { text: '    fused = reciprocal_rank_fusion(dense, sparse)', color: SYN.kw  },
      { text: '    reranked = await cohere.rerank(fused, top_n=6)',color: SYN.str },
      { text: '    return ParentDocResolver.expand(reranked)',     color: SYN.kw  },
      { text: '',                                                  color: ''      },
      { text: '>>> await retrieve_hybrid("ERR-8092 OAuth")',       color: SYN.fn  },
      { text: '"Recall: 97.4% | Latency: 38ms p95"',              color: SYN.kw  },
    ],
  },
  telemetry: {
    label: 'telemetry.sh',
    lines: [
      { text: '$ragas-ci --suite golden_500 --gate-pr',            color: SYN.fn  },
      { text: '[✓] Faithfulness Score      : 0.982 (PASS)',        color: SYN.kw  },
      { text: '[✓] Context Precision       : 0.946 (PASS)',        color: SYN.kw  },
      { text: '[✓] Answer Relevance        : 0.961 (PASS)',        color: SYN.kw  },
      { text: '[✓] NeMo Guardrail Shield   : 99.8% Blocked',       color: SYN.str },
      { text: '[✓] LiteLLM Failover Router : <180ms SLA',          color: SYN.txt },
      { text: '',                                                  color: ''      },
      { text: '>>> STATUS: ALL PRODUCTION GATES VERIFIED',         color: SYN.kw  },
    ],
  },
}

function TerminalWindow() {
  const [activeTab, setActiveTab]       = useState<'orchestrator' | 'rag' | 'telemetry'>('orchestrator')
  const [visibleLines, setVisibleLines] = useState(0)
  const [charCount, setCharCount]       = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentLines = TERMINAL_TABS[activeTab].lines

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleLines(currentLines.length)
      setCharCount(999)
      return
    }

    setVisibleLines(0)
    setCharCount(0)
    let lineIdx = 0
    let charIdx = 0

    function tick() {
      const line = currentLines[lineIdx]
      if (!line) return

      if (charIdx <= line.text.length) {
        setVisibleLines(lineIdx + 1)
        setCharCount(charIdx)
        charIdx++
        timerRef.current = setTimeout(tick, 28)
      } else {
        lineIdx++
        charIdx = 0
        if (lineIdx >= currentLines.length) {
          timerRef.current = setTimeout(() => {
            setVisibleLines(0)
            setCharCount(0)
            lineIdx = 0
            charIdx = 0
            timerRef.current = setTimeout(tick, 60)
          }, 4800)
        } else {
          timerRef.current = setTimeout(tick, 45)
        }
      }
    }

    timerRef.current = setTimeout(tick, 320)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [activeTab, currentLines])

  return (
    <div
      className="w-full overflow-hidden glass-card border-beam terminal-window tilt-3d relative"
      style={{ borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-3)' }}
    >
      <div
        className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-b terminal-titlebar"
        style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: '#ff5f57' }} />
          <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: '#febc2e' }} />
          <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: '#28c840' }} />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {(Object.keys(TERMINAL_TABS) as Array<keyof typeof TERMINAL_TABS>).map(key => {
            const on = activeTab === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className="relative px-2.5 py-1 rounded text-[10.5px] sm:text-[11.5px] font-mono font-bold transition-colors cursor-pointer"
                style={{
                  color: on ? 'var(--accent)' : 'var(--text-dim)',
                  background: on ? 'var(--accent-soft)' : 'transparent',
                }}
              >
                {TERMINAL_TABS[key].label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="relative p-4 sm:p-5 font-mono text-[11.5px] sm:text-[12.5px] leading-[1.78] min-h-[232px] overflow-hidden terminal-body"
        style={{ background: 'var(--bg-2)' }}
      >
        {currentLines.map((line, i) => {
          const isCurrent = i === visibleLines - 1
          const isDone    = i < visibleLines - 1
          const display   = isCurrent ? line.text.slice(0, charCount) : isDone ? line.text : ''

          return (
            <div key={i} className="flex min-w-0">
              <span className="select-none mr-3.5 w-4 text-right flex-shrink-0 text-[9.5px] text-[--text-dim] opacity-60">
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

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card glass-card-hover spotlight tilt-3d px-3.5 py-4 text-center cursor-default">
      <div
        className="text-2xl sm:text-3xl font-extrabold"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
      >
        {value}
      </div>
      <div className="text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.14em] text-[--text-dim] mt-1 font-bold">
        {label}
      </div>
    </div>
  )
}

const TypedRole = memo(function TypedRole({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-7 min-h-[2.4rem] sm:min-h-[3rem]">
      <span
        className="w-[3.5px] h-7 sm:h-9 rounded-full flex-shrink-0"
        style={{ background: 'var(--accent)' }}
        aria-hidden="true"
      />
      <span
        className="text-lg sm:text-2xl md:text-[26px] font-mono font-extrabold type-cursor leading-tight"
        style={{ color: 'var(--accent)' }}
        aria-live="polite"
      >
        {text}
      </span>
    </div>
  )
})

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Hero() {
  const { db } = usePortfolioData()
  const { profile } = db
  const roles = profile.roles?.length ? profile.roles : ['Senior AI/LLM Engineer']
  const displayed = useTypewriter(roles)

  const handleScroll = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault()
      scrollTo(id)
    },
    []
  )

  const socials = [
    { href: profile.linkedin, name: 'linkedin' as const, label: 'LinkedIn' },
    { href: profile.github,   name: 'github'   as const, label: 'GitHub'   },
    { href: profile.twitter,  name: 'twitter'  as const, label: 'Twitter'  },
    { href: profile.facebook, name: 'facebook' as const, label: 'Facebook' },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="grid-bg absolute inset-0" />
        <div className="hidden xl:block absolute top-[15%] left-[46%] opacity-45">
          <div className="cube-3d-scene">
            <div className="cube-3d">
              <div className="cube-face cube-face-front" />
              <div className="cube-face cube-face-back" />
              <div className="cube-face cube-face-right" />
              <div className="cube-face cube-face-left" />
              <div className="cube-face cube-face-top" />
              <div className="cube-face cube-face-bottom" />
            </div>
          </div>
        </div>
      </div>

      <div className="container-x w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-16 xl:gap-20 items-center">

          {/* LEFT */}
          <div className="order-1">
            <div className="announce-badge mb-6 text-xs sm:text-[13px] py-1.5 px-4 font-bold">
              <span className="status-dot" aria-hidden="true" />
              {profile.heroBadge}
            </div>

            <p className="font-mono text-sm sm:text-[15.5px] text-[--text-dim] mb-2.5 font-bold">
              {profile.heroGreeting}
            </p>

            <h1
              className="word-rise text-[clamp(3.1rem,8.8vw,5.45rem)] font-extrabold leading-[1.02] tracking-[-0.022em] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span style={{ ['--wd' as string]: '100ms' }}>{profile.firstName}</span>
              <br />
              <span className="gradient-text" style={{ ['--wd' as string]: '200ms' }}>{profile.lastName}</span>
            </h1>

            <p className="font-mono text-xs sm:text-[14px] text-[--text-dim] mb-6 font-semibold">
              {profile.heroSubtitle}
            </p>

            <TypedRole text={displayed} />

            <p className="text-[17px] sm:text-[18.5px] font-medium leading-[1.8] max-w-xl mb-8 text-[--text-muted]">
              {profile.heroBio}
            </p>

            <div className="grid grid-cols-3 gap-3.5 mb-8 max-w-md">
              {profile.stats.map((st, idx) => (
                <StatCard key={idx} value={st.value} label={st.label} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3.5 mb-9 items-center">
              <a
                href="#contact"
                onClick={handleScroll('contact')}
                className="btn btn-primary text-[15px] sm:text-[16px] font-bold py-3.5 px-6"
              >
                &gt; Let&apos;s Work Together_
              </a>
              <a
                href="#blog"
                onClick={handleScroll('blog')}
                className="btn btn-ghost text-[14.5px] sm:text-[15.5px] font-bold py-3.5 px-5"
              >
                ./read-insights.sh
              </a>
              <a
                href="#projects"
                onClick={handleScroll('projects')}
                className="btn btn-ghost text-[13.5px] sm:text-[14.5px] font-bold py-3.5 px-4.5"
              >
                ./projects.sh
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-[--text-dim] flex-shrink-0">
                Connect
              </span>
              <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              {socials.map(s => (
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

          {/* RIGHT */}
          <div className="order-2 flex flex-col items-center gap-9">
            <HeroAvatar3D />
            <div className="w-full">
              <TerminalWindow />
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        onClick={handleScroll('about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 group"
        aria-label="Scroll to About section"
      >
        <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-[--text-dim] group-hover:text-[--accent] transition-colors">
          scroll
        </span>
        <span
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
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
