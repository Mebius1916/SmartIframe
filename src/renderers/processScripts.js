import ResourceCache from '../components/ResourceCache.js';

/**
 * 处理脚本资源
 */
export async function processScripts(scripts, shadowRoot, config) {
  if (!config.loadScripts) return;

  // 处理外部脚本
  const externalScriptPromises = scripts
    .filter(script => script.type === 'script')
    .map(async (script) => {
      try {
        const jsResource = await ResourceCache.fetchWithCache(script.absoluteUrl);
        await executeScript(jsResource.content, shadowRoot, script.absoluteUrl);
      } catch (error) {
        console.warn(`[Renderer] 脚本处理失败: ${script.absoluteUrl}`, error);
      }
    });

  await Promise.all(externalScriptPromises);

  // 处理内联脚本
  const inlineScripts = shadowRoot.querySelectorAll('script:not([src])');
  inlineScripts.forEach(script => {
    if (script.textContent.trim()) {
      executeScript(script.textContent, shadowRoot, 'inline');
    }
  });
}

/**
 * 执行脚本代码
 */
async function executeScript(scriptContent, shadowRoot, source = 'unknown') {
  try {
    // 创建隔离的执行环境
    const scriptContext = createScriptContext(shadowRoot);
    
    // 包装脚本以提供正确的上下文
    const wrappedScript = wrapScriptForShadowDOM(scriptContent, scriptContext);
    
    // 执行脚本
    const scriptFunction = new Function('context', `
      with(context) {
        ${wrappedScript}
      }
    `);
    
    scriptFunction(scriptContext);
    
  } catch (error) {
    console.warn(`[Renderer] 脚本执行失败 (${source}):`, error);
  }
}

/**
 * 创建脚本执行上下文
 */
function createScriptContext(shadowRoot) {
  const context = {
    // DOM 访问
    document: createDocumentProxy(shadowRoot),
    window: createWindowProxy(shadowRoot),
    
    // 全局函数
    console: window.console,
    setTimeout: window.setTimeout.bind(window),
    setInterval: window.setInterval.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    clearInterval: window.clearInterval.bind(window),
    fetch: window.fetch.bind(window),
    
    // 事件相关
    Event: window.Event,
    CustomEvent: window.CustomEvent,
    MouseEvent: window.MouseEvent,
    KeyboardEvent: window.KeyboardEvent,
    
    // 其他API
    JSON: window.JSON,
    Date: window.Date,
    Math: window.Math,
    Array: window.Array,
    Object: window.Object,
    String: window.String,
    Number: window.Number,
    Boolean: window.Boolean,
    RegExp: window.RegExp,
    
    // Shadow root 引用
    shadowRoot: shadowRoot
  };

  return context;
}

/**
 * 创建document代理
 */
function createDocumentProxy(shadowRoot) {
  return new Proxy({}, {
    get(target, prop) {
      // 重定向常用的document方法到shadowRoot
      switch (prop) {
        case 'getElementById':
          return (id) => shadowRoot.getElementById(id);
        case 'querySelector':
          return (selector) => shadowRoot.querySelector(selector);
        case 'querySelectorAll':
          return (selector) => shadowRoot.querySelectorAll(selector);
        case 'createElement':
          return (tagName) => document.createElement(tagName);
        case 'createTextNode':
          return (text) => document.createTextNode(text);
        case 'addEventListener':
          return (type, listener, options) => shadowRoot.addEventListener(type, listener, options);
        case 'removeEventListener':
          return (type, listener, options) => shadowRoot.removeEventListener(type, listener, options);
        case 'body':
          return shadowRoot.querySelector('body') || shadowRoot.firstElementChild;
        case 'head':
          return shadowRoot.querySelector('head') || null;
        case 'documentElement':
          return shadowRoot.firstElementChild;
        default:
          // 其他属性尝试从原始document获取
          return document[prop];
      }
    }
  });
}

/**
 * 创建window代理
 */
function createWindowProxy(shadowRoot) {
  return new Proxy({}, {
    get(target, prop) {
      // 重定向到实际的window对象，但某些属性指向shadowRoot
      switch (prop) {
        case 'document':
          return createDocumentProxy(shadowRoot);
        case 'addEventListener':
          return (type, listener, options) => shadowRoot.addEventListener(type, listener, options);
        case 'removeEventListener':
          return (type, listener, options) => shadowRoot.removeEventListener(type, listener, options);
        default:
          return window[prop];
      }
    }
  });
}

/**
 * 包装脚本以适配Shadow DOM环境
 */
function wrapScriptForShadowDOM(scriptContent, context) {
  // 替换一些常见的全局引用
  let wrappedScript = scriptContent
    // 确保document引用指向正确的代理
    .replace(/\bdocument\b/g, 'context.document')
    // 确保window引用指向正确的代理
    .replace(/\bwindow\b/g, 'context.window');

  return wrappedScript;
}

export default processScripts; 