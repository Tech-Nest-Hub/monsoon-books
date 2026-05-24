import { Button } from "@/components/ui/button";
import Navbar from "./aayushma/Navbar";
import { CarouselSpacing } from "@/components/landingpage/CarouselHeroSectionComp";

export default function Home() {
  return (
    <div>
           <Navbar/>
      <div className="p-10 text-center">
          <CarouselSpacing/>
      </div>
    </div>
  );
}