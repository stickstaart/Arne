"use client"

import { useState, useRef, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import { getPortfolioImages } from '@/lib/cloudinary-actions'
import { CloudinaryResource } from '@/types'

export default function PortfolioCarousel() {
  const [images, setImages] = useState<CloudinaryResource[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const thumbContainerRef = useRef<HTMLDivElement>(null)
  const isPausedRef = useRef<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const requestRef = useRef<number | null>(null)

  // Momentum-variabelen voor de MINIATUREN (MC)
  const isDownMCRef = useRef(false)
  const startXMCRef = useRef(0)
  const scrollLeftMCRef = useRef(0)
  const velXMCRef = useRef(0)
  const momentumIdMCRef = useRef<number | null>(null)

  // Momentum-variabelen voor de GROTE CARROUSEL (PC)
  const isDownPCRef = useRef(false)
  const startXPCRef = useRef(0)
  const scrollLeftPCRef = useRef(0)
  const velXPCRef = useRef(0)
  const momentumIdPCRef = useRef<number | null>(null)

  // 1. Haal live Cloudinary beelden op
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const data = await getPortfolioImages()
        setImages(data)
      } catch (error) {
        console.error("Fout bij het laden van Cloudinary beelden:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  const marqueeImages = [...images, ...images]

  // 2. Grote carrousel (PC) automatische loop
  useEffect(() => {
    if (loading || images.length === 0) return

    const container = scrollContainerRef.current
    if (!container) return

    let currentScrollLeft = container.scrollLeft

    const render = () => {
      // Alleen automatisch scrollen als hij niet gepauzeerd is en de gebruiker hem NIET vasthoudt
      if (!isPausedRef.current && !isDownPCRef.current && container) {
        currentScrollLeft += 1

        if (currentScrollLeft >= container.scrollWidth / 2) {
          currentScrollLeft = 0
        }

        container.scrollLeft = currentScrollLeft
      } else if (container) {
        currentScrollLeft = container.scrollLeft
      }
      requestRef.current = requestAnimationFrame(render)
    }

    requestRef.current = requestAnimationFrame(render)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [loading, images])

  // 3. Klik op miniatuur (Centreren)
  const handleThumbClick = (index: number) => {
    setActiveIndex(index)
    isPausedRef.current = true

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const items = container.children
      const targetItem = items[index] as HTMLElement

      if (targetItem) {
        const containerWidth = container.clientWidth
        const itemWidth = targetItem.clientWidth
        const itemOffset = targetItem.offsetLeft
        const scrollToX = itemOffset - (containerWidth / 2) + (itemWidth / 2)

        container.scrollTo({
          left: scrollToX,
          behavior: 'smooth',
        })
      }
    }

    resetAutoScrollTimer()
  }

  // Timer om na handmatige acties na 3 seconden weer te gaan scrollen
  const resetAutoScrollTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      isPausedRef.current = false
    }, 3000)
  }

  // 4. Momentum voor Miniaturen (MC)
  const beginMCMomentumLoop = (container: HTMLDivElement) => {
    cancelMCMomentum()
    const loop = () => {
      container.scrollLeft += velXMCRef.current
      velXMCRef.current *= 0.95

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft -= container.scrollWidth / 2
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += container.scrollWidth / 2
      }

      if (Math.abs(velXMCRef.current) > 0.5) {
        momentumIdMCRef.current = requestAnimationFrame(loop)
      }
    }
    momentumIdMCRef.current = requestAnimationFrame(loop)
  }

  const cancelMCMomentum = () => {
    if (momentumIdMCRef.current) cancelAnimationFrame(momentumIdMCRef.current)
  }

// 5. Momentum voor Grote Carrousel (PC) met vloeiende overgang naar auto-scroll
  const beginPCMomentumLoop = (container: HTMLDivElement) => {
    cancelPCMomentum()
    const loop = () => {
      container.scrollLeft += velXPCRef.current
      velXPCRef.current *= 0.95 // Wrijving remt de zwiep af

      // Oneindige loop check tijdens het uitrollen
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft -= container.scrollWidth / 2
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += container.scrollWidth / 2
      }

      // De "Vloeiende Overloop" Logica:
      // Als de zwiep-snelheid is afgeremd tot onder de 2.2, haken we de auto-scroll er weer in.
      // We checken Math.abs voor het geval er naar rechts (negatieve velocity) gesleept is.
      if (Math.abs(velXPCRef.current) > 2.2) {
        momentumIdPCRef.current = requestAnimationFrame(loop)
      } else {
        // Zodra de snelheden matchen, zetten we isPausedRef weer op false.
        // De carrousel pakt de beweging vanaf deze exacte snelheid en positie direct weer op!
        isPausedRef.current = false
      }
    }
    momentumIdPCRef.current = requestAnimationFrame(loop)
  }

  const cancelPCMomentum = () => {
    if (momentumIdPCRef.current) cancelAnimationFrame(momentumIdPCRef.current)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      cancelMCMomentum()
      cancelPCMomentum()
    }
  }, [])

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center bg-transparent">
        <div className="text-stone-400 text-sm tracking-widest uppercase animate-pulse">
          Kunstwerken laden...
        </div>
      </div>
    )
  }

  if (images.length === 0) return null

  return (
    <div className="w-full bg-transparent py-4 overflow-hidden select-none">

      <style>{`
        .remove-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>

      {/* 1. GROTE CARROUSEL (PC - Nu mét Drag & Momentum!) */}
      <div className="relative w-full min-h-[50vh] flex items-center overflow-hidden bg-transparent">
        <div
          ref={scrollContainerRef}
          className="flex w-max overflow-x-auto bg-transparent remove-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={(e) => {
            isDownPCRef.current = true
            isPausedRef.current = true // Stop de automatische loop direct
            cancelPCMomentum()
            const container = e.currentTarget
            container.classList.remove('scroll-smooth')
            startXPCRef.current = e.pageX - container.offsetLeft
            scrollLeftPCRef.current = container.scrollLeft
            velXPCRef.current = 0
          }}
          onMouseLeave={() => {
            if (!isDownPCRef.current) return
            isDownPCRef.current = false
            if (scrollContainerRef.current) beginPCMomentumLoop(scrollContainerRef.current)
          }}
          onMouseUp={() => {
            if (!isDownPCRef.current) return
            isDownPCRef.current = false
            if (scrollContainerRef.current) beginPCMomentumLoop(scrollContainerRef.current)
          }}
          onMouseMove={(e) => {
            if (!isDownPCRef.current || !scrollContainerRef.current) return
            e.preventDefault()
            const container = scrollContainerRef.current
            const x = e.pageX - container.offsetLeft
            const walk = (x - startXPCRef.current) * 1.2

            const prevScrollLeft = container.scrollLeft
            container.scrollLeft = scrollLeftPCRef.current - walk
            velXPCRef.current = container.scrollLeft - prevScrollLeft

            // Oneindige drag reset
            if (container.scrollLeft >= container.scrollWidth / 2) {
              container.scrollLeft -= container.scrollWidth / 2
              scrollLeftPCRef.current -= container.scrollWidth / 2
            } else if (container.scrollLeft <= 0) {
              container.scrollLeft += container.scrollWidth / 2
              scrollLeftPCRef.current += container.scrollWidth / 2
            }
          }}
          onTouchStart={() => {
            isPausedRef.current = true
            cancelPCMomentum()
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
          }}
          onTouchEnd={() => {
            resetAutoScrollTimer()
          }}
        >
          {marqueeImages.map((img, index) => {
            const isPortrait = (img.width || 1) < (img.height || 1)
            const widthClass = isPortrait
              ? "w-full landscape:w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4"
              : "w-full landscape:w-full sm:w-full md:w-2/3 lg:w-1/2"

            return (
              <div
                key={`marquee-${img.publicId}-${index}`}
                className={`${widthClass} shrink-0 px-3 md:px-6 py-4 flex justify-center bg-transparent`}
              >
                <div className="relative w-full aspect-[4/5] md:aspect-[16/9] max-h-[70vh] rounded-xl overflow-hidden bg-stone-100/30 shadow-md">
                  <CldImage
                    src={img.publicId}
                    fill
                    alt={img.title || "Arne van der Ree Kunstwerk"}
                    className="object-cover pointer-events-none"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. ONEINDIGE THUMBNAIL NAVIGATOR (MC) */}
      <div className="mt-6 px-4 bg-transparent">
        <div
          ref={thumbContainerRef}
          className="flex gap-2 overflow-x-auto pb-2 bg-transparent cursor-grab active:cursor-grabbing remove-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          onMouseDown={(e) => {
            isDownMCRef.current = true
            cancelMCMomentum()
            const container = e.currentTarget
            startXMCRef.current = e.pageX - container.offsetLeft
            scrollLeftMCRef.current = container.scrollLeft
            velXMCRef.current = 0
          }}
          onMouseLeave={() => {
            if (!isDownMCRef.current) return
            isDownMCRef.current = false
            if (thumbContainerRef.current) beginMCMomentumLoop(thumbContainerRef.current)
          }}
          onMouseUp={() => {
            if (!isDownMCRef.current) return
            isDownMCRef.current = false
            if (thumbContainerRef.current) beginMCMomentumLoop(thumbContainerRef.current)
          }}
          onMouseMove={(e) => {
            if (!isDownMCRef.current || !thumbContainerRef.current) return
            e.preventDefault()
            const container = thumbContainerRef.current
            const x = e.pageX - container.offsetLeft
            const walk = (x - startXMCRef.current) * 1.2

            const prevScrollLeft = container.scrollLeft
            container.scrollLeft = scrollLeftMCRef.current - walk
            velXMCRef.current = container.scrollLeft - prevScrollLeft

            if (container.scrollLeft >= container.scrollWidth / 2) {
              container.scrollLeft -= container.scrollWidth / 2
              scrollLeftMCRef.current -= container.scrollWidth / 2
            } else if (container.scrollLeft <= 0) {
              container.scrollLeft += container.scrollWidth / 2
              scrollLeftMCRef.current += container.scrollWidth / 2
            }
          }}
        >
          {marqueeImages.map((img, index) => {
            const realIndex = index % images.length

            return (
              <button
                key={`thumb-${img.publicId}-${index}`}
                onClick={() => {
                  if (Math.abs(velXMCRef.current) < 2) {
                    scrollContainerRef.current?.classList.add('scroll-smooth')
                    thumbContainerRef.current?.classList.add('scroll-smooth')

                    handleThumbClick(realIndex)
                    setActiveIndex(realIndex)

                    setTimeout(() => {
                      scrollContainerRef.current?.classList.remove('scroll-smooth')
                      thumbContainerRef.current?.classList.remove('scroll-smooth')
                    }, 500)
                  }
                }}
                className={`relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-md overflow-hidden bg-stone-200/50 transition-all ${
                  activeIndex === realIndex && isPausedRef.current
                    ? 'ring-2 ring-stone-900 opacity-100 scale-95'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <CldImage
                  src={img.publicId}
                  fill
                  alt={`Miniatuur ${realIndex + 1}`}
                  className="object-cover pointer-events-none"
                />
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
