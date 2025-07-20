import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { getArticleBySlug, getArticles } from '../lib/articles';
import { markdownToHtml } from '../lib/markdown';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const content = await markdownToHtml(article.content || '');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/media"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            記事一覧に戻る
          </Link>
          
          <div className="mb-6">
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold text-black mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{article.date}</span>
              </div>
              {article.author && (
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>{article.author}</span>
                </div>
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center">
                  <Tag size={16} className="mr-2" />
                  <div className="flex gap-2">
                    {article.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-black [&_h1]:my-8 [&_h1]:leading-tight
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b-2 [&_h2]:border-gray-200 [&_h2]:leading-tight
              [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:leading-tight
              [&_p]:text-gray-700 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:my-4
              [&_ul]:my-4 [&_ul]:pl-6
              [&_li]:text-gray-700 [&_li]:text-lg [&_li]:leading-relaxed [&_li]:my-2 [&_li]:list-disc
              [&_strong]:text-black [&_strong]:font-bold
              [&_a]:text-blue-600 [&_a]:no-underline hover:[&_a]:underline
              [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-red-600 [&_code]:font-mono [&_code]:text-sm
              [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-gray-600 [&_blockquote]:italic
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>

      {/* Footer CTA */}
      <section className="py-24 bg-gray-50">
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

// 静的生成用のパス生成
export async function generateStaticParams() {
  const articles = await getArticles();
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// メタデータ生成
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: '記事が見つかりません | Algion',
    };
  }

  return {
    title: `${article.title} | Algion`,
    description: article.excerpt,
  };
}