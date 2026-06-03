import Link from "next/link"
import type { Metadata } from "next"
import { Footer } from "@/components/landingpage/Footer"
import Navbar from "../navcomp/Navbar"
import ComingSoon503 from "./503ComingSoon"



export const metadata: Metadata = {
    title: "Coming Soon",
    description: "This page is coming soon.",
    robots: "noindex, nofollow",
}

export default function ComingSoon() {
    return (
        <>
            <Navbar />

            <main className="flex min-h-[70vh] items-center justify-center px-4 py-20">
                <div className="text-center">
                    <p className="text-4xl font-bold text-red-600 justify-center items-center"><ComingSoon503/></p>

                    <h1 className="mt-4 text-3xl font-bold text-slate-900">
                        Coming Soon
                    </h1>

                    <p className="mt-3 max-w-md text-sm text-slate-500">
                        This page is under construction and will be live soon. Stay tuned!
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            Go Home
                        </Link>

                        <Link
                            href="/books"
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Browse Books
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}