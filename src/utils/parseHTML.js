import { extractStylesheets } from './extractStylesheets.js';
import { extractScripts } from './extractScripts.js';
import { extractImages } from './extractImages.js';
import { extractOtherLinks } from './extractOtherLinks.js';

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

  extractStylesheets(doc, resources, baseUrl);
  extractScripts(doc, resources, baseUrl);
  extractImages(doc, resources, baseUrl);
  extractOtherLinks(doc, resources, baseUrl);

  const allUrls = [];
  Object.values(resources).forEach(resourceArray => {
    resourceArray.forEach(resource => {
      if (resource.absoluteUrl && !allUrls.includes(resource.absoluteUrl)) {
        allUrls.push(resource.absoluteUrl);
      }
    });
  });

  return {
    document: doc,
    resources,
    allUrls
  };
}

export default parseHTML; 