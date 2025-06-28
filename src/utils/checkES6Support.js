/**
 * 检查ES6支持
 */
export function checkES6Support() {
  try {
    // 使用Feature Detection替代eval
    return !!(
      typeof Promise !== 'undefined' &&
      typeof Map !== 'undefined' &&
      typeof Set !== 'undefined' &&
      typeof Array.prototype.includes === 'function' &&
      typeof Object.assign === 'function' &&
      typeof Symbol !== 'undefined'
    );
  } catch (e) {
    return false;
  }
}

export default checkES6Support; 