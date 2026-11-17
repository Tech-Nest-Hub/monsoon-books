"use client"

import React from "react"
import CustomLink from "@/components/manual-ui/CustomLink"

const Topthinbar = () => {
  return (
    <div className="hidden md:block bg-primary text-white text-xs">
      <div className="container mx-auto px-4 sm:px-6 py-1.5">
        <div className="flex items-center justify-between">

          {/* Left side */}
          <div className="flex items-center gap-5">
            <span className="whitespace-nowrap">
              SUPPORT: +977 98-51000689
            </span>

            <span className="text-white/60">|</span>

            <span className="whitespace-nowrap">
              FREE SHIPPING ON ORDERS ABOVE RS. 1000
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-5">

            <CustomLink
              href="/faq"
              title="FAQ"
              className="text-white hover:text-purple-100 font-medium"
              underlineClassName="bg-white"
            />

            <span className="text-white/60">|</span>

            <span className="whitespace-nowrap">
              AUTHENTIC BOOKS ONLY
            </span>

            <span className="text-white/60">|</span>

            <CustomLink
              href="/coming-soon"
              title="SAVE MORE ON APP"
              className="text-white hover:text-purple-100 font-medium"
              underlineClassName="bg-white"
            />

          </div>

        </div>
      </div>
    </div>
  )
}

export default Topthinbar