"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccountButton } from './AccountButton'
import { WishlistButton } from '../../app/(client)/(profilesettings)/wishlist/WishlistButton'
import { CartButton } from '../../app/(client)/(profilesettings)/cart/CartButton'
import Image from 'next/image'
import Link from 'next/link'
import { UserCog } from 'lucide-react'

type Props = {
  user: {
    firstName: string | null
    lastName: string | null
    email: string
    role?: string
  } | null
}

const Bottomthickbar = ({ user }: Props) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const isAdmin = user?.role === "ADMIN"

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4 lg:gap-6">

          {/* Logo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <Image
                src="/LOGO_MONSOON-01.png"
                alt="Monsoon Books Logo"
                width={70}
                height={70}
              />
              <span className="text-primary text-2xl font-extrabold tracking-tight leading-none">
                <span className="text-primary">
                  M
                </span>
                <span className="text-secondary">
                  o
                </span>
                <span className="text-primary">
                  ns
                </span>
                <span className="text-secondary">
                  oo
                </span>
                <span className="text-primary">
                  n
                </span>
              </span>
              <span className="text-xl font-bold leading-none mt-1">
                
                <span className="text-primary">
                  B
                </span><span className="text-secondary">
                  oo
                </span>
                <span className="text-primary">
                  ks
                </span>
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 hidden sm:flex items-center border-2 border-primary/70 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
            <input
              type="text"
              placeholder="Search books, authors, ISBN…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
              className="flex-1 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-white"
            />
            <button
              onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
              className="bg-primary/90  hover:bg-primary text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            {isAdmin && (
              <><Link
                href="/dashboard"
                className="hidden sm:flex flex-col items-center gap-0.5 px-3 py-2 rounded-md hover:bg-purple-50 hover:text-primary text-gray-600 transition-colors group"
              >
                <UserCog className="w-5 h-5 inline-block mr-1" />
              </Link>
                <span className="text-primary select-none">|</span>
              </>
            )}

            {/* Wishlist */}
            <WishlistButton user={user} />

            {/* Account */}
            <AccountButton user={user} />

            {/* Cart */}
            <CartButton user={user} />

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
          <div className="sm:hidden mt-3 flex items-center border-2 border-primary/70 rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search books, authors…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
            />
            <button className="bg-primary/90  hover:bg-primary text-white px-4 py-2.5" onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}>
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