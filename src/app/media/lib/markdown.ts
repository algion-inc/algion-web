import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown support (tables, strikethrough, etc.)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  
  return result.toString();
}