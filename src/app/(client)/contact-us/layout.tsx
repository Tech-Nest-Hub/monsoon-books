import { Footer } from "@/components/landingpage/Footer";
import Navbar from "@/components/navcomp/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Monsoon Books",
  description:
    "Get in touch with Monsoon Books. Have questions about your order, need book recommendations, or just want to say hello? We'd love to hear from you.",
  icons: {
    icon: "/MonsoonBooksLogoBlack&White.ico",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}