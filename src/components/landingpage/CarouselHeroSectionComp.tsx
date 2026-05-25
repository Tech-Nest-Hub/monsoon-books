import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselIndicators,
} from "@/components/ui/carousel"

const heroSlides = [
  { 
    title: "Big Sale — Up to 50% off", 
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1600&auto=format&fit=crop" 
  },
  { 
    title: "New Arrivals", 
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1600&auto=format&fit=crop" 
  },
  { 
    title: "Staff Picks", 
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600&auto=format&fit=crop" 
  },
]

export function CarouselSpacing() {
  return (
    <Carousel className="w-full mx-auto relative group">
      <CarouselContent>
        {heroSlides.map((slide, index) => (
          <CarouselItem key={index} className="basis-full">
            <div className="relative overflow-hidden rounded-none h-[210px] md:h-[320px] lg:h-[420px] transition-all">
              {/* Image element */}
              <img
                src={slide.image}
                alt={slide.title}
                className="object-cover w-full h-full brightness-[0.85] contrast-[1.05]"
              />
              
              {/* Beautiful, text-readable overlay styling */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex items-end p-6 md:p-12">
                <div className="text-white space-y-2">
                  <span className="inline-block text-xs uppercase tracking-widest bg-red-600 px-2.5 py-1 font-bold rounded-sm">
                    {index === 0 ? "Limited Time" : index === 1 ? "Just In" : "Curated"}
                  </span>
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {/* Navigation controls positioned nicely */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
        <CarouselPrevious className="pointer-events-auto bg-white/90 hover:bg-white text-slate-800 shadow transition-opacity opacity-0 group-hover:opacity-100 border-none" />
        <CarouselNext className="pointer-events-auto bg-white/90 hover:bg-white text-slate-800 shadow transition-opacity opacity-0 group-hover:opacity-100 border-none" />
      </div>
      
      {/* Positioned indicator dots near the bottom bar */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center z-10">
        <CarouselIndicators />
      </div>
    </Carousel>
  )
}