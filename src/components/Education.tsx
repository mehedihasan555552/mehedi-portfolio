'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'
import SectionHeader from './SectionHeader'
import swpu from '../../images/swpu.png'

const EDUCATION = [
  {
    period: '2021–2024',
    degree: "Master's Degree",
    field: 'Computer Science & Engineering',
    institution: 'Southwest Petroleum University',
    desc: 'Focused on ML, Deep Learning, and Advanced Algorithms. Thesis on NLP applications.',
    tone: 'var(--c-1)',
  },
  {
    period: '2017–2021',
    degree: "Bachelor's Degree",
    field: 'Computer Science & Engineering',
    institution: 'Southwest Petroleum University',
    desc: 'Study of CS fundamentals, software engineering, data structures, algorithms, and web development.',
    tone: 'var(--c-2)',
  },
  {
    period: '2013–2015',
    degree: 'Higher Secondary (HSC)',
    field: 'Science',
    institution: 'Jahangirnagar University School & College',
    desc: 'Higher secondary with focus on Science, Mathematics, and Physics.',
    tone: 'var(--c-3)',
  },
  {
    period: '2003–2013',
    degree: 'Secondary School (SSC)',
    field: 'Science',
    institution: 'Radio Colony Model School & College',
    desc: 'Completed secondary education with distinction, building a strong foundation in Science, Mathematics, and Bengali literature.',
    tone: 'var(--c-5)',
  },
]

const CERTS = [
  { name: 'Machine Learning Specialization', issuer: 'Coursera / Stanford', year: '2023' },
  { name: 'Deep Learning Specialization',    issuer: 'deeplearning.ai',     year: '2023' },
  { name: 'Python for Data Science',         issuer: 'IBM / Coursera',      year: '2022' },
  { name: 'AWS Cloud Fundamentals',          issuer: 'Amazon Web Services', year: '2022' },
]

const STATS = [
  { value: '7+', label: 'Years Study' },
  { value: '4',  label: 'Institutions' },
  { value: '4',  label: 'Certifications' },
]

export default function Education() {
  const ref = useReveal()

  return (
    <section
      id="education"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div
        data-parallax
        className="absolute bottom-0 left-0 w-[380px] aspect-square rounded-full opacity-[0.05] blur-[100px] pointer-events-none"
        style={{ ['--par' as string]: '-55px', background: 'var(--c-2)' }}
        aria-hidden="true"
      />

      <div className="container-x">
        <SectionHeader
          index="06 —"
          title="Education"
          emphasis="Journey"
          standfirst="Building knowledge through continuous learning and academic excellence."
        />

        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Timeline ── */}
          <div className="reveal-left">
            <div className="relative">
              <span
                className="absolute left-[7px] top-4 bottom-4 w-px"
                style={{
                  background:
                    'linear-gradient(to bottom, var(--c-1), var(--c-2), var(--c-3), var(--c-5))',
                  opacity: 0.35,
                }}
                aria-hidden="true"
              />

              <div className="space-y-4">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="relative pl-9 group">
                    {/* Node */}
                    <span
                      className="absolute left-0 top-6 w-[15px] h-[15px] rounded-full transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125"
                      style={{
                        background: 'var(--bg)',
                        border: `2px solid ${edu.tone}`,
                        boxShadow: `0 0 0 4px color-mix(in srgb, ${edu.tone} 12%, transparent)`,
                      }}
                      aria-hidden="true"
                    />

                    <motion.div
                      whileHover={{ y: -4, scale: 1.015 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      className="glass-card glass-card-hover spotlight p-5 sm:p-6 tilt-3d"
                      style={{ borderColor: `color-mix(in srgb, ${edu.tone} 16%, var(--border))` }}
                    >
                      <div className="tilt-glare" />
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h3
                            className="text-[18px] sm:text-[19.5px] font-extrabold leading-snug tracking-[-0.015em]"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {edu.degree}
                          </h3>
                          <div className="text-[14.5px] sm:text-[15px] font-semibold mt-0.5" style={{ color: edu.tone }}>
                            {edu.field}
                          </div>
                        </div>
                        <span
                          className="px-3 py-1 text-[12px] font-mono font-bold flex-shrink-0"
                          style={{
                            borderRadius: 'var(--r-sm)',
                            background: `color-mix(in srgb, ${edu.tone} 11%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${edu.tone} 26%, transparent)`,
                            color: edu.tone,
                          }}
                        >
                          {edu.period}
                        </span>
                      </div>

                      <div className="text-[14px] font-mono font-bold text-[--text-dim] mb-2.5">
                        {edu.institution}
                      </div>

                      <p className="text-[15px] sm:text-[15.5px] font-medium leading-relaxed text-[--text-muted]">
                        {edu.desc}
                      </p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="reveal-right space-y-6">

            {/* Campus */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative h-56 overflow-hidden group tilt-3d"
              style={{
                borderRadius: 'var(--r-xl)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--sh-3)',
              }}
            >
              <div className="tilt-glare" />
              <Image
                src={swpu}
                alt="Southwest Petroleum University campus"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <span
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgb(3 8 6 / 0.86), rgb(3 8 6 / 0.14) 58%, transparent)' }}
                aria-hidden="true"
              />
              <span
                className="absolute top-4 left-4 px-3 py-1 text-[12px] font-mono backdrop-blur-sm"
                style={{
                  borderRadius: 'var(--r-sm)',
                  background: 'rgb(2 8 5 / 0.62)',
                  border: '1px solid rgb(var(--accent-rgb) / 0.5)',
                  color: 'var(--accent)',
                }}
              >
                Chengdu, China
              </span>
              <blockquote className="absolute bottom-5 left-5 right-5">
                <p className="text-[16px] sm:text-[17px] italic text-white/92 leading-snug">
                  &ldquo;Learning never exhausts the mind.&rdquo;
                </p>
              </blockquote>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {STATS.map(stat => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="glass-card glass-card-hover spotlight p-4 text-center tilt-3d cursor-default"
                >
                  <div className="tilt-glare" />
                  <div
                    className="text-[26px] sm:text-[28px] font-bold"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[11.5px] sm:text-[12px] font-mono uppercase tracking-[0.1em] text-[--text-dim] mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <h3 className="flex items-center gap-2.5 text-[14px] sm:text-[14.5px] font-mono font-semibold uppercase tracking-[0.16em] mb-4 text-[--text-muted]">
                <span className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                Certifications
              </h3>
              <div className="space-y-2.5">
                {CERTS.map((cert, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 5, scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className="flex items-center gap-3.5 glass-card glass-card-hover spotlight px-4 py-3 group tilt-3d cursor-default"
                  >
                    <div className="tilt-glare" />
                    <span
                      className="w-9 h-9 rounded-md grid place-items-center flex-shrink-0 font-mono text-[12px] font-semibold transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110"
                      style={{
                        background: 'var(--accent-soft)',
                        border: '1px solid var(--accent-line)',
                        color: 'var(--accent)',
                      }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14.5px] sm:text-[15px] font-medium truncate" style={{ color: 'var(--text)' }}>
                        {cert.name}
                      </div>
                      <div className="text-[12.5px] text-[--text-dim] mt-0.5">{cert.issuer}</div>
                    </div>
                    <span className="text-[12.5px] font-mono flex-shrink-0 text-[--text-dim]">
                      {cert.year}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
