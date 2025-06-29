export function extractStylesheets(doc, resources, baseUrl) {
  const links = doc.querySelectorAll('link[rel="stylesheet"], link[rel="preload"][as="style"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const absoluteUrl = new URL(href, baseUrl).toString();
      resources.stylesheets.push({
        element: link,
        originalUrl: href,
        absoluteUrl,
        type: 'stylesheet'
      });
    }
  });

  // 内联样式中的@import
  const styleTags = doc.querySelectorAll('style');
  styleTags.forEach(style => {
    const content = style.textContent;
    const importMatches = content.match(/@import\s+(?:url\()?["']?([^"')]+)["']?\)?[^;]*;/g);
    
    if (importMatches) {
      importMatches.forEach(match => {
        const urlMatch = match.match(/["']?([^"')]+)["']?/);
        if (urlMatch && urlMatch[1]) {
          const absoluteUrl = new URL(urlMatch[1], baseUrl).toString();
          resources.stylesheets.push({
            element: style,
            originalUrl: urlMatch[1],
            absoluteUrl,
            type: 'import',
            parentStyle: style
          });
        }
      });
    }
  });
}

export default extractStylesheets; 