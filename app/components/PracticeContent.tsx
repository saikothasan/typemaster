"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import TypingTest from "./TypingTest"
import LoginPrompt from "./LoginPrompt"
import { useSupabase } from "./SupabaseProvider"

export default function PracticeContent() {
  const [session, setSession] = useState<any>(null)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const searchParams = useSearchParams()
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

    const difficultyParam = searchParams.get("difficulty")
    if (difficultyParam && ["easy", "medium", "hard"].includes(difficultyParam)) {
      setDifficulty(difficultyParam as "easy" | "medium" | "hard")
    }

    return () => subscription.unsubscribe()
  }, [searchParams, supabase])

  if (!session) {
    return <LoginPrompt />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Typing Practice</h1>
      <TypingTest userId={session.user.id} initialDifficulty={difficulty} />
    </div>
  )
}

