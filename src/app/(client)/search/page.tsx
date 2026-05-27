import { Suspense } from "react"
import SearchClient from "./search-client"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchClient />
    </Suspense>
  )
}