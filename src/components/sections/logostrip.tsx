'use client'

import { useState, useEffect } from 'react'
import { getLogoResources } from '@/lib/cloudinary-actions'
import { CldImage } from 'next-cloudinary'
import { CloudinaryResource } from '@/types'

export default function Logostrip() {
  const [logos, setLogos] = useState<CloudinaryResource[]>([])

  useEffect(() => {
    async function fetchLogos() {
      const resources = await getLogoResources()
      setLogos(resources)
    }
    fetchLogos()
  }, [])

  if (logos.length === 0) return null

  // We dupliceren de logos om een naadloze loop te creëren
  const duplicatedLogos = [...logos, ...logos, ...logos]

  return (
    <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">

        {/* De Fade maskers aan de zijkanten */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* De Carrousel Container */}
        <div className="flex overflow-hidden group">
          <div className="flex space-x-16 animate-marquee whitespace-nowrap py-4">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.publicId}-${index}`}
                className="flex-shrink-0 flex items-center justify-center w-40 h-20 transition-transform duration-300 hover:scale-110"
              >
                <CldImage
                  src={logo.publicId}
                  width={160}
                  height={80}
                  alt="Partner Logo"
                  className="object-contain" // Geen 'grayscale' meer voor full color!
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
