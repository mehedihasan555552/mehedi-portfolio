'use client'
import { useState, useCallback } from 'react'
import { useReveal } from '@/hooks/useReveal'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const CONTACT_ITEMS = [
  { icon: '✉️', label: 'Email',            value: 'mehediswpu@gmail.com',    href: 'mailto:mehediswpu@gmail.com' },
  { icon: '📞', label: 'Phone (Primary)',  value: '+8801339-388329',          href: 'tel:+8801339388329' },
  { icon: '📱', label: 'Phone (Alt)',      value: '+8801521-333362',          href: 'tel:+8801521333362' },
  { icon: '📍', label: 'Address',          value: '99/1, Noyabari, Radio Colony, BPATC, Savar, Dhaka', href: null },
  { icon: '🌐', label: 'Website',          value: 'mehediswpu.vercel.app',   href: 'https://mehediswpu.vercel.app' },
]

const SOCIALS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/mehedihasan555552/' },
  { name: 'GitHub',   href: 'https://github.com/mehedihasan555552' },
  { name: 'Twitter',  href: 'https://x.com/ridoy123439' },
  { name: 'Facebook', href: 'https://www.facebook.com/mehedihasan555552/' },
]

const inputCls = "w-full px-4 py-3 dark:bg-[#0f0f1a] bg-[#f5f4ff] border border-[--border] rounded-xl dark:text-white text-[#1a1830] placeholder-[--text-dim] text-base focus:outline-none focus:border-[--accent] transition-[border-color] duration-200"

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const ref = useReveal()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Replace with real EmailJS or API call:
    await new Promise(r => setTimeout(r, 1400))
    setStatus('sent')
    setTimeout(() => setStatus('idle'), 4000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <section id="contact" ref={ref as React.RefObject<HTMLDivElement>} className="py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.03] bg-[#4f7fff] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-4 mb-6 reveal">
          <span className="font-mono text-sm text-[--accent]">06.</span>
          <h2 className="text-4xl md:text-5xl font-black dark:text-white text-[#1a1830]" style={{ fontFamily: 'var(--font-display)' }}>
            Get In <em className="italic text-[--accent]">Touch</em>
          </h2>
          <div className="flex-1 h-px bg-[--border]" />
        </div>
        <p className="text-lg italic dark:text-white/55 text-[#3b3860] font-semibold mb-14 max-w-2xl reveal" style={{ fontFamily: 'var(--font-italic)' }}>
          Have a project or want to collaborate? Let&apos;s build something extraordinary together.
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-4 reveal-left">
            {CONTACT_ITEMS.map(item => (
              <div key={item.label} className="flex items-start gap-4 glass-card rounded-2xl p-4">
                <div className="w-11 h-11 rounded-xl dark:bg-[#0f0f1a] bg-[#f0eeff] flex items-center justify-center text-xl flex-shrink-0" aria-hidden="true">{item.icon}</div>
                <div>
                  <div className="text-xs font-mono uppercase dark:text-white/40 text-[#6b689a] tracking-wider mb-0.5 font-bold">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="text-base dark:text-white text-[#0e0c1f] hover:text-[--accent] transition-colors font-bold break-all">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-base dark:text-[#e8e6ff] text-[#1a1830] font-semibold">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-4">
              <h3 className="text-sm font-mono uppercase text-[--text-dim] tracking-widest mb-4">Social Profiles</h3>
              <div className="flex flex-wrap gap-3">
                {SOCIALS.map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2.5 glass-card glass-card-hover rounded-xl text-sm font-semibold text-[--text-muted] hover:text-[--text]">
                    {s.name} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card rounded-3xl p-8 reveal-right">
            <h3 className="text-2xl font-bold dark:text-white text-[#1a1830] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono font-semibold text-[--text-dim] uppercase tracking-wider mb-2">Name</label>
                  <input id="contact-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="John Doe" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono font-semibold text-[--text-dim] uppercase tracking-wider mb-2">Email</label>
                  <input id="contact-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" className={inputCls} />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-xs font-mono font-semibold text-[--text-dim] uppercase tracking-wider mb-2">Subject</label>
                <input id="contact-subject" name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="Project Inquiry / Collaboration" className={inputCls} />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono font-semibold text-[--text-dim] uppercase tracking-wider mb-2">Message</label>
                <textarea id="contact-message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Tell me about your project..." className={`${inputCls} resize-none`} />
              </div>
              <button
                type="submit"
                disabled={status !== 'idle'}
                aria-busy={status === 'sending'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-[transform,box-shadow,background] duration-300 ${
                  status === 'sent'    ? 'bg-emerald-500 text-white' :
                  status === 'sending' ? 'bg-[#4f7fff]/50 text-white cursor-wait' :
                  'bg-gradient-to-r from-[#4f7fff] to-[#9b5de5] text-white hover:shadow-2xl hover:shadow-[#4f7fff]/30 hover:-translate-y-1'
                }`}
              >
                {status === 'sending' ? '⏳ Sending…' : status === 'sent' ? '✅ Message Sent!' : '→ Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
