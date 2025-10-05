"use client"
import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  const { data: session } = useSession()
  const [showdropdown, setShowdropdown] = useState(false)

  // ✅ FIX: Create a URL-friendly slug from the user's name
  // This will convert "Mahir Kumar" to "mahir-kumar"
  const usernameSlug = session?.user?.name?.replace(/\s+/g, '.').toLowerCase();

  return (
    <nav className='bg-gray-900 text-white flex justify-between items-center px-4 md:h-16 flex-wrap'>
      
        <Link className="logo font-bold text-lg flex justify-center items-center" href={"/"}>
          <Image className='invertImg' src="/tea.gif" width={44} height={44} alt="Get Me A Chai Logo" />
          <span className='text-xl md:text-base my-3 md:my-0'>GetMeaChai!</span>
        </Link>
      
      <div className='relative'>
        {session && (
          <>
            <button 
              onClick={() => setShowdropdown(!showdropdown)} 
              onBlur={() => setTimeout(() => setShowdropdown(false), 200)} 
              id="dropdownDefaultButton" 
              className="text-white mx-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
              type="button"
            >
              Welcome {session.user.name} 
              <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                {/* ✅ FIX: SVG attributes changed to camelCase */}
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            {/* Dropdown menu */}
            <div id="dropdown" className={`z-10 ${showdropdown ? "" : "hidden"} absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700`}>
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                  <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
                </li>
                <li>
                  {/* ✅ FIX: Using the new usernameSlug for the link */}
                  <Link href={`/${session.user.username}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Page</Link>
                </li>
                <li>
                  <Link onClick={() => signOut()} href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</Link>
                </li>
              </ul>
            </div>
          </>
        )}

        {!session && (
          <Link href={"/login"}>
            <button className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
