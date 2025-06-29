export function extractScripts(doc, resources, baseUrl) {
  const scripts = doc.querySelectorAll('script[src]');
  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src) {
      const absoluteUrl = new URL(src, baseUrl).toString();
      resources.scripts.push({
        element: script,
        originalUrl: src,
        absoluteUrl,
        type: 'script'
      });
    }
  });
}

export default extractScripts; 