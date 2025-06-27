import ResourceCache from './ResourceCache.js';
import HtmlParser from '../utils/htmlParser.js';

/**
 * 渲染引擎 - 负责在Shadow DOM中渲染完整网页
 */
class Renderer {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      sandbox: true,
      loadImages: true,
      loadScripts: true,
      loadStyles: true,
      ...options
    };
    
    this.shadowRoot = null;
    this.shadowRootCreated = false;
    this.baseUrl = '';
    this.resourceMap = new Map();
    this.isRendered = false;
  }

  /**
   * 渲染URL指定的网页
   * @param {string} url - 要渲染的网页URL
   * @returns {Promise<void>}
   */
  async renderUrl(url) {
    try {
      console.log(`[SmartIframe] 开始渲染: ${url}`);
      this.baseUrl = url;

      // 1. 获取HTML内容
      const htmlResource = await ResourceCache.fetchWithCache(url);
      
      // 2. 解析HTML并提取资源
      const parsed = HtmlParser.parseHTML(htmlResource.content, url);
      
      // 3. 预加载所有资源
      if (parsed.allUrls.length > 0) {
        await this.preloadResources(parsed.allUrls);
      }

      // 4. 创建Shadow DOM
      this.createShadowRoot();

      // 5. 处理CSS样式
      await this.processStyles(parsed.resources.stylesheets);

      // 6. 渲染HTML结构
      this.renderHTML(parsed.document);

      // 7. 处理JavaScript（如果启用）
      if (this.options.loadScripts) {
        await this.processScripts(parsed.resources.scripts);
      }

      // 8. 处理图片资源
      if (this.options.loadImages) {
        this.processImages(parsed.resources.images);
      }

      this.isRendered = true;
      console.log(`[SmartIframe] 渲染完成: ${url}`);
      
      // 触发渲染完成事件
      this.dispatchEvent('rendered', { url, resources: parsed.resources });

    } catch (error) {
      console.error(`[SmartIframe] 渲染失败: ${url}`, error);
      this.dispatchEvent('error', { url, error });
      throw error;
    }
  }

  /**
   * 创建Shadow DOM
   */
  createShadowRoot() {
    if (this.shadowRoot) {
      return;
    }

    if (this.shadowRootCreated) {
      console.warn('[SmartIframe] Shadow root 已存在，跳过创建');
      return;
    }

    if (this.container.shadowRoot) {
      this.shadowRoot = this.container.shadowRoot;
      this.shadowRootCreated = true;
      this.shadowRoot.innerHTML = '';
    } else {
      try {
        this.shadowRoot = this.container.attachShadow({ 
          mode: 'open',
          delegatesFocus: false 
        });
        this.shadowRootCreated = true;
      } catch (error) {
        if (error.name === 'NotSupportedError') {
          console.warn('[SmartIframe] Shadow root 已存在，尝试重用现有容器');
          this.shadowRootCreated = true;
          this.shadowRoot = this.container;
        } else {
          throw error;
        }
      }
    }

    const resetStyle = document.createElement('style');
    resetStyle.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
    `;
    
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(resetStyle);
    }
  }

  /**
   * 预加载资源
   * @param {Array<string>} urls - 资源URL列表
   */
  async preloadResources(urls) {
    const filteredUrls = urls.filter(url => {
      // 过滤掉不需要预加载的资源
      return !url.startsWith('data:') && 
             !url.startsWith('blob:') && 
             !url.startsWith('javascript:');
    });

    if (filteredUrls.length > 0) {
      await ResourceCache.preloadResources(filteredUrls);
    }
  }

  /**
   * 处理CSS样式
   * @param {Array} stylesheets - CSS资源列表
   */
  async processStyles(stylesheets) {
    if (!this.options.loadStyles) {
      return;
    }

    for (const stylesheet of stylesheets) {
      try {
        if (stylesheet.type === 'stylesheet') {
          const cssResource = await ResourceCache.fetchWithCache(stylesheet.absoluteUrl);
          const processedCSS = await this.processCSSContent(cssResource.content, stylesheet.absoluteUrl);
          
          const style = document.createElement('style');
          style.textContent = processedCSS;
          this.shadowRoot.appendChild(style);
          
        } else if (stylesheet.type === 'import') {
          // 处理@import
          const cssResource = await ResourceCache.fetchWithCache(stylesheet.absoluteUrl);
          const processedCSS = await this.processCSSContent(cssResource.content, stylesheet.absoluteUrl);
          
          // 替换原来的@import
          const parentStyle = stylesheet.parentStyle;
          if (parentStyle) {
            let content = parentStyle.textContent;
            content = content.replace(
              new RegExp(`@import\\s+(?:url\\()?["']?${stylesheet.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?\\)?[^;]*;`),
              processedCSS
            );
            parentStyle.textContent = content;
          }
        }
      } catch (error) {
        console.warn(`[SmartIframe] CSS加载失败: ${stylesheet.absoluteUrl}`, error);
      }
    }
  }

  /**
   * 处理CSS内容，解析其中的url()引用
   * @param {string} cssContent - CSS内容
   * @param {string} baseUrl - CSS文件的基础URL
   * @returns {Promise<string>} 处理后的CSS内容
   */
  async processCSSContent(cssContent, baseUrl) {
    // 提取CSS中的所有URL引用
    const urlRegex = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
    const urls = [];
    let match;

    while ((match = urlRegex.exec(cssContent)) !== null) {
      const url = match[1];
      if (!url.startsWith('data:') && !url.startsWith('blob:')) {
        const absoluteUrl = HtmlParser.resolveUrl(url, baseUrl);
        urls.push({ originalUrl: url, absoluteUrl });
      }
    }

    // 预加载这些资源
    if (urls.length > 0) {
      const urlList = urls.map(u => u.absoluteUrl);
      await ResourceCache.preloadResources(urlList);
    }

    // 替换URL引用为缓存的blob URL
    let processedCSS = cssContent;
    for (const urlInfo of urls) {
      try {
        const resource = await ResourceCache.fetchWithCache(urlInfo.absoluteUrl);
        if (resource && resource.content) {
          // 如果是blob URL，直接使用
          const newUrl = resource.content.startsWith('blob:') ? resource.content : `data:${resource.contentType};base64,${btoa(resource.content)}`;
          processedCSS = processedCSS.replace(
            new RegExp(`url\\(\\s*["']?${urlInfo.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?\\s*\\)`, 'g'),
            `url(${newUrl})`
          );
        }
      } catch (error) {
        console.warn(`[SmartIframe] CSS资源处理失败: ${urlInfo.absoluteUrl}`, error);
      }
    }

    return processedCSS;
  }

  /**
   * 渲染HTML结构
   * @param {Document} doc - 解析后的文档
   */
  renderHTML(doc) {
    // 克隆body内容到shadow root
    const body = doc.body;
    if (body) {
      // 创建一个容器div
      const container = document.createElement('div');
      container.innerHTML = body.innerHTML;
      
      // 处理所有图片的src属性
      this.processImageElements(container);
      
      this.shadowRoot.appendChild(container);
    }
  }

  /**
   * 处理图片元素
   * @param {Element} container - 容器元素
   */
  processImageElements(container) {
    const images = container.querySelectorAll('img');
    
    images.forEach(async (img) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
        try {
          const absoluteUrl = HtmlParser.resolveUrl(src, this.baseUrl);
          const resource = await ResourceCache.fetchWithCache(absoluteUrl);
          
          if (resource && resource.content) {
            if (resource.content.startsWith('blob:')) {
              img.src = resource.content;
            } else {
              // 转换为data URL
              img.src = `data:${resource.contentType};base64,${btoa(resource.content)}`;
            }
          }
        } catch (error) {
          console.warn(`[SmartIframe] 图片加载失败: ${src}`, error);
        }
      }
    });
  }

  /**
   * 处理JavaScript脚本
   * @param {Array} scripts - 脚本资源列表
   */
  async processScripts(scripts) {
    if (!this.options.sandbox) {
      console.warn('[SmartIframe] 脚本执行需要沙箱环境，跳过JavaScript处理');
      return;
    }

    for (const script of scripts) {
      try {
        const jsResource = await ResourceCache.fetchWithCache(script.absoluteUrl);
        
        // 在沙箱环境中执行脚本
        this.executeScriptInSandbox(jsResource.content, script.absoluteUrl);
        
      } catch (error) {
        console.warn(`[SmartIframe] 脚本加载失败: ${script.absoluteUrl}`, error);
      }
    }
  }

  /**
   * 在沙箱中执行脚本
   * @param {string} scriptContent - 脚本内容
   * @param {string} scriptUrl - 脚本URL
   */
  executeScriptInSandbox(scriptContent, scriptUrl) {
    try {
      // 创建一个受限的执行环境
      const sandbox = {
        console,
        setTimeout,
        setInterval,
        clearTimeout,
        clearInterval,
        document: this.shadowRoot,
        window: new Proxy({}, {
          get: (target, prop) => {
            // 只允许访问安全的属性
            const allowedProps = ['console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'];
            if (typeof prop === 'string' && allowedProps.includes(prop)) {
              return sandbox[prop];
            }
            return undefined;
          }
        })
      };

      // 使用Function构造器创建沙箱环境
      const func = new Function('sandbox', `
        with(sandbox) {
          ${scriptContent}
        }
      `);

      func(sandbox);
      
    } catch (error) {
      console.error(`[SmartIframe] 脚本执行失败: ${scriptUrl}`, error);
    }
  }

  /**
   * 处理图片资源
   * @param {Array} images - 图片资源列表
   */
  processImages(images) {
    // 图片处理已经在renderHTML中进行了
    console.log(`[SmartIframe] 处理了 ${images.length} 个图片资源`);
  }

  /**
   * 触发自定义事件
   * @param {string} eventName - 事件名称
   * @param {Object} detail - 事件详情
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(`smartiframe:${eventName}`, {
      detail,
      bubbles: true,
      cancelable: true
    });
    
    this.container.dispatchEvent(event);
  }

  /**
   * 销毁渲染器
   */
  destroy() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
      // 重置shadowRoot引用，但不移除容器上的shadowRoot
      this.shadowRoot = null;
    }
    
    this.shadowRootCreated = false; // 重置创建标记
    this.resourceMap.clear();
    this.isRendered = false;
    
    console.log('[SmartIframe] 渲染器已销毁');
  }

  /**
   * 获取渲染统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      isRendered: this.isRendered,
      baseUrl: this.baseUrl,
      resourceCount: this.resourceMap.size,
      cacheStats: ResourceCache.getCacheStats()
    };
  }
}

export default Renderer;