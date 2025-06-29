export function addBaseStyles(shadowRoot) {
  const resetStyle = document.createElement('style');
  resetStyle.textContent = `
    :where(:host) {
      display: block;
      width: 100%;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
    
    :where(html, body) {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    
    :where(*) {
      box-sizing: border-box;
    }
    
    :where(img, video, iframe, object, embed) {
      max-width: 100%;
      height: auto;
    }
    
    :where(::-webkit-scrollbar) {
      width: 8px;
      height: 8px;
    }
    
    :where(::-webkit-scrollbar-track) {
      background: #f1f1f1;
    }
    
    :where(::-webkit-scrollbar-thumb) {
      background: #c1c1c1;
      border-radius: 4px;
    }
    
    :where(::-webkit-scrollbar-thumb:hover) {
      background: #a8a8a8;
    }
  `;
  
  shadowRoot.appendChild(resetStyle);
}

export default addBaseStyles; 