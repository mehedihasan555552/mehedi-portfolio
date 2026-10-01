import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { blogs } from '@/data/blogs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogPostClient from './BlogPostClient'

// ─── Generate static paths at build time (SSG) ─────────────────────────
export function generateStaticParams() {
  return blogs.map(b => ({ slug: b.slug }))
}

// ─── Dynamic SEO Metadata per Blog ────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const blog = blogs.find(b => b.slug === slug)
  if (!blog) return {}

  const url = `https://mehediswpu.vercel.app/blog/${blog.slug}`

  return {
    title: `${blog.title} — Mehedi Hasan`,
    description: blog.excerpt,
    keywords: [
      ...blog.tags,
      'Agentic AI',
      'Multi-Agent Systems',
      'Production LLM',
      'Md Mehedi Hasan',
      'Python AI Backend',
    ],
    authors: [{ name: 'Md Mehedi Hasan', url: 'https://mehediswpu.vercel.app' }],
    openGraph: {
      type: 'article',
      title: blog.title,
      description: blog.excerpt,
      url,
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.tagline,
      creator: '@ridoy123439',
      images: [blog.image],
    },
    alternates: {
      canonical: url,
    },
  }
}

// ─── Server Page Component ────────────────────────────────────────────
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const blog = blogs.find(b => b.slug === slug)
  if (!blog) notFound()

  // Find up to 3 related articles (prioritize same category or adjacent)
  const related = blogs
    .filter(b => b.slug !== blog.slug)
    .sort((a, b) => (a.category === blog.category ? -1 : 1))
    .slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <BlogPostClient blog={blog} related={related} />
      </main>
      <Footer />
    </>
  )
}
