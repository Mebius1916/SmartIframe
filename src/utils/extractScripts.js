export function extractScripts(doc, resources, baseUrl) {
  // 提取外部脚本
  const externalScripts = doc.querySelectorAll('script[src]');
  externalScripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src) {
      const absoluteUrl = new URL(src, baseUrl).toString();
      resources.scripts.push({
        element: script,
        originalUrl: src,
        absoluteUrl,
        type: 'script',
        isExternal: true
      });
    }
  });

  // 提取内联脚本
  const inlineScripts = doc.querySelectorAll('script:not([src])');
  inlineScripts.forEach((script, index) => {
    if (script.textContent.trim()) {
      resources.scripts.push({
        element: script,
        content: script.textContent,
        type: 'inline-script',
        isExternal: false,
        index: index
      });
    }
  });
}

export default extractScripts; 