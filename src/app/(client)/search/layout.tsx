import Navbar from "@/components/navcomp/Navbar";

export default function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>
    <Navbar />
    {children}
  </>;
}