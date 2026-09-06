'use client'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'
import SectionHeader from './SectionHeader'

const MARQUEE_SKILLS = [
  'Python','Django','FastAPI','React','Next.js','TensorFlow','PyTorch','Docker','PostgreSQL',
  'Redis','LangChain','OpenAI','Hugging Face','TypeScript','Celery','Nginx',
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
          <div className="reveal-left relative">
            <div
              className="relative h-[440px] overflow-hidden group"
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
              {/* Pulls the stock photo's saturated blue toward the palette so it
                  stops fighting the greens, without flattening it to a duotone. */}
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
            <div
              className="absolute -top-5 -right-4 glass-card px-5 py-4 hidden sm:block animate-float-b"
              style={{ boxShadow: 'var(--sh-3)' }}
            >
              <div
                className="text-3xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
              >
                5+
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[--text-dim] mt-0.5">
                Years Experience
              </div>
            </div>

            {/* Current role — top-left, not bottom-left: the bottom of the
                image belongs to the pull quote. */}
            <div
              className="absolute -top-5 -left-4 glass-card px-5 py-3.5 hidden sm:block"
              style={{ boxShadow: 'var(--sh-3)' }}
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[--text-dim]">
                Current Role
              </div>
              <div className="font-semibold text-sm mt-0.5" style={{ color: 'var(--text)' }}>
                Senior LLM Engineer
              </div>
              <a
                href="https://www.facebook.com/MYai-Robotics-1058509204012017/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono transition-colors duration-200 hover:underline underline-offset-2"
                style={{ color: 'var(--accent)' }}
              >
                @ MYai Robotics
              </a>
            </div>
          </div>

          {/* ── Copy ── */}
          <div className="reveal-right space-y-6">
            <h3
              className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-[1.15]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Full-Stack Developer &amp;{' '}
              <span style={{ color: 'var(--accent)' }}>AI/ML Consultant</span>
            </h3>

            <p className="text-[15.5px] leading-relaxed text-[--text-muted]">
              Based in{' '}
              <strong className="font-semibold" style={{ color: 'var(--text)' }}>
                Savar, Dhaka, Bangladesh
              </strong>
              , I specialize in building intelligent web applications and training advanced
              models in Machine Learning, Deep Learning, and NLP.
            </p>

            <p className="text-[15.5px] leading-relaxed text-[--text-muted]">
              With 5+ years of experience, I combine strong full-stack development with a
              passion for AI/ML, delivering high-quality data-driven solutions for
              international clients. Currently engineering advanced LLM-powered agents at{' '}
              <a
                href="https://www.facebook.com/MYai-Robotics-1058509204012017/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline underline-offset-2 transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                MYai Robotics
              </a>
              .
            </p>

            <blockquote
              className="pl-5 py-1 text-[16px] leading-relaxed italic"
              style={{ borderLeft: '2px solid var(--accent)', color: 'var(--text)' }}
            >
              &ldquo;From concept to deployment — I manage the entire software development
              lifecycle with precision and efficiency.&rdquo;
            </blockquote>

            <dl className="grid sm:grid-cols-2 gap-3 pt-2">
              {FACTS.map(item => (
                <div
                  key={item.label}
                  className="glass-card glass-card-hover spotlight px-4 py-3"
                >
                  <dt className="text-[10px] font-mono uppercase tracking-[0.14em] text-[--text-dim]">
                    {item.label}
                  </dt>
                  <dd className="text-[13.5px] font-medium mt-0.5" style={{ color: 'var(--text)' }}>
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

        {/* ── Marquee ── */}
        <div className="mt-20 reveal">
          <div className="flex items-center gap-4 mb-5">
            <span className="flex-1 h-px" style={{ background: 'var(--border)' }} aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[--text-dim] whitespace-nowrap">
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
        </div>
      </div>
    </section>
  )
}
