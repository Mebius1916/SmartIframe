/**
 * 解析URL为绝对路径
 */
export function resolveUrl(url, baseUrl) {
  try {
    return new URL(url, baseUrl).toString();
  } catch (error) {
    return url;
  }
}

export default resolveUrl; 