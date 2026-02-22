"use client"

import { CldImage } from 'next-cloudinary'
import Container from '../layout/Container'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32 bg-[#F9F7F2]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Foto van Arne */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-stone-200">
              {/* Vervang 'arne_foto' door de juiste ID uit je Cloudinary dashboard */}
              <CldImage
                src="arne-van-der-ree-met-het-werk-van-rien-poortvliet_gphaba"
                width={800}
                height={1000}
                alt="Arne van der Ree"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F2]/40 to-transparent" />
            </div>
            <p className="mt-4 text-[10px] text-stone-400 uppercase tracking-widest text-center lg:text-left">
              Alle afbeeldingen zijn auteursrechtelijk beschermd © Arne van der Ree
            </p>
          </div>

          {/* Tekst Content */}
          <div className="lg:col-span-7">
            <h1 className="text-5xl md:text-7xl font-serif italic leading-tight text-stone-900">
              Welkom op Doodle.nl
            </h1>
            <h2 className="text-2xl md:text-3xl text-stone-500 font-sans font-light mt-2">
              Voor illustratie en Educatief Design
            </h2>
            <p className="mt-8 text-lg text-stone-600 leading-relaxed max-w-xl">
              Arne van der Ree startte Doodle.nl in 2001 na een bevlogen start van zijn commerciële illustratiewerk op jonge leeftijd.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center h-14 px-8 bg-stone-900 text-white rounded-full font-medium hover:scale-105 transition-all"
              >
                Bekijk Portfolio
              </a>
              <a
                href="#over-arne"
                className="inline-flex items-center justify-center h-14 px-8 border border-stone-300 rounded-full font-medium hover:bg-stone-100 transition-all"
              >
                Over Arne
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
