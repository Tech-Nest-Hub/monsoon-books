import type { Metadata } from 'next'
import FAQsComp from './FAQsComp'
import Navbar from '@/components/navcomp/Navbar'
import { Footer } from '@/components/landingpage/Footer'

export const metadata: Metadata = {
  title: "FAQ | Monsoon Books",
  description: "Find answers to frequently asked questions about Monsoon Books, including popular search queries and customer support information.",
  icons: {
    icon: "/MonsoonBooksLogoBlack&White.ico",
  },
}

const HelpPage = () => {
  return (
    <div>
      <Navbar />
      <FAQsComp/>
      <Footer/>
    </div>
  )
}

export default HelpPage
