/**
 * 解析容器元素
 */
export function resolveContainer(container) {
  if (typeof container === 'string') {
    const element = document.querySelector(container);
    if (!element) {
      throw new Error(`[SmartIframe] 找不到容器元素: ${container}`);
    }
    return element;
  } else if (container instanceof Element) {
    return container;
  } else {
    throw new Error('[SmartIframe] 无效的容器参数');
  }
}

export default resolveContainer; 