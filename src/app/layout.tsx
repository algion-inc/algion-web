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
  display: 'swap',
  preload: false
});

export const metadata: Metadata = {
  title: "Algion株式会社",
  description: "法人向けAIソリューション、AIコンサルティング、SaaSプロダクトを提供。生成AI・LLMの導入から運用まで包括的に支援します。",
  keywords: "AI, 人工知能, LLM, 大規模言語モデル, AIコンサルティング, SaaS, 機械学習, データサイエンス",
  authors: [{ name: "岡本 秀明" }],
  creator: "Algion株式会社",
  publisher: "Algion株式会社",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  openGraph: {
    title: "Algion株式会社",
    description: "法人向けAIソリューション、AIコンサルティング、SaaSプロダクトを提供。生成AI・LLMの導入から運用まで包括的に支援します。",
    url: "https://algion.co.jp",
    siteName: "Algion株式会社",
    images: [
      {
        url: "/Algion_logo_512x512.png",
        width: 512,
        height: 512,
        alt: "Algion株式会社ロゴ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Algion株式会社",
    description: "法人向けAIソリューション、AIコンサルティング、SaaSプロダクトを提供。生成AI・LLMの導入から運用まで包括的に支援します。",
    images: ["/Algion_logo_512x512.png"],
  },
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
