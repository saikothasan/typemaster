"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Trophy, BarChart2, ArrowRight } from "lucide-react"

export default function Completion() {
  const searchParams = useSearchParams()
  const [wpm, setWpm] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState<string | null>(null)

  useEffect(() => {
    setWpm(Number(searchParams.get("wpm")))
    setAccuracy(Number(searchParams.get("accuracy")))
    setDifficulty(searchParams.get("difficulty"))
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
      <p className="text-xl mb-8">You've completed the {difficulty} level typing test.</p>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-3xl font-bold text-blue-500">{wpm}</p>
          <p className="text-gray-600 dark:text-gray-400">Words per minute</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-green-500">{accuracy}%</p>
          <p className="text-gray-600 dark:text-gray-400">Accuracy</p>
        </div>
      </div>
      <div className="space-x-4">
        <Link
          href="/levels"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          Try Another Level <ArrowRight className="ml-2" />
        </Link>
        <Link
          href="/profile"
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          View Your Progress <BarChart2 className="ml-2" />
        </Link>
      </div>
    </div>
  )
}

