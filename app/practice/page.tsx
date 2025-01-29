import { Suspense } from "react"
import PracticeContent from "../components/PracticeContent"
import Loading from "../components/Loading"

export default function Practice() {
  return (
    <Suspense fallback={<Loading />}>
      <PracticeContent />
    </Suspense>
  )
}

