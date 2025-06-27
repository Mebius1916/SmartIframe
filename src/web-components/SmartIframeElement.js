import SmartIframe from '../core/SmartIframe.js';

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
    container.addEventListener('load', (e) => {
      this.dispatchEvent(new CustomEvent('load', {
        detail: e.detail,
        bubbles: true
      }));
    });

    container.addEventListener('error', (e) => {
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

export default SmartIframeElement; 