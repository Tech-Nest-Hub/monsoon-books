"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselIndicators,
} from "@/components/ui/carousel"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const heroSlides = [
  { 
    title: "Big Sale — Up to 50% off", 
    subtitle: "Grab your favorite books before they're gone",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1600&auto=format&fit=crop",
    badge: "Limited Time"
  },
  { 
    title: "New Arrivals", 
    subtitle: "Discover the latest books from top authors",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1600&auto=format&fit=crop",
    badge: "Just In"
  },
  { 
    title: "Staff Picks", 
    subtitle: "Our team's favorite reads of the month",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop",
    badge: "Curated"
  },
]

export function CarouselSpacing() {
  const [api, setApi] = React.useState<any>()
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [isHovering, setIsHovering] = React.useState(false)

  React.useEffect(() => {
    if (!api) return

    const updateButtons = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    updateButtons()
    api.on("select", updateButtons)
    api.on("reInit", updateButtons)

    return () => {
      api.off("select", updateButtons)
      api.off("reInit", updateButtons)
    }
  }, [api])

  return (
    <div 
      className="relative w-full mx-auto group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Carousel 
        className="w-full" 
        setApi={setApi}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="relative overflow-hidden rounded-2xl h-[250px] md:h-[400px] lg:h-[500px]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                
                <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-16">
                  <div className="max-w-2xl space-y-4 md:space-y-6">
                    <span className="inline-block text-xs md:text-sm uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full w-fit">
                      {slide.badge}
                    </span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-sm md:text-base text-white/80 max-w-lg">
                      {slide.subtitle}
                    </p>
                    <button className="mt-2 md:mt-4 px-6 md:px-8 py-2 md:py-3 bg-white text-gray-900 rounded-full font-semibold text-sm md:text-base hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Shop Now →
                    </button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselIndicators className="bottom-4 md:bottom-6" />
      </Carousel>

      {/* Left Button - Tall rectangular shape */}
      <button
        onClick={() => api?.scrollPrev()}
        disabled={!canScrollPrev}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2",
          "h-24 md:h-32 w-10 md:w-12",
          "bg-black/50 backdrop-blur-sm",
          "text-white",
          "transition-all duration-300 ease-in-out",
          "flex items-center justify-center",
          "hover:bg-black/80 hover:w-14 md:hover:w-16",
          "disabled:opacity-0 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-white/50",
          "rounded-r-lg",
          "z-10",
          !isHovering && "opacity-0",
          isHovering && "opacity-100"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
      </button>

      {/* Right Button - Tall rectangular shape */}
      <button
        onClick={() => api?.scrollNext()}
        disabled={!canScrollNext}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2",
          "h-24 md:h-32 w-10 md:w-12",
          "bg-black/50 backdrop-blur-sm",
          "text-white",
          "transition-all duration-300 ease-in-out",
          "flex items-center justify-center",
          "hover:bg-black/80 hover:w-14 md:hover:w-16",
          "disabled:opacity-0 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-white/50",
          "rounded-l-lg",
          "z-10",
          !isHovering && "opacity-0",
          isHovering && "opacity-100"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
      </button>
    </div>
  )
}