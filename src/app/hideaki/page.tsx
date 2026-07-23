import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, Download, Mail } from "lucide-react";
import ShareButton from "@/components/ShareButton";

export const metadata: Metadata = {
  title: "岡本 秀明 | Algion",
  description: "Algion株式会社 代表取締役CEO、AI & Software Engineer 岡本秀明のデジタル名刺です。",
  alternates: { canonical: "/hideaki/" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "岡本 秀明 | Algion",
    description: "Algion株式会社 代表取締役CEO、AI & Software Engineer 岡本秀明のデジタル名刺です。",
    url: "/hideaki/",
    type: "profile",
    images: [{ url: "/hideaki-okamoto-profile.jpg", width: 220, height: 293, alt: "岡本 秀明" }],
  },
  twitter: {
    card: "summary",
    title: "岡本 秀明 | Algion",
    description: "Algion株式会社 代表取締役CEO、AI & Software Engineer",
    images: ["/hideaki-okamoto-profile.jpg"],
  },
};

const expertise = [
  "AI Product Development / FDE",
  "Generative AI / RAG / AI Agents",
  "Computer Vision / Multimodal AI",
  "Evaluation / LLMOps",
  "Software Engineering / Cloud",
];

const career = [
  { year: "2025–Present", company: "Algion株式会社", role: "代表取締役CEO" },
  { year: "2023–Present", company: "PayPay株式会社", role: "Forward Deployed Engineer\nSenior Software Engineer, Machine Learning" },
  { year: "2021–2023", company: "ソフトバンク株式会社", role: "Machine Learning Engineer", note: "高市場価値AI人材認定" },
  { year: "2015–2021", company: "法政大学・法政大学大学院", role: "Machine Learning / Computer Vision", note: "IEEE BigData 論文発表" },
];

export default function HideakiPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-950">
      <section className="border-t-4 border-cyan-400 bg-[#070b12] text-white">
        <div className="mx-auto flex min-h-[88svh] w-full max-w-xl flex-col px-5 pb-8 pt-7 sm:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold" aria-label="Algionウェブサイト">Algion</Link>
            <ShareButton />
          </div>

          <div className="mt-auto pt-12">
            <Image src="/hideaki-okamoto-profile.jpg" alt="岡本 秀明" width={220} height={293} priority className="h-32 w-24 rounded-lg object-cover object-top shadow-2xl sm:h-36 sm:w-28" />
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">岡本 秀明</h1>
            <p className="mt-1 text-lg text-white/55">Hideaki Okamoto</p>
            <div className="mt-6 space-y-1.5">
              <p className="font-semibold">Algion株式会社 代表取締役CEO</p>
              <p className="font-semibold text-cyan-300">AI & Software Engineer</p>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-white/70">AIを、検証から現場で使える価値へ。</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <a href="/hideaki-okamoto.vcf" className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-black hover:bg-cyan-50">
              <Download className="mr-2" size={18} />連絡先に追加
            </a>
            <a href="mailto:info@algion.co.jp" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/15"><Mail className="mr-2" size={18} />メール</a>
            <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/15"><Building2 className="mr-2" size={18} />Algion</Link>
          </div>
          <div className="mt-8 h-px bg-white/15" />
        </div>
      </section>

      <main className="mx-auto max-w-xl bg-white px-5 py-14 sm:px-8">
        <section>
          <p className="text-xs font-bold text-blue-700">PROFILE</p>
          <p className="mt-5 text-lg leading-relaxed text-gray-700">機械学習・コンピュータビジョンの研究を起点に、生成AI、RAG、AIエージェントを含むAIプロダクト開発に取り組んできました。業務理解から設計、実装、評価、本番運用、継続改善までをつなぐ開発を得意としています。</p>
        </section>

        <section className="mt-14">
          <p className="text-xs font-bold text-blue-700">EXPERTISE</p>
          <div className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
            {expertise.map((item) => <p key={item} className="py-3.5 text-sm font-semibold text-gray-800">{item}</p>)}
          </div>
        </section>

        <section className="mt-14">
          <p className="text-xs font-bold text-blue-700">CAREER</p>
          <div className="mt-6 space-y-8">
            {career.map((item) => (
              <div key={`${item.year}-${item.company}`} className="grid grid-cols-[88px_1fr] gap-4">
                <p className="text-sm font-semibold text-gray-400">{item.year}</p>
                <div><h2 className="font-bold text-gray-950">{item.company}</h2><p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-600">{item.role}</p>{item.note && <p className="mt-1 text-sm text-gray-500">{item.note}</p>}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <p className="text-xs font-bold text-blue-700">CONNECT</p>
          <div className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
            <a href="https://www.linkedin.com/in/okkah/" target="_blank" rel="noreferrer" className="flex items-center justify-between py-5 font-semibold text-gray-950 hover:text-blue-700"><span>LinkedIn <span className="ml-2 text-sm font-normal text-gray-400">linkedin.com/in/okkah</span></span><ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href="https://x.com/h_okkah" target="_blank" rel="noreferrer" className="flex items-center justify-between py-5 font-semibold text-gray-950 hover:text-blue-700"><span>X <span className="ml-2 text-sm font-normal text-gray-400">@h_okkah</span></span><ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href="https://github.com/okkah" target="_blank" rel="noreferrer" className="flex items-center justify-between py-5 font-semibold text-gray-950 hover:text-blue-700"><span>GitHub <span className="ml-2 text-sm font-normal text-gray-400">github.com/okkah</span></span><ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="mt-14 rounded-lg bg-gray-950 p-7 text-white">
          <p className="text-xl font-bold">Algion株式会社</p>
          <p className="mt-3 text-sm leading-relaxed text-white/60">AI活用構想、PoC開発・評価、本番実装についてご相談いただけます。</p>
          <Link href="/" className="mt-5 inline-flex items-center text-sm font-semibold text-cyan-300">Algionを見る <ArrowUpRight className="ml-2" size={16} /></Link>
        </section>

        <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-7 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} Hideaki Okamoto</span>
          <Link href="/hideaki/qr" className="font-semibold text-gray-600">QRを表示</Link>
        </div>
      </main>
    </div>
  );
}
