import Hero from '@/components/sections/Hero'
import Logostrip from '@/components/sections/Logostrip'
import PortfolioGrid from '@/components/sections/PortfolioGrid'
import About from '@/components/sections/About'
import PortfolioCarousel from '@/components/portfolio/PortfolioCarousel'
import InfoContact from '@/components/sections/InfoContact'

export default function Home() {
  return (
    <main className="pt-24 md:pt-32 bg-[#F9F7F2] min-h-screen">
      <PortfolioCarousel />
      {/* Het nieuwe interactieve portfolio */}
      {/*<PortfolioGrid />*/}
      {/* Over Arne (Zonder foto, puur tekst/elegant) */}
      <InfoContact /> {/* Contact sectie */ }
      <Logostrip /> { /* OPDRACHTGEVERS */ }
    </main>
  )
}
