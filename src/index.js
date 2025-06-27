/**
 * Smart-Iframe SDK
 * 智能iframe替代方案，解决资源重复加载问题
 * 
 * 使用方式：
 * 1. ES6 模块：import SmartIframe from 'smart-iframe-sdk'
 * 2. CommonJS：const SmartIframe = require('smart-iframe-sdk')
 * 3. 全局变量：<script src="smart-iframe.min.js"></script>
 * 4. Web Components：<smart-iframe src="https://example.com"></smart-iframe>
 */

import SmartIframe from './core/SmartIframe.js';
import ResourceCache from './core/ResourceCache.js';
import Renderer from './core/Renderer.js';
import HtmlParser from './utils/htmlParser.js';
import SmartIframeElement from './web-components/SmartIframeElement.js';

/**
 * 版本信息
 */
const VERSION = '1.0.0';

/**
 * 快速创建SmartIframe实例的工厂函数
 * @param {string|Element} container - 容器选择器或元素
 * @param {Object} options - 配置选项
 * @returns {SmartIframe} SmartIframe实例
 */
function create(container, options = {}) {
  return new SmartIframe(container, options);
}

/**
 * 快速加载网页到指定容器
 * @param {string|Element} container - 容器选择器或元素
 * @param {string} url - 要加载的URL
 * @param {Object} options - 配置选项
 * @returns {Promise<SmartIframe>} SmartIframe实例
 */
async function load(container, url, options = {}) {
  const iframe = new SmartIframe(container, options);
  await iframe.load(url);
  return iframe;
}

/**
 * 注册自定义元素到全局
 * 调用后可以在HTML中使用 <smart-iframe> 标签
 */
function registerWebComponent() {
  if (typeof window !== 'undefined' && window.customElements) {
    // SmartIframeElement 会自动注册，这里只是确保
    console.log('[SmartIframe] Web Component 已注册');
  } else {
    console.warn('[SmartIframe] 当前环境不支持 Web Components');
  }
}

/**
 * 获取SDK信息
 * @returns {Object} SDK信息
 */
function getInfo() {
  return {
    name: 'smart-iframe-sdk',
    version: VERSION,
    description: '智能iframe替代方案，解决资源重复加载问题',
    author: 'Smart-Iframe Team',
    license: 'MIT',
    cacheStats: ResourceCache.getCacheStats()
  };
}

/**
 * 清除所有缓存
 */
function clearCache() {
  ResourceCache.clearCache();
  console.log('[SmartIframe] 已清除所有缓存');
}

/**
 * 设置全局配置
 * @param {Object} config - 全局配置
 */
function setGlobalConfig(config = {}) {
  if (config.maxCacheSize) {
    ResourceCache.maxCacheSize = config.maxCacheSize;
  }
  
  if (config.maxAge) {
    ResourceCache.maxAge = config.maxAge;
  }
  
  console.log('[SmartIframe] 全局配置已更新:', config);
}

/**
 * 批量预加载URL列表
 * @param {Array<string>} urls - URL列表
 * @returns {Promise<Array>} 预加载结果
 */
async function preload(urls) {
  if (!Array.isArray(urls)) {
    throw new Error('[SmartIframe] preload 参数必须是数组');
  }
  
  console.log(`[SmartIframe] 开始批量预加载 ${urls.length} 个URL`);
  return await ResourceCache.preloadResources(urls);
}

/**
 * 检查浏览器兼容性
 * @returns {Object} 兼容性检查结果
 */
function checkCompatibility() {
  const isSupported = {
    shadowDOM: !!Element.prototype.attachShadow,
    webComponents: typeof customElements !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    proxy: typeof Proxy !== 'undefined',
    asyncAwait: true, // 如果代码能执行到这里就支持
    es6Classes: true,  // 如果代码能执行到这里就支持
    es6Modules: true   // 简化检测，如果能导入就支持
  };
  
  const allSupported = Object.values(isSupported).every(Boolean);
  
  return {
    supported: allSupported,
    features: isSupported,
    recommendation: allSupported 
      ? '✅ 浏览器完全兼容SmartIframe SDK' 
      : '⚠️ 部分功能可能不可用，建议使用现代浏览器'
  };
}

// 默认导出主类
export default SmartIframe;

// 命名导出所有API
export {
  SmartIframe,
  ResourceCache,
  Renderer,
  HtmlParser,
  SmartIframeElement,
  VERSION,
  create,
  load,
  registerWebComponent,
  getInfo,
  clearCache,
  setGlobalConfig,
  preload,
  checkCompatibility
};

// 如果在浏览器环境中，自动注册到全局
if (typeof window !== 'undefined') {
  // 注册到全局对象
  window.SmartIframe = SmartIframe;
  window.SmartIframeSDK = {
    SmartIframe,
    create,
    load,
    registerWebComponent,
    getInfo,
    clearCache,
    setGlobalConfig,
    preload,
    checkCompatibility,
    version: VERSION
  };
  
  // 自动注册Web Component
  registerWebComponent();
  
  console.log(`[SmartIframe] SDK v${VERSION} 已加载`);
  console.log('[SmartIframe] 兼容性检查:', checkCompatibility());
}

// 如果是CommonJS环境
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartIframe;
  module.exports.default = SmartIframe;
  module.exports.create = create;
  module.exports.load = load;
  module.exports.getInfo = getInfo;
  module.exports.clearCache = clearCache;
  module.exports.setGlobalConfig = setGlobalConfig;
  module.exports.preload = preload;
  module.exports.checkCompatibility = checkCompatibility;
  module.exports.version = VERSION;
} 