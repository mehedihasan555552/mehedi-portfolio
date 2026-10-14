'use client'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import SectionHeader from './SectionHeader'
import AgenticHolodeck3D from './AgenticHolodeck3D'

const MARQUEE_ROW_1 = [
  'Python 3.12','LangGraph','Multi-Agent Systems','Hybrid RAG','FastAPI','LiteLLM','Ragas Evals','NeMo Guardrails',
  'Qdrant','Docker','PostgreSQL','Redis Streams','OpenAI','Anthropic Claude','Celery','TypeScript',
]

const MARQUEE_ROW_2 = [
  'BM25 + Dense RRF','Cohere Rerank','Pydantic V2','Langfuse Tracing','OpenTelemetry','vLLM','Django DRF','Next.js 16',
  'Pinecone','PyTorch','Hugging Face','SSE Streaming','WebSockets','AWS Bedrock','GitHub Actions CI','Nginx',
]

export default function About() {
  const ref = useReveal()
  const { db } = usePortfolioData()
  const { profile } = db

  const facts = [
    { label: 'Email',    value: profile.email,          href: `mailto:${profile.email}` },
    { label: 'Phone',    value: profile.phoneSecondary, href: `tel:${profile.phoneSecondary.replace(/[^+\d]/g, '')}` },
    { label: 'Location', value: profile.location,       href: null },
    { label: 'Company',  value: profile.companyBadge,   href: null },
  ]

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div className="container-x">
        <SectionHeader index="01 —" title="Who I" emphasis="Am" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Portrait panel */}
          <div className="relative reveal-left">
            <div
              className="relative h-[440px] overflow-hidden group about-photo-frame tilt-3d"
              style={{
                borderRadius: 'var(--r-xl)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--sh-3)',
              }}
            >
              <Image
                src={profile.aboutImage || 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=85&auto=format'}
                alt={`${profile.name} — AI and LLM engineering`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgb(2 6 4 / 0.88) 0%, rgb(2 6 4 / 0.25) 46%, transparent 78%)' }}
                aria-hidden="true"
              />
              <blockquote className="absolute bottom-7 left-7 right-7">
                <p className="text-xl md:text-2xl leading-snug font-medium text-white/95">
                  &ldquo;{profile.aboutImageQuote}&rdquo;
                </p>
              </blockquote>
            </div>

            <div
              className="absolute -top-5 -right-4 glass-card tilt-3d px-5 py-4 hidden sm:block cursor-default"
              style={{ boxShadow: 'var(--sh-3)' }}
            >
              <div
                className="text-3xl sm:text-4xl font-extrabold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
              >
                {profile.yearsExperience}
              </div>
              <div className="text-[11.5px] sm:text-xs font-mono uppercase tracking-[0.14em] text-[--text-dim] mt-0.5 font-bold">
                Years Experience
              </div>
            </div>

            <div
              className="absolute -top-5 -left-4 glass-card tilt-3d px-5 py-3.5 hidden sm:block cursor-default"
              style={{ boxShadow: 'var(--sh-3)' }}
            >
              <div className="text-[11.5px] font-mono uppercase tracking-[0.16em] text-[--text-dim] font-bold">
                Current Role
              </div>
              <div className="font-extrabold text-[15.5px] mt-0.5" style={{ color: 'var(--text)' }}>
                {profile.currentRole}
              </div>
              <a
                href={profile.currentCompanyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13.5px] font-mono font-bold transition-colors duration-200 hover:underline underline-offset-2"
                style={{ color: 'var(--accent)' }}
              >
                @ {profile.currentCompany}
              </a>
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-6 reveal-right">
            <h3
              className="text-[clamp(1.85rem,3.4vw,2.5rem)] font-extrabold leading-[1.15]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {profile.aboutTitle}{' '}
              <span style={{ color: 'var(--accent)' }}>{profile.aboutHighlight}</span>
            </h3>

            <p className="text-[17px] sm:text-[18px] font-medium leading-relaxed text-[--text-muted]">
              {profile.aboutBio1}
            </p>

            <p className="text-[17px] sm:text-[18px] font-medium leading-relaxed text-[--text-muted]">
              {profile.aboutBio2}
            </p>

            <blockquote
              className="pl-5 py-2 text-[17.5px] sm:text-[18.5px] font-semibold leading-relaxed italic"
              style={{ borderLeft: '3px solid var(--accent)', color: 'var(--text)' }}
            >
              &ldquo;{profile.aboutQuote}&rdquo;
            </blockquote>

            <dl className="grid sm:grid-cols-2 gap-3.5 pt-2">
              {facts.map(item => (
                <div
                  key={item.label}
                  className="glass-card glass-card-hover spotlight tilt-3d px-4 py-3.5"
                >
                  <dt className="text-[12px] font-mono uppercase tracking-[0.16em] text-[--text-dim] font-bold">
                    {item.label}
                  </dt>
                  <dd className="text-[15px] sm:text-[16px] font-bold mt-0.5" style={{ color: 'var(--text)' }}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="transition-colors duration-200 hover:text-[--accent]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Interactive 3D Multi-Agent & RAG Holodeck */}
        <AgenticHolodeck3D />

        {/* Dual-Direction Infinite Skill Marquees */}
        <div className="mt-16 space-y-3 reveal">
          <div className="flex items-center gap-4 mb-5">
            <span className="flex-1 h-px" style={{ background: 'var(--border)' }} aria-hidden="true" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-[--text-dim] whitespace-nowrap">
              Production AI &amp; Backend Ecosystem
            </span>
            <span className="flex-1 h-px" style={{ background: 'var(--border)' }} aria-hidden="true" />
          </div>
          <div className="marquee-viewport">
            <div className="marquee-track" aria-hidden="true">
              {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((t, i) => (
                <span key={i} className="skill-pill flex-shrink-0">{t}</span>
              ))}
            </div>
          </div>
          <div className="marquee-viewport">
            <div className="marquee-track-rev" aria-hidden="true">
              {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((t, i) => (
                <span key={i} className="skill-pill flex-shrink-0">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
