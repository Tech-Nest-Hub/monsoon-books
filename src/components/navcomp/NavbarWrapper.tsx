'use client'

import React, { useEffect, useState } from 'react'

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [shouldHideTopBar, setShouldHideTopBar] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Handle top bar hide/show based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down & past 50px - hide top bar
        setShouldHideTopBar(true)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show top bar
        setShouldHideTopBar(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const childrenArray = React.Children.toArray(children)
  
  return (
    <>
      {/* Topthinbar - not sticky, just animated */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          shouldHideTopBar 
            ? '-translate-y-full opacity-0 pointer-events-none hidden' 
            : 'translate-y-0 opacity-100'
        }`}
      >
        {childrenArray[0]}
      </div>
      
      {/* Bottomthickbar - this is the sticky element */}
      <div className="sticky top-0 z-50">
        {childrenArray[1]}
      </div>
    </>
  )
}