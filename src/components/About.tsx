'use client'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'

const MARQUEE_SKILLS = [
  'Python','Django','FastAPI','React','Next.js','TensorFlow','PyTorch','Docker','PostgreSQL',
  'Redis','LangChain','OpenAI','Hugging Face','TypeScript','Celery','Nginx',
]

export default function About() {
  const ref = useReveal()

  return (
    <section id="about" ref={ref as React.RefObject<HTMLDivElement>} className="py-28 relative overflow-hidden">
      <div className="absolute -left-40 top-1/2 w-96 h-96 rounded-full opacity-[0.04] bg-[#4f7fff] blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-4 mb-16 reveal">
          <span className="font-mono text-sm text-[--accent]">01.</span>
          <h2 className="text-4xl md:text-5xl font-black dark:text-white text-[#1a1830]" style={{ fontFamily: 'var(--font-display)' }}>
            Who I <em className="italic text-[--accent]">Am</em>
          </h2>
          <div className="flex-1 h-px bg-[--border]" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="reveal-left relative">
            <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=700&q=80&auto=format"
                alt="Mehedi Hasan at work — coding environment"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw,50vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/55 via-transparent to-transparent" aria-hidden="true" />
              <blockquote className="absolute bottom-6 left-6 right-6">
                <p className="text-2xl text-white/90 leading-snug italic" style={{ fontFamily: 'var(--font-italic)' }}>
                  &ldquo;Transforming ideas into intelligent systems.&rdquo;
                </p>
              </blockquote>
            </div>
            {/* Stat card */}
            <div className="absolute -top-5 -right-5 glass-card rounded-2xl p-5 shadow-2xl hidden sm:block">
              <div className="text-3xl font-black gradient-text" style={{ fontFamily: 'var(--font-display)' }}>3+</div>
              <div className="text-sm text-[--text-muted] font-medium">Years Experience</div>
              <div className="mt-2 flex -space-x-1.5" aria-hidden="true">
                {['🐍','🤖','⚛️'].map((e, i) => (
                  <div key={i} className="w-7 h-7 rounded-full glass-card flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
            </div>
            {/* Role badge */}
            <div className="absolute -bottom-5 -left-5 glass-card rounded-2xl px-5 py-3 shadow-2xl hidden sm:block">
              <div className="text-xs text-[--text-dim] font-mono uppercase tracking-wider">Current Role</div>
              <div className="font-bold dark:text-white text-[#1a1830] text-sm">Python Backend &amp; AI Dev</div>
              <div className="text-xs text-[--accent]">@ CodeMindsTech</div>
            </div>
          </div>

          {/* Copy */}
          <div className="reveal-right space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold dark:text-white text-[#1a1830] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Full-Stack Developer &amp;{' '}
              <em className="italic text-[--accent]">AI/ML Consultant</em>
            </h3>
            <p className="text-lg dark:text-white/75 text-[#1a1640] leading-relaxed font-medium">
              Based in <strong className="dark:text-white text-[#1a1830]">Savar, Dhaka, Bangladesh</strong>, I specialize in building
              intelligent web applications and training advanced models in Machine Learning, Deep Learning, and NLP.
            </p>
            <p className="text-lg dark:text-white/75 text-[#1a1640] leading-relaxed font-medium">
              With 3+ years of experience, I combine strong full-stack development with a passion for AI/ML,
              delivering high-quality data-driven solutions for international clients.
            </p>
            <blockquote className="text-xl italic dark:text-[#e8e6ff] text-[#1a1830] leading-relaxed" style={{ fontFamily: 'var(--font-italic)' }}>
              &ldquo;From concept to deployment — I manage the entire software development lifecycle with precision and efficiency.&rdquo;
            </blockquote>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {[
                { icon: '✉️', label: 'Email', value: 'mehediswpu@gmail.com', href: 'mailto:mehediswpu@gmail.com' },
                { icon: '📞', label: 'Phone', value: '+8801521-333362', href: 'tel:+8801521333362' },
                { icon: '📍', label: 'Location', value: 'Savar, Dhaka, BD', href: null },
                { icon: '🏢', label: 'Company', value: 'CEO, StyleBuzzBD', href: null },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl glass-card">
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
                  <div>
                    <div className="text-xs font-mono uppercase text-[--text-dim]">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm dark:text-[#e8e6ff] text-[#1a1830] hover:text-[--accent] transition-colors font-medium">{item.value}</a>
                    ) : (
                      <span className="text-sm dark:text-[#e8e6ff] text-[#1a1830] font-medium">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-20 reveal overflow-hidden">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-[--border]" />
            <span className="text-xs font-mono text-[--text-dim] uppercase tracking-widest whitespace-nowrap">Technologies I work with</span>
            <div className="flex-1 h-px bg-[--border]" />
          </div>
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[--bg] to-transparent z-10 pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[--bg] to-transparent z-10 pointer-events-none" aria-hidden="true" />
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
