'use client'
import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useReveal } from '@/hooks/useReveal'

const CATEGORIES = [
  { title: 'AI / ML',    icon: '🤖', color: '#4f7fff', skills: ['TensorFlow','PyTorch','Scikit-learn','Keras','OpenCV','Hugging Face','LangChain','NLTK','SpaCy','Pandas','NumPy'] },
  { title: 'Backend',   icon: '⚙️', color: '#9b5de5', skills: ['Python','Django','FastAPI','Flask','REST API','GraphQL','Celery','Redis','WebSocket','JWT','OAuth2'] },
  { title: 'Frontend',  icon: '🎨', color: '#00d4ff', skills: ['React.js','Next.js','TypeScript','JavaScript','HTML5','CSS3','Tailwind CSS','Bootstrap','SASS'] },
  { title: 'DevOps',    icon: '☁️', color: '#f4a261', skills: ['Docker','CI/CD','GitHub Actions','Nginx','Gunicorn','Ubuntu','AWS EC2','Vercel','Heroku'] },
  { title: 'Databases', icon: '🗄️', color: '#f72585', skills: ['PostgreSQL','MySQL','SQLite','MongoDB','Redis','Firebase'] },
  { title: 'Tools',     icon: '🔧', color: '#a8dadc', skills: ['Git','GitHub','VS Code','Figma','Postman','Jupyter','Linux','Bash'] },
]

const PROFICIENCY = [
  { name: 'Python',           level: 95, icon: '🐍', delay: 0   },
  { name: 'Django / DRF',     level: 93, icon: '🦄', delay: 120 },
  { name: 'Machine Learning', level: 89, icon: '🧠', delay: 240 },
  { name: 'Deep Learning',    level: 86, icon: '🔬', delay: 360 },
  { name: 'React / Next.js',  level: 83, icon: '⚛️', delay: 480 },
  { name: 'Docker & DevOps',  level: 80, icon: '🐳', delay: 600 },
]

const SPECIALIZATIONS = [
  { icon: '🧬', title: 'Machine Learning',  desc: 'Supervised, Unsupervised, RL',       color: '#4f7fff' },
  { icon: '🧠', title: 'Deep Learning',     desc: 'CNN, RNN, LSTM, Transformers',       color: '#9b5de5' },
  { icon: '💬', title: 'NLP',               desc: 'Classification, Summarization, QA',  color: '#00d4ff' },
  { icon: '👁️', title: 'Computer Vision',  desc: 'Detection, Segmentation',            color: '#f72585' },
  { icon: '🤖', title: 'LLM / RAG',         desc: 'GPT, Claude, Llama, Embeddings',    color: '#f4a261' },
  { icon: '🏗️', title: 'API Architecture', desc: 'REST, GraphQL, Microservices',        color: '#a8dadc' },
]

// ─── Skill Bar ───────────────────────────────────────────────────────────────

const SkillBar = memo(function SkillBar({
  skill,
  animated,
}: {
  skill: typeof PROFICIENCY[0]
  animated: boolean
}) {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-lg transition-transform duration-200 group-hover:scale-125"
            aria-hidden="true"
          >
            {skill.icon}
          </span>
          <span className="text-base font-bold dark:text-white text-[#0e0c1f]">
            {skill.name}
          </span>
        </div>
        <span
          className="text-sm font-mono font-black tabular-nums"
          style={{
            color: '#4f7fff',
            opacity: animated ? 1 : 0,
            transition: `opacity 0.4s ease ${skill.delay + 400}ms`,
          }}
        >
          {skill.level}%
        </span>
      </div>

      {/* Track */}
      <div
        className="h-2.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.07)' }}
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        {/* Fill */}
        <div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            width: animated ? `${skill.level}%` : '0%',
            background: 'linear-gradient(90deg, #4f7fff, #9b5de5)',
            transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${skill.delay}ms`,
          }}
        >
          {/* Shimmer sweep */}
          <span
            className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              animation: animated ? `shimmer-sweep 2s ease ${skill.delay + 900}ms 1` : 'none',
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
})

// ─── Category Card ────────────────────────────────────────────────────────────

const CategoryCard = memo(function CategoryCard({
  cat,
  index,
  active,
  onHover,
  onLeave,
}: {
  cat: typeof CATEGORIES[0]
  index: number
  active: number | null
  onHover: (i: number) => void
  onLeave: () => void
}) {
  const isActive  = active === index
  const isDimmed  = active !== null && !isActive

  return (
    <div
      className="glass-card rounded-3xl p-6 cursor-default transition-all duration-300"
      style={{
        borderColor:  isActive ? `${cat.color}50` : 'transparent',
        boxShadow:    isActive ? `0 0 32px ${cat.color}20, 0 8px 24px rgba(0,0,0,0.15)` : undefined,
        opacity:      isDimmed ? 0.45 : 1,
        transform:    isActive ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform duration-300"
          style={{
            background:  `${cat.color}18`,
            transform:   isActive ? 'rotate(-8deg) scale(1.1)' : 'none',
          }}
          aria-hidden="true"
        >
          {cat.icon}
        </div>
        <div>
          <h3
            className="text-lg font-bold dark:text-white text-[#1a1830] transition-colors duration-200"
            style={{ fontFamily: 'var(--font-display)', color: isActive ? cat.color : undefined }}
          >
            {cat.title}
          </h3>
          <div className="text-xs font-mono text-[--text-dim] mt-0.5">
            {cat.skills.length} technologies
          </div>
        </div>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2">
        {cat.skills.map((skill, si) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all duration-200"
            style={{
              background:   isActive ? `${cat.color}18` : 'rgba(255,255,255,0.05)',
              color:        isActive ? cat.color : 'var(--text-muted)',
              border:       `1px solid ${isActive ? `${cat.color}35` : 'var(--border)'}`,
              transitionDelay: isActive ? `${si * 18}ms` : '0ms',
              transform:    isActive ? 'translateY(-1px)' : 'none',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
})

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Skills() {
  const ref                           = useReveal()
  const barsRef                       = useRef<HTMLDivElement>(null)
  const [animated, setAnimated]       = useState(false)
  const [hoveredCat, setHoveredCat]   = useState<number | null>(null)

  const handleHover  = useCallback((i: number) => setHoveredCat(i), [])
  const handleLeave  = useCallback(() => setHoveredCat(null), [])

  // Trigger bar animation on scroll-into-view
  useEffect(() => {
    const el = barsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <section
        id="skills"
        ref={ref as React.RefObject<HTMLDivElement>}
        className="py-28 relative overflow-hidden"
      >
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/2 w-96 h-96 rounded-full opacity-[0.04] bg-[#00d4ff] blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-[0.03] bg-[#9b5de5] blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          {/* Section header */}
          <div className="flex items-center gap-4 mb-6 reveal">
            <span className="font-mono text-sm text-[--accent]">03.</span>
            <h2
              className="text-4xl md:text-5xl font-black dark:text-white text-[#1a1830]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Skills &amp; <em className="italic text-[--accent]">Technologies</em>
            </h2>
            <div className="flex-1 h-px bg-[--border]" />
          </div>

          <p
            className="text-lg italic dark:text-white/55 text-[#3b3860] font-semibold mb-14 reveal"
            style={{ fontFamily: 'var(--font-italic)' }}
          >
            Constantly learning, constantly building
          </p>

          {/* ── Top two-col: proficiencies + specializations ── */}
          <div className="grid lg:grid-cols-2 gap-16 mb-16">

            {/* Skill bars */}
            <div className="reveal-left" ref={barsRef}>
              <h3
                className="text-xl font-bold dark:text-white text-[#1a1830] mb-8 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span
                  className="inline-block w-1 h-5 rounded-full bg-[--accent]"
                  aria-hidden="true"
                />
                Core Proficiencies
              </h3>
              <div className="space-y-6">
                {PROFICIENCY.map(s => (
                  <SkillBar key={s.name} skill={s} animated={animated} />
                ))}
              </div>
            </div>

            {/* Specialization cards */}
            <div className="reveal-right">
              <h3
                className="text-xl font-bold dark:text-white text-[#1a1830] mb-8 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span
                  className="inline-block w-1 h-5 rounded-full bg-[--accent]"
                  aria-hidden="true"
                />
                Specializations
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {SPECIALIZATIONS.map((s, i) => (
                  <div
                    key={s.title}
                    className={`glass-card glass-card-hover rounded-2xl p-4 cursor-default group d${i + 1} transition-all duration-300`}
                    style={{ borderColor: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${s.color}40`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                  >
                    <div
                      className="text-2xl mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6 inline-block"
                      aria-hidden="true"
                    >
                      {s.icon}
                    </div>
                    <div
                      className="text-sm font-black dark:text-white text-[#0e0c1f] transition-colors duration-200 group-hover:text-[var(--accent)]"
                    >
                      {s.title}
                    </div>
                    <div className="text-xs text-[--text-muted] mt-0.5">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Category grid ── */}
          <div className="reveal">
            <h3
              className="text-xl font-bold dark:text-white text-[#1a1830] mb-6 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span
                className="inline-block w-1 h-5 rounded-full bg-[--accent]"
                aria-hidden="true"
              />
              Full Tech Stack
              <span className="text-sm font-mono font-normal text-[--text-dim] ml-2">
                — hover a category to highlight
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </>
  )
}