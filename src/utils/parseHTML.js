import { extractStylesheets } from './extractStylesheets.js';
import { extractScripts } from './extractScripts.js';
import { extractImages } from './extractImages.js';
import { extractOtherLinks } from './extractOtherLinks.js';
import { getAllUrls } from './getAllUrls.js';

/**
 * HTML解析器 - 解析HTML并提取资源引用
 */
export function parseHTML(html, baseUrl) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const resources = {
    stylesheets: [],
    scripts: [],
    images: [],
    links: [],
    other: []
  };

  // 提取各种资源
  extractStylesheets(doc, resources, baseUrl);
  extractScripts(doc, resources, baseUrl);
  extractImages(doc, resources, baseUrl);
  extractOtherLinks(doc, resources, baseUrl);

  return {
    document: doc,
    resources,
    allUrls: getAllUrls(resources)
  };
}

export default parseHTML; 