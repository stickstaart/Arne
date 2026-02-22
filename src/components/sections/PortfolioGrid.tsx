'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CldImage } from 'next-cloudinary'
import { getPortfolioImages } from '@/lib/cloudinary-actions'
import { Category, CloudinaryResource } from '@/types'

const CATEGORIES: Category[] = ['doodle', 'wildkunst'];

export default function PortfolioGrid() {
  const [category, setCategory] = useState<Category>('doodle')
  const [images, setImages] = useState<CloudinaryResource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const data = await getPortfolioImages(category)
        setImages(data)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [category])

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="portfolio">
      {/* Filter Navigatie */}
      <div className="flex justify-center space-x-8 mb-16">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-sm uppercase tracking-[0.2em] font-medium transition-all ${
              category === cat ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Het Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {images.map((img) => (
            <motion.div
              key={img.publicId}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group relative aspect-[4/5] overflow-hidden bg-slate-100 rounded-xl"
            >
              <CldImage
                src={img.publicId}
                fill
                alt={img.title}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <p className="text-white font-medium">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
