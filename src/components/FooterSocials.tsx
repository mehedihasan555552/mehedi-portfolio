import SocialIcon from '@/components/SocialIcon'

const SOCIALS = [
  { name: 'linkedin' as const, label: 'LinkedIn', href: 'https://www.linkedin.com/in/mehedihasan555552/' },
  { name: 'github'   as const, label: 'GitHub',   href: 'https://github.com/mehedihasan555552' },
  { name: 'twitter'  as const, label: 'Twitter',  href: 'https://x.com/ridoy123439' },
  { name: 'facebook' as const, label: 'Facebook', href: 'https://www.facebook.com/mehedihasan555552/' },
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
          className="w-9 h-9 rounded-md glass-card glass-card-hover grid place-items-center text-[--text-muted] hover:text-[--accent]"
        >
          <SocialIcon name={s.name} />
        </a>
      ))}
    </div>
  )
}
