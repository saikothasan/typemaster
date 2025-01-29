"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { supabase, type Score } from "../../utils/supabase"
import { AlertCircle, CheckCircle, BarChart2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const difficultyLevels = {
  easy: {
    texts: [
      "The quick brown fox jumps over the lazy dog.",
      "Pack my box with five dozen liquor jugs.",
      "How vexingly quick daft zebras jump!",
    ],
    timeLimit: 60,
    wordsPerMinuteThreshold: 30,
  },
  medium: {
    texts: [
      "The five boxing wizards jump quickly.",
      "Sphinx of black quartz, judge my vow.",
      "Two driven jocks help fax my big quiz.",
    ],
    timeLimit: 45,
    wordsPerMinuteThreshold: 50,
  },
  hard: {
    texts: [
      "Waltz, nymph, for quick jigs vex Bud.",
      "Glib jocks quiz nymph to vex dwarf.",
      "Quick zephyrs blow, vexing daft Jim.",
    ],
    timeLimit: 30,
    wordsPerMinuteThreshold: 70,
  },
}

type Difficulty = "easy" | "medium" | "hard"

export default function TypingTest({
  userId,
  initialDifficulty = "easy",
}: { userId: string; initialDifficulty?: Difficulty }) {
  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [mistakes, setMistakes] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const startTest = useCallback(() => {
    const randomText =
      difficultyLevels[difficulty].texts[Math.floor(Math.random() * difficultyLevels[difficulty].texts.length)]
    setText(randomText)
    setUserInput("")
    setStartTime(null)
    setEndTime(null)
    setWpm(null)
    setAccuracy(null)
    setTimeLeft(difficultyLevels[difficulty].timeLimit)
    setIsFinished(false)
    setMistakes([])
    setShowResults(false)
    setCurrentCharIndex(0)
    if (inputRef.current) inputRef.current.focus()
  }, [difficulty])

  useEffect(() => {
    startTest()
  }, [startTest])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (startTime && timeLeft !== null && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === null || prevTime <= 1) {
            clearInterval(timer)
            setIsFinished(true)
            setShowResults(true)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, timeLeft, isFinished])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!startTime) {
      setStartTime(Date.now())
    }

    if (e.key === text[currentCharIndex]) {
      setCurrentCharIndex(currentCharIndex + 1)
      setUserInput(userInput + e.key)
    } else {
      setMistakes([...mistakes, currentCharIndex])
    }

    if (currentCharIndex + 1 === text.length) {
      setEndTime(Date.now())
      setIsFinished(true)
      setShowResults(true)
    }
  }

  useEffect(() => {
    if (isFinished && startTime && endTime) {
      const timeInMinutes = (endTime - startTime) / 60000
      const wordsTyped = text.split(" ").length
      const calculatedWpm = Math.round(wordsTyped / timeInMinutes)
      setWpm(calculatedWpm)

      const correctChars = text.split("").filter((char, index) => char === userInput[index]).length
      const calculatedAccuracy = Math.round((correctChars / text.length) * 100)
      setAccuracy(calculatedAccuracy)

      // Save the score to Supabase
      const newScore: Omit<Score, "id" | "created_at"> = {
        user_id: userId,
        wpm: calculatedWpm,
        accuracy: calculatedAccuracy,
        difficulty,
      }

      supabase
        .from("scores")
        .insert(newScore)
        .then(({ error }) => {
          if (error) console.error("Error saving score:", error)
          else {
            // Redirect to the completion page
            router.push(`/completion?wpm=${calculatedWpm}&accuracy=${calculatedAccuracy}&difficulty=${difficulty}`)
          }
        })
    }
  }, [isFinished, startTime, endTime, text, userInput, userId, difficulty, router])

  const getPerformanceMessage = (wpm: number, accuracy: number) => {
    const threshold = difficultyLevels[difficulty].wordsPerMinuteThreshold
    if (wpm >= threshold && accuracy >= 95) return "Excellent performance!"
    if (wpm >= threshold && accuracy >= 90) return "Great job! Try to improve your accuracy."
    if (wpm < threshold && accuracy >= 95) return "Good accuracy! Work on increasing your speed."
    return "Keep practicing to improve both speed and accuracy."
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <button
              key={level}
              onClick={() => {
                setDifficulty(level)
                startTest()
              }}
              className={`px-4 py-2 rounded-full transition duration-300 ease-in-out ${
                difficulty === level
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        {timeLeft !== null && (
          <div className={`text-xl font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : ""}`}>
            Time: {timeLeft}s
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-lg font-medium mb-4">
          {text.split("").map((char, index) => {
            let color = "text-gray-400"
            if (index < userInput.length) {
              color = char === userInput[index] ? "text-green-500" : "text-red-500"
            }
            return (
              <span
                key={index}
                className={`${color} ${index === currentCharIndex ? "bg-yellow-200 dark:bg-yellow-800" : ""} ${
                  mistakes.includes(index) ? "underline" : ""
                }`}
              >
                {char}
              </span>
            )
          })}
        </p>
        <input
          ref={inputRef}
          type="text"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={handleKeyDown}
          disabled={isFinished}
          autoFocus
        />
      </div>
      {showResults && wpm !== null && accuracy !== null && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold">Your Results</h2>
          <div className="flex justify-center space-x-8">
            <div>
              <p className="text-3xl font-bold text-blue-500">{wpm}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Words per minute</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">{accuracy}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
            </div>
          </div>
          <p className="text-lg">{getPerformanceMessage(wpm, accuracy)}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={startTest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105"
            >
              Try Again <RefreshCw className="ml-2" />
            </button>
            <Link
              href="/profile"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105"
            >
              View Stats <BarChart2 className="ml-2" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

