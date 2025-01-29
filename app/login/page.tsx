"use client"

import { useState } from "react"
import { supabase } from "../../utils/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function signInWithGithub() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    })
    if (error) {
      setError("Failed to sign in. Please try again.")
      setLoading(false)
    } else {
      router.push("/practice")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <button
        onClick={signInWithGithub}
        disabled={loading}
        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        {loading ? (
          <span className="mr-2">Loading...</span>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
            Sign in with GitHub
          </>
        )}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}

