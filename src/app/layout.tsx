import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

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
  metadataBase: new URL("https://algion.co.jp"),
  title: "AI開発・PoC支援 | Algion株式会社",
  description: "AIを使う場所の整理からPoC・評価設計・本番実装・運用改善まで。機械学習とソフトウェア開発の両面から、AIを現場で使い続けられる仕組みへつなげます。",
  keywords: "AI開発, PoC開発, 生成AI, RAG, AIエージェント, 機械学習, ソフトウェア開発, 評価設計",
  authors: [{ name: "岡本 秀明" }],
  creator: "Algion株式会社",
  publisher: "Algion株式会社",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Algion株式会社 | 構想段階のAIを、現場で使える仕組みへ。",
    description: "AIを使う場所の整理からPoC・評価設計・本番実装・運用改善まで。機械学習とソフトウェア開発の両面から支援します。",
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
    title: "Algion株式会社 | AI開発・PoC支援",
    description: "構想段階のAIを、現場で使える仕組みへ。",
    images: ["/Algion_logo_512x512.png"],
  },
  icons: {
    icon: '/Algion_logo_32x32.png',
    apple: '/Algion_logo_180x180.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
        {/* Polyfill for requestIdleCallback */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
if(typeof window !== 'undefined' && !('requestIdleCallback' in window)){
  window.requestIdleCallback = function(cb){ return setTimeout(()=>cb({ timeRemaining: ()=>0 }), 1); };
  window.cancelIdleCallback = function(id){ clearTimeout(id); };
}
`           }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
