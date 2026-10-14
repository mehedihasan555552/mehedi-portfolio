'use client'
import { useState, useCallback } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import SectionHeader from './SectionHeader'
import GlobeBeacon3D from './GlobeBeacon3D'

type Status = 'idle' | 'sending' | 'sent' | 'error'

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
    className: 'w-full px-4 py-3.5 text-[15px] sm:text-[16px] font-medium bg-transparent outline-none placeholder:text-[--text-dim] resize-none',
    style: { color: 'var(--text)' },
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center justify-between text-[12px] font-mono font-bold uppercase tracking-[0.16em] text-[--text-dim]"
      >
        <span className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: focused ? 'var(--accent)' : 'var(--text-dim)',
            }}
            aria-hidden="true"
          />
          {label}
        </span>
        {trailing}
      </label>
      <div
        className="input-box transition-all duration-200"
        style={{
          borderRadius: 'var(--r-md)',
          background: 'var(--bg-2)',
          border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
        }}
      >
        {rows ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
      </div>
    </div>
  )
}

export default function Contact() {
  const { db } = usePortfolioData()
  const { profile } = db
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
    await new Promise(r => setTimeout(r, 1000))
    setStatus('sent')
    setTimeout(() => setStatus('idle'), 4000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const contactItems = [
    { label: 'Email',           value: profile.email,          href: `mailto:${profile.email}` },
    { label: 'Phone (Primary)', value: profile.phonePrimary,   href: `tel:${profile.phonePrimary.replace(/[^+\d]/g, '')}` },
    { label: 'Phone (Alt)',     value: profile.phoneSecondary, href: `tel:${profile.phoneSecondary.replace(/[^+\d]/g, '')}` },
    { label: 'Address',         value: profile.address,        href: null },
    { label: 'Website',         value: profile.website,        href: `https://${profile.website.replace(/^https?:\/\//, '')}` },
  ]

  const socials = [
    { name: 'LinkedIn', href: profile.linkedin },
    { name: 'GitHub',   href: profile.github },
    { name: 'Twitter',  href: profile.twitter },
    { name: 'Facebook', href: profile.facebook },
  ]

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section"
    >
      <div className="container-x">
        <SectionHeader
          index="07 —"
          title="Get In"
          emphasis="Touch"
          standfirst="Have an ambitious AI/LLM project or want to collaborate? Let's architect something extraordinary."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
          <div className="space-y-3 reveal-left">
            <GlobeBeacon3D />

            {contactItems.map(item => {
              const Tag = item.href ? 'a' : 'div'
              return (
                <Tag
                  key={item.label}
                  {...(item.href
                    ? {
                        href: item.href,
                        target: item.href.startsWith('http') ? '_blank' : undefined,
                        rel: item.href.startsWith('http') ? 'noopener noreferrer' : undefined,
                      }
                    : {})}
                  className="group flex items-center gap-4 glass-card glass-card-hover spotlight px-4.5 py-3.5 tilt-3d"
                >
                  <span
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ background: 'var(--border-hi)' }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-[--text-dim] mb-0.5">
                      {item.label}
                    </span>
                    <span
                      className="block text-[15px] sm:text-[15.5px] font-semibold break-words transition-colors duration-200 group-hover:text-[--accent]"
                      style={{ color: 'var(--text)' }}
                    >
                      {item.value}
                    </span>
                  </span>
                </Tag>
              )
            })}

            <div className="pt-4">
              <div className="grid grid-cols-2 gap-2.5">
                {socials.map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between glass-card glass-card-hover spotlight px-4 py-3 tilt-3d"
                  >
                    <span className="text-[14px] font-bold text-[--text-muted] group-hover:text-[--accent] transition-colors">
                      {s.name}
                    </span>
                    <span className="text-xs font-mono text-[--text-dim] group-hover:text-[--accent]">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card border-beam spotlight p-6 sm:p-8 md:p-9 reveal-right relative overflow-hidden">
            <h3
              className="flex items-center gap-2.5 text-2xl sm:text-[26px] font-extrabold tracking-[-0.015em] mb-1.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="w-1.5 h-6 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              Send a Message
            </h3>
            <p className="text-[14.5px] sm:text-[15px] font-medium text-[--text-dim] mb-7 pl-4">
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
                value={form.subject} placeholder="Project Inquiry / Multi-Agent Architecture"
                focused={focused === 'subject'} onChange={handleChange}
                onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
              />

              <Field
                id="contact-message" name="message" label="Message" required rows={5}
                value={form.message} placeholder="Tell me about your project..."
                focused={focused === 'message'} onChange={handleChange}
                onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                trailing={
                  <span className="font-mono font-semibold normal-case tracking-normal">
                    {form.message.length} chars
                  </span>
                }
              />

              <button
                type="submit"
                disabled={status !== 'idle'}
                aria-busy={status === 'sending'}
                className="btn btn-primary w-full py-4 text-[15.5px] sm:text-[16px] font-bold tracking-tight disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending…'
                  : status === 'sent'  ? 'Message Sent ✓'
                  : <>Send Message <span aria-hidden="true">→</span></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
