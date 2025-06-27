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
    const totalSize = Array.from(this.cache.values())
      .reduce((sum, item) => sum + (item.size || 0), 0);
    
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
    const promises = urls.map(url => 
      this.fetchWithCache(url).catch(error => {
        console.warn(`[SmartIframe] 预加载失败: ${url}`, error);
        return null;
      })
    );
    
    const results = await Promise.all(promises);
    const successCount = results.filter(r => r !== null).length;
    console.log(`[SmartIframe] 预加载完成: ${successCount}/${urls.length} 成功`);
    
    return results;
  }
}

export default ResourceCache; 