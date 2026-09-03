'use client'

import { useState, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import { CloudinaryResource } from '@/types'
import { getImagesFromFolder } from '@/lib/cloudinary-actions'

export default function Logostrip() {
  const [logos, setLogos] = useState<CloudinaryResource[]>([])

  useEffect(() => {
    async function fetchLogos() {
      try {
        const data = await getImagesFromFolder()
        if (Array.isArray(data)) {
          setLogos(data)
        }
      } catch (error) {
        console.error("Fout bij het ophalen van logos:", error)
      }
    }
    fetchLogos()
  }, [])

  if (logos.length === 0) return null

  return (
    <section className="py-12 bg-white border-y border-stone-200/60 overflow-hidden font-sans">
      <div className="relative max-w-7xl mx-auto px-6">

        {/* Witte Fade maskers aan de zijkanten */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Carrousel Container */}
        <div className="flex overflow-hidden select-none">
          {[1, 2].map((trackIndex) => (
            <div
              key={trackIndex}
              className="flex flex-shrink-0 items-center space-x-12 md:space-x-16 pr-12 md:pr-16 animate-marquee whitespace-nowrap py-2"
              style={{ animationDuration: '22s' }}
            >
              {logos.map((logo, index) => {
                const id = logo.publicId.toLowerCase()
                const isWhiteLogo = id.includes('on2it')

                // Welke logo's zijn erg plat/breed en hebben meer schaal nodig?
                const isWideLogo = id.includes('malmberg') || id.includes('nike')

                return (
                  <div
                    key={`${logo.publicId}-${trackIndex}-${index}`}
                    className="flex-shrink-0 flex items-center justify-center w-32 md:w-40 h-16"
                  >
                    <CldImage
                      src={logo.publicId}
                      width={400}
                      height={200}
                      crop="fit"
                      alt="Opdrachtgever logo"
                      className={`w-auto object-contain pointer-events-none ${
                        isWideLogo
                          ? 'h-10 md:h-12 max-w-[160px] scale-125' // Geef brede logo's meer ruimte en een lichte boost
                          : 'h-8 md:h-10 max-w-[130px]'
                      } ${isWhiteLogo ? 'invert opacity-80' : ''}`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
