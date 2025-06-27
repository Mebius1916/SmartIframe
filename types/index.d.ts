/**
 * Smart-Iframe SDK TypeScript 类型定义
 */

export interface SmartIframeOptions {
  /** 宽度，默认 '100%' */
  width?: string;
  /** 高度，默认 '400px' */
  height?: string;
  /** 是否启用沙箱环境，默认 true */
  sandbox?: boolean;
  /** 是否加载图片，默认 true */
  loadImages?: boolean;
  /** 是否加载脚本，默认 false */
  loadScripts?: boolean;
  /** 是否加载样式，默认 true */
  loadStyles?: boolean;
  /** 是否启用缓存，默认 true */
  cache?: boolean;
}

export interface ResourceInfo {
  /** 资源内容 */
  content: string;
  /** 内容类型 */
  contentType: string;
  /** 资源URL */
  url: string;
  /** 缓存时间戳 */
  timestamp: number;
  /** 资源大小（字节） */
  size: number;
}

export interface CacheStats {
  /** 缓存数量 */
  count: number;
  /** 总大小（字节） */
  totalSize: number;
  /** 最大缓存数量 */
  maxSize: number;
  /** 正在进行的请求数量 */
  pendingRequests: number;
}

export interface SmartIframeStats {
  /** 当前加载的URL */
  src: string;
  /** 是否正在加载 */
  loading: boolean;
  /** 是否已加载完成 */
  loaded: boolean;
  /** 渲染器统计信息 */
  renderer: RendererStats | null;
}

export interface RendererStats {
  /** 是否已渲染 */
  isRendered: boolean;
  /** 基础URL */
  baseUrl: string;
  /** 资源数量 */
  resourceCount: number;
  /** 缓存统计 */
  cacheStats: CacheStats;
}

export interface CompatibilityCheck {
  /** 是否完全支持 */
  supported: boolean;
  /** 功能支持详情 */
  features: {
    shadowDOM: boolean;
    webComponents: boolean;
    fetch: boolean;
    proxy: boolean;
    asyncAwait: boolean;
    es6Classes: boolean;
    es6Modules: boolean;
  };
  /** 兼容性建议 */
  recommendation: string;
}

export interface SDKInfo {
  /** SDK名称 */
  name: string;
  /** 版本号 */
  version: string;
  /** 描述 */
  description: string;
  /** 作者 */
  author: string;
  /** 许可证 */
  license: string;
  /** 缓存统计 */
  cacheStats: CacheStats;
}

export interface GlobalConfig {
  /** 最大缓存数量 */
  maxCacheSize?: number;
  /** 缓存过期时间（毫秒） */
  maxAge?: number;
}

export interface ParsedResource {
  /** DOM元素 */
  element: Element;
  /** 原始URL */
  originalUrl: string;
  /** 绝对URL */
  absoluteUrl: string;
  /** 资源类型 */
  type: string;
}

export interface ParsedHTML {
  /** 解析后的文档 */
  document: Document;
  /** 资源分类 */
  resources: {
    stylesheets: ParsedResource[];
    scripts: ParsedResource[];
    images: ParsedResource[];
    links: ParsedResource[];
    other: ParsedResource[];
  };
  /** 所有URL列表 */
  allUrls: string[];
}

/**
 * SmartIframe 主类
 */
export declare class SmartIframe {
  /** 容器元素 */
  readonly container: HTMLElement;
  
  /** 配置选项 */
  readonly options: SmartIframeOptions;
  
  /** 当前URL */
  src: string;
  
  /** 宽度 */
  width: string;
  
  /** 高度 */
  height: string;
  
  /** 是否正在加载 */
  readonly loading: boolean;
  
  /** 是否已加载完成 */
  readonly loaded: boolean;

  /**
   * 构造函数
   * @param container 容器选择器或元素
   * @param options 配置选项
   */
  constructor(container: string | HTMLElement, options?: SmartIframeOptions);

  /**
   * 加载指定URL
   * @param url 要加载的URL
   */
  load(url: string): Promise<void>;

  /**
   * 重新加载当前URL
   */
  reload(): Promise<void>;

  /**
   * 销毁实例
   */
  destroy(): void;

  /**
   * 获取统计信息
   */
  getStats(): SmartIframeStats;

  /**
   * 创建SmartIframe实例（静态方法）
   * @param container 容器选择器或元素
   * @param options 配置选项
   */
  static create(container: string | HTMLElement, options?: SmartIframeOptions): SmartIframe;

  /**
   * 获取缓存统计（静态方法）
   */
  static getCacheStats(): CacheStats;

  /**
   * 清除所有缓存（静态方法）
   */
  static clearAllCache(): void;
}

/**
 * 资源缓存类
 */
export declare class ResourceCache {
  /** 缓存Map */
  static cache: Map<string, ResourceInfo>;
  
  /** 正在进行的请求Map */
  static pendingRequests: Map<string, Promise<ResourceInfo>>;
  
  /** 最大缓存数量 */
  static maxCacheSize: number;
  
  /** 缓存过期时间 */
  static maxAge: number;

  /**
   * 带缓存的资源获取
   * @param url 资源URL
   * @param options 请求选项
   */
  static fetchWithCache(url: string, options?: RequestInit): Promise<ResourceInfo>;

  /**
   * URL标准化处理
   * @param url 原始URL
   */
  static normalizeUrl(url: string): string;

  /**
   * 清除缓存
   * @param url 可选的特定URL
   */
  static clearCache(url?: string): void;

  /**
   * 获取缓存统计
   */
  static getCacheStats(): CacheStats;

  /**
   * 预加载资源列表
   * @param urls 要预加载的URL列表
   */
  static preloadResources(urls: string[]): Promise<(ResourceInfo | null)[]>;
}

/**
 * 渲染引擎类
 */
export declare class Renderer {
  /** 容器元素 */
  readonly container: HTMLElement;
  
  /** 配置选项 */
  readonly options: SmartIframeOptions;

  /**
   * 构造函数
   * @param container 容器元素
   * @param options 配置选项
   */
  constructor(container: HTMLElement, options?: SmartIframeOptions);

  /**
   * 渲染URL指定的网页
   * @param url 要渲染的网页URL
   */
  renderUrl(url: string): Promise<void>;

  /**
   * 销毁渲染器
   */
  destroy(): void;

  /**
   * 获取渲染统计信息
   */
  getStats(): RendererStats;
}

/**
 * HTML解析器类
 */
export declare class HtmlParser {
  /**
   * 解析HTML内容
   * @param html HTML内容
   * @param baseUrl 基础URL
   */
  static parseHTML(html: string, baseUrl: string): ParsedHTML;

  /**
   * 解析相对URL为绝对URL
   * @param url 相对URL
   * @param baseUrl 基础URL
   */
  static resolveUrl(url: string, baseUrl: string): string;

  /**
   * 重写HTML中的资源引用
   * @param doc DOM文档
   * @param resourceMap 资源映射表
   */
  static rewriteResourceReferences(doc: Document, resourceMap: Record<string, string>): string;
}

/**
 * SmartIframe Web Component
 */
export declare class SmartIframeElement extends HTMLElement {
  /** SmartIframe实例 */
  smartIframe: SmartIframe | null;

  /** src属性 */
  src: string;
  
  /** width属性 */
  width: string;
  
  /** height属性 */
  height: string;
  
  /** 是否正在加载 */
  readonly loading: boolean;
  
  /** 是否已加载完成 */
  readonly loaded: boolean;

  /**
   * 重新加载
   */
  reload(): Promise<void>;

  /**
   * 获取统计信息
   */
  getStats(): SmartIframeStats | null;
}

/**
 * 快速创建SmartIframe实例
 * @param container 容器选择器或元素
 * @param options 配置选项
 */
export declare function create(container: string | HTMLElement, options?: SmartIframeOptions): SmartIframe;

/**
 * 快速加载网页到指定容器
 * @param container 容器选择器或元素
 * @param url 要加载的URL
 * @param options 配置选项
 */
export declare function load(container: string | HTMLElement, url: string, options?: SmartIframeOptions): Promise<SmartIframe>;

/**
 * 注册Web Component
 */
export declare function registerWebComponent(): void;

/**
 * 获取SDK信息
 */
export declare function getInfo(): SDKInfo;

/**
 * 清除所有缓存
 */
export declare function clearCache(): void;

/**
 * 设置全局配置
 * @param config 全局配置
 */
export declare function setGlobalConfig(config: GlobalConfig): void;

/**
 * 批量预加载URL列表
 * @param urls URL列表
 */
export declare function preload(urls: string[]): Promise<(ResourceInfo | null)[]>;

/**
 * 检查浏览器兼容性
 */
export declare function checkCompatibility(): CompatibilityCheck;

/**
 * SDK版本号
 */
export declare const VERSION: string;

/**
 * 默认导出SmartIframe类
 */
declare const SmartIframeSDK: typeof SmartIframe;
export default SmartIframeSDK;

/**
 * 全局类型声明（用于浏览器环境）
 */
declare global {
  interface Window {
    SmartIframe: typeof SmartIframe;
    SmartIframeSDK: {
      SmartIframe: typeof SmartIframe;
      create: typeof create;
      load: typeof load;
      registerWebComponent: typeof registerWebComponent;
      getInfo: typeof getInfo;
      clearCache: typeof clearCache;
      setGlobalConfig: typeof setGlobalConfig;
      preload: typeof preload;
      checkCompatibility: typeof checkCompatibility;
      version: string;
    };
  }

  namespace JSX {
    interface IntrinsicElements {
      'smart-iframe': {
        src?: string;
        width?: string;
        height?: string;
        sandbox?: string;
        'load-images'?: string;
        'load-scripts'?: string;
        'load-styles'?: string;
        onload?: (event: CustomEvent) => void;
        onerror?: (event: CustomEvent) => void;
      };
    }
  }
} 