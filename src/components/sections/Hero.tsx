"use client"

import { CldImage } from 'next-cloudinary'
import Container from '../layout/Container'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32 bg-[#F9F7F2]">

      {/* 1. ACHTERGROND LAAG - Nu beperkt tot de rechterkant op desktop */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/3 lg:w-[35%] z-0">
        <CldImage
          fill // Gebruik fill voor absolute positionering binnen de parent div
          src="arne-van-der-ree-met-het-werk-van-rien-poortvliet_gphaba"
          alt="Arne van der Ree"
          className="object-cover object-center"
          priority
        />

        {/* De Snelle Fade: van de beige kleur (links) naar transparant (over de foto) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F2] via-[#F9F7F2]/40 to-transparent" />
      </div>

      {/* 2. CONTENT LAAG */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Tekst aan de linkerkant */}
          <div className="lg:col-span-7">
            <h1 className="text-5xl md:text-7xl font-serif italic leading-tight text-stone-900">
              Welkom op Doodle.nl
            </h1>
            <h2 className="text-2xl md:text-3xl text-stone-500 font-sans font-light mt-2">
              Voor illustratie en Educatief Design
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center h-14 px-8 bg-stone-900 text-white rounded-full font-medium hover:scale-105 transition-all shadow-lg"
              >
                Bekijk Portfolio
              </a>
              <a
                href="#over-arne"
                className="inline-flex items-center justify-center h-14 px-8 bg-stone-900 text-white rounded-full font-medium hover:scale-105 transition-all shadow-lg"
              >
                Over Arne
              </a>
            </div>
          </div>

          {/* Rechterkant leeg laten voor de foto op de achtergrond */}
          <div className="hidden lg:block lg:col-span-5" />
        </div>
      </Container>
    </section>
  )
}
