'use client'
import { useState, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
const DetailPanel = memo(function DetailPanel({ exp }: { exp: Experience }) {
  return (
    <motion.article
      key={exp.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card spotlight p-6 md:p-8 h-full tilt-3d"
      style={{
        borderColor: `color-mix(in srgb, ${exp.tone} 26%, var(--border))`,
      }}
    >
      <div className="tilt-glare" />

      {/* Header */}
      <div
        className="flex flex-wrap items-start justify-between gap-4 mb-5 pb-5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="min-w-0">
          <h3
            className="text-2xl md:text-3xl font-extrabold leading-tight tracking-[-0.015em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {exp.role}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 font-mono font-bold text-[16px] sm:text-[17px]">
            <span style={{ color: exp.tone }}>@</span>
            {exp.companyUrl ? (
              <a
                href={exp.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline underline-offset-4 transition-colors"
                style={{ color: exp.tone }}
              >
                {exp.company}
              </a>
            ) : (
              <span className="font-bold" style={{ color: exp.tone }}>{exp.company}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span
            className="px-3.5 py-1 rounded-full text-[12px] font-mono font-bold uppercase tracking-[0.08em]"
            style={{
              background: `color-mix(in srgb, ${exp.tone} 12%, transparent)`,
              color: exp.tone,
              border: `1px solid color-mix(in srgb, ${exp.tone} 32%, transparent)`,
            }}
          >
            {exp.type}
          </span>
          <span className="text-[13px] font-mono font-bold text-[--text-dim]">{exp.period}</span>
        </div>
      </div>

      <p className="text-[16.5px] sm:text-[17.5px] font-medium leading-relaxed text-[--text-muted] mb-7">
        {exp.description}
      </p>

      {/* Highlights */}
      <h4 className="text-[12px] font-mono font-bold uppercase tracking-[0.16em] mb-4" style={{ color: exp.tone }}>
        Key Highlights
      </h4>
      <ul className="space-y-3 mb-7">
        {exp.highlights.map((h, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 + i * 0.06 }}
            className="flex items-start gap-3"
          >
            <span
              className="mt-[3px] flex-shrink-0 w-5 h-5 rounded-full grid place-items-center text-[11px] font-mono font-extrabold"
              style={{
                background: `color-mix(in srgb, ${exp.tone} 16%, transparent)`,
                color: exp.tone,
                border: `1px solid color-mix(in srgb, ${exp.tone} 34%, transparent)`,
              }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="text-[15.5px] sm:text-[16px] font-medium leading-relaxed text-[--text-muted]">{h}</span>
          </motion.li>
        ))}
      </ul>

      {/* Stack */}
      <h4 className="text-[12px] font-mono font-bold uppercase tracking-[0.16em] mb-3" style={{ color: exp.tone }}>
        Tech Stack
      </h4>
      <div className="flex flex-wrap gap-2">
        {exp.stack.map((tech, i) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="px-3 py-1 text-[12.5px] sm:text-[13px] font-mono font-semibold cursor-default"
            style={{
              borderRadius: 'var(--r-sm)',
              background: `color-mix(in srgb, ${exp.tone} 9%, transparent)`,
              border: `1px solid color-mix(in srgb, ${exp.tone} 22%, transparent)`,
              color: 'var(--text)',
            }}
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </motion.article>
  )
})

/* ─── Main ─────────────────────────────────────────────────────────────── */
export default function Experience() {
  const [active, setActive] = useState(0)
  const ref = useReveal()

  const handleSelect = useCallback((i: number) => {
    setActive(i)
  }, [])

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

      {/* Ambient 3D floating accent */}
      <div
        className="floating-3d-geom hidden lg:block absolute top-12 left-10 w-16 h-16 pointer-events-none opacity-30"
        style={{ animationDuration: '19s' }}
        aria-hidden="true"
      >
        <div className="w-full h-full border border-[--accent] rounded-xl transform -rotate-12" />
      </div>

      <div className="container-x">
        <SectionHeader
          index="02 —"
          title="Professional"
          emphasis="Experience"
          standfirst="A journey of growth, innovation, and delivering exceptional results."
        />

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Timeline rail ── */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2"
          >
            <div className="relative" role="tablist" aria-label="Roles">
              {/* Rail */}
              <span
                className="absolute left-[13px] top-3 bottom-3 w-px"
                style={{ background: 'var(--border)' }}
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
                      className="w-full text-left p-4 pl-10 relative group transition-colors duration-200"
                      style={{
                        borderRadius: 'var(--r-md)',
                      }}
                    >
                      {/* Active sliding pill */}
                      {on && (
                        <motion.span
                          layoutId="active-experience-pill"
                          className="absolute inset-0 rounded-[var(--r-md)] pointer-events-none"
                          style={{
                            background: `color-mix(in srgb, ${e.tone} 11%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${e.tone} 36%, transparent)`,
                            boxShadow: `0 4px 22px -4px color-mix(in srgb, ${e.tone} 28%, transparent)`,
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}

                      {/* Node */}
                      <span
                        className="absolute left-[7px] top-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                        style={{
                          width: on ? 13 : 9,
                          height: on ? 13 : 9,
                          background: on ? e.tone : 'var(--border-hi)',
                          boxShadow: on ? `0 0 0 3px color-mix(in srgb, ${e.tone} 18%, transparent)` : 'none',
                        }}
                        aria-hidden="true"
                      />

                      <span
                        className="block text-[16px] font-bold leading-snug transition-colors duration-200 relative z-10"
                        style={{ color: on ? 'var(--text)' : 'var(--text-muted)' }}
                      >
                        {e.role}
                      </span>
                      <span className="block text-[14px] sm:text-[14.5px] font-semibold mt-0.5 text-[--text-dim] relative z-10">
                        @ {e.company}
                      </span>
                      <span
                        className="block text-[12.5px] font-mono font-bold mt-1 transition-colors duration-200 relative z-10"
                        style={{ color: on ? e.tone : 'var(--text-dim)' }}
                      >
                        {e.period}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* ── Detail with AnimatePresence ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <DetailPanel key={active} exp={EXPERIENCES[active]} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
