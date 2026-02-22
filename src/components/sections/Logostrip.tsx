'use client'

import { useState, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import { CloudinaryResource } from '@/types'
import { getImagesFromFolder } from '@/lib/cloudinary-actions' // We gebruiken alleen deze!

export default function Logostrip() {
  const [logos, setLogos] = useState<CloudinaryResource[]>([])

  useEffect(() => {
    async function fetchLogos() {
      // Gebruik het pad dat we eerder hebben vastgesteld
      const data = await getImagesFromFolder()
      console.log("Gevonden logo data:", data)
      setLogos(data)
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
                  className="opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 object-contain"
                  style={{ height: 'auto', width: 'auto' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
