'use client'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'
import swpu from '../../images/swpu.png'

const EDUCATION = [
  {
    period: '2021–2024',
    degree: "Master's Degree",
    field: 'Computer Science & Engineering',
    institution: 'Southwest Petroleum University',
    desc: 'Focused on ML, Deep Learning, and Advanced Algorithms. Thesis on NLP applications.',
    color: '#4f7fff',
    icon: '🎓',
  },
  {
    period: '2017–2021',
    degree: "Bachelor's Degree",
    field: 'Computer Science & Engineering',
    institution: 'Southwest Petroleum University',
    desc: 'Study of CS fundamentals, software engineering, data structures, algorithms, and web development.',
    color: '#9b5de5',
    icon: '🎓',
  },
  {
    period: '2013–2015',
    degree: 'Higher Secondary (HSC)',
    field: 'Science',
    institution: 'Jahangirnagar University School & College',
    desc: 'Higher secondary with focus on Science, Mathematics, and Physics.',
    color: '#00d4ff',
    icon: '🏫',
  },
  {
    period: '2003–2013',
    degree: 'Secondary School (SSC)',
    field: 'Science',
    institution: 'Radio Colony Model School & College',
    desc: 'Completed secondary education with distinction, building a strong foundation in Science, Mathematics, and Bengali literature.',
    color: '#f4a261',
    icon: '📚',
  },
]

const CERTS = [
  { name: 'Machine Learning Specialization', issuer: 'Coursera / Stanford',  year: '2023', icon: '🤖' },
  { name: 'Deep Learning Specialization',    issuer: 'deeplearning.ai',       year: '2023', icon: '🧠' },
  { name: 'Python for Data Science',         issuer: 'IBM / Coursera',        year: '2022', icon: '🐍' },
  { name: 'AWS Cloud Fundamentals',          issuer: 'Amazon Web Services',   year: '2022', icon: '☁️' },
]

export default function Education() {
  const ref = useReveal()

  return (
    <section
      id="education"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-28 relative overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.05] bg-[#9b5de5] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full opacity-[0.04] bg-[#4f7fff] blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-6 reveal">
          <span className="font-mono text-sm text-[--accent]">05.</span>
          <h2
            className="text-4xl md:text-5xl font-black dark:text-white text-[#1a1830]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Education <em className="italic text-[--accent]">Journey</em>
          </h2>
          <div className="flex-1 h-px bg-[--border]" />
        </div>

        <p
          className="text-lg italic dark:text-white/55 text-[#3b3860] font-semibold mb-14 reveal"
          style={{ fontFamily: 'var(--font-italic)' }}
        >
          Building knowledge through continuous learning and academic excellence
        </p>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Timeline ── */}
          <div className="reveal-left">
            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-6 top-6 bottom-6 w-px"
                style={{
                  background: 'linear-gradient(to bottom, #4f7fff40, #9b5de540, #00d4ff40, #f4a26140)',
                }}
                aria-hidden="true"
              />

              <div className="space-y-5">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="relative pl-20 group">

                    {/* Icon dot */}
                    <div
                      className="absolute left-0 top-5 w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `${edu.color}18`,
                        borderColor: `${edu.color}50`,
                        boxShadow: `0 0 16px ${edu.color}25`,
                      }}
                      aria-hidden="true"
                    >
                      {edu.icon}
                    </div>

                    {/* Card */}
                    <div
                      className="glass-card rounded-2xl p-5 border transition-all duration-300 group-hover:shadow-xl"
                      style={{
                        borderColor: `${edu.color}20`,
                        // subtle left accent glow on hover via box-shadow
                      }}
                    >
                      {/* Top row */}
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3
                            className="text-lg font-bold dark:text-white text-[#1a1830] leading-tight"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {edu.degree}
                          </h3>
                          <div
                            className="text-sm font-semibold italic mt-0.5"
                            style={{ color: edu.color }}
                          >
                            {edu.field}
                          </div>
                        </div>

                        {/* Period badge */}
                        <span
                          className="px-3 py-1 rounded-full text-xs font-mono font-bold flex-shrink-0"
                          style={{
                            background: `${edu.color}18`,
                            color: edu.color,
                            border: `1px solid ${edu.color}35`,
                          }}
                        >
                          {edu.period}
                        </span>
                      </div>

                      {/* Institution */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold"
                          style={{
                            background: `${edu.color}10`,
                            color: edu.color,
                            border: `1px solid ${edu.color}25`,
                          }}
                        >
                          🏛️ {edu.institution}
                        </span>
                      </div>

                      <p className="text-sm dark:text-white/55 text-[#3b3860] leading-relaxed font-medium">
                        {edu.desc}
                      </p>
                    </div>

                    {/* Connector dot on the timeline line */}
                    <div
                      className="absolute left-[21px] top-[26px] w-2.5 h-2.5 rounded-full ring-2 ring-[--bg] transition-all duration-300 group-hover:scale-125"
                      style={{ background: edu.color }}
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: image + certs ── */}
          <div className="reveal-right space-y-8">

            {/* University image */}
            <div className="relative h-52 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={swpu}
                alt="Southwest Petroleum University campus"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(8,8,16,0.72) 0%, rgba(8,8,16,0.1) 55%, transparent 100%)',
                }}
                aria-hidden="true"
              />
              {/* Top label */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#4f7fff]/70 backdrop-blur-sm">
                  🇨🇳 Chengdu, China
                </span>
              </div>
              <blockquote className="absolute bottom-5 left-5 right-5">
                <p className="text-base italic text-white/90 leading-snug" style={{ fontFamily: 'var(--font-italic)' }}>
                  &ldquo;Learning never exhausts the mind.&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '7+', label: 'Years Study', color: '#4f7fff' },
                { value: '4', label: 'Institutions', color: '#9b5de5' },
                { value: '4', label: 'Certifications', color: '#00d4ff' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="glass-card rounded-2xl p-4 text-center border"
                  style={{ borderColor: `${stat.color}25` }}
                >
                  <div
                    className="text-2xl font-black"
                    style={{ color: stat.color, fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-[--text-muted] font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <h3
                className="text-xl font-bold dark:text-white text-[#1a1830] mb-4 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span
                  className="inline-block w-1 h-5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                  aria-hidden="true"
                />
                Certifications
              </h3>
              <div className="space-y-3">
                {CERTS.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 glass-card rounded-xl p-4 border border-transparent transition-all duration-200 hover:border-[--border] hover:shadow-md group"
                  >
                    <div className="w-10 h-10 rounded-xl dark:bg-[#0f0f1a] bg-[#f0eeff] flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true">
                      {cert.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold dark:text-white text-[#1a1830] text-sm truncate">
                        {cert.name}
                      </div>
                      <div className="text-xs text-[--text-muted] mt-0.5">{cert.issuer}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[--accent] flex-shrink-0 px-2 py-1 rounded-lg dark:bg-[#0f0f1a] bg-[#f0eeff]">
                      {cert.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}