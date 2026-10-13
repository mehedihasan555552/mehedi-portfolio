'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'
import SectionHeader from './SectionHeader'

const MARQUEE_SKILLS = [
  'Python','LangGraph','Multi-Agent Systems','Hybrid RAG','FastAPI','LiteLLM','Ragas Evals','Guardrails',
  'Qdrant','Docker','PostgreSQL','Redis','OpenAI','Anthropic Claude','Celery','TypeScript',
]

const FACTS = [
  { label: 'Email',    value: 'mehediswpu@gmail.com', href: 'mailto:mehediswpu@gmail.com' },
  { label: 'Phone',    value: '+8801521-333362',      href: 'tel:+8801521333362' },
  { label: 'Location', value: 'Savar, Dhaka, BD',     href: null },
  { label: 'Company',  value: 'CEO, StyleBuzzBD',     href: null },
]

export default function About() {
  const ref = useReveal()

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div
        data-parallax
        className="absolute -left-40 top-1/3 w-[420px] aspect-square rounded-full opacity-[0.05] blur-[90px] pointer-events-none"
        style={{ ['--par' as string]: '60px', background: 'var(--accent)' }}
        aria-hidden="true"
      />

      <div className="container-x">
        <SectionHeader index="01 —" title="Who I" emphasis="Am" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Portrait panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              className="relative h-[440px] overflow-hidden group about-photo-frame"
              style={{
                borderRadius: 'var(--r-xl)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--sh-3)',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=85&auto=format"
                alt="Mehedi Hasan — AI and LLM engineering environment"
                fill
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
                loading="lazy"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'var(--accent)', mixBlendMode: 'color', opacity: 0.34 }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgb(2 6 4 / 0.88) 0%, rgb(2 6 4 / 0.25) 46%, transparent 78%)' }}
                aria-hidden="true"
              />
              <blockquote className="absolute bottom-7 left-7 right-7">
                <p className="text-xl md:text-2xl leading-snug font-medium text-white/95">
                  &ldquo;Transforming ideas into intelligent systems.&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 14 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 350, damping: 25 }}
              whileHover={{ scale: 1.06, y: -4 }}
              className="absolute -top-5 -right-4 glass-card tilt-3d px-5 py-4 hidden sm:block cursor-default"
              style={{ boxShadow: 'var(--sh-3)' }}
            >
              <div className="tilt-glare" />
              <div
                className="text-3xl sm:text-4xl font-extrabold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
              >
                5+
              </div>
              <div className="text-[11.5px] sm:text-xs font-mono uppercase tracking-[0.14em] text-[--text-dim] mt-0.5 font-bold">
                Years Experience
              </div>
            </motion.div>

            {/* Current role */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 14 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 350, damping: 25 }}
              whileHover={{ scale: 1.06, y: -4 }}
              className="absolute -top-5 -left-4 glass-card tilt-3d px-5 py-3.5 hidden sm:block cursor-default"
              style={{ boxShadow: 'var(--sh-3)' }}
            >
              <div className="tilt-glare" />
              <div className="text-[11.5px] font-mono uppercase tracking-[0.16em] text-[--text-dim] font-bold">
                Current Role
              </div>
              <div className="font-extrabold text-[15.5px] mt-0.5" style={{ color: 'var(--text)' }}>
                Senior LLM Engineer
              </div>
              <a
                href="https://www.facebook.com/MYai-Robotics-1058509204012017/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13.5px] font-mono font-bold transition-colors duration-200 hover:underline underline-offset-2"
                style={{ color: 'var(--accent)' }}
              >
                @ MYai Robotics
              </a>
            </motion.div>
          </motion.div>

          {/* ── Copy ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h3
              className="text-[clamp(1.85rem,3.4vw,2.5rem)] font-extrabold leading-[1.15]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Senior AI/LLM Engineer &amp;{' '}
              <span style={{ color: 'var(--accent)' }}>Systems Architect</span>
            </h3>

            <p className="text-[17px] sm:text-[18px] font-medium leading-relaxed text-[--text-muted]">
              Based in{' '}
              <strong className="font-bold" style={{ color: 'var(--text)' }}>
                Dhaka, Bangladesh
              </strong>
              , I specialize in building production AI systems and scalable Python backends with over 5+ years of hands-on engineering experience.
            </p>

            <p className="text-[17px] sm:text-[18px] font-medium leading-relaxed text-[--text-muted]">
              Specialised in <strong className="font-bold" style={{ color: 'var(--text)' }}>LLM-powered multi-agent systems</strong>, RAG pipelines, agent orchestration, and AI evaluation frameworks. Experienced in designing tool-enabled agents, hybrid retrieval systems, provider-agnostic LLM architectures, guardrails, observability, regression testing, and production deployment. Currently engineering human-AI teammate systems at{' '}
              <a
                href="https://www.facebook.com/MYai-Robotics-1058509204012017/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline underline-offset-2 transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                MYai Robotics
              </a>
              .
            </p>

            <blockquote
              className="pl-5 py-2 text-[17.5px] sm:text-[18.5px] font-semibold leading-relaxed italic"
              style={{ borderLeft: '3px solid var(--accent)', color: 'var(--text)' }}
            >
              &ldquo;Engineering resilient, non-deterministic AI pipelines into deterministic, high-throughput production realities.&rdquo;
            </blockquote>

            <dl className="grid sm:grid-cols-2 gap-3.5 pt-2">
              {FACTS.map(item => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="glass-card glass-card-hover spotlight tilt-3d px-4 py-3.5"
                >
                  <div className="tilt-glare" />
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
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>

        {/* ── Marquee ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="mt-20"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="flex-1 h-px" style={{ background: 'var(--border)' }} aria-hidden="true" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-[--text-dim] whitespace-nowrap">
              Technologies I work with
            </span>
            <span className="flex-1 h-px" style={{ background: 'var(--border)' }} aria-hidden="true" />
          </div>
          <div className="marquee-viewport">
            <div className="marquee-track" aria-hidden="true">
              {[...MARQUEE_SKILLS, ...MARQUEE_SKILLS].map((t, i) => (
                <span key={i} className="skill-pill flex-shrink-0">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
