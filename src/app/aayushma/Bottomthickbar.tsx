'use client'
import React, { useState } from 'react'
import { AccountButton } from './AccountButton'

type Props = {
  user: {
    firstName: string | null
    lastName: string | null
    email: string
  } | null
}

const Bottomthickbar = ({ user }: Props) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4 lg:gap-6">

          {/* Logo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-red-700 text-2xl font-extrabold tracking-tight leading-none">Monsoon</span>
            <span className="text-gray-500 text-sm font-medium leading-none mt-1">Books</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 hidden sm:flex items-center border-2 border-red-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-red-200 transition-shadow">
            <input
              type="text"
              placeholder="Search books, authors, ISBN…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && console.log('search:', searchQuery)}
              className="flex-1 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-white"
            />
            <button
              onClick={() => console.log('search:', searchQuery)}
              className="bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">

            {/* Wishlist */}
            <button className="hidden sm:flex flex-col items-center gap-0.5 px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-700 text-gray-600 transition-colors group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-[10px] font-medium">Wishlist</span>
            </button>

            {/* Account */}
            <AccountButton user={user} />

            {/* Cart */}
            <button className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-700 text-gray-600 transition-colors relative group">
              <span className="relative">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-6" />
                </svg>
                <span className="absolute -top-2 -right-2.5 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  2
                </span>
              </span>
              <span className="text-[10px] font-medium">Cart</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-3 flex items-center border-2 border-red-700 rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search books, authors…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
            />
            <button className="bg-red-700 text-white px-4 py-2.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bottomthickbar