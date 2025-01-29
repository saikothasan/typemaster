"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Home, Keyboard, Award, User, LogIn, LogOut, Menu } from "lucide-react"
import { useSupabase } from "./SupabaseProvider"
import type React from "react"

export default function Navbar() {
  const [session, setSession] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { supabase } = useSupabase()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            TypeMaster
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/" current={pathname === "/"} icon={<Home size={20} />}>
              Home
            </NavLink>
            <NavLink href="/levels" current={pathname === "/levels"} icon={<Keyboard size={20} />}>
              Levels
            </NavLink>
            <NavLink href="/leaderboard" current={pathname === "/leaderboard"} icon={<Award size={20} />}>
              Leaderboard
            </NavLink>
            {session ? (
              <>
                <NavLink href="/profile" current={pathname === "/profile"} icon={<User size={20} />}>
                  Profile
                </NavLink>
                <button onClick={signOut} className="hover:text-gray-300 flex items-center">
                  <LogOut size={20} />
                  <span className="ml-1">Sign Out</span>
                </button>
              </>
            ) : (
              <NavLink href="/login" current={pathname === "/login"} icon={<LogIn size={20} />}>
                Sign In
              </NavLink>
            )}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/" current={pathname === "/"} icon={<Home size={20} />}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/levels" current={pathname === "/levels"} icon={<Keyboard size={20} />}>
              Levels
            </MobileNavLink>
            <MobileNavLink href="/leaderboard" current={pathname === "/leaderboard"} icon={<Award size={20} />}>
              Leaderboard
            </MobileNavLink>
            {session ? (
              <>
                <MobileNavLink href="/profile" current={pathname === "/profile"} icon={<User size={20} />}>
                  Profile
                </MobileNavLink>
                <button onClick={signOut} className="w-full text-left hover:text-gray-300 flex items-center py-2 px-3">
                  <LogOut size={20} />
                  <span className="ml-1">Sign Out</span>
                </button>
              </>
            ) : (
              <MobileNavLink href="/login" current={pathname === "/login"} icon={<LogIn size={20} />}>
                Sign In
              </MobileNavLink>
            )}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full text-left flex items-center py-2 px-3"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              <span className="ml-1">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({
  href,
  current,
  children,
  icon,
}: {
  href: string
  current: boolean
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <Link href={href} className={`hover:text-gray-300 flex items-center ${current ? "text-blue-400" : ""}`}>
      {icon}
      <span className="ml-1">{children}</span>
    </Link>
  )
}

function MobileNavLink({
  href,
  current,
  children,
  icon,
}: {
  href: string
  current: boolean
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`block py-2 px-3 rounded-md ${
        current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-1">{children}</span>
      </div>
    </Link>
  )
}

