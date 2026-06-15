// Some other page
'use client'
import { useRef, useState, useEffect } from 'react'
import { FAQsHeader, FAQsList } from './FAQsComp'
import { topQueries } from './FAQsQueries'

export default function CustomFAQPage() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FAQsHeader headerRef={headerRef} headerVisible={headerVisible} />
      <FAQsList filteredQueries={topQueries} searchTerm="" />
    </section>
  )
}