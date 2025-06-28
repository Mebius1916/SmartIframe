/**
 * 添加基础样式
 */
export function addBaseStyles(shadowRoot) {
  const resetStyle = document.createElement('style');
  resetStyle.textContent = `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
    
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    
    * {
      box-sizing: border-box;
    }
    
    img, video, iframe, object, embed {
      max-width: 100%;
      height: auto;
    }
    
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `;
  
  shadowRoot.appendChild(resetStyle);
}

export default addBaseStyles; 