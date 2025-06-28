import { checkES6Support } from './checkES6Support.js';

/**
 * 环境检测功能
 */
export function checkEnvironment() {
  return {
    shadowDOM: !!Element.prototype.attachShadow,
    customElements: !!window.customElements,
    fetch: !!window.fetch,
    promise: !!window.Promise,
    es6: checkES6Support()
  };
}

export default checkEnvironment; 