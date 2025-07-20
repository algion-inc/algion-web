import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Article {
  id: number;
  title: string;
  category: "導入事例" | "技術解説" | "お知らせ";
  date: string;
  rawDate: Date | null;
  excerpt: string;
  slug: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  content?: string;
}

const contentDirectory = path.join(process.cwd(), 'src/app/media/content');

// カテゴリーディレクトリとカテゴリー名のマッピング
const categoryMapping = {
  'case-studies': '導入事例' as const,
  'technical': '技術解説' as const,
  'news': 'お知らせ' as const,
};

// frontmatterデータの型定義
interface FrontmatterData {
  title?: string;
  category?: string;
  date?: string;
  excerpt?: string;
  slug?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
}

// 型ガード関数
function isValidCategory(category: any): category is Article['category'] {
  return typeof category === 'string' && 
         ['導入事例', '技術解説', 'お知らせ'].includes(category);
}

function isValidDate(date: any): boolean {
  if (typeof date !== 'string') return false;
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

function isValidTags(tags: any): tags is string[] {
  return Array.isArray(tags) && tags.every(tag => typeof tag === 'string');
}

function validateFrontmatter(data: any, filePath: string): {
  isValid: boolean;
  validatedData: Partial<FrontmatterData>;
  errors: string[];
} {
  const errors: string[] = [];
  const validatedData: Partial<FrontmatterData> = {};

  // title検証
  if (typeof data.title === 'string' && data.title.trim()) {
    validatedData.title = data.title.trim();
  } else {
    errors.push('title is required and must be a non-empty string');
  }

  // category検証
  if (isValidCategory(data.category)) {
    validatedData.category = data.category;
  } else {
    errors.push('category must be one of: 導入事例, 技術解説, お知らせ');
  }

  // date検証
  if (isValidDate(data.date)) {
    validatedData.date = data.date;
  } else {
    errors.push('date must be a valid date string (YYYY-MM-DD format recommended)');
  }

  // excerpt検証
  if (typeof data.excerpt === 'string' && data.excerpt.trim()) {
    validatedData.excerpt = data.excerpt.trim();
  } else {
    errors.push('excerpt is required and must be a non-empty string');
  }

  // slug検証（オプション）
  if (data.slug !== undefined) {
    if (typeof data.slug === 'string' && data.slug.trim()) {
      validatedData.slug = data.slug.trim();
    } else {
      errors.push('slug must be a non-empty string if provided');
    }
  }

  // author検証（オプション）
  if (data.author !== undefined) {
    if (typeof data.author === 'string' && data.author.trim()) {
      validatedData.author = data.author.trim();
    } else {
      errors.push('author must be a non-empty string if provided');
    }
  }

  // tags検証（オプション）
  if (data.tags !== undefined) {
    if (isValidTags(data.tags)) {
      validatedData.tags = data.tags;
    } else {
      errors.push('tags must be an array of strings if provided');
    }
  }

  // featured検証（オプション）
  if (data.featured !== undefined) {
    if (typeof data.featured === 'boolean') {
      validatedData.featured = data.featured;
    } else {
      errors.push('featured must be a boolean if provided');
    }
  }

  return {
    isValid: errors.length === 0,
    validatedData,
    errors
  };
}

export async function getArticles(): Promise<Article[]> {
  const articles: Article[] = [];
  let idCounter = 1;

  // 各カテゴリーディレクトリを処理
  for (const [dirName, category] of Object.entries(categoryMapping)) {
    const categoryPath = path.join(contentDirectory, dirName);
    
    // ディレクトリの存在確認
    try {
      if (!fs.existsSync(categoryPath)) {
        console.warn(`Category directory not found: ${categoryPath}`);
        continue;
      }
    } catch (error) {
      console.error(`Error checking directory ${categoryPath}:`, error);
      continue;
    }

    let files: string[];
    try {
      files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.md'));
    } catch (error) {
      console.error(`Error reading directory ${categoryPath}:`, error);
      continue;
    }

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        // frontmatterデータの検証
        const validation = validateFrontmatter(data, filePath);
        
        if (!validation.isValid) {
          console.error(`Invalid frontmatter in ${filePath}:`);
          validation.errors.forEach(error => console.error(`  - ${error}`));
          continue; // 検証エラーの場合はスキップ
        }

        const validData = validation.validatedData;

        // slugをファイル名から生成（拡張子を除く）
        const slug = file.replace(/\.md$/, '');

        // 日付をフォーマット（YYYY-MM-DD -> YYYY年MM月DD日）
        const formatDate = (dateStr: string): string => {
          const date = new Date(dateStr);
          return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        };

        // 日付の処理（検証済みデータを使用）
        const rawDate = validData.date ? new Date(validData.date) : null;
        const formattedDate = validData.date ? formatDate(validData.date) : '日付不明';

        const article: Article = {
          id: idCounter++,
          title: validData.title || 'タイトルなし',
          category: validData.category || category,
          date: formattedDate,
          rawDate: rawDate,
          excerpt: validData.excerpt || '',
          slug: validData.slug || slug,
          author: validData.author,
          tags: validData.tags,
          featured: validData.featured || false,
          content,
        };

        articles.push(article);
        
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        // ファイル処理エラーでも他のファイルは継続処理
        continue;
      }
    }
  }

  // 日付で降順ソート（rawDateを使用）
  return articles.sort((a, b) => {
    // rawDateがnullの場合は最後に配置
    if (!a.rawDate && !b.rawDate) return 0;
    if (!a.rawDate) return 1;
    if (!b.rawDate) return -1;
    
    return b.rawDate.getTime() - a.rawDate.getTime();
  });
}

// 最新記事を取得する関数（既存のAPIとの互換性のため）
export const getLatestArticles = async (limit: number = 3): Promise<Article[]> => {
  try {
    const articles = await getArticles();
    return articles.slice(0, limit);
  } catch (error) {
    console.error(`Error getting latest articles:`, error);
    return [];
  }
};

// 特定のカテゴリーの記事を取得
export const getArticlesByCategory = async (category: Article['category']): Promise<Article[]> => {
  try {
    const articles = await getArticles();
    return articles.filter(article => article.category === category);
  } catch (error) {
    console.error(`Error getting articles by category ${category}:`, error);
    return [];
  }
};


// スラッグで記事を取得（将来の個別記事ページ用）
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const articles = await getArticles();
    return articles.find(article => article.slug === slug) || null;
  } catch (error) {
    console.error(`Error getting article by slug ${slug}:`, error);
    return null;
  }
};