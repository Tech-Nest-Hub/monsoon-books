import React from 'react'

const Topthinbar = () => {
  return (
    <div className="bg-red-950 text-white text-xs sm:text-sm flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-6 py-2 gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <button className="font-semibold hover:text-orange-200">SAVE MORE ON APP</button>
        <button className="font-semibold hover:text-orange-200">BECOME A SELLER</button>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-white/90">
        <button className="hover:text-white">HELP & SUPPORT</button>
        <button className="hover:text-white">LOGIN</button>
        <button className="hover:text-white">भाषा परिवर्तन</button>
      </div>
    </div>
  )
}

export default Topthinbar

