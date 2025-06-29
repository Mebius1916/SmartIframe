import ResourceCache from './components/ResourceCache.js';
import SmartIframeElement from './components/web-component.js';

// 注册容器名为smart-iframe
if (typeof window !== 'undefined' && window.customElements && !window.customElements.get('smart-iframe')) {
  window.customElements.define('smart-iframe', SmartIframeElement);
}

export { 
  ResourceCache, 
}; 