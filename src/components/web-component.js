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

  static get observedAttributes() {
    return ['src', 'width', 'height', 'sandbox', 'load-images', 'load-scripts', 'load-styles'];
  }

  connectedCallback() {
    this.isConnected = true;
    this.render();
  }

  disconnectedCallback() {
    this.isConnected = false;
    if (this.smartIframe) {
      this.smartIframe.destroy();
      this.smartIframe = null;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected || oldValue === newValue) {
      return;
    }

    switch (name) {
      case 'src':
        if (this.smartIframe && newValue) {
          this.smartIframe.load(newValue);
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
        this.render();
        break;
    }
  }

  render() {
    if (this.smartIframe) {
      this.smartIframe.destroy();
    }

    // 创建容器
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    
    this.innerHTML = '';
    this.appendChild(container);

    // 解析配置
    const options = {
      width: this.getAttribute('width') || '100%',
      height: this.getAttribute('height') || '400px',
      sandbox: this.getAttribute('sandbox') !== 'false',
      loadImages: this.getAttribute('load-images') !== 'false',
      loadScripts: this.getAttribute('load-scripts') === 'true',
      loadStyles: this.getAttribute('load-styles') !== 'false'
    };

    // 创建实例
    this.smartIframe = new SmartIframe(container, options);
    
    // 设置事件转发
    this.setupEventListeners();

    // 自动加载
    const src = this.getAttribute('src');
    if (src) {
      this.smartIframe.load(src).catch(error => {
        console.error('[SmartIframeElement] 加载失败:', error);
      });
    }
  }

  setupEventListeners() {
    const container = this.querySelector('div');
    if (!container) return;

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

  // 属性访问器
  get src() { return this.getAttribute('src') || ''; }
  set src(value) {
    if (value) {
      this.setAttribute('src', value);
    } else {
      this.removeAttribute('src');
    }
  }

  get width() { return this.getAttribute('width') || '100%'; }
  set width(value) {
    if (value) {
      this.setAttribute('width', value);
    } else {
      this.removeAttribute('width');
    }
  }

  get height() { return this.getAttribute('height') || '400px'; }
  set height(value) {
    if (value) {
      this.setAttribute('height', value);
    } else {
      this.removeAttribute('height');
    }
  }

  get loading() {
    return this.smartIframe ? this.smartIframe.loading : false;
  }

  get loaded() {
    return this.smartIframe ? this.smartIframe.loaded : false;
  }

  async reload() {
    if (this.smartIframe) {
      await this.smartIframe.reload();
    }
  }

  getStats() {
    return this.smartIframe ? this.smartIframe.getStats() : null;
  }
}

export default SmartIframeElement; 