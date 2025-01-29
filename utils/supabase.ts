import { createClient } from "@supabase/supabase-js"

export type User = {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export type Score = {
  id: string
  user_id: string
  wpm: number
  accuracy: number
  difficulty: string
  created_at: string
}

export type Profile = {
  id: string
  username: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export type Tables = {
  users: User
  scores: Score
  profiles: Profile
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

