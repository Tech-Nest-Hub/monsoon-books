// NavbarWrapper.tsx
'use client'

import React, { useEffect, useState } from 'react'

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Extract children to show/hide Topthinbar based on scroll
  const childrenArray = React.Children.toArray(children)
  
  return (
    <div
      className={`sticky bg-red-700 top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-2xl' : 'shadow-md'
      }`}
    >
      {/* Hide Topthinbar when scrolled */}
      {!isScrolled && childrenArray[0]}
      {/* Always show Bottomthickbar */}
      {childrenArray[1]}
    </div>
  )
}