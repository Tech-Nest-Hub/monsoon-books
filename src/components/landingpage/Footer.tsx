'use client'
import Image from "next/image"
import CustomLink from "../manual-ui/CustomLink"

export function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200/60 relative overflow-hidden">
      {/* Subtle modern background gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-50/50 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Section */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-20 z-10">
        <div className="grid gap-12 md:gap-8 md:grid-cols-4">
          
          {/* Brand Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-[#c10617] rounded-full group-hover:bg-[#a00513] transition-colors duration-300">
                <Image 
                  src="/Monsoon_Books_Logo_Black_&_White.jpeg" 
                  alt="Monsoon Books Logo" 
                  width={50} 
                  height={50} 
                  className="rounded-full"
                />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Monsoon <span className="text-[#c10617] font-medium">Books</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-slate-500">
              Discover thousands of books across all genres. Fast shipping, authentic collections, and exceptional customer service.
            </p>
            {/* Minimalist Social Icons */}
            <div className="flex gap-2.5 pt-1">
              {['facebook', 'instagram', 'twitter'].map((platform, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-200/60"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    {platform === 'facebook' && <path d="M8.29 20v-7.21H5.413V9.25h2.877V7.062c0-2.846 1.714-4.398 4.277-4.398 1.217 0 2.266.091 2.568.132v2.975h-1.762c-1.382 0-1.649.657-1.649 1.62v2.127h3.297l-4.293 3.53V20" />}
                    {platform === 'instagram' && <path d="M7.75 2A5.75 5.75 0 002 7.75v4.5A5.75 5.75 0 007.75 18h4.5A5.75 5.75 0 0018 12.25v-4.5A5.75 5.75 0 0012.25 2h-4.5zM10 7a3 3 0 110 6 3 3 0 010-6zm4.25-.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z" />}
                    {platform === 'twitter' && <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 01.77 16.251a11.616 11.616 0 006.29 1.85" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Books, Search, Profile, Wishlist, Order */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Books', href: '/books' },
                { label: 'Search', href: '/search' },
                { label: 'Profile', href: '/profile' },
                { label: 'Wishlist', href: '/wishlist' },
                { label: 'Orders', href: '/orders' }
              ].map((link, i) => (
                <li key={i}>
                  <CustomLink
                    href={link.href}
                    title={link.label}
                    className="text-slate-500 hover:text-slate-900 font-medium transition-colors duration-200"
                    underlineClassName="bg-[#c10617]"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-5">Support</h3>
            <ul className="space-y-3 text-sm">
              {['Help Center', 'Shipping Info', 'Returns Policy', 'Contact Us'].map((text, i) => (
                <li key={i}>
                  <CustomLink
                    href="#"
                    title={text}
                    className="text-slate-500 hover:text-slate-900 font-medium transition-colors duration-200"
                    underlineClassName="bg-[#c10617]"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box (Modern Card Design) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Subscribe</h3>
              <p className="text-xs text-slate-500 leading-5">Get exclusive deals and weekly updates.</p>
            </div>
            <div className="space-y-2">
              <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-[#c10617]/20 focus-within:border-[#c10617] transition-all duration-300">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="flex-1 px-3 py-2 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
                />
                <button className="px-4 py-2 bg-[#c10617] text-white hover:bg-[#a00513] transition-colors flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7m0 0l-7 7m7-7H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="my-10 h-px bg-slate-200/60"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <div className="flex gap-6 flex-wrap justify-center sm:justify-start">
            <CustomLink
              href="/privacy"
              title="Privacy Policy"
              className="hover:text-slate-900 transition-colors"
              underlineClassName="bg-slate-400"
            />
            <CustomLink
              href="/terms"
              title="Terms & Conditions"
              className="hover:text-slate-900 transition-colors"
              underlineClassName="bg-slate-400"
            />
            <CustomLink
              href="/deldata"
              title="User Data Deletion"
              className="hover:text-slate-900 transition-colors"
              underlineClassName="bg-slate-400"
            />
          </div>
          <p className="text-center sm:text-right text-slate-400">
            © 2026 Monsoon Books
          </p>
        </div>
      </div>

      {/* Floating Bottom Promo Bar */}
      <div className="bg-[#c10617] text-white py-3 px-4 text-center text-xs font-bold tracking-wider">
        <CustomLink
          href="/app"
          title="FREE SHIPPING ON ORDERS ABOVE ₹500 | AUTHENTIC BOOKS ONLY ✨"
          className="text-white hover:text-red-200 font-medium"
          underlineClassName="bg-white"
        />
      </div>
    </footer>
  )
}