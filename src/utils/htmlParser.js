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
      urls.push({ originalUrl, absoluteUrl });
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
        urls.push({ originalUrl, absoluteUrl });
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

export default HtmlParser; 