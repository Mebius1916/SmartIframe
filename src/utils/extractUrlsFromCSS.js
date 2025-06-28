import { resolveUrl } from './resolveUrl.js';

/**
 * 从CSS中提取URL
 */
export function extractUrlsFromCSS(cssContent, baseUrl) {
  const urls = [];
  const urlMatches = cssContent.match(/url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi);
  
  if (urlMatches) {
    urlMatches.forEach(match => {
      const urlMatch = match.match(/url\s*\(\s*["']?([^"')]+)["']?\s*\)/i);
      if (urlMatch && urlMatch[1]) {
        const originalUrl = urlMatch[1];
        const absoluteUrl = resolveUrl(originalUrl, baseUrl);
        urls.push({ originalUrl, absoluteUrl });
      }
    });
  }
  
  return urls;
}

export default extractUrlsFromCSS; 