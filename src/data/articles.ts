export interface Article {
  id: number;
  title: string;
  category: "導入事例" | "技術解説" | "お知らせ";
  date: string;
  excerpt: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "製造業AI導入で業務効率90%改善を実現",
    category: "導入事例",
    date: "2025年7月10日",
    excerpt: "某製造業企業様でのAI導入により、品質検査工程の自動化と業務効率の劇的な改善を実現した事例をご紹介します。"
  },
  {
    id: 2,
    title: "RAG活用で企業内検索精度を大幅向上する実装手法",
    category: "技術解説",
    date: "2025年7月8日",
    excerpt: "Retrieval Augmented Generationを活用した企業内ナレッジ検索システムの実装方法と精度向上のポイントを解説します。"
  },
  {
    id: 3,
    title: "TechVision Conference 2025での講演を実施しました",
    category: "お知らせ",
    date: "2025年7月5日",
    excerpt: "「企業におけるAI導入の成功パターンと失敗要因」をテーマにTechVision Conference 2025で講演を行いました。"
  },
  {
    id: 4,
    title: "金融業界でのAIチャットボット導入成功事例",
    category: "導入事例",
    date: "2025年7月3日",
    excerpt: "地方銀行でのAIチャットボット導入により、顧客満足度向上と業務効率化を同時に実現した事例をご紹介します。"
  },
  {
    id: 5,
    title: "LLMの企業導入におけるセキュリティ考慮事項",
    category: "技術解説",
    date: "2025年7月1日",
    excerpt: "大規模言語モデルを企業で安全に活用するためのセキュリティ対策とガバナンス体制について詳しく解説します。"
  },
  {
    id: 6,
    title: "Algion設立1周年を迎えました",
    category: "お知らせ",
    date: "2025年6月28日",
    excerpt: "Algion株式会社の設立から1年を迎え、これまでの歩みと今後のビジョンについてお知らせいたします。"
  }
];

// 最新記事を取得する関数
export const getLatestArticles = (limit: number = 3): Article[] => {
  return articles.slice(0, limit);
};