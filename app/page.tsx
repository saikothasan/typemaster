import Link from "next/link"
import { ArrowRight, Award, BarChart2, Brain, Zap } from "lucide-react"
import type React from "react" // Added import for React

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-8">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Welcome to TypeMaster Pro
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Elevate your typing skills with our advanced AI-powered platform. Practice, compete, and track your progress
          like never before.
        </p>
        <div className="space-x-4">
          <Link
            href="/practice"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start Typing <ArrowRight className="ml-2" />
          </Link>
          <Link
            href="/leaderboard"
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105"
          >
            View Leaderboard <Award className="ml-2" />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Zap size={24} />}
          title="AI-Powered Analysis"
          description="Get personalized insights and recommendations to improve your typing speed and accuracy."
        />
        <FeatureCard
          icon={<Brain size={24} />}
          title="Adaptive Learning"
          description="Our system adjusts to your skill level, providing challenges that grow with you."
        />
        <FeatureCard
          icon={<BarChart2 size={24} />}
          title="Detailed Analytics"
          description="Track your progress with comprehensive charts and statistics."
        />
        <FeatureCard
          icon={<Award size={24} />}
          title="Global Competitions"
          description="Participate in daily and weekly typing challenges to win rewards and recognition."
        />
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose TypeMaster Pro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Training</h3>
            <p>
              Our platform offers a wide range of exercises, from basic drills to advanced texts in various genres and
              languages.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Real-time Feedback</h3>
            <p>
              Get instant feedback on your typing performance, including speed, accuracy, and areas for improvement.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Customizable Experience</h3>
            <p>
              Tailor your typing sessions with adjustable difficulty levels, time limits, and text content to suit your
              preferences.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Community Features</h3>
            <p>Connect with other typists, join typing clubs, and participate in group challenges to stay motivated.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="text-blue-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

