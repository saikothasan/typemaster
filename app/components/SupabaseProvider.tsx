"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect } from "react"
import type { SupabaseClient as SupabaseClientType } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../../types/supabase"
import type { Session } from "@supabase/auth-helpers-nextjs"
import type React from "react"

type SupabaseContext = {
  supabase: SupabaseClientType<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== undefined) {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}

