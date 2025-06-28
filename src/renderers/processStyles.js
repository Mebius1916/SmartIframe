import { processSingleStyle } from './processSingleStyle.js';

/**
 * 处理样式表
 */
export async function processStyles(stylesheets, shadowRoot, config) {
  if (!config.loadStyles) return;

  const promises = stylesheets.map(stylesheet => processSingleStyle(stylesheet, shadowRoot));
  await Promise.all(promises);
}

export default processStyles; 