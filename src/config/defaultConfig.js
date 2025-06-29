export function getDefaultConfig() {
  return {
    width: '100%',
    height: '400px',
    sandbox: true,
    loadImages: true,
    loadScripts: true,
    loadStyles: true,
    cache: true,
    maxCacheSize: 100,
    maxAge: 30 * 60 * 1000,
    allowedDomains: [],
    blockedDomains: [],
    preloadLimit: 10,
    renderTimeout: 30000,
    showLoadingIndicator: true,
    showErrorDetails: false,
    debug: false
  };
}

export default getDefaultConfig; 