import { extractUrlsFromCSS } from './extractUrlsFromCSS.js';

export function extractImages(doc, resources, baseUrl) {
  const images = doc.querySelectorAll('img[src], img[data-src]');
  images.forEach(img => {
    const src = img.getAttribute('src') || img.getAttribute('data-src');
    if (src) {
      const absoluteUrl = new URL(src, baseUrl).toString();
      resources.images.push({
        element: img,
        originalUrl: src,
        absoluteUrl,
        type: 'image'
      });
    }
  });

  const elementsWithBg = doc.querySelectorAll('[style*="background"]');
  elementsWithBg.forEach(el => {
    const style = el.getAttribute('style');
    const bgUrls = extractUrlsFromCSS(style, baseUrl);
    bgUrls.forEach(url => {
      resources.images.push({
        element: el,
        originalUrl: url.originalUrl,
        absoluteUrl: url.absoluteUrl,
        type: 'background-image'
      });
    });
  });
}

export default extractImages; 