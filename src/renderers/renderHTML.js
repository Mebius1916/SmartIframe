import { addBaseStyles } from './addBaseStyles.js';

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

const createShadowRoot = (container) => {
  if (container.shadowRoot) {
    return container.shadowRoot;
  }

  try {
    return container.attachShadow({ mode: 'open', delegatesFocus: false });
  } catch (error) {
    if (error.name === 'NotSupportedError') {
      console.warn('[Renderer] Shadow root 已存在，使用容器自身');
      return container;
    }
    throw error;
  }
}

export default renderHTML; 