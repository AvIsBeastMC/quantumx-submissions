import React from "react"

export default function Navbar() {

  return (
    <div className="items-center justify-between flex-row sticky z-50 flex mx-auto w-2/3 rounded-md top-5 mt-4 bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-xl py-2 px-8">
      <div className="flex flex-row items-center gap-3 font-bold">
        <img className="w-8" src="https://register.thequantumx.xyz/icon2.png" alt="" />
        QUANTUMX SUBMISSIONS
      </div>
      <div className="">
        <a href="https://discord.gg/cxYrZ3qx4W" target="_blank" className="bg-gray-600 rounded-md px-4 py-1.5 hover:opacity-75 transition-all flex flex-row items-center gap-3 text-md">
          <img className="w-7" src="https://cdn.simpleicons.org/discord/FFFFFF" alt="" />
          Discord Server
        </a>
      </div>
    </div>
  )
}