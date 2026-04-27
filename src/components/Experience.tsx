'use client'
import { useState, memo } from 'react'
import { useReveal } from '@/hooks/useReveal'

const EXPERIENCES = [
  {
    id: 1,
    period: '2024 – Present',
    role: 'Python Backend & AI Developer',
    company: 'CodeMindsTech',
    type: 'Full-time',
    description: 'Building intelligent backend systems with Python Django and integrating AI/ML models into production pipelines. Leading architecture decisions and deploying scalable, high-performance applications for enterprise clients.',
    highlights: [
      'Designed AI-powered REST APIs serving 10K+ requests/day with sub-100ms response',
      'Integrated LLM models (GPT-4, Claude) into live web applications with streaming responses',
      'Built end-to-end ML pipelines with TensorFlow & PyTorch, deployed via Docker + CI/CD',
      'Led backend architecture decisions for 5+ client projects from scoping to production',
    ],
    stack: ['Python', 'Django', 'FastAPI', 'TensorFlow', 'Docker', 'PostgreSQL', 'Redis'],
    color: '#4f7fff',
    colorBg: 'rgba(79,127,255,0.12)',
  },
  {
    id: 2,
    period: 'Nov 2021 – May 2023',
    role: 'Python Backend Developer',
    company: 'Automation Solutionz',
    type: 'Full-time',
    description: 'Developed and maintained robust Python Django applications, REST APIs, and intelligent automation scripts. Collaborated closely with frontend teams to deliver complete, production-ready web solutions.',
    highlights: [
      'Built and maintained 15+ Django REST API applications across diverse industries',
      'Automated critical business workflows reducing manual processing time by 60%',
      'Integrated Stripe, SSL Commerz payment gateways and 10+ third-party API services',
      'Optimized complex PostgreSQL queries cutting average response time by 40%',
    ],
    stack: ['Python', 'Django', 'REST API', 'Celery', 'Redis', 'MySQL', 'Nginx'],
    color: '#9b5de5',
    colorBg: 'rgba(155,93,229,0.12)',
  },
  {
    id: 3,
    period: 'May 2021 – Oct 2021',
    role: 'Full-Stack Developer',
    company: 'DevHub Tech',
    type: 'Full-time',
    description: 'Built complete web applications from design to deployment, handling both React frontend and Python Django backend. Delivered polished, responsive products in a fast-paced agile team environment.',
    highlights: [
      'Delivered 8+ full-stack web applications end-to-end within tight deadlines',
      'Implemented pixel-perfect responsive UIs using React.js and Tailwind CSS',
      'Developed RESTful APIs and seamlessly integrated them with React frontend',
      'Participated in daily agile standups, sprint planning, and peer code reviews',
    ],
    stack: ['React', 'Python', 'Django', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    color: '#00d4ff',
    colorBg: 'rgba(0,212,255,0.10)',
  },
  {
    id: 4,
    period: '2021 – Present',
    role: 'Freelance AI/ML Consultant',
    company: 'Freelancer.com',
    type: 'Freelance',
    description: 'Providing expert AI/ML consulting and development services to international clients across 10+ countries. Building custom ML models, NLP solutions, computer vision systems, and intelligent web applications that deliver real business value.',
    highlights: [
      'Delivered 30+ successful freelance projects with 5-star ratings from global clients',
      'Built custom NLP pipelines for sentiment analysis, text classification & summarization',
      'Developed computer vision solutions with OpenCV for defect detection and recognition',
      'Created LLM-powered chatbots and RAG systems for enterprise knowledge bases',
    ],
    stack: ['Python', 'TensorFlow', 'PyTorch', 'LangChain', 'NLP', 'OpenCV', 'Scikit-learn'],
    color: '#f4a261',
    colorBg: 'rgba(244,162,97,0.12)',
  },
]

const DetailPanel = memo(function DetailPanel({ exp }: { exp: typeof EXPERIENCES[0] }) {
  return (
    <article
      className="rounded-3xl p-7 md:p-8 h-full border"
      style={{
        background: exp.colorBg,
        borderColor: `${exp.color}30`,
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5 pb-5 border-b" style={{ borderColor: `${exp.color}20` }}>
        <div>
          <h3
            className="text-2xl md:text-3xl font-black dark:text-white text-[#0e0c1f] leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {exp.role}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl font-bold" style={{ color: exp.color }}>@</span>
            <span className="text-lg font-bold dark:text-white text-[#0e0c1f]">{exp.company}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span
            className="px-4 py-1.5 rounded-full text-sm font-bold"
            style={{ background: `${exp.color}20`, color: exp.color, border: `1.5px solid ${exp.color}40` }}
          >
            {exp.type}
          </span>
          <span className="text-sm font-mono font-semibold dark:text-white/60 text-[#3b3860]">{exp.period}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-base md:text-lg dark:text-white/80 text-[#1a1640] leading-relaxed mb-6 font-medium">
        {exp.description}
      </p>

      {/* Highlights */}
      <div className="mb-6">
        <h4
          className="text-xs font-mono font-bold uppercase tracking-widest mb-4"
          style={{ color: exp.color }}
        >
          ✦ Key Highlights
        </h4>
        <ul className="space-y-3">
          {exp.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm"
                style={{ background: exp.color }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-base dark:text-white/75 text-[#1a1640] font-medium leading-snug">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stack */}
      <div>
        <h4
          className="text-xs font-mono font-bold uppercase tracking-widest mb-3"
          style={{ color: exp.color }}
        >
          ✦ Tech Stack
        </h4>
        <div className="flex flex-wrap gap-2">
          {exp.stack.map(tech => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg text-sm font-mono font-semibold dark:text-white text-[#0e0c1f]"
              style={{
                background: `${exp.color}15`,
                border: `1px solid ${exp.color}30`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
})

export default function Experience() {
  const [active, setActive] = useState(0)
  const ref = useReveal()

  return (
    <section
      id="experience"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-28 relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 right-0 w-80 h-80 rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: EXPERIENCES[active].color }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6 reveal">
          <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent)' }}>02.</span>
          <h2
            className="text-4xl md:text-5xl font-black dark:text-white text-[#0e0c1f]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Professional{' '}
            <em className="italic" style={{ color: 'var(--accent)' }}>Experience</em>
          </h2>
          <div className="flex-1 h-px dark:bg-white/10 bg-[#0e0c1f]/15" />
        </div>
        <p
          className="text-lg italic dark:text-white/50 text-[#3b3860] mb-14 reveal font-medium"
          style={{ fontFamily: 'var(--font-italic)' }}
        >
          A journey of growth, innovation, and delivering exceptional results
        </p>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── Sidebar tabs ── */}
          <div className="lg:col-span-2 reveal-left">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-6 bottom-6 w-0.5 dark:bg-white/10 bg-[#0e0c1f]/12" aria-hidden="true" />

              <div className="space-y-3">
                {EXPERIENCES.map((e, i) => (
                  <button
                    key={e.id}
                    onClick={() => setActive(i)}
                    aria-pressed={active === i}
                    className={`w-full text-left p-4 pl-14 rounded-2xl border-2 transition-all duration-200 relative ${
                      active === i
                        ? 'shadow-lg dark:shadow-black/30'
                        : 'border-transparent dark:hover:bg-white/5 hover:bg-[#0e0c1f]/5'
                    }`}
                    style={
                      active === i
                        ? {
                            background: `${e.colorBg}`,
                            borderColor: `${e.color}50`,
                          }
                        : {}
                    }
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-200 ${
                        active === i ? 'w-6 h-6' : 'w-5 h-5'
                      }`}
                      style={{
                        background: e.color,
                        borderColor: active === i ? 'transparent' : 'var(--bg)',
                        boxShadow: active === i ? `0 0 12px ${e.color}70` : 'none',
                      }}
                      aria-hidden="true"
                    />

                    {/* Text */}
                    <div
                      className={`text-base font-bold transition-colors ${
                        active === i ? 'dark:text-white text-[#0e0c1f]' : 'dark:text-white/70 text-[#1a1640]'
                      }`}
                    >
                      {e.role}
                    </div>
                    <div className={`text-sm mt-0.5 font-semibold ${active === i ? 'dark:text-white/70 text-[#3b3860]' : 'dark:text-white/40 text-[#6b689a]'}`}>
                      @ {e.company}
                    </div>
                    <div
                      className="text-xs font-mono font-bold mt-1.5"
                      style={{ color: active === i ? e.color : `${e.color}80` }}
                    >
                      {e.period}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Detail panel ── */}
          <div className="lg:col-span-3 reveal-right">
            <DetailPanel exp={EXPERIENCES[active]} />
          </div>
        </div>
      </div>
    </section>
  )
}
