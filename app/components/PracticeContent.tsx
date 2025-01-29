"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "../../utils/supabase"
import TypingTest from "./TypingTest"
import LoginPrompt from "./LoginPrompt"

export default function PracticeContent() {
  const [session, setSession] = useState<any>(null)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const searchParams = useSearchParams()

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
  }, [searchParams])

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

