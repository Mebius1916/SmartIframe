import ResourceCache from '../core/ResourceCache.js';
import { processCSSContent } from './processCSSContent.js';
import { addStyleToShadowRoot } from './addStyleToShadowRoot.js';
import { generateStyleId } from './generateStyleId.js';

/**
 * 处理单个样式表
 */
export async function processSingleStyle(stylesheet, shadowRoot) {
  try {
    const cssResource = await ResourceCache.fetchWithCache(stylesheet.absoluteUrl);
    const processedCSS = await processCSSContent(cssResource.content, stylesheet.absoluteUrl);
    
    addStyleToShadowRoot(shadowRoot, processedCSS, generateStyleId(stylesheet.absoluteUrl));
  } catch (error) {
    console.warn(`[Renderer] 样式处理失败: ${stylesheet.absoluteUrl}`, error);
  }
}

export default processSingleStyle; 