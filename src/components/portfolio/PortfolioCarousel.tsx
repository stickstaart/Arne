"use client"

import { useState, useRef, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import { getPortfolioImages } from '@/lib/cloudinary-actions'
import { CloudinaryResource } from '@/types'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

export default function PortfolioCarousel() {
  const [images, setImages] = useState<CloudinaryResource[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [selectedImage, setSelectedImage] = useState<CloudinaryResource | null>(null)

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

  // Grote carrousel (PC) automatische loop
  useEffect(() => {
    if (loading || images.length === 0) return

    const container = scrollContainerRef.current
    if (!container) return

    let currentScrollLeft = container.scrollLeft

    const render = () => {
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

  // Klik op miniatuur
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

  const resetAutoScrollTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      isPausedRef.current = false
    }, 3000)
  }

  // Momentum voor Miniaturen
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

  // Momentum voor Grote Carrousel
  const beginPCMomentumLoop = (container: HTMLDivElement) => {
    cancelPCMomentum()
    const loop = () => {
      container.scrollLeft += velXPCRef.current
      velXPCRef.current *= 0.95

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft -= container.scrollWidth / 2
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += container.scrollWidth / 2
      }

      if (Math.abs(velXPCRef.current) > 2.2) {
        momentumIdPCRef.current = requestAnimationFrame(loop)
      } else {
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

      {/* 1. GROTE CARROUSEL */}
      <div className="relative w-full min-h-[50vh] flex items-center overflow-hidden bg-transparent">
        <div
          ref={scrollContainerRef}
          className="flex w-max items-center overflow-x-auto bg-transparent remove-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={(e) => {
            isDownPCRef.current = true
            isPausedRef.current = true
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
            return (
              <div
                key={`marquee-${img.publicId}-${index}`}
                className="shrink-0 px-3 md:px-6 py-4 flex justify-center items-center bg-transparent"
                style={{ height: '60vh' }}
              >
                <div
                  onClick={() => {
                    if (Math.abs(velXPCRef.current) < 2) {
                      setSelectedImage(img)
                    }
                  }}
                  className="relative h-full w-auto max-w-[85vw] md:max-w-[70vw] rounded-xl overflow-hidden bg-stone-100/30 shadow-md transition-transform duration-300 hover:scale-[1.01] cursor-pointer"
                >
                  <CldImage
                    src={img.publicId}
                    width={img.width || 1200}
                    height={img.height || 1200}
                    alt={img.title || "Arne van der Ree Kunstwerk"}
                    className="h-full w-auto object-contain pointer-events-none"
                    priority={index === 0}
                    sizes="(max-width: 768px) 85vw, 60vw"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. MINIATUUR NAVIGATOR */}
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

      {/* 3. LIGHTBOX MODAL MET DRAG, PINCH-ZOOM EN +, - KNOPPEN */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center overflow-hidden select-none">
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={4}
            centerOnInit
            limitToBounds={true}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* ACTIEBALK RECHTSBOVEN (+, -, Reset, Sluiten) */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 md:gap-3 z-50">
                  <button
                    onClick={() => zoomIn()}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 text-lg transition-all active:scale-95"
                    aria-label="Inzoomen"
                  >
                    +
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 text-lg transition-all active:scale-95"
                    aria-label="Uitzoomen"
                  >
                    &minus;
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="px-3 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 text-xs uppercase tracking-wider transition-all active:scale-95"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-2xl font-light transition-all active:scale-95 ml-2"
                    aria-label="Sluiten"
                  >
                    &times;
                  </button>
                </div>

                {/* AFBEELDING CONTAINER MET CORRECTE BOUNDS */}
                <div className="w-screen h-screen flex items-center justify-center p-4 md:p-12">
                  <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                    contentStyle={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="relative max-w-full max-h-full flex items-center justify-center">
                      <CldImage
                        src={selectedImage.publicId}
                        width={selectedImage.width || 2400}
                        height={selectedImage.height || 2400}
                        alt={selectedImage.title || "Arne van der Ree Vergroot"}
                        className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-sm shadow-2xl pointer-events-auto cursor-grab active:cursor-grabbing"
                        priority
                      />
                    </div>
                  </TransformComponent>
                </div>
              </>
            )}
          </TransformWrapper>
        </div>
      )}

    </div>
  )
}
