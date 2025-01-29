"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../utils/supabase"

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([])

  useEffect(() => {
    fetchScores()
  }, [])

  async function fetchScores() {
    const { data, error } = await supabase
      .from("scores")
      .select("id, wpm, created_at, users(email)")
      .order("wpm", { ascending: false })
      .limit(10)

    if (error) console.error("Error fetching scores:", error)
    else setScores(data || [])
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Rank</th>
            <th className="text-left py-2">User</th>
            <th className="text-left py-2">WPM</th>
            <th className="text-left py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score.id} className="border-b">
              <td className="py-2">{index + 1}</td>
              <td className="py-2">{score.users.email}</td>
              <td className="py-2">{score.wpm}</td>
              <td className="py-2">{new Date(score.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

