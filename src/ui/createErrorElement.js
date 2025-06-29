export function createErrorElement(error, url, showErrorDetails = false) {
  const div = document.createElement('div');
  div.className = 'smart-iframe-error';
  
  const errorMessage = showErrorDetails ? error.message : '加载失败，请稍后重试';
  
  div.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100%; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                background: #fff; border: 1px solid #dee2e6;">
      <div style="text-align: center; color: #6c757d; padding: 32px;">
        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <div style="font-size: 16px; margin-bottom: 8px; color: #495057;">加载失败</div>
        <div style="font-size: 14px; margin-bottom: 16px;">${errorMessage}</div>
        ${url ? `<div style="font-size: 12px; color: #adb5bd; margin-bottom: 16px;">URL: ${url}</div>` : ''}
        <button onclick="this.closest('.smart-iframe-container').smartIframe?.reload()" 
                style="padding: 8px 16px; background: #007bff; color: white; border: none; 
                       border-radius: 4px; cursor: pointer; font-size: 14px;">
          重新加载
        </button>
      </div>
    </div>
  `;
  return div;
}

export default createErrorElement; 