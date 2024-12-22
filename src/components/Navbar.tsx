import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, cn } from "@nextui-org/react"
import { ChevronDown, ListCheck } from "lucide-react"
import React from "react"
import { Inter } from "~/pages/_app"
import Typewriter from 'typewriter-effect'

export default function Navbar() {
  return (
    <div className="items-center justify-between flex-row sticky z-50 flex mx-auto w-2/3 rounded-md top-5 mt-4 bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-xl py-2 px-8">
      <div className="flex flex-row items-center gap-3 font-bold">
        <img className="w-8" src="https://register.thequantumx.xyz/icon2.png" alt="" />
        <Typewriter options={{
          strings: 'QUANTUMX SUBMISSIONS',
          autoStart: true,
          loop: true,
          delay:50,
          deleteSpeed: 150
        }} />
      </div>
      <div className="flex md:hidden">
        <Dropdown>
          <DropdownTrigger>
            <ChevronDown />
          </DropdownTrigger>
          <DropdownMenu className={cn(Inter.className)} aria-label="Static Actions">
            <DropdownItem>
              <a href="https://discord.gg/cxYrZ3qx4W" target="_blank" className="rounded-md hover:opacity-75 transition-all flex flex-row items-center gap-3 text-md">
                <ListCheck className="w-7" />
                <span>Registrations Portal <span className="text-red-400">(closing soon!)</span></span>
              </a>
            </DropdownItem>
            <DropdownItem>
              <a href="https://discord.gg/cxYrZ3qx4W" target="_blank" className="rounded-md hover:opacity-75 transition-all flex flex-row items-center gap-3 text-md">
                <img className="w-6" src="https://cdn.simpleicons.org/discord/000000" alt="" />
                Discord Server
              </a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="hidden md:flex gap-6">
        <a href="https://register.thequantumx.xyz/" target="_blank" className="rounded-md hover:opacity-75 transition-all flex flex-row items-center gap-3 text-md">
          <ListCheck className="w-7" />
          <span>Registrations Portal</span>
        </a>
        <a href="https://discord.gg/cxYrZ3qx4W" target="_blank" className="rounded-md hover:opacity-75 transition-all flex flex-row items-center gap-3 text-md">
          <img className="w-6" src="https://cdn.simpleicons.org/discord/FFFFFF" alt="" />
          Discord Server
        </a>
      </div>
    </div>
  )
}