/**
 * 创建Shadow DOM
 */
export function createShadowRoot(container) {
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

export default createShadowRoot; 