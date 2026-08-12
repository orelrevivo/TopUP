import { tool } from 'ai';
import { z } from 'zod';
import { isAllowedUrl } from '~/utils/url';

const MAX_CONTENT_LENGTH = 8000;

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractMetaDescription(html: string): string {
  const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (match) return match[1].trim();
  const altMatch = html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  return altMatch ? altMatch[1].trim() : '';
}

function extractTextContent(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export const webSearch = tool({
  description: 'Search the web using DuckDuckGo to get up-to-date information, news, competitors, and articles.',
  parameters: z.object({
    query: z.string().describe('The search query to execute.'),
  }),
  execute: async ({ query }) => {
    try {
      const response = await fetch('https://lite.duckduckgo.com/lite/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': FETCH_HEADERS['User-Agent'],
        },
        body: `q=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        return `Failed to fetch search results from DuckDuckGo: ${response.statusText}`;
      }

      const html = await response.text();
      const results: { url: string; title: string; snippet: string }[] = [];
      const linkRegex = /<a[^>]+href="([^"]+)"[^>]+class='result-link'[^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const url = match[1];
        const title = match[2].replace(/<[^>]+>/g, '').trim();
        const searchArea = html.slice(match.index, match.index + 2000);
        const snippetMatch = searchArea.match(/<td[^>]+class='result-snippet'[^>]*>([\s\S]*?)<\/td>/i);
        const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        results.push({ url, title, snippet });
      }

      if (results.length === 0) {
        return 'No results found.';
      }

      return JSON.stringify(results.slice(0, 8), null, 2);
    } catch (error: any) {
      return `Search error: ${error.message || error}`;
    }
  },
});

export const readPageContent = tool({
  description: 'Fetch and read the raw text content of a specific public URL/webpage to extract details or perform research.',
  parameters: z.object({
    url: z.string().describe('The URL to read'),
  }),
  execute: async ({ url }) => {
    try {
      if (!isAllowedUrl(url)) {
        return 'Error: URL is not allowed. Only public HTTP/HTTPS URLs are accepted.';
      }

      const response = await fetch(url, {
        headers: FETCH_HEADERS,
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        return `Error: Failed to fetch URL: ${response.status} ${response.statusText}`;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
        return 'Error: URL must point to an HTML or text page';
      }

      const html = await response.text();
      const title = extractTitle(html);
      const description = extractMetaDescription(html);
      const content = extractTextContent(html);

      const resultText = [
        `[Web content from ${url}]`,
        `Title: ${title}`,
        `Description: ${description}`,
        `Content:`,
        content.length > MAX_CONTENT_LENGTH ? content.slice(0, MAX_CONTENT_LENGTH) + '...' : content,
      ].join('\n');

      return resultText;
    } catch (error: any) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        return 'Error: Request timed out after 10 seconds';
      }
      return `Error: ${error.message || error}`;
    }
  },
});
