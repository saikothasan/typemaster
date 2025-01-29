import Link from "next/link"
import { ArrowRight } from "lucide-react"

const levels = [
  { name: "Easy", description: "Perfect for beginners. Simple sentences and common words.", color: "bg-green-500" },
  {
    name: "Medium",
    description: "For intermediate typists. More complex sentences and varied vocabulary.",
    color: "bg-yellow-500",
  },
  {
    name: "Hard",
    description: "Challenge yourself with difficult phrases and advanced vocabulary.",
    color: "bg-red-500",
  },
]

export default function Levels() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Choose Your Level</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <div key={level.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className={`${level.color} h-2`} />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{level.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{level.description}</p>
              <Link
                href={`/practice?difficulty=${level.name.toLowerCase()}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                Start Typing <ArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

