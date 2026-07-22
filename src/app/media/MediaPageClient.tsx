"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "./lib/articles";

type Category = "All" | Article["category"];

export default function MediaPageClient({ articles }: { articles: Article[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((article) => article.category)))] as Category[],
    [articles],
  );
  const [activeTab, setActiveTab] = useState<Category>("All");
  const filteredArticles = activeTab === "All" ? articles : articles.filter((article) => article.category === activeTab);

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-blue-700">MEDIA</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-950 sm:text-5xl lg:text-6xl">技術と実践について発信します。</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl">AIを業務で使える形へつなぐための設計、評価、ソフトウェア開発について発信しています。</p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="記事カテゴリー">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeTab === category}
                onClick={() => setActiveTab(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold ${activeTab === category ? "bg-black text-white" : "border border-gray-300 bg-white text-gray-700 hover:border-gray-500"}`}
              >
                {category === "All" ? "すべて" : category}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/media/${article.slug}`} className="group flex min-h-64 flex-col rounded-lg border border-gray-200 bg-white p-7 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <span className="text-blue-700">{article.category}</span>
                  <span className="text-gray-400">{article.date}</span>
                </div>
                <h2 className="mt-6 text-xl font-bold leading-relaxed text-gray-950 group-hover:text-blue-700">{article.title}</h2>
                <p className="mt-4 line-clamp-3 leading-relaxed text-gray-600">{article.excerpt}</p>
                <span className="mt-auto inline-flex items-center pt-6 text-sm font-semibold text-gray-700">記事を読む <ArrowRight className="ml-2" size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6"><h2 className="text-3xl font-bold sm:text-4xl">サービスについて相談する</h2><p className="mt-5 text-white/65">構想段階からご相談いただけます。</p><Link href="/contact" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-7 py-3 font-semibold text-black hover:bg-cyan-50">無料相談を申し込む <ArrowRight className="ml-2" size={18} /></Link></div>
      </section>
    </div>
  );
}
