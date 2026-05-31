import Navbar from "@/components/navcomp/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Search | Monsoon Books",
  description:
    "Search thousands of books by title, author, genre, or keyword. Discover new books and find exactly what you're looking for on Monsoon Books.",
  icons: {
    icon: "/MonsoonBooksLogoBlack&White.ico",
  },
};

export default function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>
    <Navbar />
    {children}
  </>;
}