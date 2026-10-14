import type { Metadata } from 'next'
import { blogs } from '@/data/blogs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogPostClient from './BlogPostClient'

export function generateStaticParams() {
  return blogs.map(b => ({ slug: b.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const blog = blogs.find(b => b.slug === slug)
  if (!blog) {
    return {
      title: 'Engineering Article — Mehedi Hasan',
    }
  }

  const url = `https://mehediswpu.vercel.app/blog/${blog.slug}`

  return {
    title: `${blog.title} — Mehedi Hasan`,
    description: blog.excerpt,
    openGraph: {
      type: 'article',
      title: blog.title,
      description: blog.excerpt,
      url,
      images: [{ url: blog.image, width: 1200, height: 630, alt: blog.title }],
    },
    alternates: { canonical: url },
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const initialBlog = blogs.find(b => b.slug === slug) || null
  const initialRelated = blogs.filter(b => b.slug !== slug).slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <BlogPostClient slug={slug} initialBlog={initialBlog} initialRelated={initialRelated} />
      </main>
      <Footer />
    </>
  )
}
