"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDigitalCard = pathname === "/hideaki" || pathname?.startsWith("/hideaki/");

  if (isDigitalCard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="pt-20 sm:pt-24">{children}</main>
      <Footer />
    </>
  );
}
