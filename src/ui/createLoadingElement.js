/**
 * 创建加载元素
 */
export function createLoadingElement(message) {
  const div = document.createElement('div');
  div.className = 'smart-iframe-loading';
  div.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100%; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                color: #666; background: #f8f9fa;">
      <div style="text-align: center;">
        <div style="width: 40px; height: 40px; border: 3px solid #e9ecef; 
                    border-top: 3px solid #007bff; border-radius: 50%; 
                    animation: smart-iframe-spin 1s linear infinite; 
                    margin: 0 auto 16px;"></div>
        <div style="font-size: 14px;">${message}</div>
      </div>
    </div>
    <style>
      @keyframes smart-iframe-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  return div;
}

export default createLoadingElement; 