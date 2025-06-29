/**
 * 资源缓存层 - 解决重复请求问题
 */
class ResourceCache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.maxCacheSize = 100;
    this.maxAge = 30 * 60 * 1000; // 30分钟
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      totalRequests: 0
    };
  }

  /**
   * 带缓存的资源获取
   */
  async fetchWithCache(url, options = {}) {
    const normalizedUrl = this.normalizeUrl(url);
    this.stats.totalRequests++;
    
    // 检查缓存
    if (this.cache.has(normalizedUrl)) {
      const cached = this.cache.get(normalizedUrl);
      
      if (Date.now() - cached.timestamp < this.maxAge) {
        this.stats.hits++;
        this.updateCacheAccess(normalizedUrl);
        return { ...cached };
      } else {
        this.cache.delete(normalizedUrl);
      }
    }

    this.stats.misses++;

    // 检查正在进行的请求
    if (this.pendingRequests.has(normalizedUrl)) {
      return await this.pendingRequests.get(normalizedUrl);
    }

    // 发起新请求
    const requestPromise = this.performRequest(normalizedUrl, options);
    this.pendingRequests.set(normalizedUrl, requestPromise);

    try {
      const result = await requestPromise;
      this.pendingRequests.delete(normalizedUrl);
      this.addToCache(normalizedUrl, result);
      return { ...result };
    } catch (error) {
      this.stats.errors++;
      this.pendingRequests.delete(normalizedUrl);
      throw error;
    }
  }

  /**
   * 执行HTTP请求
   */
  async performRequest(url, options) {
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
      let size = 0;

      if (this.isTextContent(contentType)) {
        content = await response.text();
        size = content.length;
      } else {
        const blob = await response.blob();
        content = URL.createObjectURL(blob);
        size = blob.size;
      }

      return {
        content,
        contentType,
        url,
        timestamp: Date.now(),
        size,
        lastAccess: Date.now()
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 判断文本内容
   */
  isTextContent(contentType) {
    const textTypes = ['text/', 'application/javascript', 'application/json', 'application/xml'];
    return textTypes.some(type => contentType.includes(type));
  }

  /**
   * URL标准化
   */
  normalizeUrl(url) {
    try {
      const urlObj = new URL(url, window.location.href);
      urlObj.hash = '';
      return urlObj.toString();
    } catch (error) {
      return url;
    }
  }

  /**
   * 添加到缓存
   */
  addToCache(url, data) {
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldestCache();
    }

    this.cache.set(url, {
      ...data,
      lastAccess: Date.now()
    });
  }

  /**
   * 驱逐最旧缓存
   */
  evictOldestCache() {
    if (this.cache.size === 0) return;

    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, value] of this.cache.entries()) {
      if (value.lastAccess < oldestTime) {
        oldestTime = value.lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * 更新访问时间
   */
  updateCacheAccess(url) {
    const cached = this.cache.get(url);
    if (cached) {
      cached.lastAccess = Date.now();
    }
  }

  /**
   * 清除缓存
   */
  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * 获取统计
   */
  getStats() {
    // 计算总大小
    let totalSize = 0;
    for (const [url, cached] of this.cache.entries()) {
      if (cached.size) {
        totalSize += cached.size;
      }
    }

    return {
      ...this.stats,
      count: this.cache.size,          // 缓存数量
      cacheSize: this.cache.size,      // 保持向后兼容
      totalSize,                       // 总大小
      pendingRequests: this.pendingRequests.size,
      hitRate: this.stats.totalRequests > 0 ? (this.stats.hits / this.stats.totalRequests * 100).toFixed(2) : '0.00'
    };
  }

  /**
   * 预加载资源
   */
  async preloadResources(urls) {
    const promises = urls.map(url => {
      return this.fetchWithCache(url).catch(error => {
        console.warn(`[ResourceCache] 预加载失败: ${url}`, error);
        return null;
      });
    });

    const results = await Promise.allSettled(promises);
    const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
    
    return { total: urls.length, successful };
  }

  /**
   * 配置缓存
   */
  setConfig(config) {
    if (config.maxCacheSize) this.maxCacheSize = config.maxCacheSize;
    if (config.maxAge) this.maxAge = config.maxAge;
  }
}

// 导出单例
export default new ResourceCache(); 