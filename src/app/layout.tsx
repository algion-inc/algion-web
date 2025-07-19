import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Algion株式会社",
  description: "データとアルゴリズムで人々のビジョンを実現する",
  icons: {
    icon: '/Algion_logo_32x32.png',
    apple: '/Algion_logo_180x180.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <Header />
        <main className="pt-20 sm:pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
