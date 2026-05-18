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

  return (
    <div
      className={`sticky bg-red-700 top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-2xl' : 'shadow-md'
      }`}
    >
      {children}
    </div>
  )
}