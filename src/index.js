// SmartIframe SDK - 简化版入口文件
import SmartIframe from './core/SmartIframe.js';
import ResourceCache from './core/ResourceCache.js';
import SmartIframeElement from './components/web-component.js';

// 自动注册Web Component
if (typeof window !== 'undefined' && window.customElements && !window.customElements.get('smart-iframe')) {
  window.customElements.define('smart-iframe', SmartIframeElement);
}

// 便捷函数：直接创建实例并加载URL
async function load(container, url, options = {}) {
  const instance = new SmartIframe(container, options);
  await instance.load(url);
  return instance;
}

// 统一使用命名导出
export { 
  SmartIframe as default, 
  SmartIframe, 
  ResourceCache, 
  SmartIframeElement,
  load
}; 