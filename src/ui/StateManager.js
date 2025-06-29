import { createLoadingElement, createErrorElement } from './index.js';

class StateManager {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.currentState = 'idle';
    this.stateElements = new Map();
  }

  showLoading(message = '正在加载...') {
    if (!this.config.showLoadingIndicator) return;
    
    this.clearState();
    this.currentState = 'loading';
    
    const loadingElement = createLoadingElement(message);
    this.container.appendChild(loadingElement);
    this.stateElements.set('loading', loadingElement);
  }

  showError(error, url = '') {
    this.clearState();
    this.currentState = 'error';
    
    const errorElement = createErrorElement(error, url, this.config.showErrorDetails);
    this.container.appendChild(errorElement);
    this.stateElements.set('error', errorElement);
  }

  showSuccess() {
    this.clearState();
    this.currentState = 'success';
  }

  clearState() {
    this.stateElements.forEach((element) => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.stateElements.clear();
  }

  getCurrentState() {
    return this.currentState;
  }

  destroy() {
    this.clearState();
  }
}

export default StateManager; 