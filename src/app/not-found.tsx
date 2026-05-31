import Link from "next/link"
import type { Metadata } from "next"
import Navbar from "../components/navcomp/Navbar"
import { Footer } from "@/components/landingpage/Footer"



export const metadata: Metadata = {
    title: "404 - Page Not Found",
    description: "The page you are looking for does not exist.",
    robots: "noindex, nofollow",
}

export default function NotFound() {
    return (
        <>
            <Navbar />

            <main className="flex min-h-[70vh] items-center justify-center px-4 py-20">
                <div className="text-center">
                    <p className="text-6xl font-bold text-red-600">404</p>

                    <h1 className="mt-4 text-3xl font-bold text-slate-900">
                        Page not found
                    </h1>

                    <p className="mt-3 max-w-md text-sm text-slate-500">
                        Sorry, the page you are looking for does not exist or has been moved.
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