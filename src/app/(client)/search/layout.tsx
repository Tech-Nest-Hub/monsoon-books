import Navbar from "@/app/aayushma/Navbar";

export default function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>
    <Navbar />
    {children}
  </>;
}