# Mehedi Hasan — Portfolio v2.1

A premium, fully-responsive portfolio built with **Next.js 14** + **Tailwind CSS**.

## ✨ What's New in v2

- 🌙 **Dark / Light mode** — toggle with one click, persisted to localStorage
- 📄 **Project detail pages** — rich `/projects/[id]` pages with gallery, stats, highlights
- 🎨 **Playfair Display + DM Sans + Cormorant Garamond** — elegant italic serif typography
- ✦ **More animations** — morphing blobs, orbiting rings, floating particles, reveal-on-scroll
- 🖼️ **Online images** via Unsplash (no placeholder needed)
- 📱 **Mobile navbar fixed** — full-screen overlay menu with staggered animation
- ♿ **Accessible** — aria-labels, keyboard navigation, focus states

## 🚀 Quick Start

```bash
unzip mehedi-portfolio.zip
cd mehedi-portfolio
npm install
npm run dev
```

Open http://localhost:3000

## 📁 Structure

```
src/
├── app/
│   ├── globals.css              # Tokens, animations, dark/light vars
│   ├── layout.tsx               # Root layout + Google Fonts
│   ├── page.tsx                 # Home page
│   └── projects/[id]/page.tsx   # Dynamic project detail page
├── components/
│   ├── Navbar.tsx               # Fixed nav + mobile overlay + theme toggle
│   ├── Hero.tsx                 # Typing animation + floating particles
│   ├── About.tsx                # Image + bio + skill marquee
│   ├── Experience.tsx           # Tab-panel timeline
│   ├── Skills.tsx               # Animated progress bars + categories
│   ├── Projects.tsx             # Filterable grid → links to detail pages
│   ├── Education.tsx            # Timeline + certs + campus photo
│   ├── Contact.tsx              # Form + contact info
│   └── Footer.tsx               # 3-col footer
├── context/
│   └── ThemeContext.tsx          # Dark/light toggle (localStorage)
└── data/
    └── projects.ts              # All project data (single source of truth)
```

## 🖼️ Add Your Own Photo

In `Hero.tsx`, the Unsplash placeholder is already set. To use your own:

1. Place your photo at `public/mehedi.jpg`
2. In `Hero.tsx`, change the `<Image>` `src` to `"/mehedi.jpg"`

## 📧 Activate Contact Form (EmailJS)

```bash
npm install emailjs-com
```

In `Contact.tsx`, replace `handleSubmit`:

```tsx
import emailjs from 'emailjs-com'
const handleSubmit = async (e) => {
  e.preventDefault(); setStatus('sending')
  try {
    await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', form, 'PUBLIC_KEY')
    setStatus('sent')
  } catch { setStatus('idle') }
}
```

## 🚢 Deploy

```bash
npm i -g vercel
vercel --prod
```

## 🎨 Customize

| What | Where |
|------|-------|
| Colors / tokens | `tailwind.config.js` + `globals.css` `:root` |
| Dark/light vars | `globals.css` `.dark {}` and `:root:not(.dark) {}` |
| Fonts | `layout.tsx` Google Fonts link + `tailwind.config.js` fontFamily |
| Projects data | `src/data/projects.ts` |
| Experience data | `src/components/Experience.tsx` `experiences` array |
| SEO metadata | `src/app/layout.tsx` `metadata` object |
