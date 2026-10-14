'use client'
import { useState, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import type { ExperienceItem } from '@/data/defaultDb'
import SectionHeader from './SectionHeader'

const DetailPanel = memo(function DetailPanel({ exp }: { exp: ExperienceItem }) {
  return (
    <motion.article
      key={exp.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="glass-card spotlight p-6 md:p-8 h-full tilt-3d"
      style={{
        borderColor: `color-mix(in srgb, ${exp.tone} 40%, var(--border))`,
      }}
    >
      <div
        className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="min-w-0">
          <h3
            className="text-2xl md:text-3xl font-extrabold leading-tight tracking-[-0.015em]"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
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
            className="px-3.5 py-1 rounded-full text-[12px] font-mono font-extrabold uppercase tracking-[0.08em]"
            style={{
              background: `color-mix(in srgb, ${exp.tone} 16%, transparent)`,
              color: exp.tone,
              border: `1.5px solid color-mix(in srgb, ${exp.tone} 40%, transparent)`,
            }}
          >
            {exp.type}
          </span>
          <span className="text-[13px] font-mono font-bold text-[--text-dim]">{exp.period}</span>
        </div>
      </div>

      <p className="text-[16.5px] sm:text-[17.5px] font-medium leading-relaxed text-[--text-muted] mb-8">
        {exp.description}
      </p>

      <h4 className="text-[12px] font-mono font-extrabold uppercase tracking-[0.16em] mb-4 flex items-center gap-2" style={{ color: exp.tone }}>
        <span className="w-1.5 h-3 rounded-full" style={{ background: exp.tone }} aria-hidden="true" />
        Key Highlights
      </h4>
      <ul className="space-y-3.5 mb-8">
        {exp.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-3.5">
            <span
              className="mt-[3px] flex-shrink-0 w-5 h-5 rounded-full grid place-items-center text-[11px] font-mono font-extrabold"
              style={{
                background: `color-mix(in srgb, ${exp.tone} 18%, transparent)`,
                color: exp.tone,
                border: `1px solid color-mix(in srgb, ${exp.tone} 40%, transparent)`,
              }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="text-[15.5px] sm:text-[16.5px] font-medium leading-relaxed text-[--text-muted]">{h}</span>
          </li>
        ))}
      </ul>

      <h4 className="text-[12px] font-mono font-extrabold uppercase tracking-[0.16em] mb-3 flex items-center gap-2" style={{ color: exp.tone }}>
        <span className="w-1.5 h-3 rounded-full" style={{ background: exp.tone }} aria-hidden="true" />
        Tech Stack
      </h4>
      <div className="flex flex-wrap gap-2">
        {exp.stack.map((tech) => (
          <span
            key={tech}
            className="px-3.5 py-1.5 text-[12.5px] sm:text-[13px] font-mono font-bold cursor-default"
            style={{
              borderRadius: 'var(--r-sm)',
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.article>
  )
})

export default function Experience() {
  const { db } = usePortfolioData()
  const experiences = db.experiences
  const [active, setActive] = useState(0)
  const ref = useReveal()

  const safeActive = active < experiences.length ? active : 0

  const handleSelect = useCallback((i: number) => {
    setActive(i)
  }, [])

  if (!experiences.length) return null

  return (
    <section
      id="experience"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div className="container-x">
        <SectionHeader
          index="02 —"
          title="Professional"
          emphasis="Experience"
          standfirst="A journey of growth, innovation, and delivering exceptional results."
        />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 reveal-left">
            <div className="relative" role="tablist" aria-label="Roles">
              <span
                className="absolute left-[13px] top-3 bottom-3 w-px"
                style={{ background: 'var(--border)' }}
                aria-hidden="true"
              />

              <div className="space-y-2">
                {experiences.map((e, i) => {
                  const on = safeActive === i
                  return (
                    <button
                      key={`${e.id}-${i}`}
                      role="tab"
                      aria-selected={on}
                      onClick={() => handleSelect(i)}
                      className="w-full text-left p-4 pl-10 relative group rounded-[var(--r-md)] transition-all duration-200 cursor-pointer"
                      style={{
                        background: on ? 'var(--card)' : 'transparent',
                        border: on ? `1.5px solid ${e.tone}` : '1.5px solid transparent',
                        boxShadow: on ? 'var(--sh-2)' : 'none',
                      }}
                    >
                      <span
                        className="absolute left-[7px] top-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                        style={{
                          width: on ? 13 : 9,
                          height: on ? 13 : 9,
                          background: on ? e.tone : 'var(--border-hi)',
                        }}
                        aria-hidden="true"
                      />

                      <span
                        className="block text-[16px] font-extrabold leading-snug relative z-10"
                        style={{ color: 'var(--text)' }}
                      >
                        {e.role}
                      </span>
                      <span
                        className="block text-[14px] sm:text-[14.5px] font-bold mt-0.5 relative z-10"
                        style={{ color: on ? e.tone : 'var(--text-muted)' }}
                      >
                        @ {e.company}
                      </span>
                      <span
                        className="block text-[12.5px] font-mono font-bold mt-1 relative z-10"
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

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <DetailPanel key={safeActive} exp={experiences[safeActive]} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
