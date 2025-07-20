import React from 'react';
import { getArticles } from './lib/articles';
import MediaPageClient from './MediaPageClient';

export default async function MediaPage() {
  const articles = await getArticles();
  
  return <MediaPageClient articles={articles} />;
}