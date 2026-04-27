'use client'
import { useState, useEffect, useRef, memo } from 'react'
import { useReveal } from '@/hooks/useReveal'

const CATEGORIES = [
  { title:'AI / ML',    icon:'🤖', color:'#4f7fff', skills:['TensorFlow','PyTorch','Scikit-learn','Keras','OpenCV','Hugging Face','LangChain','NLTK','SpaCy','Pandas','NumPy'] },
  { title:'Backend',   icon:'⚙️', color:'#9b5de5', skills:['Python','Django','FastAPI','Flask','REST API','GraphQL','Celery','Redis','WebSocket','JWT','OAuth2'] },
  { title:'Frontend',  icon:'🎨', color:'#00d4ff', skills:['React.js','Next.js','TypeScript','JavaScript','HTML5','CSS3','Tailwind CSS','Bootstrap','SASS'] },
  { title:'DevOps',    icon:'☁️', color:'#f4a261', skills:['Docker','CI/CD','GitHub Actions','Nginx','Gunicorn','Ubuntu','AWS EC2','Vercel','Heroku'] },
  { title:'Databases', icon:'🗄️', color:'#f72585', skills:['PostgreSQL','MySQL','SQLite','MongoDB','Redis','Firebase'] },
  { title:'Tools',     icon:'🔧', color:'#a8dadc', skills:['Git','GitHub','VS Code','Figma','Postman','Jupyter','Linux','Bash'] },
]

const PROFICIENCY = [
  { name:'Python',          level:95, icon:'🐍', delay:0   },
  { name:'Django / DRF',    level:93, icon:'🦄', delay:120 },
  { name:'Machine Learning',level:89, icon:'🧠', delay:240 },
  { name:'Deep Learning',   level:86, icon:'🔬', delay:360 },
  { name:'React / Next.js', level:83, icon:'⚛️', delay:480 },
  { name:'Docker & DevOps', level:80, icon:'🐳', delay:600 },
]

const SPECIALIZATIONS = [
  { icon:'🧬', title:'Machine Learning', desc:'Supervised, Unsupervised, RL' },
  { icon:'🧠', title:'Deep Learning', desc:'CNN, RNN, LSTM, Transformers' },
  { icon:'💬', title:'NLP', desc:'Classification, Summarization, QA' },
  { icon:'👁️', title:'Computer Vision', desc:'Detection, Segmentation' },
  { icon:'🤖', title:'LLM / RAG', desc:'GPT, Claude, Llama, Embeddings' },
  { icon:'🏗️', title:'API Architecture', desc:'REST, GraphQL, Microservices' },
]

const SkillBar = memo(function SkillBar({ skill, animated }: { skill: typeof PROFICIENCY[0]; animated: boolean }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">{skill.icon}</span>
          <span className="text-base font-bold dark:text-white text-[#0e0c1f]">{skill.name}</span>
        </div>
        <span className="text-sm font-mono text-[--accent] font-bold">{skill.level}%</span>
      </div>
      <div className="h-2 bg-[--border] rounded-full overflow-hidden" role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.name} proficiency`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] progress-fill"
          style={{
            width: animated ? `${skill.level}%` : '0%',
            '--delay': `${skill.delay}ms`,
          } as React.CSSProperties}
        />
      </div>
    </div>
  )
})

export default function Skills() {
  const ref = useReveal()
  // Separate ref for detecting when bars scroll into view
  const barsRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

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
    <section id="skills" ref={ref as React.RefObject<HTMLDivElement>} className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-96 h-96 rounded-full opacity-[0.04] bg-[#00d4ff] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-4 mb-6 reveal">
          <span className="font-mono text-sm text-[--accent]">03.</span>
          <h2 className="text-4xl md:text-5xl font-black dark:text-white text-[#1a1830]" style={{ fontFamily: 'var(--font-display)' }}>
            Skills &amp; <em className="italic text-[--accent]">Technologies</em>
          </h2>
          <div className="flex-1 h-px bg-[--border]" />
        </div>
        <p className="text-lg italic dark:text-white/55 text-[#3b3860] font-semibold mb-14 reveal" style={{ fontFamily: 'var(--font-italic)' }}>
          Constantly learning, constantly building
        </p>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          <div className="reveal-left" ref={barsRef}>
            <h3 className="text-xl font-bold dark:text-white text-[#1a1830] mb-8" style={{ fontFamily: 'var(--font-display)' }}>Core Proficiencies</h3>
            <div className="space-y-6">
              {PROFICIENCY.map(s => <SkillBar key={s.name} skill={s} animated={animated} />)}
            </div>
          </div>
          <div className="reveal-right">
            <h3 className="text-xl font-bold dark:text-white text-[#1a1830] mb-8" style={{ fontFamily: 'var(--font-display)' }}>Specializations</h3>
            <div className="grid grid-cols-2 gap-3">
              {SPECIALIZATIONS.map((s, i) => (
                <div key={s.title} className={`glass-card glass-card-hover rounded-2xl p-4 cursor-default d${i + 1}`}>
                  <div className="text-2xl mb-2" aria-hidden="true">{s.icon}</div>
                  <div className="text-sm font-black dark:text-white text-[#0e0c1f]">{s.title}</div>
                  <div className="text-xs text-[--text-muted] mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
          {CATEGORIES.map(cat => (
            <div key={cat.title} className="glass-card glass-card-hover rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${cat.color}18` }} aria-hidden="true">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold dark:text-white text-[#1a1830]" style={{ fontFamily: 'var(--font-display)' }}>{cat.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map(skill => <span key={skill} className="skill-pill">{skill}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
