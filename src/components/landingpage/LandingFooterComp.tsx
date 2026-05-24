import Link from "next/link"

export function LandingFooterComp() {
  return (
    <footer className="border-t border-border bg-white/95 py-12 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Monsoon Books</h2>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Discover the best books and authors with a smooth experience, updated collections, and smart search.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">Explore</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/search?q=fiction" className="hover:text-foreground">Fiction</Link>
                </li>
                <li>
                  <Link href="/search?q=study" className="hover:text-foreground">Study Guides</Link>
                </li>
                <li>
                  <Link href="/search?q=bestseller" className="hover:text-foreground">Bestsellers</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-red-700">Support</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Shipping</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 Monsoon Books. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
