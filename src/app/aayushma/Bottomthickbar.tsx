import React from 'react'

const Bottomthickbar = () => {
  return (
    <div className="bg-red-950 shadow-md flex flex-col gap-4 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="text-orange-600 text-3xl font-extrabold">Monsoon</div>
          <div className="text-white text-lg font-semibold">Books</div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-white">
          <span className="hover:text-orange-500 cursor-pointer">Wishlist</span>
          <span className="hover:text-orange-500 cursor-pointer">Account</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full max-w-4xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              className="w-full rounded-full border border-orange-7950 bg-white px-5 py-3 text-black focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-700"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bottomthickbar
