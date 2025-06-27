import Renderer from './Renderer.js';
import ResourceCache from './ResourceCache.js';

/**
 * SmartIframe - 智能iframe替代方案的核心组件
 */
class SmartIframe {
  constructor(container, options = {}) {
    this.container = this.resolveContainer(container);
    this.options = {
      width: '100%',
      height: '400px',
      sandbox: true,
      loadImages: true,
      loadScripts: false, // 默认关闭脚本执行，提高安全性
      loadStyles: true,
      cache: true,
      ...options
    };

    this.src = '';
    this.renderer = null;
    this.isLoading = false;
    this.isLoaded = false;
    
    this.init();
  }

  /**
   * 解析容器元素
   * @param {string|Element} container - 容器选择器或元素
   * @returns {Element} 容器元素
   */
  resolveContainer(container) {
    if (typeof container === 'string') {
      const element = document.querySelector(container);
      if (!element) {
        throw new Error(`[SmartIframe] 找不到容器元素: ${container}`);
      }
      return element;
    } else if (container instanceof Element) {
      return container;
    } else {
      throw new Error('[SmartIframe] 无效的容器参数');
    }
  }

  /**
   * 初始化组件
   */
  init() {
    this.setupContainer();
    this.setupEventListeners();
    this.renderer = new Renderer(this.container, this.options);
  }

  /**
   * 设置容器样式
   */
  setupContainer() {
    // 设置容器基础样式
    Object.assign(this.container.style, {
      width: this.options.width,
      height: this.options.height,
      border: 'none',
      overflow: 'hidden',
      display: 'block'
    });

    // 添加SmartIframe标识
    this.container.setAttribute('data-smart-iframe', 'true');
    this.container.classList.add('smart-iframe-container');
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 监听渲染事件
    this.container.addEventListener('smartiframe:rendered', (e) => {
      this.isLoading = false;
      this.isLoaded = true;
      this.dispatchEvent('load', e.detail);
    });

    // 监听错误事件
    this.container.addEventListener('smartiframe:error', (e) => {
      this.isLoading = false;
      this.isLoaded = false;
      this.dispatchEvent('error', e.detail);
    });
  }

  /**
   * 加载指定URL的内容
   * @param {string} url - 要加载的URL
   * @returns {Promise<void>}
   */
  async load(url) {
    if (!url) {
      throw new Error('[SmartIframe] URL不能为空');
    }

    if (this.isLoading) {
      console.warn('[SmartIframe] 正在加载中，忽略新的加载请求');
      return;
    }

    try {
      this.isLoading = true;
      this.isLoaded = false;
      this.src = url;

      // 显示加载状态
      this.showLoadingState();

      // 使用渲染器加载内容
      await this.renderer.renderUrl(url);

      // 隐藏加载状态
      this.hideLoadingState();

    } catch (error) {
      this.hideLoadingState();
      this.showErrorState(error);
      throw error;
    }
  }

  /**
   * 显示加载状态
   */
  showLoadingState() {
    this.container.innerHTML = `
      <div class="smart-iframe-loading" style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-family: Arial, sans-serif;
        color: #666;
        background: #f5f5f5;
      ">
        <div style="text-align: center;">
          <div style="
            width: 40px;
            height: 40px;
            border: 3px solid #e0e0e0;
            border-top: 3px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
          "></div>
          <div>正在加载...</div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </div>
    `;
  }

  /**
   * 隐藏加载状态
   */
  hideLoadingState() {
    const loadingElement = this.container.querySelector('.smart-iframe-loading');
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  /**
   * 显示错误状态
   * @param {Error} error - 错误对象
   */
  showErrorState(error) {
    this.container.innerHTML = `
      <div class="smart-iframe-error" style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-family: Arial, sans-serif;
        background: #fff;
        border: 1px solid #ddd;
      ">
        <div style="text-align: center; color: #666; padding: 20px;">
          <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
          <div style="font-size: 16px; margin-bottom: 10px;">加载失败</div>
          <div style="font-size: 14px; color: #999;">${error.message}</div>
          <button onclick="this.closest('.smart-iframe-container').smartIframe.reload()" 
                  style="
                    margin-top: 15px;
                    padding: 8px 16px;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                  ">
            重新加载
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 重新加载当前URL
   * @returns {Promise<void>}
   */
  async reload() {
    if (this.src) {
      // 清除该URL的缓存
      if (this.options.cache) {
        ResourceCache.clearCache(this.src);
      }
      await this.load(this.src);
    }
  }

  /**
   * 设置src属性（类似iframe的src）
   * @param {string} url - URL
   */
  set src(url) {
    this._src = url;
    if (url) {
      this.load(url).catch(error => {
        console.error('[SmartIframe] 自动加载失败:', error);
      });
    }
  }

  /**
   * 获取src属性
   * @returns {string} 当前的URL
   */
  get src() {
    return this._src || '';
  }

  /**
   * 设置宽度
   * @param {string} width - 宽度值
   */
  set width(width) {
    this.options.width = width;
    this.container.style.width = width;
  }

  /**
   * 获取宽度
   * @returns {string} 当前宽度
   */
  get width() {
    return this.options.width;
  }

  /**
   * 设置高度
   * @param {string} height - 高度值
   */
  set height(height) {
    this.options.height = height;
    this.container.style.height = height;
  }

  /**
   * 获取高度
   * @returns {string} 当前高度
   */
  get height() {
    return this.options.height;
  }

  /**
   * 获取加载状态
   * @returns {boolean} 是否正在加载
   */
  get loading() {
    return this.isLoading;
  }

  /**
   * 获取加载完成状态
   * @returns {boolean} 是否已加载完成
   */
  get loaded() {
    return this.isLoaded;
  }

  /**
   * 触发自定义事件
   * @param {string} eventName - 事件名称
   * @param {Object} detail - 事件详情
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    
    this.container.dispatchEvent(event);
  }

  /**
   * 销毁组件
   */
  destroy() {
    if (this.renderer) {
      this.renderer.destroy();
      this.renderer = null;
    }

    // 清理容器内容，但保留Shadow DOM结构以便重用
    if (this.container.shadowRoot) {
      this.container.shadowRoot.innerHTML = '';
    } else {
      this.container.innerHTML = '';
    }
    
    this.container.removeAttribute('data-smart-iframe');
    this.container.classList.remove('smart-iframe-container');
    
    this.isLoading = false;
    this.isLoaded = false;
    this._src = '';

    console.log('[SmartIframe] 组件已销毁');
  }

  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      src: this.src,
      loading: this.isLoading,
      loaded: this.isLoaded,
      renderer: this.renderer ? this.renderer.getStats() : null
    };
  }

  /**
   * 静态方法：创建SmartIframe实例
   * @param {string|Element} container - 容器
   * @param {Object} options - 选项
   * @returns {SmartIframe} SmartIframe实例
   */
  static create(container, options = {}) {
    return new SmartIframe(container, options);
  }

  /**
   * 静态方法：获取缓存统计
   * @returns {Object} 缓存统计信息
   */
  static getCacheStats() {
    return ResourceCache.getCacheStats();
  }

  /**
   * 静态方法：清除所有缓存
   */
  static clearAllCache() {
    ResourceCache.clearCache();
  }
}

export default SmartIframe; 