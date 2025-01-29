import Link from "next/link"

export default function LoginPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-2xl font-bold mb-4">Please Sign In to Practice</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        You need to be logged in to access the typing practice area.
      </p>
      <Link
        href="/login"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Sign In
      </Link>
    </div>
  )
}

