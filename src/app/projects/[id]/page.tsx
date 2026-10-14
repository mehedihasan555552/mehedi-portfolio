import { projects } from '@/data/projects'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectDetailClient from './ProjectDetailClient'

export function generateStaticParams() {
  return projects.map(p => ({ id: p.id }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const project = projects.find(p => p.id === id)
  if (!project) return { title: 'Project Case Study — Mehedi Hasan' }
  return {
    title: `${project.title} — Mehedi Hasan`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.image, width: 1200, height: 630, alt: project.title }],
    },
  }
}

export default async function ProjectPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const initialProject = projects.find(p => p.id === id) || null

  return (
    <>
      <Navbar />
      <ProjectDetailClient id={id} initialProject={initialProject} />
      <Footer />
    </>
  )
}
