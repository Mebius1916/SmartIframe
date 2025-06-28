/**
 * 获取浏览器信息
 */
export function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) {
    const version = userAgent.match(/Chrome\/(\d+)/)?.[1];
    return { name: 'Chrome', version: parseInt(version || '0') };
  } else if (userAgent.includes('Firefox')) {
    const version = userAgent.match(/Firefox\/(\d+)/)?.[1];
    return { name: 'Firefox', version: parseInt(version || '0') };
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const version = userAgent.match(/Version\/(\d+)/)?.[1];
    return { name: 'Safari', version: parseInt(version || '0') };
  } else {
    return { name: 'Unknown', version: 0 };
  }
}

export default getBrowserInfo; 