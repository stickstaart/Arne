'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CldImage } from 'next-cloudinary'
import { getPortfolioImages } from '@/lib/cloudinary-actions'
import { Category, CloudinaryResource } from '@/types'

const CATEGORIES: Category[] = ['doodle', 'wildkunst'];

export default function Portfoliogrid() {
  const [category, setCategory] = useState<Category>('doodle')
  const [images, setImages] = useState<CloudinaryResource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const data = await getPortfolioImages()
        setImages(data)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, []) // We houden de useEffect leeg om alles in één keer te laden

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="portfolio">
      {/* Filter Navigatie - Kleuren aangepast naar het nieuwe thema */}
      <div className="flex justify-center space-x-8 mb-16">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-sm uppercase tracking-[0.2em] font-medium transition-all ${
              category === cat
                ? 'text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* De Masonry Container */}
      <motion.div
        layout
        className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {images.map((img) => (
            <motion.div
              key={img.publicId}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="break-inside-avoid mb-6 group relative overflow-hidden bg-stone-200 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              <CldImage
                src={img.publicId}
                width={img.width || 800}
                height={img.height || 1000}
                alt={img.title || "Portfolio item"}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                <p className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-serif italic text-lg">
                  {img.title || "Untitled"}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
