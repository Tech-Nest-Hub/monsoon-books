// Navbar.tsx (Combined)
'use client'
import React, { useState, useEffect } from 'react'
import Topthinbar from "./Topthinbar"
import Bottomthickbar from "./Bottomthickbar"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`sticky bg-red-700 top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-2xl' : 'shadow-md'}`}>
      <Topthinbar />
      <Bottomthickbar user={{ firstName: "Aakash", lastName: "Sharma", email: "aakash@example.com" }} />
    </div>
  )
}

export default Navbar