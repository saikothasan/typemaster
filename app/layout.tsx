import "./globals.css"
import { Poppins } from "next/font/google"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { ThemeProvider } from "./components/ThemeProvider"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import SupabaseProvider from "./components/SupabaseProvider"
import type React from "react"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "TypeMaster Pro - Advanced Typing Speed Test",
  description:
    "Enhance your typing skills with TypeMaster Pro, featuring AI-powered analysis, personalized training, and global competitions.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <SupabaseProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}

