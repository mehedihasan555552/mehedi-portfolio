import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

// Below-the-fold sections: dynamically import so they don't block the initial render
const About      = dynamic(() => import('@/components/About'))
const Experience = dynamic(() => import('@/components/Experience'))
const Skills     = dynamic(() => import('@/components/Skills'))
const Projects   = dynamic(() => import('@/components/Projects'))
const BlogSection = dynamic(() => import('@/components/BlogSection'))
const Education  = dynamic(() => import('@/components/Education'))
const Contact    = dynamic(() => import('@/components/Contact'))

export default function Home() {
  return (
    <main>
      {/* Navbar and Hero are SSR'd — visible immediately */}
      <Navbar />
      <Hero />
      {/* Rest lazy-loads after initial paint */}
      <About />
      <Experience />
      <Skills />
      <Projects />
      <BlogSection />
      <Education />
      <Contact />
      <Footer />
    </main>
  )
}
