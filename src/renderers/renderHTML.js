import { createShadowRoot } from './createShadowRoot.js';
import { addBaseStyles } from './addBaseStyles.js';

/**
 * 渲染HTML到Shadow DOM
 */
export async function renderHTML(container, document, config) {
  const shadowRoot = createShadowRoot(container);
  
  // 清空Shadow DOM
  shadowRoot.innerHTML = '';
  
  // 添加基础样式
  addBaseStyles(shadowRoot);
  
  // 克隆并添加内容
  const body = document.body ? document.body.cloneNode(true) : document.documentElement.cloneNode(true);
  shadowRoot.appendChild(body);
  
  return shadowRoot;
}

export default renderHTML; 