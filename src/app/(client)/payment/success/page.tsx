import { Suspense } from "react"
import PaymentSuccessPage from "./PaymentSuccess"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <PaymentSuccessPage/>
    </Suspense>
  )
}