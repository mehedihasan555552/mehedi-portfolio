'use client'
import { useState, memo, useCallback, useEffect, useRef } from 'react'
import { useReveal } from '@/hooks/useReveal'
import SectionHeader from './SectionHeader'

type Experience = {
  id: number
  period: string
  role: string
  company: string
  type: string
  description: string
  highlights: string[]
  stack: string[]
  /** Index into the harmonised --c-1..--c-6 ramp, so nothing sits outside the palette. */
  tone: string
  companyUrl?: string
}

const EXPERIENCES: Experience[] = [
  {
    id: 0,
    period: 'Mar 2026 – Present',
    role: 'Senior LLM Engineer',
    company: 'MYai Robotics',
    type: 'Full-time',
    description:
      'Working at the forefront of Human AI teammate development — building intelligent agents that augment workforce capabilities across industries. Contributing to advanced search engine applications that deliver clarity in authentication and amplify unfiltered insights to guide business strategies and inform public policy.',
    highlights: [
      'Engineering advanced LLM-powered agents that act as Human AI teammates across enterprise workflows',
      'Building intelligent search engine applications for authentication clarity and business strategy insights',
      'Designing multi-agent systems that amplify workforce capabilities and automate complex decision-making',
      'Contributing to AI infrastructure powering public policy insight and real-time data intelligence',
    ],
    stack: ['LLMs', 'LangChain', 'LangGraph', 'RAG', 'FastAPI', 'Python', 'Vector DB', 'OpenAI'],
    tone: 'var(--c-1)',
    companyUrl: 'https://www.facebook.com/MYai-Robotics-1058509204012017/',
  },
  {
    id: 5,
    period: '2023 – Present',
    role: 'CEO & Full-Stack Developer',
    company: 'StyleBuzzBD',
    type: 'Founder',
    description:
      'Founded and leading StyleBuzzBD as CEO while hands-on developing the full-stack platform. Overseeing product vision, team management, and technical architecture to build a thriving fashion-tech brand in Bangladesh.',
    highlights: [
      'Founded and scaled StyleBuzzBD from concept to a live fashion-tech platform',
      'Architected and built the full-stack platform with React frontend and Django backend',
      'Leading product strategy, brand direction, and business development as CEO',
      'Managing a cross-functional team across design, development, and marketing',
    ],
    stack: ['React', 'Next.js', 'Django', 'PostgreSQL', 'Tailwind CSS', 'Python', 'Stripe'],
    tone: 'var(--c-5)',
  },
  {
    id: 1,
    period: '2024 – Present',
    role: 'Python Backend & AI Developer',
    company: 'SoftwareBari',
    type: 'Full-time',
    description:
      'Building intelligent backend systems with Python Django and integrating AI/ML models into production pipelines. Leading architecture decisions and deploying scalable, high-performance applications for enterprise clients.',
    highlights: [
      'Designed AI-powered REST APIs serving 10K+ requests/day with sub-100ms response',
      'Integrated LLM models (GPT-4, Claude) into live web applications with streaming responses',
      'Built end-to-end ML pipelines with TensorFlow & PyTorch, deployed via Docker + CI/CD',
      'Led backend architecture decisions for 5+ client projects from scoping to production',
    ],
    stack: ['Python', 'Django', 'FastAPI', 'TensorFlow', 'Docker', 'PostgreSQL', 'Redis'],
    tone: 'var(--c-3)',
  },
  {
    id: 2,
    period: 'Nov 2021 – May 2023',
    role: 'Python Backend Developer',
    company: 'Automation Solutionz',
    type: 'Full-time',
    description:
      'Developed and maintained robust Python Django applications, REST APIs, and intelligent automation scripts. Collaborated closely with frontend teams to deliver complete, production-ready web solutions.',
    highlights: [
      'Built and maintained 15+ Django REST API applications across diverse industries',
      'Automated critical business workflows reducing manual processing time by 60%',
      'Integrated Stripe, SSL Commerz payment gateways and 10+ third-party API services',
      'Optimized complex PostgreSQL queries cutting average response time by 40%',
    ],
    stack: ['Python', 'Django', 'REST API', 'Celery', 'Redis', 'MySQL', 'Nginx'],
    tone: 'var(--c-6)',
  },
  {
    id: 3,
    period: 'May 2021 – Oct 2021',
    role: 'Full-Stack Developer',
    company: 'DevHub Tech',
    type: 'Full-time',
    description:
      'Built complete web applications from design to deployment, handling both React frontend and Python Django backend. Delivered polished, responsive products in a fast-paced agile team environment.',
    highlights: [
      'Delivered 8+ full-stack web applications end-to-end within tight deadlines',
      'Implemented pixel-perfect responsive UIs using React.js and Tailwind CSS',
      'Developed RESTful APIs and seamlessly integrated them with React frontend',
      'Participated in daily agile standups, sprint planning, and peer code reviews',
    ],
    stack: ['React', 'Python', 'Django', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    tone: 'var(--c-2)',
  },
  {
    id: 4,
    period: '2021 – Present',
    role: 'Freelance AI/ML Consultant',
    company: 'Freelancer.com',
    type: 'Freelance',
    description:
      'Providing expert AI/ML consulting and development services to international clients across 10+ countries. Building custom ML models, NLP solutions, computer vision systems, and intelligent web applications that deliver real business value.',
    highlights: [
      'Delivered 30+ successful freelance projects with 5-star ratings from global clients',
      'Built custom NLP pipelines for sentiment analysis, text classification & summarization',
      'Developed computer vision solutions with OpenCV for defect detection and recognition',
      'Created LLM-powered chatbots and RAG systems for enterprise knowledge bases',
    ],
    stack: ['Python', 'TensorFlow', 'PyTorch', 'LangChain', 'NLP', 'OpenCV', 'Scikit-learn'],
    tone: 'var(--c-4)',
  },
]

/* ─── Detail panel ─────────────────────────────────────────────────────── */
const DetailPanel = memo(function DetailPanel({
  exp, visible,
}: { exp: Experience; visible: boolean }) {
  const ease = 'cubic-bezier(0.16,1,0.3,1)'

  return (
    <article
      className="glass-card spotlight p-6 md:p-8 h-full"
      style={{
        borderColor: `color-mix(in srgb, ${exp.tone} 26%, var(--border))`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(14px) scale(0.99)',
        transition: `opacity 380ms ${ease}, transform 380ms ${ease}`,
      }}
    >
      {/* Header */}
      <div
        className="flex flex-wrap items-start justify-between gap-4 mb-5 pb-5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="min-w-0">
          <h3
            className="text-xl md:text-2xl font-bold leading-tight tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {exp.role}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 font-mono text-[15px]">
            <span style={{ color: exp.tone }}>@</span>
            {exp.companyUrl ? (
              <a
                href={exp.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline underline-offset-4 transition-colors"
                style={{ color: exp.tone }}
              >
                {exp.company}
              </a>
            ) : (
              <span className="font-semibold" style={{ color: exp.tone }}>{exp.company}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span
            className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-[0.08em]"
            style={{
              background: `color-mix(in srgb, ${exp.tone} 12%, transparent)`,
              color: exp.tone,
              border: `1px solid color-mix(in srgb, ${exp.tone} 32%, transparent)`,
            }}
          >
            {exp.type}
          </span>
          <span className="text-xs font-mono text-[--text-dim]">{exp.period}</span>
        </div>
      </div>

      <p className="text-[15px] leading-relaxed text-[--text-muted] mb-7">
        {exp.description}
      </p>

      {/* Highlights */}
      <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: exp.tone }}>
        Key Highlights
      </h4>
      <ul className="space-y-3 mb-7">
        {exp.highlights.map((h, i) => (
          <li
            key={i}
            className="flex items-start gap-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateX(-10px)',
              transition: `opacity 420ms ${ease} ${120 + i * 70}ms, transform 420ms ${ease} ${120 + i * 70}ms`,
            }}
          >
            <span
              className="mt-[3px] flex-shrink-0 w-5 h-5 rounded-full grid place-items-center text-[10px] font-mono font-bold"
              style={{
                background: `color-mix(in srgb, ${exp.tone} 16%, transparent)`,
                color: exp.tone,
                border: `1px solid color-mix(in srgb, ${exp.tone} 34%, transparent)`,
              }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="text-[14.5px] leading-relaxed text-[--text-muted]">{h}</span>
          </li>
        ))}
      </ul>

      {/* Stack */}
      <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: exp.tone }}>
        Tech Stack
      </h4>
      <div className="flex flex-wrap gap-2">
        {exp.stack.map((tech, i) => (
          <span
            key={tech}
            className="px-2.5 py-1 text-xs font-mono"
            style={{
              borderRadius: 'var(--r-sm)',
              background: `color-mix(in srgb, ${exp.tone} 9%, transparent)`,
              border: `1px solid color-mix(in srgb, ${exp.tone} 22%, transparent)`,
              color: 'var(--text)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'scale(0.9)',
              transition: `opacity 340ms ${ease} ${280 + i * 40}ms, transform 340ms ${ease} ${280 + i * 40}ms`,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
})

/* ─── Main ─────────────────────────────────────────────────────────────── */
export default function Experience() {
  const [active, setActive]       = useState(0)
  const [visible, setVisible]     = useState(true)
  const [displayed, setDisplayed] = useState(0)
  const ref = useReveal()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSelect = useCallback((i: number) => {
    if (i === active) return
    setActive(i)
    setVisible(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDisplayed(i)
      setVisible(true)
    }, 220)
  }, [active])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const tone = EXPERIENCES[active].tone

  return (
    <section
      id="experience"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      {/* Ambient wash that follows the selected role */}
      <div
        className="absolute top-1/3 right-0 w-[380px] aspect-square rounded-full opacity-[0.07] blur-[100px] pointer-events-none"
        style={{ background: tone, transition: 'background 700ms cubic-bezier(0.16,1,0.3,1)' }}
        aria-hidden="true"
      />

      <div className="container-x">
        <SectionHeader
          index="02 —"
          title="Professional"
          emphasis="Experience"
          standfirst="A journey of growth, innovation, and delivering exceptional results."
        />

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Timeline rail ── */}
          <div className="lg:col-span-2 reveal-left">
            <div className="relative" role="tablist" aria-label="Roles">
              {/* Rail */}
              <span
                className="absolute left-[13px] top-3 bottom-3 w-px"
                style={{ background: 'var(--border)' }}
                aria-hidden="true"
              />
              {/* Travelling highlight */}
              <span
                className="absolute left-[12px] w-[3px] rounded-full pointer-events-none"
                style={{
                  top: `calc(${(active / EXPERIENCES.length) * 100}% + 12px)`,
                  height: `calc(${100 / EXPERIENCES.length}% - 12px)`,
                  background: tone,
                  boxShadow: `0 0 12px ${tone}`,
                  transition: 'top 480ms cubic-bezier(0.16,1,0.3,1), background 480ms ease, box-shadow 480ms ease',
                }}
                aria-hidden="true"
              />

              <div className="space-y-2">
                {EXPERIENCES.map((e, i) => {
                  const on = active === i
                  return (
                    <button
                      key={e.id}
                      role="tab"
                      aria-selected={on}
                      onClick={() => handleSelect(i)}
                      className="w-full text-left p-3.5 pl-10 relative group transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        borderRadius: 'var(--r-md)',
                        background: on ? `color-mix(in srgb, ${e.tone} 8%, transparent)` : 'transparent',
                        border: `1px solid ${on ? `color-mix(in srgb, ${e.tone} 28%, transparent)` : 'transparent'}`,
                        transform: on ? 'translateX(4px)' : 'none',
                      }}
                    >
                      {/* Node */}
                      <span
                        className="absolute left-[7px] top-1/2 -translate-y-1/2 rounded-full transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{
                          width: on ? 13 : 9,
                          height: on ? 13 : 9,
                          background: on ? e.tone : 'var(--border-hi)',
                          boxShadow: on ? `0 0 0 3px color-mix(in srgb, ${e.tone} 18%, transparent)` : 'none',
                        }}
                        aria-hidden="true"
                      />

                      <span
                        className="block text-[14.5px] font-semibold leading-snug transition-colors duration-200"
                        style={{ color: on ? 'var(--text)' : 'var(--text-muted)' }}
                      >
                        {e.role}
                      </span>
                      <span className="block text-[13px] mt-0.5 text-[--text-dim]">
                        @ {e.company}
                      </span>
                      <span
                        className="block text-[11px] font-mono mt-1 transition-colors duration-200"
                        style={{ color: on ? e.tone : 'var(--text-dim)' }}
                      >
                        {e.period}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Detail ── */}
          <div className="lg:col-span-3 reveal-right">
            <DetailPanel exp={EXPERIENCES[displayed]} visible={visible} />
          </div>
        </div>
      </div>
    </section>
  )
}
