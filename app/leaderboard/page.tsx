"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../utils/supabase"
import { Award, Filter } from "lucide-react"
import React from "react"

type Difficulty = "easy" | "medium" | "hard" | "all"
type TimeFrame = "daily" | "weekly" | "monthly" | "all-time"

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>("all")
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("all-time")

  useEffect(() => {
    fetchScores()
  }, []) // Removed unnecessary dependencies

  async function fetchScores() {
    setLoading(true)
    setError(null)
    let query = supabase
      .from("scores")
      .select("id, wpm, accuracy, difficulty, created_at, users(email)")
      .order("wpm", { ascending: false })
      .limit(50)

    if (difficulty !== "all") {
      query = query.eq("difficulty", difficulty)
    }

    if (timeFrame !== "all-time") {
      const now = new Date()
      let startDate: Date
      switch (timeFrame) {
        case "daily":
          startDate = new Date(now.setDate(now.getDate() - 1))
          break
        case "weekly":
          startDate = new Date(now.setDate(now.getDate() - 7))
          break
        case "monthly":
          startDate = new Date(now.setMonth(now.getMonth() - 1))
          break
      }
      query = query.gte("created_at", startDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching scores:", error)
      setError("Failed to fetch leaderboard data. Please try again later.")
    } else {
      setScores(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center">Loading leaderboard...</div>
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">Leaderboard</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="space-y-2 sm:space-y-0 sm:space-x-2">
          <span className="font-semibold">Difficulty:</span>
          {(["all", "easy", "medium", "hard"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-3 py-1 rounded-full text-sm ${
                difficulty === level
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <div className="space-y-2 sm:space-y-0 sm:space-x-2">
          <span className="font-semibold">Time Frame:</span>
          {(["daily", "weekly", "monthly", "all-time"] as const).map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-3 py-1 rounded-full text-sm ${
                timeFrame === frame
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {frame
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  WPM
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {scores.map((score, index) => (
                <tr
                  key={score.id}
                  className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index + 1}
                      {index < 3 && <Award className="ml-2 text-yellow-400" size={16} />}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{score.users.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap font-semibold text-blue-600 dark:text-blue-400">
                    {score.wpm}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{score.accuracy}%</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        score.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : score.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {score.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(score.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

