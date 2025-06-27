'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 资源缓存层 - 解决重复请求问题的核心模块
 */
class ResourceCache {
  static cache = new Map();
  static pendingRequests = new Map();
  static maxCacheSize = 100; // 最大缓存数量
  static maxAge = 30 * 60 * 1000; // 30分钟过期时间

  /**
   * 带缓存的资源获取
   * @param {string} url - 资源URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 缓存的资源对象
   */
  static async fetchWithCache(url, options = {}) {
    const normalizedUrl = this.normalizeUrl(url);

    // 检查缓存
    if (this.cache.has(normalizedUrl)) {
      const cached = this.cache.get(normalizedUrl);

      // 检查是否过期
      if (Date.now() - cached.timestamp < this.maxAge) {
        console.log(`[SmartIframe] 使用缓存: ${normalizedUrl}`);
        return cached;
      } else {
        // 删除过期缓存
        this.cache.delete(normalizedUrl);
      }
    }

    // 检查是否有正在进行的请求
    if (this.pendingRequests.has(normalizedUrl)) {
      console.log(`[SmartIframe] 等待正在进行的请求: ${normalizedUrl}`);
      return await this.pendingRequests.get(normalizedUrl);
    }

    // 发起新请求
    console.log(`[SmartIframe] 发起新请求: ${normalizedUrl}`);
    const requestPromise = this.performRequest(normalizedUrl, options);
    this.pendingRequests.set(normalizedUrl, requestPromise);
    try {
      const result = await requestPromise;
      this.pendingRequests.delete(normalizedUrl);

      // 存入缓存
      this.addToCache(normalizedUrl, result);
      return result;
    } catch (error) {
      this.pendingRequests.delete(normalizedUrl);
      throw error;
    }
  }

  /**
   * 执行实际的HTTP请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 请求结果
   */
  static async performRequest(url, options) {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        cache: 'default',
        ...options
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get('content-type') || '';
      let content;
      if (contentType.includes('text/') || contentType.includes('application/javascript') || contentType.includes('application/json')) {
        content = await response.text();
      } else {
        // 对于二进制资源，转换为blob URL
        const blob = await response.blob();
        content = URL.createObjectURL(blob);
      }
      return {
        content,
        contentType,
        url,
        timestamp: Date.now(),
        size: content.length || 0
      };
    } catch (error) {
      console.error(`[SmartIframe] 请求失败: ${url}`, error);
      throw error;
    }
  }

  /**
   * URL标准化处理
   * @param {string} url - 原始URL
   * @returns {string} 标准化后的URL
   */
  static normalizeUrl(url) {
    try {
      const urlObj = new URL(url, window.location.href);
      // 移除fragment，保留query参数
      urlObj.hash = '';
      return urlObj.toString();
    } catch (error) {
      console.warn(`[SmartIframe] URL标准化失败: ${url}`, error);
      return url;
    }
  }

  /**
   * 添加到缓存
   * @param {string} url - URL
   * @param {Object} data - 缓存数据
   */
  static addToCache(url, data) {
    // 检查缓存大小限制
    if (this.cache.size >= this.maxCacheSize) {
      // 删除最旧的缓存项
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      console.log(`[SmartIframe] 删除最旧缓存: ${oldestKey}`);
    }
    this.cache.set(url, data);
    console.log(`[SmartIframe] 缓存已保存: ${url} (${data.size} bytes)`);
  }

  /**
   * 清除缓存
   * @param {string} url - 可选的特定URL，不传则清除全部
   */
  static clearCache(url = null) {
    if (url) {
      const normalizedUrl = this.normalizeUrl(url);
      this.cache.delete(normalizedUrl);
      console.log(`[SmartIframe] 已清除缓存: ${normalizedUrl}`);
    } else {
      this.cache.clear();
      console.log('[SmartIframe] 已清除全部缓存');
    }
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 缓存统计
   */
  static getCacheStats() {
    const totalSize = Array.from(this.cache.values()).reduce((sum, item) => sum + (item.size || 0), 0);
    return {
      count: this.cache.size,
      totalSize,
      maxSize: this.maxCacheSize,
      pendingRequests: this.pendingRequests.size
    };
  }

  /**
   * 预加载资源列表
   * @param {Array<string>} urls - 要预加载的URL列表
   * @returns {Promise<Array>} 预加载结果
   */
  static async preloadResources(urls) {
    console.log(`[SmartIframe] 开始预加载 ${urls.length} 个资源`);
    const promises = urls.map(url => this.fetchWithCache(url).catch(error => {
      console.warn(`[SmartIframe] 预加载失败: ${url}`, error);
      return null;
    }));
    const results = await Promise.all(promises);
    const successCount = results.filter(r => r !== null).length;
    console.log(`[SmartIframe] 预加载完成: ${successCount}/${urls.length} 成功`);
    return results;
  }
}

/**
 * HTML解析器 - 解析HTML并提取所有资源引用
 */
class HtmlParser {
  /**
   * 解析HTML内容，提取所有资源引用
   * @param {string} html - HTML内容
   * @param {string} baseUrl - 基础URL，用于解析相对路径
   * @returns {Object} 解析结果
   */
  static parseHTML(html, baseUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const resources = {
      stylesheets: [],
      scripts: [],
      images: [],
      links: [],
      other: []
    };

    // 提取CSS资源
    this.extractStylesheets(doc, resources, baseUrl);

    // 提取JavaScript资源
    this.extractScripts(doc, resources, baseUrl);

    // 提取图片资源
    this.extractImages(doc, resources, baseUrl);

    // 提取其他链接资源
    this.extractOtherLinks(doc, resources, baseUrl);

    // 处理内联样式中的URL
    this.extractInlineStyleUrls(doc, resources, baseUrl);
    return {
      document: doc,
      resources,
      allUrls: this.getAllUrls(resources)
    };
  }

  /**
   * 提取CSS样式表
   */
  static extractStylesheets(doc, resources, baseUrl) {
    const links = doc.querySelectorAll('link[rel="stylesheet"], link[rel="preload"][as="style"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const absoluteUrl = this.resolveUrl(href, baseUrl);
        resources.stylesheets.push({
          element: link,
          originalUrl: href,
          absoluteUrl,
          type: 'stylesheet'
        });
      }
    });

    // 提取style标签中的@import
    const styleTags = doc.querySelectorAll('style');
    styleTags.forEach(style => {
      const content = style.textContent;
      const importMatches = content.match(/@import\s+(?:url\()?["']?([^"')]+)["']?\)?[^;]*;/g);
      if (importMatches) {
        importMatches.forEach(match => {
          const urlMatch = match.match(/["']?([^"')]+)["']?/);
          if (urlMatch && urlMatch[1]) {
            const absoluteUrl = this.resolveUrl(urlMatch[1], baseUrl);
            resources.stylesheets.push({
              element: style,
              originalUrl: urlMatch[1],
              absoluteUrl,
              type: 'import',
              parentStyle: style
            });
          }
        });
      }
    });
  }

  /**
   * 提取JavaScript脚本
   */
  static extractScripts(doc, resources, baseUrl) {
    const scripts = doc.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src) {
        const absoluteUrl = this.resolveUrl(src, baseUrl);
        resources.scripts.push({
          element: script,
          originalUrl: src,
          absoluteUrl,
          type: 'script',
          async: script.hasAttribute('async'),
          defer: script.hasAttribute('defer'),
          module: script.type === 'module'
        });
      }
    });
  }

  /**
   * 提取图片资源
   */
  static extractImages(doc, resources, baseUrl) {
    const images = doc.querySelectorAll('img[src], img[data-src]');
    images.forEach(img => {
      const src = img.getAttribute('src') || img.getAttribute('data-src');
      if (src) {
        const absoluteUrl = this.resolveUrl(src, baseUrl);
        resources.images.push({
          element: img,
          originalUrl: src,
          absoluteUrl,
          type: 'image'
        });
      }

      // 处理srcset
      const srcset = img.getAttribute('srcset');
      if (srcset) {
        const srcsetUrls = this.parseSrcset(srcset, baseUrl);
        srcsetUrls.forEach(url => {
          resources.images.push({
            element: img,
            originalUrl: url.originalUrl,
            absoluteUrl: url.absoluteUrl,
            type: 'image-srcset'
          });
        });
      }
    });

    // 处理背景图片
    const elementsWithBg = doc.querySelectorAll('[style*="background"]');
    elementsWithBg.forEach(el => {
      const style = el.getAttribute('style');
      const bgUrls = this.extractBackgroundUrls(style, baseUrl);
      bgUrls.forEach(url => {
        resources.images.push({
          element: el,
          originalUrl: url.originalUrl,
          absoluteUrl: url.absoluteUrl,
          type: 'background-image'
        });
      });
    });
  }

  /**
   * 提取其他链接资源
   */
  static extractOtherLinks(doc, resources, baseUrl) {
    const links = doc.querySelectorAll('link:not([rel="stylesheet"]):not([rel="preload"][as="style"])');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const absoluteUrl = this.resolveUrl(href, baseUrl);
        const rel = link.getAttribute('rel') || 'unknown';
        resources.links.push({
          element: link,
          originalUrl: href,
          absoluteUrl,
          type: 'link',
          rel
        });
      }
    });

    // 处理其他可能的资源引用
    const otherElements = doc.querySelectorAll('source[src], track[src], embed[src], object[data]');
    otherElements.forEach(el => {
      const src = el.getAttribute('src') || el.getAttribute('data');
      if (src) {
        const absoluteUrl = this.resolveUrl(src, baseUrl);
        resources.other.push({
          element: el,
          originalUrl: src,
          absoluteUrl,
          type: el.tagName.toLowerCase()
        });
      }
    });
  }

  /**
   * 提取内联样式中的URL
   */
  static extractInlineStyleUrls(doc, resources, baseUrl) {
    const elementsWithStyle = doc.querySelectorAll('[style]');
    elementsWithStyle.forEach(el => {
      const style = el.getAttribute('style');
      const urls = this.extractUrlsFromCSS(style, baseUrl);
      urls.forEach(url => {
        resources.other.push({
          element: el,
          originalUrl: url.originalUrl,
          absoluteUrl: url.absoluteUrl,
          type: 'inline-style'
        });
      });
    });
  }

  /**
   * 从CSS内容中提取URL
   */
  static extractUrlsFromCSS(cssContent, baseUrl) {
    const urls = [];
    const urlRegex = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
    let match;
    while ((match = urlRegex.exec(cssContent)) !== null) {
      const originalUrl = match[1];
      const absoluteUrl = this.resolveUrl(originalUrl, baseUrl);
      urls.push({
        originalUrl,
        absoluteUrl
      });
    }
    return urls;
  }

  /**
   * 提取背景图片URL
   */
  static extractBackgroundUrls(styleContent, baseUrl) {
    return this.extractUrlsFromCSS(styleContent, baseUrl);
  }

  /**
   * 解析srcset属性
   */
  static parseSrcset(srcset, baseUrl) {
    const urls = [];
    const entries = srcset.split(',');
    entries.forEach(entry => {
      const trimmed = entry.trim();
      const parts = trimmed.split(/\s+/);
      if (parts.length > 0) {
        const originalUrl = parts[0];
        const absoluteUrl = this.resolveUrl(originalUrl, baseUrl);
        urls.push({
          originalUrl,
          absoluteUrl
        });
      }
    });
    return urls;
  }

  /**
   * 解析相对URL为绝对URL
   */
  static resolveUrl(url, baseUrl) {
    try {
      // 如果已经是绝对URL，直接返回
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        return url.startsWith('//') ? `https:${url}` : url;
      }

      // 如果是data URL或其他特殊协议，直接返回
      if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('javascript:')) {
        return url;
      }

      // 解析相对URL
      const base = new URL(baseUrl);
      const resolved = new URL(url, base);
      return resolved.toString();
    } catch (error) {
      console.warn(`[SmartIframe] URL解析失败: ${url} (base: ${baseUrl})`, error);
      return url;
    }
  }

  /**
   * 获取所有资源URL列表
   */
  static getAllUrls(resources) {
    const allUrls = [];
    Object.values(resources).forEach(resourceList => {
      resourceList.forEach(resource => {
        if (resource.absoluteUrl && !allUrls.includes(resource.absoluteUrl)) {
          allUrls.push(resource.absoluteUrl);
        }
      });
    });
    return allUrls;
  }

  /**
   * 重写HTML中的资源引用
   * @param {Document} doc - DOM文档
   * @param {Object} resourceMap - 资源映射表 {originalUrl: newUrl}
   * @returns {string} 重写后的HTML
   */
  static rewriteResourceReferences(doc, resourceMap) {
    // 重写link标签
    doc.querySelectorAll('link[href]').forEach(link => {
      const href = link.getAttribute('href');
      const absoluteUrl = this.resolveUrl(href, window.location.href);
      if (resourceMap[absoluteUrl]) {
        link.setAttribute('href', resourceMap[absoluteUrl]);
      }
    });

    // 重写script标签
    doc.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src');
      const absoluteUrl = this.resolveUrl(src, window.location.href);
      if (resourceMap[absoluteUrl]) {
        script.setAttribute('src', resourceMap[absoluteUrl]);
      }
    });

    // 重写img标签
    doc.querySelectorAll('img[src]').forEach(img => {
      const src = img.getAttribute('src');
      const absoluteUrl = this.resolveUrl(src, window.location.href);
      if (resourceMap[absoluteUrl]) {
        img.setAttribute('src', resourceMap[absoluteUrl]);
      }
    });

    // 重写style标签中的@import和url()
    doc.querySelectorAll('style').forEach(style => {
      let content = style.textContent;

      // 替换所有URL引用
      content = content.replace(/url\(\s*["']?([^"')]+)["']?\s*\)/g, (match, url) => {
        const absoluteUrl = this.resolveUrl(url, window.location.href);
        const newUrl = resourceMap[absoluteUrl] || url;
        return match.replace(url, newUrl);
      });
      style.textContent = content;
    });
    return doc.documentElement.outerHTML;
  }
}

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
      this.dispatchEvent('rendered', {
        url,
        resources: parsed.resources
      });
    } catch (error) {
      console.error(`[SmartIframe] 渲染失败: ${url}`, error);
      this.dispatchEvent('error', {
        url,
        error
      });
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

    // 检查容器是否已经有Shadow DOM
    if (this.container.shadowRoot) {
      this.shadowRoot = this.container.shadowRoot;
      // 清空现有内容
      this.shadowRoot.innerHTML = '';
    } else {
      this.shadowRoot = this.container.attachShadow({
        mode: 'closed',
        delegatesFocus: false
      });
    }

    // 添加基础样式重置
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
    this.shadowRoot.appendChild(resetStyle);
  }

  /**
   * 预加载资源
   * @param {Array<string>} urls - 资源URL列表
   */
  async preloadResources(urls) {
    const filteredUrls = urls.filter(url => {
      // 过滤掉不需要预加载的资源
      return !url.startsWith('data:') && !url.startsWith('blob:') && !url.startsWith('javascript:');
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
            content = content.replace(new RegExp(`@import\\s+(?:url\\()?["']?${stylesheet.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?\\)?[^;]*;`), processedCSS);
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
        urls.push({
          originalUrl: url,
          absoluteUrl
        });
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
          processedCSS = processedCSS.replace(new RegExp(`url\\(\\s*["']?${urlInfo.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?\\s*\\)`, 'g'), `url(${newUrl})`);
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
    images.forEach(async img => {
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
            if (allowedProps.includes(prop)) {
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
    }
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
      loadScripts: false,
      // 默认关闭脚本执行，提高安全性
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
    this.container.addEventListener('smartiframe:rendered', e => {
      this.isLoading = false;
      this.isLoaded = true;
      this.dispatchEvent('load', e.detail);
    });

    // 监听错误事件
    this.container.addEventListener('smartiframe:error', e => {
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

/**
 * SmartIframe Web Component
 * 使用方式：<smart-iframe src="https://example.com" width="800" height="600"></smart-iframe>
 */
class SmartIframeElement extends HTMLElement {
  constructor() {
    super();
    this.smartIframe = null;
    this.isConnected = false;
  }

  /**
   * 定义观察的属性
   */
  static get observedAttributes() {
    return ['src', 'width', 'height', 'sandbox', 'load-images', 'load-scripts', 'load-styles'];
  }

  /**
   * 元素连接到DOM时调用
   */
  connectedCallback() {
    this.isConnected = true;
    this.render();
  }

  /**
   * 元素从DOM断开时调用
   */
  disconnectedCallback() {
    this.isConnected = false;
    if (this.smartIframe) {
      this.smartIframe.destroy();
      this.smartIframe = null;
    }
  }

  /**
   * 属性变化时调用
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected || oldValue === newValue) {
      return;
    }
    switch (name) {
      case 'src':
        if (this.smartIframe && newValue) {
          this.smartIframe.src = newValue;
        }
        break;
      case 'width':
        if (this.smartIframe && newValue) {
          this.smartIframe.width = newValue;
        }
        break;
      case 'height':
        if (this.smartIframe && newValue) {
          this.smartIframe.height = newValue;
        }
        break;
      default:
        // 其他属性变化时重新渲染
        this.render();
        break;
    }
  }

  /**
   * 渲染组件
   */
  render() {
    if (this.smartIframe) {
      this.smartIframe.destroy();
    }

    // 创建容器div
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    this.innerHTML = '';
    this.appendChild(container);

    // 解析配置选项
    const options = {
      width: this.getAttribute('width') || '100%',
      height: this.getAttribute('height') || '400px',
      sandbox: this.getAttribute('sandbox') !== 'false',
      loadImages: this.getAttribute('load-images') !== 'false',
      loadScripts: this.getAttribute('load-scripts') === 'true',
      loadStyles: this.getAttribute('load-styles') !== 'false'
    };

    // 创建SmartIframe实例
    this.smartIframe = new SmartIframe(container, options);

    // 绑定到容器元素
    container.smartIframe = this.smartIframe;

    // 设置事件监听
    this.setupEventListeners();

    // 如果有src属性，立即加载
    const src = this.getAttribute('src');
    if (src) {
      this.smartIframe.load(src).catch(error => {
        console.error('[SmartIframeElement] 加载失败:', error);
      });
    }
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    const container = this.querySelector('div');
    if (!container) return;

    // 转发SmartIframe的事件
    container.addEventListener('load', e => {
      this.dispatchEvent(new CustomEvent('load', {
        detail: e.detail,
        bubbles: true
      }));
    });
    container.addEventListener('error', e => {
      this.dispatchEvent(new CustomEvent('error', {
        detail: e.detail,
        bubbles: true
      }));
    });
  }

  /**
   * src属性的getter
   */
  get src() {
    return this.getAttribute('src') || '';
  }

  /**
   * src属性的setter
   */
  set src(value) {
    if (value) {
      this.setAttribute('src', value);
    } else {
      this.removeAttribute('src');
    }
  }

  /**
   * width属性的getter
   */
  get width() {
    return this.getAttribute('width') || '100%';
  }

  /**
   * width属性的setter
   */
  set width(value) {
    if (value) {
      this.setAttribute('width', value);
    } else {
      this.removeAttribute('width');
    }
  }

  /**
   * height属性的getter
   */
  get height() {
    return this.getAttribute('height') || '400px';
  }

  /**
   * height属性的setter
   */
  set height(value) {
    if (value) {
      this.setAttribute('height', value);
    } else {
      this.removeAttribute('height');
    }
  }

  /**
   * 获取加载状态
   */
  get loading() {
    return this.smartIframe ? this.smartIframe.loading : false;
  }

  /**
   * 获取加载完成状态
   */
  get loaded() {
    return this.smartIframe ? this.smartIframe.loaded : false;
  }

  /**
   * 重新加载
   */
  async reload() {
    if (this.smartIframe) {
      await this.smartIframe.reload();
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return this.smartIframe ? this.smartIframe.getStats() : null;
  }
}

// 注册自定义元素
if (!customElements.get('smart-iframe')) {
  customElements.define('smart-iframe', SmartIframeElement);
}

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
    asyncAwait: true,
    // 如果代码能执行到这里就支持
    es6Classes: true,
    // 如果代码能执行到这里就支持
    es6Modules: true // 简化检测，如果能导入就支持
  };
  const allSupported = Object.values(isSupported).every(Boolean);
  return {
    supported: allSupported,
    features: isSupported,
    recommendation: allSupported ? '✅ 浏览器完全兼容SmartIframe SDK' : '⚠️ 部分功能可能不可用，建议使用现代浏览器'
  };
}

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

exports.HtmlParser = HtmlParser;
exports.Renderer = Renderer;
exports.ResourceCache = ResourceCache;
exports.SmartIframe = SmartIframe;
exports.SmartIframeElement = SmartIframeElement;
exports.VERSION = VERSION;
exports.checkCompatibility = checkCompatibility;
exports.clearCache = clearCache;
exports.create = create;
exports["default"] = SmartIframe;
exports.getInfo = getInfo;
exports.load = load;
exports.preload = preload;
exports.registerWebComponent = registerWebComponent;
exports.setGlobalConfig = setGlobalConfig;
//# sourceMappingURL=smart-iframe.cjs.js.map
