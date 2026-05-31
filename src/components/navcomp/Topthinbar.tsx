'use client'
import React, { useState, useRef, useEffect } from 'react'
import CustomLink from '@/components/manual-ui/CustomLink'

const Topthinbar = () => {
  const [isLangOpen, setIsLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="hidden md:block text-white text-xs">
      <div className="container mx-auto px-4 sm:px-6 py-1.5">
        <div className="flex items-center justify-end gap-5">

          <CustomLink
            href="/app"
            title="Save more on app"
            className="text-white hover:text-red-200 font-medium"
            underlineClassName="bg-white"
          />

          <span className="text-red-500 select-none">|</span>

          <CustomLink
            href="/sell"
            title="Become a seller"
            className="text-white hover:text-red-200 font-medium"
            underlineClassName="bg-white"
          />

          <span className="text-red-500 select-none">|</span>

          <CustomLink
            href="/help"
            title="Help & support"
            className="text-white hover:text-red-200"
            underlineClassName="bg-white"
          />

          <span className="text-red-500 select-none">|</span>

          <CustomLink
            href="/track"
            title="Track order"
            className="text-white hover:text-red-200"
            underlineClassName="bg-white"
          />

          <span className="text-red-500 select-none">|</span>

          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-expanded={isLangOpen}
              aria-haspopup="listbox"
              className="flex items-center hover:cursor-pointer gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-0.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              भाषा
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLangOpen && (
              <div
                role="listbox"
                className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100"
              >
                {[['🇳🇵', 'नेपाली'], ['🇬🇧', 'English']].map(([flag, label]) => (
                  <button
                    key={label}
                    role="option"
                    onClick={() => setIsLangOpen(false)}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-700 text-sm transition-colors"
                  >
                    <span>{flag}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Topthinbar