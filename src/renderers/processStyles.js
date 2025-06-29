import ResourceCache from '../components/ResourceCache.js';
import { processCSSContent } from './processCSSContent.js';

/**
 * 处理样式表
 */
export async function processStyles(stylesheets, shadowRoot, config) {
  if (!config.loadStyles) return;

  const promises = stylesheets.map(async (stylesheet) => {
    try {
      const cssResource = await ResourceCache.fetchWithCache(stylesheet.absoluteUrl);
      const processedCSS = await processCSSContent(cssResource.content, stylesheet.absoluteUrl);
      
      // 直接内联添加样式的逻辑，避免过度抽象
      const style = document.createElement('style');
      style.textContent = processedCSS;
      shadowRoot.appendChild(style);
    } catch (error) {
      console.warn(`[Renderer] 样式处理失败: ${stylesheet.absoluteUrl}`, error);
    }
  });
  
  await Promise.all(promises);
}

export default processStyles; 