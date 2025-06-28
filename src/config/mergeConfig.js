import { getDefaultConfig } from './defaultConfig.js';

/**
 * 合并配置
 */
export function mergeConfig(userConfig = {}) {
  const config = { ...getDefaultConfig(), ...userConfig };
  
  // 简单验证
  if (typeof config.maxCacheSize !== 'number' || config.maxCacheSize < 1) {
    config.maxCacheSize = getDefaultConfig().maxCacheSize;
  }
  if (typeof config.renderTimeout !== 'number' || config.renderTimeout < 1000) {
    config.renderTimeout = getDefaultConfig().renderTimeout;
  }
  
  return config;
}

export default mergeConfig; 