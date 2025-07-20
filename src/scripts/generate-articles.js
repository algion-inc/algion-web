const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// カテゴリーディレクトリとカテゴリー名のマッピング
const categoryMapping = {
  'case-studies': '導入事例',
  'technical': '技術解説',
  'news': 'お知らせ',
};

function generateArticlesData() {
  const contentDirectory = path.join(process.cwd(), 'src/app/media/content');
  const articles = [];
  let idCounter = 1;

  // 各カテゴリーディレクトリを処理
  for (const [dirName, category] of Object.entries(categoryMapping)) {
    const categoryPath = path.join(contentDirectory, dirName);
    
    // ディレクトリの存在確認
    if (!fs.existsSync(categoryPath)) {
      console.warn(`Category directory not found: ${categoryPath}`);
      continue;
    }

    try {
      const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        
        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const { data } = matter(fileContent);

          // 必須フィールドの検証
          if (!data.title || !data.date || !data.excerpt) {
            console.warn(`Missing required fields in ${filePath}`);
            continue;
          }

          // slugをファイル名から生成（拡張子を除く）
          const slug = file.replace(/\.md$/, '');

          // 日付をフォーマット（YYYY-MM-DD -> YYYY年MM月DD日）
          const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
          };

          // 日付の処理
          const rawDate = data.date ? new Date(data.date) : null;
          const formattedDate = data.date ? formatDate(data.date) : '日付不明';

          const article = {
            id: idCounter++,
            title: data.title,
            category: data.category || category,
            date: formattedDate,
            rawDate: rawDate ? rawDate.toISOString() : null,
            excerpt: data.excerpt,
            slug: data.slug || slug,
            author: data.author,
            tags: data.tags,
            featured: data.featured || false,
          };

          articles.push(article);
          
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${categoryPath}:`, error);
    }
  }

  // 日付で降順ソート
  articles.sort((a, b) => {
    if (!a.rawDate && !b.rawDate) return 0;
    if (!a.rawDate) return 1;
    if (!b.rawDate) return -1;
    
    return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
  });

  // 各カテゴリから最新1記事ずつ取得
  const categories = ['導入事例', '技術解説', 'お知らせ'];
  const latestByCategory = [];

  categories.forEach(category => {
    const categoryArticles = articles.filter(article => article.category === category);
    if (categoryArticles.length > 0) {
      latestByCategory.push(categoryArticles[0]);
    }
  });

  // 出力ディレクトリを作成
  const outputDir = path.join(process.cwd(), 'src/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // JSONファイルに出力
  fs.writeFileSync(
    path.join(outputDir, 'articles.json'),
    JSON.stringify({ articles, latestByCategory }, null, 2)
  );

  console.log(`Generated articles data: ${articles.length} articles, ${latestByCategory.length} latest by category`);
  return { articles, latestByCategory };
}

// スクリプトとして実行された場合
if (require.main === module) {
  generateArticlesData();
}

module.exports = { generateArticlesData };