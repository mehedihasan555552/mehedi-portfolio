'use client'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import SectionHeader from './SectionHeader'
import swpu from '../../images/swpu.png'

export default function Education() {
  const ref = useReveal()
  const { db } = usePortfolioData()
  const { education, certifications, educationStats } = db

  return (
    <section
      id="education"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div className="container-x">
        <SectionHeader
          index="06 —"
          title="Education"
          emphasis="Journey"
          standfirst="Building knowledge through continuous learning and academic excellence."
        />

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="reveal-left">
            <div className="relative">
              <span
                className="absolute left-[7px] top-4 bottom-4 w-px"
                style={{
                  background: 'linear-gradient(to bottom, var(--c-1), var(--c-2), var(--c-3), var(--c-5))',
                  opacity: 0.35,
                }}
                aria-hidden="true"
              />

              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i} className="relative pl-9 group">
                    <span
                      className="absolute left-0 top-6 w-[15px] h-[15px] rounded-full"
                      style={{
                        background: 'var(--bg)',
                        border: `2px solid ${edu.tone || 'var(--c-1)'}`,
                      }}
                      aria-hidden="true"
                    />

                    <div className="glass-card glass-card-hover spotlight p-5 sm:p-6 tilt-3d">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h3
                            className="text-[18px] sm:text-[19.5px] font-extrabold leading-snug tracking-[-0.015em]"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {edu.degree}
                          </h3>
                          <div className="text-[14.5px] sm:text-[15px] font-semibold mt-0.5" style={{ color: edu.tone || 'var(--accent)' }}>
                            {edu.field}
                          </div>
                        </div>
                        <span
                          className="px-3 py-1 text-[12px] font-mono font-bold flex-shrink-0"
                          style={{
                            borderRadius: 'var(--r-sm)',
                            background: 'var(--accent-soft)',
                            border: '1px solid var(--accent-line)',
                            color: 'var(--accent)',
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal-right space-y-6">
            <div
              className="relative h-56 overflow-hidden group tilt-3d"
              style={{
                borderRadius: 'var(--r-xl)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--sh-3)',
              }}
            >
              <Image
                src={swpu}
                alt="Southwest Petroleum University campus"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <span
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgb(3 8 6 / 0.86), rgb(3 8 6 / 0.14) 58%, transparent)' }}
                aria-hidden="true"
              />
              <span
                className="absolute top-4 left-4 px-3 py-1 text-[12px] font-mono"
                style={{
                  borderRadius: 'var(--r-sm)',
                  background: 'rgb(2 8 5 / 0.72)',
                  border: '1px solid rgb(var(--accent-rgb) / 0.5)',
                  color: '#3ddc84',
                }}
              >
                Chengdu, China
              </span>
              <blockquote className="absolute bottom-5 left-5 right-5">
                <p className="text-[16px] sm:text-[17px] italic text-white/92 leading-snug">
                  &ldquo;Learning never exhausts the mind.&rdquo;
                </p>
              </blockquote>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {educationStats.map(stat => (
                <div
                  key={stat.label}
                  className="glass-card glass-card-hover spotlight p-4 text-center tilt-3d cursor-default"
                >
                  <div
                    className="text-[26px] sm:text-[28px] font-bold"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[11.5px] sm:text-[12px] font-mono uppercase tracking-[0.1em] text-[--text-dim] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="flex items-center gap-2.5 text-[14px] sm:text-[14.5px] font-mono font-semibold uppercase tracking-[0.16em] mb-4 text-[--text-muted]">
                <span className="w-1 h-4 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                Certifications
              </h3>
              <div className="space-y-2.5">
                {certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3.5 glass-card glass-card-hover spotlight px-4 py-3 group tilt-3d cursor-default"
                  >
                    <span
                      className="w-9 h-9 rounded-md grid place-items-center flex-shrink-0 font-mono text-[12px] font-semibold"
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
