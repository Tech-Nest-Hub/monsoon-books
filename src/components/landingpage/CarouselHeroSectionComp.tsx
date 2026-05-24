import * as React from "react"

import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const heroSlides = [
  { title: "Big Sale — Up to 50% off", description: "Limited time offers on selected titles" },
  { title: "New Arrivals", description: "Fresh books from top authors" },
  { title: "Staff Picks", description: "Curated recommendations for you" },
]

export function CarouselSpacing() {
  return (
    <Carousel className="w-full">
      <CarouselContent className="w-full">
        {heroSlides.map((slide, index) => (
          <CarouselItem key={index} className="basis-full">
            <Card className="min-h-[28rem] overflow-hidden rounded-2xl bg-red-700 text-white shadow-2xl">
              <CardContent className="flex h-full flex-col justify-between gap-6 p-8 md:p-10">
                <div className="space-y-3">
                  <CardTitle className="text-3xl font-semibold leading-tight md:text-4xl">{slide.title}</CardTitle>
                  <CardDescription className="max-w-sm text-sm text-white/90 md:text-base">{slide.description}</CardDescription>
                </div>
                <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/80 shadow-sm">Explore now</div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
