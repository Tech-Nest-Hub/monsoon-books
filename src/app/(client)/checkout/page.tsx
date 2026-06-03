import { Suspense } from "react"
import CheckoutPage from "./CheckoutPage"
import Navbar from "@/components/navcomp/Navbar"
import { Footer } from "@/components/landingpage/Footer"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar/>
      <CheckoutPage/>
      <Footer/>
    </Suspense>
  )
}