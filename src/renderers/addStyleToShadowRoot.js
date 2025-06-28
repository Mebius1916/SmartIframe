/**
 * 添加样式到Shadow Root
 */
export function addStyleToShadowRoot(shadowRoot, cssText, id = null) {
  const style = document.createElement('style');
  style.textContent = cssText;
  
  if (id) {
    style.id = id;
    const existingStyle = shadowRoot.querySelector(`style#${id}`);
    if (existingStyle) {
      existingStyle.remove();
    }
  }
  
  shadowRoot.appendChild(style);
}

export default addStyleToShadowRoot; 