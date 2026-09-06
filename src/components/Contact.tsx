'use client'
import { useState, useCallback } from 'react'
import { useReveal } from '@/hooks/useReveal'
import SectionHeader from './SectionHeader'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const CONTACT_ITEMS = [
  { label: 'Email',           value: 'mehediswpu@gmail.com',                              href: 'mailto:mehediswpu@gmail.com' },
  { label: 'Phone (Primary)', value: '+8801339-388329',                                   href: 'tel:+8801339388329' },
  { label: 'Phone (Alt)',     value: '+8801521-333362',                                   href: 'tel:+8801521333362' },
  { label: 'Address',         value: '99/1, Noyabari, Radio Colony, BPATC, Savar, Dhaka', href: null },
  { label: 'Website',         value: 'mehediswpu.vercel.app',                             href: 'https://mehediswpu.vercel.app' },
]

const SOCIALS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/mehedihasan555552/', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  )},
  { name: 'GitHub', href: 'https://github.com/mehedihasan555552', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
  )},
  { name: 'Twitter', href: 'https://x.com/ridoy123439', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )},
  { name: 'Facebook', href: 'https://www.facebook.com/mehedihasan555552/', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )},
]

/* Field wrapper — the label dot and border both respond to focus */
function Field({
  id, name, label, type = 'text', required, rows, value, placeholder, focused, onChange, onFocus, onBlur, trailing,
}: {
  id: string; name: string; label: string; type?: string; required?: boolean; rows?: number
  value: string; placeholder: string; focused: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onFocus: () => void; onBlur: () => void
  trailing?: React.ReactNode
}) {
  const shared = {
    id, name, value, placeholder, required,
    onChange, onFocus, onBlur,
    className: 'w-full px-3.5 py-3 text-[14px] bg-transparent outline-none placeholder:text-[--text-dim] resize-none',
    style: { color: 'var(--text)' },
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[--text-dim]"
      >
        <span className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: focused ? 'var(--accent)' : 'var(--text-dim)',
              boxShadow: focused ? '0 0 8px var(--glow)' : 'none',
            }}
            aria-hidden="true"
          />
          {label}
        </span>
        {trailing}
      </label>
      <div
        className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          borderRadius: 'var(--r-md)',
          background: 'var(--bg-2)',
          border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
          boxShadow: focused ? '0 0 0 3px rgb(var(--accent-rgb) / 0.12)' : 'none',
        }}
      >
        {rows ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
      </div>
    </div>
  )
}

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus]   = useState<Status>('idle')
  const [focused, setFocused] = useState<string | null>(null)
  const ref = useReveal()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    },
    []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1400))
    setStatus('sent')
    setTimeout(() => setStatus('idle'), 4000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const btnStyle =
    status === 'sent'
      ? { background: 'var(--accent)', color: 'var(--on-accent)' }
      : status === 'error'
      ? { background: '#ef4444', color: '#fff' }
      : status === 'sending'
      ? { background: 'var(--accent-deep)', color: 'var(--on-accent)', opacity: 0.75 }
      : undefined

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] aspect-square rounded-full opacity-[0.04] blur-[120px] pointer-events-none"
        style={{ background: 'var(--accent)' }}
        aria-hidden="true"
      />

      <div className="container-x">
        <SectionHeader
          index="06 —"
          title="Get In"
          emphasis="Touch"
          standfirst="Have a project or want to collaborate? Let's build something extraordinary together."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">

          {/* ── Details ── */}
          <div className="space-y-2.5 reveal-left">
            {CONTACT_ITEMS.map(item => {
              const Tag = item.href ? 'a' : 'div'
              return (
                <Tag
                  key={item.label}
                  {...(item.href
                    ? {
                        href: item.href,
                        target: item.href.startsWith('http') ? '_blank' : undefined,
                        rel: item.href.startsWith('http') ? 'noopener noreferrer' : undefined,
                        'aria-label': `${item.label}: ${item.value}`,
                      }
                    : {})}
                  className="group flex items-center gap-4 glass-card glass-card-hover spotlight px-4 py-3.5"
                >
                  <span
                    className="w-1 self-stretch rounded-full flex-shrink-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ background: 'var(--border-hi)' }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[--text-dim] mb-0.5">
                      {item.label}
                    </span>
                    <span
                      className="block text-[13.5px] font-medium break-words transition-colors duration-200 group-hover:text-[--accent]"
                      style={{ color: 'var(--text)' }}
                    >
                      {item.value}
                    </span>
                  </span>
                  {item.href && (
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-[--text-dim] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Tag>
              )
            })}

            {/* Socials */}
            <div className="pt-5">
              <h3 className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[--text-dim] mb-4">
                <span className="flex-1 h-px" style={{ background: 'var(--border)' }} aria-hidden="true" />
                Social Profiles
                <span className="flex-1 h-px" style={{ background: 'var(--border)' }} aria-hidden="true" />
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {SOCIALS.map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 glass-card glass-card-hover spotlight px-4 py-3"
                  >
                    <span
                      className="w-7 h-7 rounded-md grid place-items-center flex-shrink-0 transition-all duration-300 text-[--text-muted] group-hover:text-[--accent]"
                      style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
                    >
                      {s.icon}
                    </span>
                    <span
                      className="text-[13px] font-medium transition-colors duration-200"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {s.name}
                    </span>
                    <svg
                      className="w-3 h-3 ml-auto text-[--text-dim] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="glass-card spotlight p-6 sm:p-8 reveal-right relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
              style={{ background: 'var(--accent)' }}
              aria-hidden="true"
            />

            <h3
              className="flex items-center gap-2.5 text-xl font-bold mb-1.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              Send a Message
            </h3>
            <p className="text-[13px] text-[--text-dim] mb-7 pl-3.5">
              I typically reply within 24 hours.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  id="contact-name" name="name" label="Name" required
                  value={form.name} placeholder="John Doe"
                  focused={focused === 'name'} onChange={handleChange}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                />
                <Field
                  id="contact-email" name="email" label="Email" type="email" required
                  value={form.email} placeholder="john@example.com"
                  focused={focused === 'email'} onChange={handleChange}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                />
              </div>

              <Field
                id="contact-subject" name="subject" label="Subject"
                value={form.subject} placeholder="Project Inquiry / Collaboration"
                focused={focused === 'subject'} onChange={handleChange}
                onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
              />

              <Field
                id="contact-message" name="message" label="Message" required rows={5}
                value={form.message} placeholder="Tell me about your project..."
                focused={focused === 'message'} onChange={handleChange}
                onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                trailing={
                  <span
                    className="font-mono normal-case tracking-normal transition-colors duration-200"
                    style={{ color: form.message.length ? 'var(--accent)' : undefined }}
                  >
                    {form.message.length} chars
                  </span>
                }
              />

              <button
                type="submit"
                disabled={status !== 'idle'}
                aria-busy={status === 'sending'}
                className="btn btn-primary w-full py-3.5 text-[14px] disabled:cursor-not-allowed"
                style={btnStyle}
              >
                {status === 'sending' && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {status === 'sending' ? 'Sending…'
                  : status === 'sent'  ? 'Message Sent ✓'
                  : status === 'error' ? 'Try Again'
                  : <>Send Message <span aria-hidden="true">→</span></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
