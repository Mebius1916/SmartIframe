import { createLoadingElement, createErrorElement } from './index.js';

/**
 * UI状态管理器
 * 负责管理SmartIframe的UI状态显示
 */
class StateManager {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.currentState = 'idle';
    this.stateElements = new Map();
  }

  /**
   * 显示加载状态
   */
  showLoading(message = '正在加载...') {
    if (!this.config.showLoadingIndicator) return;
    
    this.clearState();
    this.currentState = 'loading';
    
    const loadingElement = createLoadingElement(message);
    this.container.appendChild(loadingElement);
    this.stateElements.set('loading', loadingElement);
  }

  /**
   * 显示错误状态
   */
  showError(error, url = '') {
    this.clearState();
    this.currentState = 'error';
    
    const errorElement = createErrorElement(error, url, this.config.showErrorDetails);
    this.container.appendChild(errorElement);
    this.stateElements.set('error', errorElement);
  }

  /**
   * 显示成功状态
   */
  showSuccess() {
    this.clearState();
    this.currentState = 'success';
  }

  /**
   * 清除状态
   */
  clearState() {
    this.stateElements.forEach((element) => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.stateElements.clear();
  }

  /**
   * 获取当前状态
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * 销毁状态管理器
   */
  destroy() {
    this.clearState();
  }
}

export default StateManager; 