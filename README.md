# Md Mehedi Hasan — Portfolio & Dynamic CMS (Next.js 16 + 3D AI + Local DB)

A smooth, 60fps portfolio and full-featured **Admin CMS (`/admin`)** built with **Next.js 16**, **React 19**, **Framer Motion**, **Tailwind CSS**, and a **Vercel-ready Local JSON Database**.

## 🔐 Admin Panel (`/admin`)

Open `http://localhost:3000/admin` (or click **Admin** in the top navigation bar / footer) and sign in with the default credentials:

- **Email**: `mehedi@gmail.com`
- **Password**: `Mehedihasan1.###`

### What You Can Manage Dynamically in `/admin`:
1. **📝 Blogs Manager**: Publish new Markdown blog posts, edit existing articles, or delete posts.
2. **🚀 Projects Manager**: Add new portfolio projects with full case studies, stats, tech stack, and gallery images, or edit/delete existing projects.
3. **👤 Profile, Hero & Contact Info**: Update your name, navbar cycling taglines, hero badge, hero bio, typewriter roles, stats, about section copy, email, phone numbers, address, and social links.
4. **💼 Experience Manager**: Add, edit, or delete work experience timeline entries.
5. **🎓 Education & Certifications**: Add or remove degrees and certifications.
6. **⚡ Skills & Proficiencies**: Adjust core proficiency percentages and tech stack categories.
7. **💾 Local Database & Vercel Sync**: Uses `src/data/local-db.json` via `/api/db` + instant browser persistence (`localStorage`) + serverless `/tmp` fallback so it works seamlessly both locally (`npm run dev`) and when deployed to **Vercel** (`vercel --prod`).

## 🚀 Quick Start

```bash
rm -rf .next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (Portfolio) or [http://localhost:3000/admin](http://localhost:3000/admin) (Admin CMS).
