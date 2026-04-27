'use client'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'

const EDUCATION = [
  { period:'2021–2024', degree:"Master's Degree", field:'Computer Science & Engineering', institution:'Southwest Petroleum University', desc:'Focused on ML, Deep Learning, and Advanced Algorithms. Thesis on NLP applications.', color:'#4f7fff' },
  { period:'2017–2021', degree:"Bachelor's Degree", field:'Computer Science & Engineering', institution:'Southwest Petroleum University', desc:'Study of CS fundamentals, software engineering, data structures, algorithms, and web development.', color:'#9b5de5' },
  { period:'2013–2015', degree:'Higher Secondary (HSC)', field:'Science', institution:'Jahangirnagar University School & College', desc:'Higher secondary with focus on Science, Mathematics, and Physics.', color:'#00d4ff' },
]

const CERTS = [
  { name:'Machine Learning Specialization', issuer:'Coursera / Stanford', year:'2023', icon:'🤖' },
  { name:'Deep Learning Specialization', issuer:'deeplearning.ai', year:'2023', icon:'🧠' },
  { name:'Python for Data Science', issuer:'IBM / Coursera', year:'2022', icon:'🐍' },
  { name:'AWS Cloud Fundamentals', issuer:'Amazon Web Services', year:'2022', icon:'☁️' },
]

export default function Education() {
  const ref = useReveal()

  return (
    <section id="education" ref={ref as React.RefObject<HTMLDivElement>} className="py-28 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.04] bg-[#9b5de5] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-4 mb-6 reveal">
          <span className="font-mono text-sm text-[--accent]">05.</span>
          <h2 className="text-4xl md:text-5xl font-black dark:text-white text-[#1a1830]" style={{ fontFamily: 'var(--font-display)' }}>
            Education <em className="italic text-[--accent]">Journey</em>
          </h2>
          <div className="flex-1 h-px bg-[--border]" />
        </div>
        <p className="text-lg italic dark:text-white/55 text-[#3b3860] font-semibold mb-14 reveal" style={{ fontFamily: 'var(--font-italic)' }}>
          Building knowledge through continuous learning and academic excellence
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Timeline */}
          <div className="reveal-left">
            <div className="relative">
              <div className="absolute left-6 top-6 bottom-6 w-px bg-[--border]" aria-hidden="true" />
              <div className="space-y-6">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="relative pl-20">
                    <div
                      className="absolute left-0 top-5 w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shadow-lg"
                      style={{ background: `${edu.color}15`, borderColor: `${edu.color}40` }}
                      aria-hidden="true"
                    >
                      🎓
                    </div>
                    <div className="glass-card rounded-2xl p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-bold dark:text-white text-[#1a1830]" style={{ fontFamily: 'var(--font-display)' }}>{edu.degree}</h3>
                          <div className="text-sm text-[--accent] font-semibold italic">{edu.field}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono" style={{ background: `${edu.color}15`, color: edu.color }}>
                          {edu.period}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-[--text-muted] mb-2">🏛️ {edu.institution}</div>
                      <p className="text-sm dark:text-white/55 text-[#3b3860] leading-relaxed font-medium">{edu.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certs */}
          <div className="reveal-right space-y-8">
            <div className="relative h-52 rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=75&auto=format"
                alt="University campus"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width:1024px) 100vw,50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/65 via-transparent to-transparent dark:block hidden" aria-hidden="true" />
              <blockquote className="absolute bottom-5 left-5">
                <p className="text-lg italic text-white" style={{ fontFamily: 'var(--font-italic)' }}>
                  &ldquo;Learning never exhausts the mind.&rdquo;
                </p>
              </blockquote>
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white text-[#1a1830] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Certifications</h3>
              <div className="space-y-3">
                {CERTS.map((cert, i) => (
                  <div key={i} className="flex items-center gap-4 glass-card rounded-xl p-4">
                    <div className="w-10 h-10 rounded-xl dark:bg-[#0f0f1a] bg-[#f0eeff] flex items-center justify-center text-xl flex-shrink-0" aria-hidden="true">{cert.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold dark:text-white text-[#1a1830] text-sm truncate">{cert.name}</div>
                      <div className="text-xs text-[--text-muted]">{cert.issuer}</div>
                    </div>
                    <span className="text-xs font-mono text-[--accent] flex-shrink-0">{cert.year}</span>
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
