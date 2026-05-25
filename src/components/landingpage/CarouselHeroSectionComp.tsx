import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const heroSlides = [
  { title: "Big Sale — Up to 50% off", image: "https://media.istockphoto.com/id/1411701868/photo/magic-book-with-glitter-open-book-with-lights-glowing-in-dark-background.jpg?s=612x612&w=0&k=20&c=-vGSj8f8tj6Zbj2mDZCABgP50rcLjqWw-KwxgDA2cYc=" },
  { title: "New Arrivals", image: "https://grey.com.np/cdn/shop/collections/new-arrivals-books_cf34d155-c79f-4712-83fd-9c418fceef1e.png?v=1762939391" },
  { title: "Staff Picks", image: "https://www.thegoodbook.co.uk/downloads/staffpicks.jpg" },
]

export function CarouselSpacing() {
  return (
    <Carousel className="w-full max-w-4xl mx-auto">
      <CarouselContent>
        {heroSlides.map((slide, index) => (
          <CarouselItem key={index} className="basis-full">
            {/* Removed heavy shadow + better styling */}
            <div className="overflow-hidden rounded-2xl h-[250px] shadow-md hover:shadow-lg transition-shadow">
              <img
                src={slide.image}
                alt={slide.title}
                className="object-cover w-full h-full"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}