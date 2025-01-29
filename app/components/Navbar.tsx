"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Home, Keyboard, Award, User, LogIn, LogOut } from "lucide-react"
import { useSupabase } from "./SupabaseProvider"
import type { Session, SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type React from "react"

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { supabase } = useSupabase()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            TypeMaster
          </Link>
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
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

