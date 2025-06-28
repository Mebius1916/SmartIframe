/**
 * URL允许检查
 */
export function isUrlAllowed(url, config) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // 检查黑名单
    if (config.blockedDomains && config.blockedDomains.length > 0) {
      const isBlocked = config.blockedDomains.some(blocked => 
        domain === blocked || domain.endsWith('.' + blocked)
      );
      if (isBlocked) return false;
    }
    
    // 检查白名单
    if (config.allowedDomains && config.allowedDomains.length > 0) {
      const isAllowed = config.allowedDomains.some(allowed => 
        domain === allowed || domain.endsWith('.' + allowed)
      );
      return isAllowed;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export default isUrlAllowed; 