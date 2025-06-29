export function setupContainer(container, config) {
  const htmlElement = container;
  // 确保是HTMLElement才有style属性
  if (htmlElement instanceof HTMLElement) {
    Object.assign(htmlElement.style, {
      width: config.width,
      height: config.height,
      border: 'none',
      overflow: 'hidden',
      display: 'block',
      position: 'relative'
    });
  }

  container.setAttribute('data-smart-iframe', 'true');
  container.classList.add('smart-iframe-container');
}

export default setupContainer; 