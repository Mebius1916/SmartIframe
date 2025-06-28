/**
 * 生成样式ID
 */
export function generateStyleId(url) {
  return btoa(url).replace(/[+/=]/g, '').substring(0, 16);
}

export default generateStyleId; 