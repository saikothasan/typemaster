"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../utils/supabase"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function Profile() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [recentScores, setRecentScores] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchUserStats(session.user.id)
        fetchRecentScores(session.user.id)
      }
    })
  }, [])

  async function fetchUserStats(userId: string) {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from("scores").select("wpm, accuracy").eq("user_id", userId)

    if (error) {
      console.error("Error fetching user stats:", error)
      setError("Failed to fetch user stats. Please try again later.")
    } else if (data) {
      const avgWpm = data.reduce((sum, score) => sum + score.wpm, 0) / data.length
      const avgAccuracy = data.reduce((sum, score) => sum + score.accuracy, 0) / data.length
      setStats({ avgWpm: Math.round(avgWpm), avgAccuracy: Math.round(avgAccuracy), totalTests: data.length })
    }
    setLoading(false)
  }

  async function fetchRecentScores(userId: string) {
    const { data, error } = await supabase
      .from("scores")
      .select("wpm, accuracy, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching recent scores:", error)
    } else if (data) {
      setRecentScores(data.reverse())
    }
  }

  if (loading) {
    return <div className="text-center">Loading profile...</div>
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>
  }

  if (!session) {
    return <div className="text-center">Please sign in to view your profile.</div>
  }

  const chartData = {
    labels: recentScores.map((score) => new Date(score.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "WPM",
        data: recentScores.map((score) => score.wpm),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Accuracy",
        data: recentScores.map((score) => score.accuracy),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Your Profile</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Average WPM</h2>
            <p className="text-3xl font-bold text-blue-500">{stats.avgWpm}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Average Accuracy</h2>
            <p className="text-3xl font-bold text-green-500">{stats.avgAccuracy}%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Total Tests</h2>
            <p className="text-3xl font-bold text-purple-500">{stats.totalTests}</p>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Performance</h2>
        <Line data={chartData} />
      </div>
    </div>
  )
}

