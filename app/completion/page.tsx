import { Suspense } from "react"
import CompletionContent from "../components/CompletionContent"
import Loading from "../components/Loading"

export default function Completion() {
  return (
    <Suspense fallback={<Loading />}>
      <CompletionContent />
    </Suspense>
  )
}

