'use client'
import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { useCountUp } from '@/hooks/useCountUp'
import SectionHeader from './SectionHeader'

const CATEGORIES = [
  { title: 'AI / ML',   tone: 'var(--c-1)', skills: ['TensorFlow','PyTorch','Scikit-learn','Keras','OpenCV','Hugging Face','LangChain','NLTK','SpaCy','Pandas','NumPy'] },
  { title: 'Backend',   tone: 'var(--c-2)', skills: ['Python','Django','FastAPI','Flask','REST API','GraphQL','Celery','Redis','WebSocket','JWT','OAuth2'] },
  { title: 'Frontend',  tone: 'var(--c-3)', skills: ['React.js','Next.js','TypeScript','JavaScript','HTML5','CSS3','Tailwind CSS','Bootstrap','SASS'] },
  { title: 'DevOps',    tone: 'var(--c-5)', skills: ['Docker','CI/CD','GitHub Actions','Nginx','Gunicorn','Ubuntu','AWS EC2','Vercel','Heroku'] },
  { title: 'Databases', tone: 'var(--c-6)', skills: ['PostgreSQL','MySQL','SQLite','MongoDB','Redis','Firebase'] },
  { title: 'Tools',     tone: 'var(--c-4)', skills: ['Git','GitHub','VS Code','Figma','Postman','Jupyter','Linux','Bash'] },
]

const PROFICIENCY = [
  { name: 'Python',           level: 95, delay: 0   },
  { name: 'Django / DRF',     level: 93, delay: 110 },
  { name: 'Machine Learning', level: 89, delay: 220 },
  { name: 'Deep Learning',    level: 86, delay: 330 },
  { name: 'React / Next.js',  level: 83, delay: 440 },
  { name: 'Docker & DevOps',  level: 80, delay: 550 },
]

const SPECIALIZATIONS = [
  { title: 'Machine Learning',  desc: 'Supervised, Unsupervised, RL' },
  { title: 'Deep Learning',     desc: 'CNN, RNN, LSTM, Transformers' },
  { title: 'NLP',               desc: 'Classification, Summarization, QA' },
  { title: 'Computer Vision',   desc: 'Detection, Segmentation' },
  { title: 'LLM / RAG',         desc: 'GPT, Claude, Llama, Embeddings' },
  { title: 'API Architecture',  desc: 'REST, GraphQL, Microservices' },
]

/* ─── Proficiency bar ──────────────────────────────────────────────────── */
const SkillBar = memo(function SkillBar({
  skill, animated,
}: { skill: typeof PROFICIENCY[0]; animated: boolean }) {
  const count = useCountUp(skill.level, animated, 1250)

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[14px] font-medium" style={{ color: 'var(--text)' }}>
          {skill.name}
        </span>
        <span
          className="text-[13px] font-mono font-semibold tabular-nums"
          style={{ color: 'var(--accent)' }}
        >
          {count}%
        </span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        <div
          className="progress-fill"
          style={{
            width: animated ? `${skill.level}%` : '0%',
            ['--delay' as string]: `${skill.delay}ms`,
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
    <div
      data-reveal="scale"
      className="glass-card spotlight p-5 cursor-default transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        borderColor: on ? `color-mix(in srgb, ${cat.tone} 40%, transparent)` : 'var(--border)',
        boxShadow:   on ? `0 18px 44px -18px color-mix(in srgb, ${cat.tone} 55%, transparent)` : 'var(--sh-1)',
        opacity:     dimmed ? 0.42 : 1,
        transform:   on ? 'translateY(-4px)' : 'none',
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[15px] font-bold tracking-[-0.01em] transition-colors duration-300"
          style={{ fontFamily: 'var(--font-display)', color: on ? cat.tone : 'var(--text)' }}
        >
          {cat.title}
        </h3>
        <span className="text-[10px] font-mono text-[--text-dim]">
          {String(cat.skills.length).padStart(2, '0')}
        </span>
      </div>

      {/* Accent rule that fills on hover */}
      <span
        className="block h-px mb-4 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ background: cat.tone, transform: on ? 'scaleX(1)' : 'scaleX(0.14)' }}
        aria-hidden="true"
      />

      <div className="flex flex-wrap gap-1.5">
        {cat.skills.map((skill, si) => (
          <span
            key={skill}
            className="px-2 py-[3px] text-[11px] font-mono transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              borderRadius: 'var(--r-xs)',
              background: on ? `color-mix(in srgb, ${cat.tone} 12%, transparent)` : 'var(--bg-2)',
              color:      on ? cat.tone : 'var(--text-dim)',
              border:     `1px solid ${on ? `color-mix(in srgb, ${cat.tone} 26%, transparent)` : 'var(--border)'}`,
              transitionDelay: on ? `${si * 22}ms` : '0ms',
              transform: on ? 'translateY(-1px)' : 'none',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
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
            <div className="grid grid-cols-2 gap-3">
              {SPECIALIZATIONS.map(s => (
                <div
                  key={s.title}
                  className="glass-card glass-card-hover spotlight p-4 group cursor-default"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-150"
                      style={{ background: 'var(--accent)' }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <div
                        className="text-[13.5px] font-semibold leading-snug transition-colors duration-200 group-hover:text-[--accent]"
                        style={{ color: 'var(--text)' }}
                      >
                        {s.title}
                      </div>
                      <div className="text-[11.5px] text-[--text-dim] mt-0.5 leading-snug">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                </div>
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
