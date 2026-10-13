import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import BlogSection from '@/components/BlogSection'
import Education from '@/components/Education'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

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
