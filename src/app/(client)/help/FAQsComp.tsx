// components/FAQsComp.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { QueryData, topQueries } from './FAQsQueries'

const FAQItem = ({ query, answer, index }: QueryData & { index: number }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (itemRef.current) {
      observer.observe(itemRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={itemRef}
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900">{query}</span>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" />
          )}
        </button>

        {isOpen && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 animate-fadeIn">
            <p className="text-gray-700 leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const FAQsHeader = ({ 
  headerRef, 
  headerVisible 
}: { 
  headerRef: React.RefObject<HTMLDivElement | null>; 
  headerVisible: boolean;
}) => {
  return (
    <div
      ref={headerRef}
      className={`text-center mb-10 transition-all duration-700 ease-out ${
        headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Frequently Asked Questions
      </h1>
      <p className="text-lg text-gray-600">
        Find answers to common questions about Monsoon Books
      </p>
    </div>
  )
}

export const FAQsList = ({ 
  filteredQueries, 
  searchTerm 
}: { 
  filteredQueries: QueryData[]; 
  searchTerm: string;
}) => {
  return (
    <div className="space-y-3">
      {filteredQueries.length > 0 ? (
        filteredQueries.map((query, index) => (
          <FAQItem key={index} {...query} index={index} />
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No results found for "{searchTerm}"</p>
          <p className="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
        </div>
      )}
    </div>
  )
}

export default function FAQsComp() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredQueries, setFilteredQueries] = useState<QueryData[]>(topQueries)
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

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === '') {
      setFilteredQueries(topQueries)
    } else {
      const filtered = topQueries.filter(q =>
        q.query.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredQueries(filtered)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with fade-in */}
        <FAQsHeader headerRef={headerRef} headerVisible={headerVisible} />

        {/* Search Bar with fade-in */}
        <div
          className={`mb-8 transition-all duration-700 delay-200 ease-out ${
            headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for your question..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* FAQ List */}
        <FAQsList filteredQueries={filteredQueries} searchTerm={searchTerm} />
      </div>
    </div>
  )
}