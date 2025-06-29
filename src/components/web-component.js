import SmartIframe from './SmartIframe.js';
class SmartIframeElement extends HTMLElement {
  constructor() {
    super();
    this.smartIframe = null;
    this.isConnected = false;
  }

  static get observedAttributes() {
    return ['src', 'width', 'height', 'sandbox', 'load-images', 'load-scripts', 'load-styles'];
  }

  // 当 custom element首次被插入文档DOM时，被调用。
  connectedCallback() {
    this.isConnected = true;
    this.render();
  }

  // 当 custom element从文档DOM中删除时，被调用
  disconnectedCallback() {
    this.isConnected = false;
    if (this.smartIframe) {
      this.smartIframe.destroy();
      this.smartIframe = null;
    }
  }

  // 当 custom element增加、删除、修改自身属性时，被调用。
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

    // 自动加载
    const src = this.getAttribute('src');
    if (src) {
      this.smartIframe.load(src).catch(error => {
        console.error('[SmartIframeElement] 加载失败:', error);
      });
    }
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