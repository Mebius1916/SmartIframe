import ResourceCache from '../components/ResourceCache.js';

/**
 * 处理CSS内容
 */
export async function processCSSContent(cssContent, baseUrl) {
  let processedCSS = cssContent;

  // 处理URL引用
  const urlMatches = cssContent.match(/url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi);
  
  if (urlMatches) {
    const urlPromises = urlMatches.map(async (match) => {
      const urlMatch = match.match(/url\s*\(\s*["']?([^"')]+)["']?\s*\)/i);
      if (urlMatch && urlMatch[1]) {
        const originalUrl = urlMatch[1];
        
        if (originalUrl.startsWith('data:') || originalUrl.startsWith('http')) {
          return { original: match, replacement: match };
        }

        try {
          const absoluteUrl = new URL(originalUrl, baseUrl).toString();
          const resource = await ResourceCache.fetchWithCache(absoluteUrl);
          
          if (resource.contentType && resource.contentType.startsWith('image/')) {
            return { 
              original: match, 
              replacement: `url("${resource.content}")` 
            };
          } else {
            return { 
              original: match, 
              replacement: `url("${absoluteUrl}")` 
            };
          }
        } catch (error) {
          return { original: match, replacement: match };
        }
      }
      return { original: match, replacement: match };
    });

    const urlReplacements = await Promise.all(urlPromises);
    
    urlReplacements.forEach(({ original, replacement }) => {
      processedCSS = processedCSS.replace(original, replacement);
    });
  }

  // 处理@import规则
  const importMatches = cssContent.match(/@import\s+(?:url\()?["']?([^"')]+)["']?\)?[^;]*;/g);
  
  if (importMatches) {
    for (const importMatch of importMatches) {
      const urlMatch = importMatch.match(/["']?([^"')]+)["']?/);
      if (urlMatch && urlMatch[1]) {
        try {
          const importUrl = new URL(urlMatch[1], baseUrl).toString();
          const importResource = await ResourceCache.fetchWithCache(importUrl);
          const nestedCSS = await processCSSContent(importResource.content, importUrl);
          
          processedCSS = processedCSS.replace(importMatch, nestedCSS);
        } catch (error) {
          // 保留原始@import
        }
      }
    }
  }
  
  return processedCSS;
}

export default processCSSContent; 