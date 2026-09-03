'use client'

import { useState, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import { CloudinaryResource } from '@/types'
import { getImagesFromFolder } from '@/lib/cloudinary-actions'

const LOGO_SETTINGS: Record<string, { heightInPx?: number; maxWidthInPx?: number; invert?: boolean }> = {
  nike: { heightInPx: 70, maxWidthInPx: 200 },
  malmberg: { heightInPx: 52, maxWidthInPx: 200 },
  on2it: { invert: true, heightInPx: 40, maxWidthInPx: 160 },
  scouting: { heightInPx: 36, maxWidthInPx: 120 },
}

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
      {/* Geïntegreerde CSS keyframe die gegarandeerd 100% naadloos verschuift */}
      <style jsx>{`
        @keyframes marqueeLoop {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-loop {
          animation: marqueeLoop 60s linear infinite;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Witte Fade maskers */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Carrousel Container */}
        <div className="flex overflow-hidden select-none">
          {[1, 2].map((trackIndex) => (
            <div
              key={trackIndex}
              className="flex flex-shrink-0 items-center animate-marquee-loop whitespace-nowrap py-2"
            >
              {logos.map((logo, index) => {
                const publicIdLower = logo.publicId.toLowerCase()

                const matchingKey = Object.keys(LOGO_SETTINGS).find((key) =>
                  publicIdLower.includes(key)
                )
                const config = matchingKey ? LOGO_SETTINGS[matchingKey] : {}

                const height = config.heightInPx ?? 38
                const maxWidth = config.maxWidthInPx ?? 130
                const isInverted = config.invert || false

                return (
                  <div
                    key={`${logo.publicId}-${trackIndex}-${index}`}
                    className="flex-shrink-0 flex items-center justify-center px-6 md:px-8 h-20"
                  >
                    <CldImage
                      src={logo.publicId}
                      width={400}
                      height={200}
                      crop="fit"
                      alt="Opdrachtgever logo"
                      style={{
                        height: `${height}px`,
                        maxWidth: `${maxWidth}px`,
                        width: 'auto',
                      }}
                      className={`object-contain pointer-events-none ${
                        isInverted ? 'invert opacity-80' : ''
                      }`}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
