import { CarouselSpacing } from "@/components/landingpage/CarouselHeroSectionComp";
import Navbar from "../components/navcomp/Navbar";
import { ClientLandingComp } from "@/components/landingpage/ClientLandingComp";
import { LandingFooterComp } from "@/components/landingpage/LandingFooterComp"


export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-red-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <section className="space-y-4">
            <div className="rounded-2xl bg-linear-to-r from-red-50 to-orange-50 p-3 shadow-lg sm:p-4 mb-8">
              <CarouselSpacing />
            </div>
          </section>
          <ClientLandingComp />
        </div>
      </main>
      <LandingFooterComp />
    </>
  );
}