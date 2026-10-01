import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'AI & Engineering Blog | Md Mehedi Hasan',
  description:
    'Deep architectural playbooks on Multi-Agent Systems, Advanced RAG Pipelines, Tool-Enabled Agents, AI Evaluation Frameworks, and Scalable Python Backends by Senior AI/LLM Engineer Md Mehedi Hasan.',
  openGraph: {
    title: 'AI & Engineering Blog — Md Mehedi Hasan',
    description:
      'Production engineering playbooks on Agentic AI, Multi-Agent Orchestration, Advanced RAG, and Evaluation Frameworks.',
    url: 'https://mehediswpu.vercel.app/blog',
  },
}

export default function BlogIndexPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <BlogListClient />
      </main>
      <Footer />
    </>
  )
}
