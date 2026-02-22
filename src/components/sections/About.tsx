"use client"

import Container from '../layout/Container'

export default function About() {
  return (
    <section id="over-arne" className="py-24 bg-white border-t border-stone-100">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="text-3xl font-serif italic text-stone-900">Over Arne</h2>
          </div>
          <div className="md:col-span-8 text-lg text-stone-700 leading-relaxed space-y-6 font-sans">
            <p>
              Arne van der Ree startte <strong>Doodle.nl</strong> in 2001 na een bevlogen start van zijn commerciële illustratiewerk op jonge leeftijd. Naast een liefde voor tekenen was er ook als kind al de grote interesse in de natuur en dit leidde door de jaren heen tot een specialisatie in het (educatief) tekenen voor passende opdrachtgevers.
            </p>
            <p>
              Op 18-jarige leeftijd gaf Sluis Diervoeders Arne zijn eerste grote opdrachten en sindsdien zijn de geïllustreerde onderwerpen en opgeloste beeldvragen in sneltreinvaart toegenomen. Grote namen voor wie Arne al jaren tekent zijn o.a. Vogelbescherming, de Pinkeltje boeken en Scouting Nederland.
            </p>
            <div className="pt-6">
              <p className="text-stone-500 text-sm mb-2 italic text-sm">Wil je weten of Arne ook iets voor jou kan 'betekenen'?</p>
              <a href="mailto:arne@doodle.nl" className="text-stone-900 font-bold border-b-2 border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-all text-xl">
                arne@doodle.nl
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
