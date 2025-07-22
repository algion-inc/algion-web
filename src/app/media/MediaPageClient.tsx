"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, Settings, BookOpen, Bell } from 'lucide-react';
import { Article } from './lib/articles';

type Category = "All" | "導入事例" | "技術解説" | "お知らせ";

interface MediaPageClientProps {
  articles: Article[];
}

export default function MediaPageClient({ articles }: MediaPageClientProps) {
  const [activeTab, setActiveTab] = useState<Category>("All");
  
  const tabs: { key: Category; label: string; icon: React.ElementType }[] = [
    { key: "All", label: "All", icon: FileText },
    { key: "導入事例", label: "導入事例", icon: BookOpen },
    { key: "技術解説", label: "技術解説", icon: Settings },
    { key: "お知らせ", label: "お知らせ", icon: Bell }
  ];
  
  const filteredArticles = activeTab === "All" 
    ? articles 
    : articles.filter(article => article.category === activeTab);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 tracking-tight">
            Algionメディア
          </h1>
          <p className="text-xl lg:text-2xl text-gray-900 mb-8 max-w-3xl mx-auto">
            AI導入事例や技術解説、最新ニュースなどをお届けします。
          </p>
        </div>
      </section>

      {/* Articles with Tabs */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-4 mb-12 max-w-md sm:max-w-none mx-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center justify-center px-3 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-black text-white shadow-elegant'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <IconComponent size={16} className="mr-1 sm:mr-2 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">
                    {tab.key === "All" ? "All" :
                     tab.key === "導入事例" ? "導入事例" :
                     tab.key === "技術解説" ? "技術解説" :
                     tab.key === "お知らせ" ? "お知らせ" : tab.label}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link 
                key={article.id}
                href={`/media/${article.slug}`}
                className="bg-white p-6 rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col group"
              >
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors h-14 flex items-start">
                  <span className="leading-tight">
                    {article.title}
                  </span>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                  <span>{article.date}</span>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">サービスについてのご相談</h2>
          <p className="text-xl text-gray-700 mb-8">
            Algionのサービスに関するご質問や導入のご相談は、お気軽にお問い合わせください。
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium text-lg hover:opacity-80 transition-opacity"
          >
            お問い合わせフォームへ
          </Link>
        </div>
      </section>
    </div>
  );
}