'use client'
import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'
import { useCountUp } from '@/hooks/useCountUp'
import SectionHeader from './SectionHeader'

const CATEGORIES = [
  { title: 'Agentic AI',  tone: 'var(--c-1)', skills: ['LangGraph','Multi-Agent DAG','Supervisor Pattern','Tool Calling','Pydantic V2','State Machines','AutoGen'] },
  { title: 'RAG & Search',tone: 'var(--c-2)', skills: ['Hybrid Retrieval','BM25','Dense Vectors','Cohere Rerank','Qdrant','Pinecone','Parent-Child RAG','Embeddings'] },
  { title: 'Evals & Security', tone: 'var(--c-5)', skills: ['Ragas','LLM-as-a-Judge','NeMo Guardrails','PII Redaction','Prompt Injection Defense','Langfuse','TruLens'] },
  { title: 'Backend',     tone: 'var(--c-3)', skills: ['Python','FastAPI','AsyncIO','Django / DRF','Celery','Redis Streams','SSE Streaming','WebSockets'] },
  { title: 'DevOps & MLOps', tone: 'var(--c-4)', skills: ['Docker','vLLM','GitHub Actions CI/CD','Nginx','AWS EC2','Ubuntu Linux','Uvicorn'] },
  { title: 'Databases',   tone: 'var(--c-6)', skills: ['PostgreSQL','Qdrant','Redis','Pinecone','MongoDB','MySQL','SQLite'] },
]

const PROFICIENCY = [
  { name: 'Python & Async Backends',    level: 96, delay: 0   },
  { name: 'Multi-Agent Orchestration',  level: 94, delay: 110 },
  { name: 'Advanced RAG & Hybrid Search',level: 93, delay: 220 },
  { name: 'AI Evals & Regression Testing',level: 90, delay: 330 },
  { name: 'LLM Gateways & Guardrails',   level: 89, delay: 440 },
  { name: 'Docker, DevOps & CI/CD',     level: 85, delay: 550 },
]

const SPECIALIZATIONS = [
  { title: 'Multi-Agent Systems',   desc: 'Supervisor, Cyclic State Graphs' },
  { title: 'Advanced Hybrid RAG',   desc: 'BM25 + Dense + Cohere Rerank' },
  { title: 'Tool-Enabled Agents',   desc: 'Pydantic V2, Self-Healing Loops' },
  { title: 'Provider-Agnostic Gateways', desc: 'LiteLLM, Resilient Failovers' },
  { title: 'AI Evals & CI/CD',      desc: 'Ragas, LLM-as-a-Judge, PR Gating' },
  { title: 'Guardrails & Security', desc: 'Prompt Injection, PII Masking' },
]

/* ─── Proficiency bar ──────────────────────────────────────────────────── */
const SkillBar = memo(function SkillBar({
  skill, animated,
}: { skill: typeof PROFICIENCY[0]; animated: boolean }) {
  const count = useCountUp(skill.level, animated, 1250)

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2.5">
        <span className="text-[15.5px] sm:text-[16.5px] font-bold" style={{ color: 'var(--text)' }}>
          {skill.name}
        </span>
        <span
          className="text-[14.5px] sm:text-[15.5px] font-mono font-bold tabular-nums"
          style={{ color: 'var(--accent)' }}
        >
          {count}%
        </span>
      </div>

      <div
        className="progress-track overflow-hidden"
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        <motion.div
          className="progress-fill h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: animated ? `${skill.level}%` : '0%' }}
          transition={{
            duration: 1.2,
            delay: skill.delay / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  )
})

/* ─── Category card ────────────────────────────────────────────────────── */
const CategoryCard = memo(function CategoryCard({
  cat, index, active, onHover, onLeave,
}: {
  cat: typeof CATEGORIES[0]
  index: number
  active: number | null
  onHover: (i: number) => void
  onLeave: () => void
}) {
  const on     = active === index
  const dimmed = active !== null && !on

  return (
    <motion.div
      data-reveal="scale"
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="glass-card spotlight tilt-3d p-5 cursor-default transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        borderColor: on ? `color-mix(in srgb, ${cat.tone} 40%, transparent)` : 'var(--border)',
        boxShadow:   on ? `0 18px 44px -18px color-mix(in srgb, ${cat.tone} 55%, transparent)` : 'var(--sh-1)',
        opacity:     dimmed ? 0.42 : 1,
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      <div className="tilt-glare" />
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[17px] sm:text-[18.5px] font-extrabold tracking-[-0.01em] transition-colors duration-300"
          style={{ fontFamily: 'var(--font-display)', color: on ? cat.tone : 'var(--text)' }}
        >
          {cat.title}
        </h3>
        <span className="text-[11.5px] font-mono font-extrabold text-[--text-dim]">
          {String(cat.skills.length).padStart(2, '0')}
        </span>
      </div>

      {/* Accent rule that fills on hover */}
      <motion.span
        className="block h-px mb-4 origin-left"
        animate={{
          scaleX: on ? 1 : 0.14,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: cat.tone }}
        aria-hidden="true"
      />

      <div className="flex flex-wrap gap-2">
        {cat.skills.map((skill) => (
          <motion.span
            key={skill}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="inline-block px-2.5 py-1 text-[12.5px] sm:text-[13px] font-mono font-semibold cursor-default transition-colors duration-200"
            style={{
              borderRadius: 'var(--r-xs)',
              background: on ? `color-mix(in srgb, ${cat.tone} 12%, transparent)` : 'var(--bg-2)',
              color:      on ? cat.tone : 'var(--text-dim)',
              border:     `1px solid ${on ? `color-mix(in srgb, ${cat.tone} 26%, transparent)` : 'var(--border)'}`,
            }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
})

/* ─── Main ─────────────────────────────────────────────────────────────── */
export default function Skills() {
  const ref     = useReveal()
  const barsRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated]     = useState(false)
  const [hoveredCat, setHoveredCat] = useState<number | null>(null)

  const handleHover = useCallback((i: number) => setHoveredCat(i), [])
  const handleLeave = useCallback(() => setHoveredCat(null), [])

  useEffect(() => {
    const el = barsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); obs.disconnect() } },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div
        data-parallax
        className="absolute top-0 left-1/3 w-[420px] aspect-square rounded-full opacity-[0.05] blur-[100px] pointer-events-none"
        style={{ ['--par' as string]: '-60px', background: 'var(--c-2)' }}
        aria-hidden="true"
      />

      <div className="container-x">
        <SectionHeader
          index="03 —"
          title="Skills &"
          emphasis="Technologies"
          standfirst="Constantly learning, constantly building."
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">

          {/* Proficiencies */}
          <div className="reveal-left" ref={barsRef}>
            <h3 className="flex items-center gap-2.5 text-[13px] font-mono font-semibold uppercase tracking-[0.16em] mb-7 text-[--text-muted]">
              <span className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              Core Proficiencies
            </h3>
            <div className="space-y-5">
              {PROFICIENCY.map(s => (
                <SkillBar key={s.name} skill={s} animated={animated} />
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div className="reveal-right">
            <h3 className="flex items-center gap-2.5 text-[13px] font-mono font-semibold uppercase tracking-[0.16em] mb-7 text-[--text-muted]">
              <span className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              Specializations
            </h3>
            <div className="grid grid-cols-2 gap-3.5">
              {SPECIALIZATIONS.map(s => (
                <motion.div
                  key={s.title}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="glass-card glass-card-hover spotlight tilt-3d p-4 group cursor-default"
                >
                  <div className="tilt-glare" />
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-[7px] w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-150"
                      style={{ background: 'var(--accent)' }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <div
                        className="text-[14.5px] sm:text-[15.5px] font-bold leading-snug transition-colors duration-200 group-hover:text-[--accent]"
                        style={{ color: 'var(--text)' }}
                      >
                        {s.title}
                      </div>
                      <div className="text-[12.5px] sm:text-[13px] text-[--text-dim] mt-1 leading-snug">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Full stack grid */}
        <div>
          <h3 className="flex flex-wrap items-center gap-2.5 text-[13px] font-mono font-semibold uppercase tracking-[0.16em] mb-6 text-[--text-muted] reveal">
            <span className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
            Full Tech Stack
            <span className="normal-case tracking-normal font-normal text-[--text-dim] text-[12px]">
              — hover a category to focus it
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.title}
                cat={cat}
                index={i}
                active={hoveredCat}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
