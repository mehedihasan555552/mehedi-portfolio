'use client'
import { useState, useCallback } from 'react'
import { useReveal } from '@/hooks/useReveal'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const CONTACT_ITEMS = [
  { icon: '✉️', label: 'Email',           value: 'mehediswpu@gmail.com',                      href: 'mailto:mehediswpu@gmail.com',          color: '#4f7fff' },
  { icon: '📞', label: 'Phone (Primary)', value: '+8801339-388329',                            href: 'tel:+8801339388329',                    color: '#9b5de5' },
  { icon: '📱', label: 'Phone (Alt)',     value: '+8801521-333362',                            href: 'tel:+8801521333362',                    color: '#00d4ff' },
  { icon: '📍', label: 'Address',         value: '99/1, Noyabari, Radio Colony, BPATC, Savar, Dhaka', href: null,                            color: '#f4a261' },
  { icon: '🌐', label: 'Website',         value: 'mehediswpu.vercel.app',                     href: 'https://mehediswpu.vercel.app',         color: '#f72585' },
]

const SOCIALS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/mehedihasan555552/',  color: '#0a66c2', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  )},
  { name: 'GitHub',   href: 'https://github.com/mehedihasan555552',            color: '#e8e6ff', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
  )},
  { name: 'Twitter',  href: 'https://x.com/ridoy123439',                       color: '#1d9bf0', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )},
  { name: 'Facebook', href: 'https://www.facebook.com/mehedihasan555552/',     color: '#1877f2', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )},
]

const inputCls = [
  'w-full px-4 py-3.5 rounded-xl text-base font-medium',
  'dark:bg-[#0a0a14] bg-[#f5f4ff]',
  'border border-[--border]',
  'dark:text-white text-[#1a1830]',
  'placeholder-[--text-dim]',
  'focus:outline-none focus:ring-2 focus:ring-[#4f7fff]/40 focus:border-[#4f7fff]',
  'transition-all duration-200',
].join(' ')

export default function Contact() {
  const [form,   setForm]   = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [focused, setFocused] = useState<string | null>(null)
  const ref = useReveal()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1400))
    setStatus('sent')
    setTimeout(() => setStatus('idle'), 4000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-28 relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.03] bg-[#4f7fff] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-[0.04] bg-[#9b5de5] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-[0.03] bg-[#00d4ff] blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-6 reveal">
          <span className="font-mono text-sm text-[--accent]">06.</span>
          <h2
            className="text-4xl md:text-5xl font-black dark:text-white text-[#1a1830]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Get In <em className="italic text-[--accent]">Touch</em>
          </h2>
          <div className="flex-1 h-px bg-[--border]" />
        </div>

        <p
          className="text-lg italic dark:text-white/55 text-[#3b3860] font-semibold mb-14 max-w-2xl reveal"
          style={{ fontFamily: 'var(--font-italic)' }}
        >
          Have a project or want to collaborate? Let&apos;s build something extraordinary together.
        </p>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Left: Contact info ── */}
          <div className="space-y-3 reveal-left">

            {CONTACT_ITEMS.map((item, i) => (
              <a
                key={item.label}
                href={item.href ?? undefined}
                target={item.href?.startsWith('http') ? '_blank' : undefined}
                rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 glass-card rounded-2xl p-4 border border-transparent transition-all duration-300 hover:shadow-lg"
                style={
                  { '--hover-color': item.color } as React.CSSProperties
                }
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = `${item.color}35`
                  el.style.boxShadow   = `0 0 24px ${item.color}12`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'transparent'
                  el.style.boxShadow   = ''
                }}
                aria-label={item.href ? `${item.label}: ${item.value}` : undefined}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                  aria-hidden="true"
                >
                  {item.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-mono uppercase tracking-wider font-bold mb-0.5"
                    style={{ color: `${item.color}90` }}
                  >
                    {item.label}
                  </div>
                  <span
                    className="text-sm dark:text-white text-[#0e0c1f] font-semibold break-all transition-colors duration-200 group-hover:text-[--accent]"
                    style={{ display: 'block' }}
                  >
                    {item.value}
                  </span>
                </div>

                {/* Arrow indicator for links */}
                {item.href && (
                  <svg
                    className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-60 translate-x-0 group-hover:translate-x-1 transition-all duration-200"
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </a>
            ))}

            {/* Social profiles */}
            <div className="pt-4">
              <h3 className="text-xs font-mono uppercase text-[--text-dim] tracking-widest mb-4 flex items-center gap-3">
                <span className="flex-1 h-px bg-[--border]" aria-hidden="true" />
                Social Profiles
                <span className="flex-1 h-px bg-[--border]" aria-hidden="true" />
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-4 py-3 glass-card rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-0.5"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${s.color}40`
                      e.currentTarget.style.boxShadow   = `0 4px 20px ${s.color}18`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'transparent'
                      e.currentTarget.style.boxShadow   = ''
                    }}
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{ background: `${s.color}18`, color: s.color }}
                    >
                      {s.icon}
                    </span>
                    <span className="text-sm font-semibold dark:text-white/70 text-[#1a1640] group-hover:dark:text-white group-hover:text-[#0e0c1f] transition-colors">
                      {s.name}
                    </span>
                    <svg
                      className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity"
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="glass-card rounded-3xl p-8 reveal-right border border-[--border] relative overflow-hidden">

            {/* Subtle corner glow */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.06] blur-2xl pointer-events-none"
              style={{ background: '#4f7fff' }}
              aria-hidden="true"
            />

            <h3
              className="text-2xl font-bold dark:text-white text-[#1a1830] mb-2 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="inline-block w-1 h-6 rounded-full bg-[--accent]" aria-hidden="true" />
              Send a Message
            </h3>
            <p className="text-sm text-[--text-dim] font-medium mb-7">
              I typically reply within 24 hours ✦
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[--text-dim]"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                      style={{ background: focused === 'name' ? '#4f7fff' : 'var(--text-dim)' }}
                      aria-hidden="true"
                    />
                    Name
                  </label>
                  <input
                    id="contact-name" name="name" type="text" required
                    value={form.name} onChange={handleChange}
                    placeholder="John Doe"
                    className={inputCls}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[--text-dim]"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                      style={{ background: focused === 'email' ? '#4f7fff' : 'var(--text-dim)' }}
                      aria-hidden="true"
                    />
                    Email
                  </label>
                  <input
                    id="contact-email" name="email" type="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputCls}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-subject"
                  className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[--text-dim]"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                    style={{ background: focused === 'subject' ? '#4f7fff' : 'var(--text-dim)' }}
                    aria-hidden="true"
                  />
                  Subject
                </label>
                <input
                  id="contact-subject" name="subject" type="text"
                  value={form.subject} onChange={handleChange}
                  placeholder="Project Inquiry / Collaboration"
                  className={inputCls}
                  onFocus={() => setFocused('subject')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[--text-dim]"
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                      style={{ background: focused === 'message' ? '#4f7fff' : 'var(--text-dim)' }}
                      aria-hidden="true"
                    />
                    Message
                  </span>
                  <span className="font-mono normal-case tracking-normal" style={{ color: form.message.length > 0 ? '#4f7fff' : undefined }}>
                    {form.message.length} chars
                  </span>
                </label>
                <textarea
                  id="contact-message" name="message" required rows={5}
                  value={form.message} onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className={`${inputCls} resize-none`}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status !== 'idle'}
                aria-busy={status === 'sending'}
                className="w-full py-4 rounded-xl font-bold text-base relative overflow-hidden transition-all duration-300 disabled:cursor-not-allowed"
                style={
                  status === 'sent'    ? { background: '#22c55e',             color: '#fff', boxShadow: '0 0 24px #22c55e40' } :
                  status === 'error'   ? { background: '#ef4444',             color: '#fff' } :
                  status === 'sending' ? { background: 'rgba(79,127,255,0.5)', color: '#fff' } :
                  { background: 'linear-gradient(135deg, #4f7fff, #9b5de5)', color: '#fff', boxShadow: '0 4px 24px rgba(79,127,255,0.25)' }
                }
                onMouseEnter={e => {
                  if (status === 'idle') {
                    e.currentTarget.style.transform  = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow  = '0 8px 32px rgba(79,127,255,0.40)'
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = status === 'idle' ? '0 4px 24px rgba(79,127,255,0.25)' : ''
                }}
              >
                {/* Shimmer on idle */}
                {status === 'idle' && (
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"
                    aria-hidden="true"
                  />
                )}

                <span className="relative flex items-center justify-center gap-2">
                  {status === 'sending' && (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  )}
                  {status === 'sending' ? 'Sending…'       :
                   status === 'sent'    ? '✅ Message Sent!' :
                   status === 'error'   ? '❌ Try Again'    :
                   <>Send Message <span aria-hidden="true">→</span></>}
                </span>
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  )
}