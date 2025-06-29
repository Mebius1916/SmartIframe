import ResourceCache from './ResourceCache.js';
import { renderHTML, processStyles } from '../renderers/index.js';
import { parseHTML, isUrlAllowed } from '../utils/index.js';
import { getDefaultConfig } from '../config/index.js';
import { setupContainer } from '../container/index.js';
import StateManager from '../ui/StateManager.js';
class SmartIframe {
  constructor(container, options = {}) {
    // 直接使用容器，框架内部调用可以确保类型正确
    this.container = container;
    
    // 简单配置合并，框架内部调用无需过度验证
    this.config = { ...getDefaultConfig(), ...options };
    
    // 状态管理
    this.src = '';
    this.isLoading = false;
    this.isLoaded = false;
    
    // UI状态管理器
    this.stateManager = new StateManager(this.container, this.config);
    
    // 初始化
    setupContainer(this.container, this.config);
  }

  /**
   * 加载URL
   */
  async load(url) {
    if (!url) {
      throw new Error('[SmartIframe] URL不能为空');
    }

    if (!isUrlAllowed(url, this.config)) {
      throw new Error(`[SmartIframe] URL不被允许: ${url}`);
    }

    if (this.isLoading) {
      console.warn('[SmartIframe] 正在加载中，忽略新的加载请求');
      return;
    }

    try {
      this.isLoading = true;
      this.isLoaded = false;
      this.src = url;

      this.stateManager.showLoading('正在加载页面...');

      const result = await Promise.race([
        this.performLoad(url),
        // 超时控制
        new Promise(resolve => setTimeout(() => resolve('timeout'), this.config.renderTimeout))
      ]);

      if (result === 'timeout') {
        throw new Error('加载超时');
      }

      // 成功处理
      this.isLoading = false;
      this.isLoaded = true;
      this.stateManager.showSuccess();
      
      return result;

    } catch (error) {
      // 错误处理
      this.isLoading = false;
      this.isLoaded = false;
      this.stateManager.showError(error, url);
      throw error;
    }
  }

  /**
   * 执行加载
   */
  async performLoad(url) {
    // 1. 获取HTML
    const htmlResource = await ResourceCache.fetchWithCache(url);
    
    // 2. 解析HTML
    const parsed = parseHTML(htmlResource.content, url);
    
    // 3. 预加载资源
    if (parsed.allUrls.length > 0) {
      const limitedUrls = parsed.allUrls.slice(0, this.config.preloadLimit);
      await ResourceCache.preloadResources(limitedUrls);
    }

    // 4. 渲染HTML
    const shadowRoot = await renderHTML(this.container, parsed.document, this.config);

    // 5. 处理样式
    if (parsed.resources.stylesheets.length > 0) {
      await processStyles(parsed.resources.stylesheets, shadowRoot, this.config);
    }

    return { url, parsed };
  }

  /**
   * 重新加载
   */
  async reload() {
    if (this.src) {
      await this.load(this.src);
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      url: this.src,
      loading: this.isLoading,
      loaded: this.isLoaded,
      state: this.stateManager.getCurrentState(),
      cacheStats: ResourceCache.getStats()
    };
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.stateManager.destroy();
    
    // 清除Shadow DOM
    if (this.container.shadowRoot) {
      this.container.shadowRoot.innerHTML = '';
    }
    
    this.container.classList.remove('smart-iframe-container');
    this.container.removeAttribute('data-smart-iframe');
  }

  // ============ 属性访问器 ============

  get width() { return this.config.width; }
  set width(width) { 
    this.config.width = width;
    if (this.container instanceof HTMLElement) {
      this.container.style.width = width;
    }
  }

  get height() { return this.config.height; }
  set height(height) { 
    this.config.height = height;
    if (this.container instanceof HTMLElement) {
      this.container.style.height = height;
    }
  }

  get loading() { return this.isLoading; }
  get loaded() { return this.isLoaded; }
}

export default SmartIframe;