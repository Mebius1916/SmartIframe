import { resolveUrl } from './resolveUrl.js';

/**
 * 提取其他链接资源
 */
export function extractOtherLinks(doc, resources, baseUrl) {
  const links = doc.querySelectorAll('link:not([rel="stylesheet"]):not([rel="preload"][as="style"])');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const absoluteUrl = resolveUrl(href, baseUrl);
      resources.links.push({
        element: link,
        originalUrl: href,
        absoluteUrl,
        type: 'link',
        rel: link.getAttribute('rel') || 'unknown'
      });
    }
  });
}

export default extractOtherLinks; 