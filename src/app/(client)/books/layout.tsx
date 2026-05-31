import Navbar from "@/components/navcomp/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books | Monsoon Books",
  description:
    "Browse and discover books on Monsoon Books. Explore new reads, find recommendations, and connect with fellow book lovers.",
  icons: {
    icon: "/MonsoonBooksLogoBlack&White.ico",
  },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
  <Navbar/>
  {children}</>;
}