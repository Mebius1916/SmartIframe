/**
 * 获取所有URL
 */
export function getAllUrls(resources) {
  const urls = [];
  
  Object.values(resources).forEach(resourceArray => {
    resourceArray.forEach(resource => {
      if (resource.absoluteUrl && !urls.includes(resource.absoluteUrl)) {
        urls.push(resource.absoluteUrl);
      }
    });
  });
  
  return urls;
}

export default getAllUrls; 