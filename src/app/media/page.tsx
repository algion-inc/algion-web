import React from 'react';
import type { Metadata } from 'next';
import { getArticles } from './lib/articles';
import MediaPageClient from './MediaPageClient';

export const metadata: Metadata = {
  title: 'メディア | Algion株式会社',
  description: 'AIの設計、評価、ソフトウェア開発に関する技術記事とお知らせを掲載しています。',
  alternates: { canonical: '/media' },
};

export default async function MediaPage() {
  const articles = await getArticles();
  
  return <MediaPageClient articles={articles} />;
}
