'use client'
import SocialIcon from '@/components/SocialIcon'

const SOCIALS = [
  { name: 'linkedin' as const, label: 'LinkedIn', href: 'https://www.linkedin.com/in/mehedihasan555552/', color: '#0a66c2' },
  { name: 'github'   as const, label: 'GitHub',   href: 'https://github.com/mehedihasan555552',           color: '#e8e6ff' },
  { name: 'twitter'  as const, label: 'Twitter',  href: 'https://x.com/ridoy123439',                      color: '#1d9bf0' },
  { name: 'facebook' as const, label: 'Facebook', href: 'https://www.facebook.com/mehedihasan555552/',    color: '#1877f2' },
]

export default function FooterSocials() {
  return (
    <div className="flex items-center gap-2">
      {SOCIALS.map(s => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="w-9 h-9 glass-card rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 border border-transparent"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.color       = s.color
            el.style.borderColor = `${s.color}35`
            el.style.boxShadow   = `0 4px 16px ${s.color}20`
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.color       = 'var(--text-muted)'
            el.style.borderColor = 'transparent'
            el.style.boxShadow   = ''
          }}
        >
          <SocialIcon name={s.name} />
        </a>
      ))}
    </div>
  )
}