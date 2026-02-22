"use client"

import { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import Container from '@/components/layout/Container' // Gebruik de @ import!

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full bg-[#F9F7F2]/90 backdrop-blur-md border-b border-stone-200/50">
      <nav className="mx-auto max-w-7xl px-6 h-24 flex items-center justify-between">

        {/* Logo & Naam */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-white border border-stone-200 shadow-sm">
            <CldImage
              src="https://res.cloudinary.com/dghm9cmuh/image/upload/v1771797689/doodle-logo-site_t2pq17.png" // Zorg dat deze ID klopt in Cloudinary
              width={80}
              height={80}
              alt="Doodle Logo"
              className="object-contain p-1"
              style={{ height: 'auto', width: 'auto' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif italic tracking-tight text-stone-900 leading-none">Doodle.nl</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mt-1.5">Arne van der Ree</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 text-xs font-medium uppercase tracking-widest text-stone-600">
          <a href="#portfolio" className="hover:text-stone-900 transition-colors">Portfolio</a>
          <a href="#over-arne" className="hover:text-stone-900 transition-colors">Over Arne</a>
          <a href="#contact" className="hover:text-stone-900 transition-colors border-b border-stone-900/0 hover:border-stone-900 pb-1">Contact</a>
        </div>

        {/* Hamburger Button (Mobiel) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-stone-600 focus:outline-none"
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <div className={`w-6 h-0.5 bg-stone-800 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-stone-800 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-stone-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-24 left-0 w-full bg-[#F9F7F2] border-b border-stone-200 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-64 opacity-100 shadow-xl' : 'max-h-0 opacity-0'}`}>
        <div className="py-8 px-6 flex flex-col space-y-6 text-center text-lg font-serif italic text-stone-800">
          <a href="#portfolio" onClick={() => setIsOpen(false)}>Portfolio</a>
          <a href="#over-arne" onClick={() => setIsOpen(false)}>Over Arne</a>
          <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
        </div>
      </div>
    </header>
  )
}
