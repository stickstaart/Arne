import Hero from '@/components/sections/Hero'
import Logostrip from '@/components/sections/Logostrip'
import PortfolioGrid from '@/components/sections/PortfolioGrid'
import About from '@/components/sections/About'

export default function Home() {
  return (
    <main>
      <Hero />
      <Logostrip />
      <About />
      <PortfolioGrid />
    </main>
  )
}
