'use client'
import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'
import { useCountUp } from '@/hooks/useCountUp'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import type { SkillProficiency, SkillCategory } from '@/data/defaultDb'
import SectionHeader from './SectionHeader'
import SkillSphere3D from './SkillSphere3D'

const SkillBar = memo(function SkillBar({
  skill, animated,
}: { skill: SkillProficiency; animated: boolean }) {
  const count = useCountUp(skill.level, animated, 1100)

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
            duration: 1.0,
            delay: (skill.delay || 0) / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  )
})

const CategoryCard = memo(function CategoryCard({
  cat, index, active, onHover, onLeave,
}: {
  cat: SkillCategory
  index: number
  active: number | null
  onHover: (i: number) => void
  onLeave: () => void
}) {
  const on     = active === index
  const dimmed = active !== null && !on

  return (
    <div
      className="glass-card glass-card-hover spotlight tilt-3d p-5 cursor-default transition-opacity duration-200"
      style={{
        borderColor: on ? cat.tone : 'var(--border)',
        opacity:     dimmed ? 0.5 : 1,
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[17px] sm:text-[18.5px] font-extrabold tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-display)', color: on ? cat.tone : 'var(--text)' }}
        >
          {cat.title}
        </h3>
        <span className="text-[11.5px] font-mono font-extrabold text-[--text-dim]">
          {String(cat.skills.length).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {cat.skills.map((skill) => (
          <span
            key={skill}
            className="inline-block px-2.5 py-1 text-[12.5px] sm:text-[13px] font-mono font-bold cursor-default"
            style={{
              borderRadius: 'var(--r-xs)',
              background: 'var(--bg-2)',
              color:      on ? cat.tone : 'var(--text-muted)',
              border:     '1px solid var(--border)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
})

export default function Skills() {
  const ref     = useReveal()
  const barsRef = useRef<HTMLDivElement>(null)
  const { db }  = usePortfolioData()
  const [animated, setAnimated]     = useState(false)
  const [hoveredCat, setHoveredCat] = useState<number | null>(null)

  const handleHover = useCallback((i: number) => setHoveredCat(i), [])
  const handleLeave = useCallback(() => setHoveredCat(null), [])

  useEffect(() => {
    const el = barsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); obs.disconnect() } },
      { threshold: 0.2 }
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
      <div className="container-x">
        <SectionHeader
          index="03 —"
          title="Skills &"
          emphasis="3D Tech Ecosystem"
          standfirst="Interactive 3D skill globe, quantitative proficiency telemetry, and production specializations."
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 mb-16 items-stretch">
          <div className="lg:col-span-5 reveal-left flex flex-col justify-between" ref={barsRef}>
            <div>
              <h3 className="flex items-center gap-2.5 text-[13px] font-mono font-semibold uppercase tracking-[0.16em] mb-7 text-[--text-muted]">
                <span className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                Core Proficiencies
              </h3>
              <div className="space-y-5">
                {db.proficiencies.map(s => (
                  <SkillBar key={s.name} skill={s} animated={animated} />
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {db.specializations.slice(0, 4).map(s => (
                <div
                  key={s.title}
                  className="glass-card glass-card-hover spotlight tilt-3d p-3.5 cursor-default"
                >
                  <div className="text-[13.5px] font-bold leading-snug text-[--text]">{s.title}</div>
                  <div className="text-[11.5px] font-mono text-[--text-dim] mt-1">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 reveal-right flex flex-col gap-5">
            <SkillSphere3D activeCategory={hoveredCat} />

            <div className="grid sm:grid-cols-2 gap-3.5">
              {db.specializations.slice(4, 6).map(s => (
                <div
                  key={s.title}
                  className="glass-card glass-card-hover spotlight tilt-3d p-4 group cursor-default"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-[7px] w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: 'var(--accent)' }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <div className="text-[14.5px] sm:text-[15.5px] font-bold leading-snug">
                        {s.title}
                      </div>
                      <div className="text-[12.5px] sm:text-[13px] text-[--text-dim] mt-1 leading-snug">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="flex flex-wrap items-center gap-2.5 text-[13px] font-mono font-semibold uppercase tracking-[0.16em] mb-6 text-[--text-muted] reveal">
            <span className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
            Full Tech Stack
            <span className="normal-case tracking-normal font-normal text-[--text-dim] text-[12px]">
              — hover any category to spotlight it in the 3D sphere above
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {db.skillCategories.map((cat, i) => (
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
