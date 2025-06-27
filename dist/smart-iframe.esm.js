function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && _setPrototypeOf(t, e);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
  var e,
    t,
    r = "function" == typeof Symbol ? Symbol : {},
    n = r.iterator || "@@iterator",
    o = r.toStringTag || "@@toStringTag";
  function i(r, n, o, i) {
    var c = n && n.prototype instanceof Generator ? n : Generator,
      u = Object.create(c.prototype);
    return _regeneratorDefine(u, "_invoke", function (r, n, o) {
      var i,
        c,
        u,
        f = 0,
        p = o || [],
        y = !1,
        G = {
          p: 0,
          n: 0,
          v: e,
          a: d,
          f: d.bind(e, 4),
          d: function (t, r) {
            return i = t, c = 0, u = e, G.n = r, a;
          }
        };
      function d(r, n) {
        for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
          var o,
            i = p[t],
            d = G.p,
            l = i[2];
          r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
        }
        if (o || r > 1) return a;
        throw y = !0, n;
      }
      return function (o, p, l) {
        if (f > 1) throw TypeError("Generator is already running");
        for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
          i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
          try {
            if (f = 2, i) {
              if (c || (o = "next"), t = i[o]) {
                if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                if (!t.done) return t;
                u = t.value, c < 2 && (c = 0);
              } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
              i = e;
            } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
          } catch (t) {
            i = e, c = 1, u = t;
          } finally {
            f = 1;
          }
        }
        return {
          value: t,
          done: y
        };
      };
    }(r, o, i), !0), u;
  }
  var a = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  t = Object.getPrototypeOf;
  var c = [][n] ? t(t([][n]())) : (_regeneratorDefine(t = {}, n, function () {
      return this;
    }), t),
    u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
  function f(e) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine(u), _regeneratorDefine(u, o, "Generator"), _regeneratorDefine(u, n, function () {
    return this;
  }), _regeneratorDefine(u, "toString", function () {
    return "[object Generator]";
  }), (_regenerator = function () {
    return {
      w: i,
      m: f
    };
  })();
}
function _regeneratorDefine(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, "", {});
  } catch (e) {
    i = 0;
  }
  _regeneratorDefine = function (e, r, n, t) {
    if (r) i ? i(e, r, {
      value: n,
      enumerable: !t,
      configurable: !t,
      writable: !t
    }) : e[r] = n;else {
      function o(r, n) {
        _regeneratorDefine(e, r, function (e) {
          return this._invoke(r, n, e);
        });
      }
      o("next", 0), o("throw", 1), o("return", 2);
    }
  }, _regeneratorDefine(e, r, n, t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function (t) {
    if (null === t || !_isNativeFunction(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return _construct(t, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), _setPrototypeOf(Wrapper, t);
  }, _wrapNativeSuper(t);
}

/**
 * 资源缓存层 - 解决重复请求问题的核心模块
 */
var ResourceCache = /*#__PURE__*/function () {
  function ResourceCache() {
    _classCallCheck(this, ResourceCache);
  }
  return _createClass(ResourceCache, null, [{
    key: "fetchWithCache",
    value: // 30分钟过期时间
    /**
     * 带缓存的资源获取
     * @param {string} url - 资源URL
     * @param {Object} options - 请求选项
     * @returns {Promise<Object>} 缓存的资源对象
     */
    function () {
      var _fetchWithCache = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(url) {
        var options,
          normalizedUrl,
          cached,
          requestPromise,
          result,
          _args = arguments,
          _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              normalizedUrl = this.normalizeUrl(url); // 检查缓存
              if (!this.cache.has(normalizedUrl)) {
                _context.n = 2;
                break;
              }
              cached = this.cache.get(normalizedUrl); // 检查是否过期
              if (!(Date.now() - cached.timestamp < this.maxAge)) {
                _context.n = 1;
                break;
              }
              console.log("[SmartIframe] \u4F7F\u7528\u7F13\u5B58: ".concat(normalizedUrl));
              return _context.a(2, cached);
            case 1:
              // 删除过期缓存
              this.cache.delete(normalizedUrl);
            case 2:
              if (!this.pendingRequests.has(normalizedUrl)) {
                _context.n = 4;
                break;
              }
              console.log("[SmartIframe] \u7B49\u5F85\u6B63\u5728\u8FDB\u884C\u7684\u8BF7\u6C42: ".concat(normalizedUrl));
              _context.n = 3;
              return this.pendingRequests.get(normalizedUrl);
            case 3:
              return _context.a(2, _context.v);
            case 4:
              // 发起新请求
              console.log("[SmartIframe] \u53D1\u8D77\u65B0\u8BF7\u6C42: ".concat(normalizedUrl));
              requestPromise = this.performRequest(normalizedUrl, options);
              this.pendingRequests.set(normalizedUrl, requestPromise);
              _context.p = 5;
              _context.n = 6;
              return requestPromise;
            case 6:
              result = _context.v;
              this.pendingRequests.delete(normalizedUrl);

              // 存入缓存
              this.addToCache(normalizedUrl, result);
              return _context.a(2, result);
            case 7:
              _context.p = 7;
              _t = _context.v;
              this.pendingRequests.delete(normalizedUrl);
              throw _t;
            case 8:
              return _context.a(2);
          }
        }, _callee, this, [[5, 7]]);
      }));
      function fetchWithCache(_x) {
        return _fetchWithCache.apply(this, arguments);
      }
      return fetchWithCache;
    }()
    /**
     * 执行实际的HTTP请求
     * @param {string} url - 请求URL
     * @param {Object} options - 请求选项
     * @returns {Promise<Object>} 请求结果
     */
  }, {
    key: "performRequest",
    value: (function () {
      var _performRequest = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(url, options) {
        var response, contentType, content, blob, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return fetch(url, _objectSpread2({
                mode: 'cors',
                cache: 'default'
              }, options));
            case 1:
              response = _context2.v;
              if (response.ok) {
                _context2.n = 2;
                break;
              }
              throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
            case 2:
              contentType = response.headers.get('content-type') || '';
              if (!(contentType.includes('text/') || contentType.includes('application/javascript') || contentType.includes('application/json'))) {
                _context2.n = 4;
                break;
              }
              _context2.n = 3;
              return response.text();
            case 3:
              content = _context2.v;
              _context2.n = 6;
              break;
            case 4:
              _context2.n = 5;
              return response.blob();
            case 5:
              blob = _context2.v;
              content = URL.createObjectURL(blob);
            case 6:
              return _context2.a(2, {
                content: content,
                contentType: contentType,
                url: url,
                timestamp: Date.now(),
                size: content.length || 0
              });
            case 7:
              _context2.p = 7;
              _t2 = _context2.v;
              console.error("[SmartIframe] \u8BF7\u6C42\u5931\u8D25: ".concat(url), _t2);
              throw _t2;
            case 8:
              return _context2.a(2);
          }
        }, _callee2, null, [[0, 7]]);
      }));
      function performRequest(_x2, _x3) {
        return _performRequest.apply(this, arguments);
      }
      return performRequest;
    }()
    /**
     * URL标准化处理
     * @param {string} url - 原始URL
     * @returns {string} 标准化后的URL
     */
    )
  }, {
    key: "normalizeUrl",
    value: function normalizeUrl(url) {
      try {
        var urlObj = new URL(url, window.location.href);
        // 移除fragment，保留query参数
        urlObj.hash = '';
        return urlObj.toString();
      } catch (error) {
        console.warn("[SmartIframe] URL\u6807\u51C6\u5316\u5931\u8D25: ".concat(url), error);
        return url;
      }
    }

    /**
     * 添加到缓存
     * @param {string} url - URL
     * @param {Object} data - 缓存数据
     */
  }, {
    key: "addToCache",
    value: function addToCache(url, data) {
      // 检查缓存大小限制
      if (this.cache.size >= this.maxCacheSize) {
        // 删除最旧的缓存项
        var oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
        console.log("[SmartIframe] \u5220\u9664\u6700\u65E7\u7F13\u5B58: ".concat(oldestKey));
      }
      this.cache.set(url, data);
      console.log("[SmartIframe] \u7F13\u5B58\u5DF2\u4FDD\u5B58: ".concat(url, " (").concat(data.size, " bytes)"));
    }

    /**
     * 清除缓存
     * @param {string} url - 可选的特定URL，不传则清除全部
     */
  }, {
    key: "clearCache",
    value: function clearCache() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (url) {
        var normalizedUrl = this.normalizeUrl(url);
        this.cache.delete(normalizedUrl);
        console.log("[SmartIframe] \u5DF2\u6E05\u9664\u7F13\u5B58: ".concat(normalizedUrl));
      } else {
        this.cache.clear();
        console.log('[SmartIframe] 已清除全部缓存');
      }
    }

    /**
     * 获取缓存统计信息
     * @returns {Object} 缓存统计
     */
  }, {
    key: "getCacheStats",
    value: function getCacheStats() {
      var totalSize = Array.from(this.cache.values()).reduce(function (sum, item) {
        return sum + (item.size || 0);
      }, 0);
      return {
        count: this.cache.size,
        totalSize: totalSize,
        maxSize: this.maxCacheSize,
        pendingRequests: this.pendingRequests.size
      };
    }

    /**
     * 预加载资源列表
     * @param {Array<string>} urls - 要预加载的URL列表
     * @returns {Promise<Array>} 预加载结果
     */
  }, {
    key: "preloadResources",
    value: (function () {
      var _preloadResources = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(urls) {
        var _this = this;
        var promises, results, successCount;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              console.log("[SmartIframe] \u5F00\u59CB\u9884\u52A0\u8F7D ".concat(urls.length, " \u4E2A\u8D44\u6E90"));
              promises = urls.map(function (url) {
                return _this.fetchWithCache(url).catch(function (error) {
                  console.warn("[SmartIframe] \u9884\u52A0\u8F7D\u5931\u8D25: ".concat(url), error);
                  return null;
                });
              });
              _context3.n = 1;
              return Promise.all(promises);
            case 1:
              results = _context3.v;
              successCount = results.filter(function (r) {
                return r !== null;
              }).length;
              console.log("[SmartIframe] \u9884\u52A0\u8F7D\u5B8C\u6210: ".concat(successCount, "/").concat(urls.length, " \u6210\u529F"));
              return _context3.a(2, results);
          }
        }, _callee3);
      }));
      function preloadResources(_x4) {
        return _preloadResources.apply(this, arguments);
      }
      return preloadResources;
    }())
  }]);
}();
_defineProperty(ResourceCache, "cache", new Map());
_defineProperty(ResourceCache, "pendingRequests", new Map());
_defineProperty(ResourceCache, "maxCacheSize", 100);
// 最大缓存数量
_defineProperty(ResourceCache, "maxAge", 30 * 60 * 1000);

/**
 * HTML解析器 - 解析HTML并提取所有资源引用
 */
var HtmlParser = /*#__PURE__*/function () {
  function HtmlParser() {
    _classCallCheck(this, HtmlParser);
  }
  return _createClass(HtmlParser, null, [{
    key: "parseHTML",
    value:
    /**
     * 解析HTML内容，提取所有资源引用
     * @param {string} html - HTML内容
     * @param {string} baseUrl - 基础URL，用于解析相对路径
     * @returns {Object} 解析结果
     */
    function parseHTML(html, baseUrl) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var resources = {
        stylesheets: [],
        scripts: [],
        images: [],
        links: [],
        other: []
      };

      // 提取CSS资源
      this.extractStylesheets(doc, resources, baseUrl);

      // 提取JavaScript资源
      this.extractScripts(doc, resources, baseUrl);

      // 提取图片资源
      this.extractImages(doc, resources, baseUrl);

      // 提取其他链接资源
      this.extractOtherLinks(doc, resources, baseUrl);

      // 处理内联样式中的URL
      this.extractInlineStyleUrls(doc, resources, baseUrl);
      return {
        document: doc,
        resources: resources,
        allUrls: this.getAllUrls(resources)
      };
    }

    /**
     * 提取CSS样式表
     */
  }, {
    key: "extractStylesheets",
    value: function extractStylesheets(doc, resources, baseUrl) {
      var _this = this;
      var links = doc.querySelectorAll('link[rel="stylesheet"], link[rel="preload"][as="style"]');
      links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href) {
          var absoluteUrl = _this.resolveUrl(href, baseUrl);
          resources.stylesheets.push({
            element: link,
            originalUrl: href,
            absoluteUrl: absoluteUrl,
            type: 'stylesheet'
          });
        }
      });

      // 提取style标签中的@import
      var styleTags = doc.querySelectorAll('style');
      styleTags.forEach(function (style) {
        var content = style.textContent;
        var importMatches = content.match(/@import\s+(?:url\()?["']?([^"')]+)["']?\)?[^;]*;/g);
        if (importMatches) {
          importMatches.forEach(function (match) {
            var urlMatch = match.match(/["']?([^"')]+)["']?/);
            if (urlMatch && urlMatch[1]) {
              var absoluteUrl = _this.resolveUrl(urlMatch[1], baseUrl);
              resources.stylesheets.push({
                element: style,
                originalUrl: urlMatch[1],
                absoluteUrl: absoluteUrl,
                type: 'import',
                parentStyle: style
              });
            }
          });
        }
      });
    }

    /**
     * 提取JavaScript脚本
     */
  }, {
    key: "extractScripts",
    value: function extractScripts(doc, resources, baseUrl) {
      var _this2 = this;
      var scripts = doc.querySelectorAll('script[src]');
      scripts.forEach(function (script) {
        var src = script.getAttribute('src');
        if (src) {
          var absoluteUrl = _this2.resolveUrl(src, baseUrl);
          resources.scripts.push({
            element: script,
            originalUrl: src,
            absoluteUrl: absoluteUrl,
            type: 'script',
            async: script.hasAttribute('async'),
            defer: script.hasAttribute('defer'),
            module: script.type === 'module'
          });
        }
      });
    }

    /**
     * 提取图片资源
     */
  }, {
    key: "extractImages",
    value: function extractImages(doc, resources, baseUrl) {
      var _this3 = this;
      var images = doc.querySelectorAll('img[src], img[data-src]');
      images.forEach(function (img) {
        var src = img.getAttribute('src') || img.getAttribute('data-src');
        if (src) {
          var absoluteUrl = _this3.resolveUrl(src, baseUrl);
          resources.images.push({
            element: img,
            originalUrl: src,
            absoluteUrl: absoluteUrl,
            type: 'image'
          });
        }

        // 处理srcset
        var srcset = img.getAttribute('srcset');
        if (srcset) {
          var srcsetUrls = _this3.parseSrcset(srcset, baseUrl);
          srcsetUrls.forEach(function (url) {
            resources.images.push({
              element: img,
              originalUrl: url.originalUrl,
              absoluteUrl: url.absoluteUrl,
              type: 'image-srcset'
            });
          });
        }
      });

      // 处理背景图片
      var elementsWithBg = doc.querySelectorAll('[style*="background"]');
      elementsWithBg.forEach(function (el) {
        var style = el.getAttribute('style');
        var bgUrls = _this3.extractBackgroundUrls(style, baseUrl);
        bgUrls.forEach(function (url) {
          resources.images.push({
            element: el,
            originalUrl: url.originalUrl,
            absoluteUrl: url.absoluteUrl,
            type: 'background-image'
          });
        });
      });
    }

    /**
     * 提取其他链接资源
     */
  }, {
    key: "extractOtherLinks",
    value: function extractOtherLinks(doc, resources, baseUrl) {
      var _this4 = this;
      var links = doc.querySelectorAll('link:not([rel="stylesheet"]):not([rel="preload"][as="style"])');
      links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href) {
          var absoluteUrl = _this4.resolveUrl(href, baseUrl);
          var rel = link.getAttribute('rel') || 'unknown';
          resources.links.push({
            element: link,
            originalUrl: href,
            absoluteUrl: absoluteUrl,
            type: 'link',
            rel: rel
          });
        }
      });

      // 处理其他可能的资源引用
      var otherElements = doc.querySelectorAll('source[src], track[src], embed[src], object[data]');
      otherElements.forEach(function (el) {
        var src = el.getAttribute('src') || el.getAttribute('data');
        if (src) {
          var absoluteUrl = _this4.resolveUrl(src, baseUrl);
          resources.other.push({
            element: el,
            originalUrl: src,
            absoluteUrl: absoluteUrl,
            type: el.tagName.toLowerCase()
          });
        }
      });
    }

    /**
     * 提取内联样式中的URL
     */
  }, {
    key: "extractInlineStyleUrls",
    value: function extractInlineStyleUrls(doc, resources, baseUrl) {
      var _this5 = this;
      var elementsWithStyle = doc.querySelectorAll('[style]');
      elementsWithStyle.forEach(function (el) {
        var style = el.getAttribute('style');
        var urls = _this5.extractUrlsFromCSS(style, baseUrl);
        urls.forEach(function (url) {
          resources.other.push({
            element: el,
            originalUrl: url.originalUrl,
            absoluteUrl: url.absoluteUrl,
            type: 'inline-style'
          });
        });
      });
    }

    /**
     * 从CSS内容中提取URL
     */
  }, {
    key: "extractUrlsFromCSS",
    value: function extractUrlsFromCSS(cssContent, baseUrl) {
      var urls = [];
      var urlRegex = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
      var match;
      while ((match = urlRegex.exec(cssContent)) !== null) {
        var originalUrl = match[1];
        var absoluteUrl = this.resolveUrl(originalUrl, baseUrl);
        urls.push({
          originalUrl: originalUrl,
          absoluteUrl: absoluteUrl
        });
      }
      return urls;
    }

    /**
     * 提取背景图片URL
     */
  }, {
    key: "extractBackgroundUrls",
    value: function extractBackgroundUrls(styleContent, baseUrl) {
      return this.extractUrlsFromCSS(styleContent, baseUrl);
    }

    /**
     * 解析srcset属性
     */
  }, {
    key: "parseSrcset",
    value: function parseSrcset(srcset, baseUrl) {
      var _this6 = this;
      var urls = [];
      var entries = srcset.split(',');
      entries.forEach(function (entry) {
        var trimmed = entry.trim();
        var parts = trimmed.split(/\s+/);
        if (parts.length > 0) {
          var originalUrl = parts[0];
          var absoluteUrl = _this6.resolveUrl(originalUrl, baseUrl);
          urls.push({
            originalUrl: originalUrl,
            absoluteUrl: absoluteUrl
          });
        }
      });
      return urls;
    }

    /**
     * 解析相对URL为绝对URL
     */
  }, {
    key: "resolveUrl",
    value: function resolveUrl(url, baseUrl) {
      try {
        // 如果已经是绝对URL，直接返回
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
          return url.startsWith('//') ? "https:".concat(url) : url;
        }

        // 如果是data URL或其他特殊协议，直接返回
        if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('javascript:')) {
          return url;
        }

        // 解析相对URL
        var base = new URL(baseUrl);
        var resolved = new URL(url, base);
        return resolved.toString();
      } catch (error) {
        console.warn("[SmartIframe] URL\u89E3\u6790\u5931\u8D25: ".concat(url, " (base: ").concat(baseUrl, ")"), error);
        return url;
      }
    }

    /**
     * 获取所有资源URL列表
     */
  }, {
    key: "getAllUrls",
    value: function getAllUrls(resources) {
      var allUrls = [];
      Object.values(resources).forEach(function (resourceList) {
        resourceList.forEach(function (resource) {
          if (resource.absoluteUrl && !allUrls.includes(resource.absoluteUrl)) {
            allUrls.push(resource.absoluteUrl);
          }
        });
      });
      return allUrls;
    }

    /**
     * 重写HTML中的资源引用
     * @param {Document} doc - DOM文档
     * @param {Object} resourceMap - 资源映射表 {originalUrl: newUrl}
     * @returns {string} 重写后的HTML
     */
  }, {
    key: "rewriteResourceReferences",
    value: function rewriteResourceReferences(doc, resourceMap) {
      var _this7 = this;
      // 重写link标签
      doc.querySelectorAll('link[href]').forEach(function (link) {
        var href = link.getAttribute('href');
        var absoluteUrl = _this7.resolveUrl(href, window.location.href);
        if (resourceMap[absoluteUrl]) {
          link.setAttribute('href', resourceMap[absoluteUrl]);
        }
      });

      // 重写script标签
      doc.querySelectorAll('script[src]').forEach(function (script) {
        var src = script.getAttribute('src');
        var absoluteUrl = _this7.resolveUrl(src, window.location.href);
        if (resourceMap[absoluteUrl]) {
          script.setAttribute('src', resourceMap[absoluteUrl]);
        }
      });

      // 重写img标签
      doc.querySelectorAll('img[src]').forEach(function (img) {
        var src = img.getAttribute('src');
        var absoluteUrl = _this7.resolveUrl(src, window.location.href);
        if (resourceMap[absoluteUrl]) {
          img.setAttribute('src', resourceMap[absoluteUrl]);
        }
      });

      // 重写style标签中的@import和url()
      doc.querySelectorAll('style').forEach(function (style) {
        var content = style.textContent;

        // 替换所有URL引用
        content = content.replace(/url\(\s*["']?([^"')]+)["']?\s*\)/g, function (match, url) {
          var absoluteUrl = _this7.resolveUrl(url, window.location.href);
          var newUrl = resourceMap[absoluteUrl] || url;
          return match.replace(url, newUrl);
        });
        style.textContent = content;
      });
      return doc.documentElement.outerHTML;
    }
  }]);
}();

/**
 * 渲染引擎 - 负责在Shadow DOM中渲染完整网页
 */
var Renderer = /*#__PURE__*/function () {
  function Renderer(container) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Renderer);
    this.container = container;
    this.options = _objectSpread2({
      sandbox: true,
      loadImages: true,
      loadScripts: true,
      loadStyles: true
    }, options);
    this.shadowRoot = null;
    this.baseUrl = '';
    this.resourceMap = new Map();
    this.isRendered = false;
  }

  /**
   * 渲染URL指定的网页
   * @param {string} url - 要渲染的网页URL
   * @returns {Promise<void>}
   */
  return _createClass(Renderer, [{
    key: "renderUrl",
    value: (function () {
      var _renderUrl = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(url) {
        var htmlResource, parsed, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.p = 0;
              console.log("[SmartIframe] \u5F00\u59CB\u6E32\u67D3: ".concat(url));
              this.baseUrl = url;

              // 1. 获取HTML内容
              _context.n = 1;
              return ResourceCache.fetchWithCache(url);
            case 1:
              htmlResource = _context.v;
              // 2. 解析HTML并提取资源
              parsed = HtmlParser.parseHTML(htmlResource.content, url); // 3. 预加载所有资源
              if (!(parsed.allUrls.length > 0)) {
                _context.n = 2;
                break;
              }
              _context.n = 2;
              return this.preloadResources(parsed.allUrls);
            case 2:
              // 4. 创建Shadow DOM
              this.createShadowRoot();

              // 5. 处理CSS样式
              _context.n = 3;
              return this.processStyles(parsed.resources.stylesheets);
            case 3:
              // 6. 渲染HTML结构
              this.renderHTML(parsed.document);

              // 7. 处理JavaScript（如果启用）
              if (!this.options.loadScripts) {
                _context.n = 4;
                break;
              }
              _context.n = 4;
              return this.processScripts(parsed.resources.scripts);
            case 4:
              // 8. 处理图片资源
              if (this.options.loadImages) {
                this.processImages(parsed.resources.images);
              }
              this.isRendered = true;
              console.log("[SmartIframe] \u6E32\u67D3\u5B8C\u6210: ".concat(url));

              // 触发渲染完成事件
              this.dispatchEvent('rendered', {
                url: url,
                resources: parsed.resources
              });
              _context.n = 6;
              break;
            case 5:
              _context.p = 5;
              _t = _context.v;
              console.error("[SmartIframe] \u6E32\u67D3\u5931\u8D25: ".concat(url), _t);
              this.dispatchEvent('error', {
                url: url,
                error: _t
              });
              throw _t;
            case 6:
              return _context.a(2);
          }
        }, _callee, this, [[0, 5]]);
      }));
      function renderUrl(_x) {
        return _renderUrl.apply(this, arguments);
      }
      return renderUrl;
    }()
    /**
     * 创建Shadow DOM
     */
    )
  }, {
    key: "createShadowRoot",
    value: function createShadowRoot() {
      if (this.shadowRoot) {
        return;
      }

      // 检查容器是否已经有Shadow DOM
      if (this.container.shadowRoot) {
        this.shadowRoot = this.container.shadowRoot;
        // 清空现有内容
        this.shadowRoot.innerHTML = '';
      } else {
        this.shadowRoot = this.container.attachShadow({
          mode: 'closed',
          delegatesFocus: false
        });
      }

      // 添加基础样式重置
      var resetStyle = document.createElement('style');
      resetStyle.textContent = "\n      :host {\n        display: block;\n        width: 100%;\n        height: 100%;\n        overflow: auto;\n      }\n      \n      html, body {\n        margin: 0;\n        padding: 0;\n        width: 100%;\n        height: 100%;\n      }\n    ";
      this.shadowRoot.appendChild(resetStyle);
    }

    /**
     * 预加载资源
     * @param {Array<string>} urls - 资源URL列表
     */
  }, {
    key: "preloadResources",
    value: (function () {
      var _preloadResources = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(urls) {
        var filteredUrls;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              filteredUrls = urls.filter(function (url) {
                // 过滤掉不需要预加载的资源
                return !url.startsWith('data:') && !url.startsWith('blob:') && !url.startsWith('javascript:');
              });
              if (!(filteredUrls.length > 0)) {
                _context2.n = 1;
                break;
              }
              _context2.n = 1;
              return ResourceCache.preloadResources(filteredUrls);
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function preloadResources(_x2) {
        return _preloadResources.apply(this, arguments);
      }
      return preloadResources;
    }()
    /**
     * 处理CSS样式
     * @param {Array} stylesheets - CSS资源列表
     */
    )
  }, {
    key: "processStyles",
    value: (function () {
      var _processStyles = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(stylesheets) {
        var _iterator, _step, stylesheet, cssResource, processedCSS, style, _cssResource, _processedCSS, parentStyle, content, _t2, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              if (this.options.loadStyles) {
                _context3.n = 1;
                break;
              }
              return _context3.a(2);
            case 1:
              _iterator = _createForOfIteratorHelper(stylesheets);
              _context3.p = 2;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context3.n = 13;
                break;
              }
              stylesheet = _step.value;
              _context3.p = 4;
              if (!(stylesheet.type === 'stylesheet')) {
                _context3.n = 7;
                break;
              }
              _context3.n = 5;
              return ResourceCache.fetchWithCache(stylesheet.absoluteUrl);
            case 5:
              cssResource = _context3.v;
              _context3.n = 6;
              return this.processCSSContent(cssResource.content, stylesheet.absoluteUrl);
            case 6:
              processedCSS = _context3.v;
              style = document.createElement('style');
              style.textContent = processedCSS;
              this.shadowRoot.appendChild(style);
              _context3.n = 10;
              break;
            case 7:
              if (!(stylesheet.type === 'import')) {
                _context3.n = 10;
                break;
              }
              _context3.n = 8;
              return ResourceCache.fetchWithCache(stylesheet.absoluteUrl);
            case 8:
              _cssResource = _context3.v;
              _context3.n = 9;
              return this.processCSSContent(_cssResource.content, stylesheet.absoluteUrl);
            case 9:
              _processedCSS = _context3.v;
              // 替换原来的@import
              parentStyle = stylesheet.parentStyle;
              if (parentStyle) {
                content = parentStyle.textContent;
                content = content.replace(new RegExp("@import\\s+(?:url\\()?[\"']?".concat(stylesheet.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "[\"']?\\)?[^;]*;")), _processedCSS);
                parentStyle.textContent = content;
              }
            case 10:
              _context3.n = 12;
              break;
            case 11:
              _context3.p = 11;
              _t2 = _context3.v;
              console.warn("[SmartIframe] CSS\u52A0\u8F7D\u5931\u8D25: ".concat(stylesheet.absoluteUrl), _t2);
            case 12:
              _context3.n = 3;
              break;
            case 13:
              _context3.n = 15;
              break;
            case 14:
              _context3.p = 14;
              _t3 = _context3.v;
              _iterator.e(_t3);
            case 15:
              _context3.p = 15;
              _iterator.f();
              return _context3.f(15);
            case 16:
              return _context3.a(2);
          }
        }, _callee3, this, [[4, 11], [2, 14, 15, 16]]);
      }));
      function processStyles(_x3) {
        return _processStyles.apply(this, arguments);
      }
      return processStyles;
    }()
    /**
     * 处理CSS内容，解析其中的url()引用
     * @param {string} cssContent - CSS内容
     * @param {string} baseUrl - CSS文件的基础URL
     * @returns {Promise<string>} 处理后的CSS内容
     */
    )
  }, {
    key: "processCSSContent",
    value: (function () {
      var _processCSSContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(cssContent, baseUrl) {
        var urlRegex, urls, match, url, absoluteUrl, urlList, processedCSS, _i, _urls, urlInfo, resource, newUrl, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              // 提取CSS中的所有URL引用
              urlRegex = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
              urls = [];
              while ((match = urlRegex.exec(cssContent)) !== null) {
                url = match[1];
                if (!url.startsWith('data:') && !url.startsWith('blob:')) {
                  absoluteUrl = HtmlParser.resolveUrl(url, baseUrl);
                  urls.push({
                    originalUrl: url,
                    absoluteUrl: absoluteUrl
                  });
                }
              }

              // 预加载这些资源
              if (!(urls.length > 0)) {
                _context4.n = 1;
                break;
              }
              urlList = urls.map(function (u) {
                return u.absoluteUrl;
              });
              _context4.n = 1;
              return ResourceCache.preloadResources(urlList);
            case 1:
              // 替换URL引用为缓存的blob URL
              processedCSS = cssContent;
              _i = 0, _urls = urls;
            case 2:
              if (!(_i < _urls.length)) {
                _context4.n = 7;
                break;
              }
              urlInfo = _urls[_i];
              _context4.p = 3;
              _context4.n = 4;
              return ResourceCache.fetchWithCache(urlInfo.absoluteUrl);
            case 4:
              resource = _context4.v;
              if (resource && resource.content) {
                // 如果是blob URL，直接使用
                newUrl = resource.content.startsWith('blob:') ? resource.content : "data:".concat(resource.contentType, ";base64,").concat(btoa(resource.content));
                processedCSS = processedCSS.replace(new RegExp("url\\(\\s*[\"']?".concat(urlInfo.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "[\"']?\\s*\\)"), 'g'), "url(".concat(newUrl, ")"));
              }
              _context4.n = 6;
              break;
            case 5:
              _context4.p = 5;
              _t4 = _context4.v;
              console.warn("[SmartIframe] CSS\u8D44\u6E90\u5904\u7406\u5931\u8D25: ".concat(urlInfo.absoluteUrl), _t4);
            case 6:
              _i++;
              _context4.n = 2;
              break;
            case 7:
              return _context4.a(2, processedCSS);
          }
        }, _callee4, null, [[3, 5]]);
      }));
      function processCSSContent(_x4, _x5) {
        return _processCSSContent.apply(this, arguments);
      }
      return processCSSContent;
    }()
    /**
     * 渲染HTML结构
     * @param {Document} doc - 解析后的文档
     */
    )
  }, {
    key: "renderHTML",
    value: function renderHTML(doc) {
      // 克隆body内容到shadow root
      var body = doc.body;
      if (body) {
        // 创建一个容器div
        var container = document.createElement('div');
        container.innerHTML = body.innerHTML;

        // 处理所有图片的src属性
        this.processImageElements(container);
        this.shadowRoot.appendChild(container);
      }
    }

    /**
     * 处理图片元素
     * @param {Element} container - 容器元素
     */
  }, {
    key: "processImageElements",
    value: function processImageElements(container) {
      var _this = this;
      var images = container.querySelectorAll('img');
      images.forEach(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(img) {
          var src, absoluteUrl, resource, _t5;
          return _regenerator().w(function (_context5) {
            while (1) switch (_context5.n) {
              case 0:
                src = img.getAttribute('src');
                if (!(src && !src.startsWith('data:') && !src.startsWith('blob:'))) {
                  _context5.n = 4;
                  break;
                }
                _context5.p = 1;
                absoluteUrl = HtmlParser.resolveUrl(src, _this.baseUrl);
                _context5.n = 2;
                return ResourceCache.fetchWithCache(absoluteUrl);
              case 2:
                resource = _context5.v;
                if (resource && resource.content) {
                  if (resource.content.startsWith('blob:')) {
                    img.src = resource.content;
                  } else {
                    // 转换为data URL
                    img.src = "data:".concat(resource.contentType, ";base64,").concat(btoa(resource.content));
                  }
                }
                _context5.n = 4;
                break;
              case 3:
                _context5.p = 3;
                _t5 = _context5.v;
                console.warn("[SmartIframe] \u56FE\u7247\u52A0\u8F7D\u5931\u8D25: ".concat(src), _t5);
              case 4:
                return _context5.a(2);
            }
          }, _callee5, null, [[1, 3]]);
        }));
        return function (_x6) {
          return _ref.apply(this, arguments);
        };
      }());
    }

    /**
     * 处理JavaScript脚本
     * @param {Array} scripts - 脚本资源列表
     */
  }, {
    key: "processScripts",
    value: (function () {
      var _processScripts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(scripts) {
        var _iterator2, _step2, script, jsResource, _t6, _t7;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              if (this.options.sandbox) {
                _context6.n = 1;
                break;
              }
              console.warn('[SmartIframe] 脚本执行需要沙箱环境，跳过JavaScript处理');
              return _context6.a(2);
            case 1:
              _iterator2 = _createForOfIteratorHelper(scripts);
              _context6.p = 2;
              _iterator2.s();
            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context6.n = 8;
                break;
              }
              script = _step2.value;
              _context6.p = 4;
              _context6.n = 5;
              return ResourceCache.fetchWithCache(script.absoluteUrl);
            case 5:
              jsResource = _context6.v;
              // 在沙箱环境中执行脚本
              this.executeScriptInSandbox(jsResource.content, script.absoluteUrl);
              _context6.n = 7;
              break;
            case 6:
              _context6.p = 6;
              _t6 = _context6.v;
              console.warn("[SmartIframe] \u811A\u672C\u52A0\u8F7D\u5931\u8D25: ".concat(script.absoluteUrl), _t6);
            case 7:
              _context6.n = 3;
              break;
            case 8:
              _context6.n = 10;
              break;
            case 9:
              _context6.p = 9;
              _t7 = _context6.v;
              _iterator2.e(_t7);
            case 10:
              _context6.p = 10;
              _iterator2.f();
              return _context6.f(10);
            case 11:
              return _context6.a(2);
          }
        }, _callee6, this, [[4, 6], [2, 9, 10, 11]]);
      }));
      function processScripts(_x7) {
        return _processScripts.apply(this, arguments);
      }
      return processScripts;
    }()
    /**
     * 在沙箱中执行脚本
     * @param {string} scriptContent - 脚本内容
     * @param {string} scriptUrl - 脚本URL
     */
    )
  }, {
    key: "executeScriptInSandbox",
    value: function executeScriptInSandbox(scriptContent, scriptUrl) {
      try {
        // 创建一个受限的执行环境
        var sandbox = {
          console: console,
          setTimeout: setTimeout,
          setInterval: setInterval,
          clearTimeout: clearTimeout,
          clearInterval: clearInterval,
          document: this.shadowRoot,
          window: new Proxy({}, {
            get: function get(target, prop) {
              // 只允许访问安全的属性
              var allowedProps = ['console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'];
              if (allowedProps.includes(prop)) {
                return sandbox[prop];
              }
              return undefined;
            }
          })
        };

        // 使用Function构造器创建沙箱环境
        var func = new Function('sandbox', "\n        with(sandbox) {\n          ".concat(scriptContent, "\n        }\n      "));
        func(sandbox);
      } catch (error) {
        console.error("[SmartIframe] \u811A\u672C\u6267\u884C\u5931\u8D25: ".concat(scriptUrl), error);
      }
    }

    /**
     * 处理图片资源
     * @param {Array} images - 图片资源列表
     */
  }, {
    key: "processImages",
    value: function processImages(images) {
      // 图片处理已经在renderHTML中进行了
      console.log("[SmartIframe] \u5904\u7406\u4E86 ".concat(images.length, " \u4E2A\u56FE\u7247\u8D44\u6E90"));
    }

    /**
     * 触发自定义事件
     * @param {string} eventName - 事件名称
     * @param {Object} detail - 事件详情
     */
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(eventName) {
      var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var event = new CustomEvent("smartiframe:".concat(eventName), {
        detail: detail,
        bubbles: true,
        cancelable: true
      });
      this.container.dispatchEvent(event);
    }

    /**
     * 销毁渲染器
     */
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = '';
      }
      this.resourceMap.clear();
      this.isRendered = false;
      console.log('[SmartIframe] 渲染器已销毁');
    }

    /**
     * 获取渲染统计信息
     * @returns {Object} 统计信息
     */
  }, {
    key: "getStats",
    value: function getStats() {
      return {
        isRendered: this.isRendered,
        baseUrl: this.baseUrl,
        resourceCount: this.resourceMap.size,
        cacheStats: ResourceCache.getCacheStats()
      };
    }
  }]);
}();

/**
 * SmartIframe - 智能iframe替代方案的核心组件
 */
var SmartIframe = /*#__PURE__*/function () {
  function SmartIframe(container) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, SmartIframe);
    this.container = this.resolveContainer(container);
    this.options = _objectSpread2({
      width: '100%',
      height: '400px',
      sandbox: true,
      loadImages: true,
      loadScripts: false,
      // 默认关闭脚本执行，提高安全性
      loadStyles: true,
      cache: true
    }, options);
    this.src = '';
    this.renderer = null;
    this.isLoading = false;
    this.isLoaded = false;
    this.init();
  }

  /**
   * 解析容器元素
   * @param {string|Element} container - 容器选择器或元素
   * @returns {Element} 容器元素
   */
  return _createClass(SmartIframe, [{
    key: "resolveContainer",
    value: function resolveContainer(container) {
      if (typeof container === 'string') {
        var element = document.querySelector(container);
        if (!element) {
          throw new Error("[SmartIframe] \u627E\u4E0D\u5230\u5BB9\u5668\u5143\u7D20: ".concat(container));
        }
        return element;
      } else if (container instanceof Element) {
        return container;
      } else {
        throw new Error('[SmartIframe] 无效的容器参数');
      }
    }

    /**
     * 初始化组件
     */
  }, {
    key: "init",
    value: function init() {
      this.setupContainer();
      this.setupEventListeners();
      this.renderer = new Renderer(this.container, this.options);
    }

    /**
     * 设置容器样式
     */
  }, {
    key: "setupContainer",
    value: function setupContainer() {
      // 设置容器基础样式
      Object.assign(this.container.style, {
        width: this.options.width,
        height: this.options.height,
        border: 'none',
        overflow: 'hidden',
        display: 'block'
      });

      // 添加SmartIframe标识
      this.container.setAttribute('data-smart-iframe', 'true');
      this.container.classList.add('smart-iframe-container');
    }

    /**
     * 设置事件监听器
     */
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      // 监听渲染事件
      this.container.addEventListener('smartiframe:rendered', function (e) {
        _this.isLoading = false;
        _this.isLoaded = true;
        _this.dispatchEvent('load', e.detail);
      });

      // 监听错误事件
      this.container.addEventListener('smartiframe:error', function (e) {
        _this.isLoading = false;
        _this.isLoaded = false;
        _this.dispatchEvent('error', e.detail);
      });
    }

    /**
     * 加载指定URL的内容
     * @param {string} url - 要加载的URL
     * @returns {Promise<void>}
     */
  }, {
    key: "load",
    value: (function () {
      var _load = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(url) {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (url) {
                _context.n = 1;
                break;
              }
              throw new Error('[SmartIframe] URL不能为空');
            case 1:
              if (!this.isLoading) {
                _context.n = 2;
                break;
              }
              console.warn('[SmartIframe] 正在加载中，忽略新的加载请求');
              return _context.a(2);
            case 2:
              _context.p = 2;
              this.isLoading = true;
              this.isLoaded = false;
              this.src = url;

              // 显示加载状态
              this.showLoadingState();

              // 使用渲染器加载内容
              _context.n = 3;
              return this.renderer.renderUrl(url);
            case 3:
              // 隐藏加载状态
              this.hideLoadingState();
              _context.n = 5;
              break;
            case 4:
              _context.p = 4;
              _t = _context.v;
              this.hideLoadingState();
              this.showErrorState(_t);
              throw _t;
            case 5:
              return _context.a(2);
          }
        }, _callee, this, [[2, 4]]);
      }));
      function load(_x) {
        return _load.apply(this, arguments);
      }
      return load;
    }()
    /**
     * 显示加载状态
     */
    )
  }, {
    key: "showLoadingState",
    value: function showLoadingState() {
      this.container.innerHTML = "\n      <div class=\"smart-iframe-loading\" style=\"\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        height: 100%;\n        font-family: Arial, sans-serif;\n        color: #666;\n        background: #f5f5f5;\n      \">\n        <div style=\"text-align: center;\">\n          <div style=\"\n            width: 40px;\n            height: 40px;\n            border: 3px solid #e0e0e0;\n            border-top: 3px solid #007bff;\n            border-radius: 50%;\n            animation: spin 1s linear infinite;\n            margin: 0 auto 10px;\n          \"></div>\n          <div>\u6B63\u5728\u52A0\u8F7D...</div>\n        </div>\n        <style>\n          @keyframes spin {\n            0% { transform: rotate(0deg); }\n            100% { transform: rotate(360deg); }\n          }\n        </style>\n      </div>\n    ";
    }

    /**
     * 隐藏加载状态
     */
  }, {
    key: "hideLoadingState",
    value: function hideLoadingState() {
      var loadingElement = this.container.querySelector('.smart-iframe-loading');
      if (loadingElement) {
        loadingElement.remove();
      }
    }

    /**
     * 显示错误状态
     * @param {Error} error - 错误对象
     */
  }, {
    key: "showErrorState",
    value: function showErrorState(error) {
      this.container.innerHTML = "\n      <div class=\"smart-iframe-error\" style=\"\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        height: 100%;\n        font-family: Arial, sans-serif;\n        background: #fff;\n        border: 1px solid #ddd;\n      \">\n        <div style=\"text-align: center; color: #666; padding: 20px;\">\n          <div style=\"font-size: 48px; margin-bottom: 10px;\">\u26A0\uFE0F</div>\n          <div style=\"font-size: 16px; margin-bottom: 10px;\">\u52A0\u8F7D\u5931\u8D25</div>\n          <div style=\"font-size: 14px; color: #999;\">".concat(error.message, "</div>\n          <button onclick=\"this.closest('.smart-iframe-container').smartIframe.reload()\" \n                  style=\"\n                    margin-top: 15px;\n                    padding: 8px 16px;\n                    background: #007bff;\n                    color: white;\n                    border: none;\n                    border-radius: 4px;\n                    cursor: pointer;\n                  \">\n            \u91CD\u65B0\u52A0\u8F7D\n          </button>\n        </div>\n      </div>\n    ");
    }

    /**
     * 重新加载当前URL
     * @returns {Promise<void>}
     */
  }, {
    key: "reload",
    value: (function () {
      var _reload = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (!this.src) {
                _context2.n = 1;
                break;
              }
              // 清除该URL的缓存
              if (this.options.cache) {
                ResourceCache.clearCache(this.src);
              }
              _context2.n = 1;
              return this.load(this.src);
            case 1:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function reload() {
        return _reload.apply(this, arguments);
      }
      return reload;
    }()
    /**
     * 设置src属性（类似iframe的src）
     * @param {string} url - URL
     */
    )
  }, {
    key: "src",
    get:
    /**
     * 获取src属性
     * @returns {string} 当前的URL
     */
    function get() {
      return this._src || '';
    }

    /**
     * 设置宽度
     * @param {string} width - 宽度值
     */,
    set: function set(url) {
      this._src = url;
      if (url) {
        this.load(url).catch(function (error) {
          console.error('[SmartIframe] 自动加载失败:', error);
        });
      }
    }
  }, {
    key: "width",
    get:
    /**
     * 获取宽度
     * @returns {string} 当前宽度
     */
    function get() {
      return this.options.width;
    }

    /**
     * 设置高度
     * @param {string} height - 高度值
     */,
    set: function set(width) {
      this.options.width = width;
      this.container.style.width = width;
    }
  }, {
    key: "height",
    get:
    /**
     * 获取高度
     * @returns {string} 当前高度
     */
    function get() {
      return this.options.height;
    }

    /**
     * 获取加载状态
     * @returns {boolean} 是否正在加载
     */,
    set: function set(height) {
      this.options.height = height;
      this.container.style.height = height;
    }
  }, {
    key: "loading",
    get: function get() {
      return this.isLoading;
    }

    /**
     * 获取加载完成状态
     * @returns {boolean} 是否已加载完成
     */
  }, {
    key: "loaded",
    get: function get() {
      return this.isLoaded;
    }

    /**
     * 触发自定义事件
     * @param {string} eventName - 事件名称
     * @param {Object} detail - 事件详情
     */
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(eventName) {
      var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var event = new CustomEvent(eventName, {
        detail: detail,
        bubbles: true,
        cancelable: true
      });
      this.container.dispatchEvent(event);
    }

    /**
     * 销毁组件
     */
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.renderer) {
        this.renderer.destroy();
        this.renderer = null;
      }

      // 清理容器内容，但保留Shadow DOM结构以便重用
      if (this.container.shadowRoot) {
        this.container.shadowRoot.innerHTML = '';
      } else {
        this.container.innerHTML = '';
      }
      this.container.removeAttribute('data-smart-iframe');
      this.container.classList.remove('smart-iframe-container');
      this.isLoading = false;
      this.isLoaded = false;
      this._src = '';
      console.log('[SmartIframe] 组件已销毁');
    }

    /**
     * 获取统计信息
     * @returns {Object} 统计信息
     */
  }, {
    key: "getStats",
    value: function getStats() {
      return {
        src: this.src,
        loading: this.isLoading,
        loaded: this.isLoaded,
        renderer: this.renderer ? this.renderer.getStats() : null
      };
    }

    /**
     * 静态方法：创建SmartIframe实例
     * @param {string|Element} container - 容器
     * @param {Object} options - 选项
     * @returns {SmartIframe} SmartIframe实例
     */
  }], [{
    key: "create",
    value: function create(container) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new SmartIframe(container, options);
    }

    /**
     * 静态方法：获取缓存统计
     * @returns {Object} 缓存统计信息
     */
  }, {
    key: "getCacheStats",
    value: function getCacheStats() {
      return ResourceCache.getCacheStats();
    }

    /**
     * 静态方法：清除所有缓存
     */
  }, {
    key: "clearAllCache",
    value: function clearAllCache() {
      ResourceCache.clearCache();
    }
  }]);
}();

/**
 * SmartIframe Web Component
 * 使用方式：<smart-iframe src="https://example.com" width="800" height="600"></smart-iframe>
 */
var SmartIframeElement = /*#__PURE__*/function (_HTMLElement) {
  function SmartIframeElement() {
    var _this;
    _classCallCheck(this, SmartIframeElement);
    _this = _callSuper(this, SmartIframeElement);
    _this.smartIframe = null;
    _this.isConnected = false;
    return _this;
  }

  /**
   * 定义观察的属性
   */
  _inherits(SmartIframeElement, _HTMLElement);
  return _createClass(SmartIframeElement, [{
    key: "connectedCallback",
    value:
    /**
     * 元素连接到DOM时调用
     */
    function connectedCallback() {
      this.isConnected = true;
      this.render();
    }

    /**
     * 元素从DOM断开时调用
     */
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.isConnected = false;
      if (this.smartIframe) {
        this.smartIframe.destroy();
        this.smartIframe = null;
      }
    }

    /**
     * 属性变化时调用
     */
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (!this.isConnected || oldValue === newValue) {
        return;
      }
      switch (name) {
        case 'src':
          if (this.smartIframe && newValue) {
            this.smartIframe.src = newValue;
          }
          break;
        case 'width':
          if (this.smartIframe && newValue) {
            this.smartIframe.width = newValue;
          }
          break;
        case 'height':
          if (this.smartIframe && newValue) {
            this.smartIframe.height = newValue;
          }
          break;
        default:
          // 其他属性变化时重新渲染
          this.render();
          break;
      }
    }

    /**
     * 渲染组件
     */
  }, {
    key: "render",
    value: function render() {
      if (this.smartIframe) {
        this.smartIframe.destroy();
      }

      // 创建容器div
      var container = document.createElement('div');
      container.style.width = '100%';
      container.style.height = '100%';
      this.innerHTML = '';
      this.appendChild(container);

      // 解析配置选项
      var options = {
        width: this.getAttribute('width') || '100%',
        height: this.getAttribute('height') || '400px',
        sandbox: this.getAttribute('sandbox') !== 'false',
        loadImages: this.getAttribute('load-images') !== 'false',
        loadScripts: this.getAttribute('load-scripts') === 'true',
        loadStyles: this.getAttribute('load-styles') !== 'false'
      };

      // 创建SmartIframe实例
      this.smartIframe = new SmartIframe(container, options);

      // 绑定到容器元素
      container.smartIframe = this.smartIframe;

      // 设置事件监听
      this.setupEventListeners();

      // 如果有src属性，立即加载
      var src = this.getAttribute('src');
      if (src) {
        this.smartIframe.load(src).catch(function (error) {
          console.error('[SmartIframeElement] 加载失败:', error);
        });
      }
    }

    /**
     * 设置事件监听器
     */
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this2 = this;
      var container = this.querySelector('div');
      if (!container) return;

      // 转发SmartIframe的事件
      container.addEventListener('load', function (e) {
        _this2.dispatchEvent(new CustomEvent('load', {
          detail: e.detail,
          bubbles: true
        }));
      });
      container.addEventListener('error', function (e) {
        _this2.dispatchEvent(new CustomEvent('error', {
          detail: e.detail,
          bubbles: true
        }));
      });
    }

    /**
     * src属性的getter
     */
  }, {
    key: "src",
    get: function get() {
      return this.getAttribute('src') || '';
    }

    /**
     * src属性的setter
     */,
    set: function set(value) {
      if (value) {
        this.setAttribute('src', value);
      } else {
        this.removeAttribute('src');
      }
    }

    /**
     * width属性的getter
     */
  }, {
    key: "width",
    get: function get() {
      return this.getAttribute('width') || '100%';
    }

    /**
     * width属性的setter
     */,
    set: function set(value) {
      if (value) {
        this.setAttribute('width', value);
      } else {
        this.removeAttribute('width');
      }
    }

    /**
     * height属性的getter
     */
  }, {
    key: "height",
    get: function get() {
      return this.getAttribute('height') || '400px';
    }

    /**
     * height属性的setter
     */,
    set: function set(value) {
      if (value) {
        this.setAttribute('height', value);
      } else {
        this.removeAttribute('height');
      }
    }

    /**
     * 获取加载状态
     */
  }, {
    key: "loading",
    get: function get() {
      return this.smartIframe ? this.smartIframe.loading : false;
    }

    /**
     * 获取加载完成状态
     */
  }, {
    key: "loaded",
    get: function get() {
      return this.smartIframe ? this.smartIframe.loaded : false;
    }

    /**
     * 重新加载
     */
  }, {
    key: "reload",
    value: (function () {
      var _reload = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (!this.smartIframe) {
                _context.n = 1;
                break;
              }
              _context.n = 1;
              return this.smartIframe.reload();
            case 1:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function reload() {
        return _reload.apply(this, arguments);
      }
      return reload;
    }()
    /**
     * 获取统计信息
     */
    )
  }, {
    key: "getStats",
    value: function getStats() {
      return this.smartIframe ? this.smartIframe.getStats() : null;
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['src', 'width', 'height', 'sandbox', 'load-images', 'load-scripts', 'load-styles'];
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)); // 注册自定义元素
if (!customElements.get('smart-iframe')) {
  customElements.define('smart-iframe', SmartIframeElement);
}

/**
 * 版本信息
 */
var VERSION = '1.0.0';

/**
 * 快速创建SmartIframe实例的工厂函数
 * @param {string|Element} container - 容器选择器或元素
 * @param {Object} options - 配置选项
 * @returns {SmartIframe} SmartIframe实例
 */
function create(container) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new SmartIframe(container, options);
}

/**
 * 快速加载网页到指定容器
 * @param {string|Element} container - 容器选择器或元素
 * @param {string} url - 要加载的URL
 * @param {Object} options - 配置选项
 * @returns {Promise<SmartIframe>} SmartIframe实例
 */
function load(_x, _x2) {
  return _load.apply(this, arguments);
}
/**
 * 注册自定义元素到全局
 * 调用后可以在HTML中使用 <smart-iframe> 标签
 */
function _load() {
  _load = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(container, url) {
    var options,
      iframe,
      _args = arguments;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
          iframe = new SmartIframe(container, options);
          _context.n = 1;
          return iframe.load(url);
        case 1:
          return _context.a(2, iframe);
      }
    }, _callee);
  }));
  return _load.apply(this, arguments);
}
function registerWebComponent() {
  if (typeof window !== 'undefined' && window.customElements) {
    // SmartIframeElement 会自动注册，这里只是确保
    console.log('[SmartIframe] Web Component 已注册');
  } else {
    console.warn('[SmartIframe] 当前环境不支持 Web Components');
  }
}

/**
 * 获取SDK信息
 * @returns {Object} SDK信息
 */
function getInfo() {
  return {
    name: 'smart-iframe-sdk',
    version: VERSION,
    description: '智能iframe替代方案，解决资源重复加载问题',
    author: 'Smart-Iframe Team',
    license: 'MIT',
    cacheStats: ResourceCache.getCacheStats()
  };
}

/**
 * 清除所有缓存
 */
function clearCache() {
  ResourceCache.clearCache();
  console.log('[SmartIframe] 已清除所有缓存');
}

/**
 * 设置全局配置
 * @param {Object} config - 全局配置
 */
function setGlobalConfig() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (config.maxCacheSize) {
    ResourceCache.maxCacheSize = config.maxCacheSize;
  }
  if (config.maxAge) {
    ResourceCache.maxAge = config.maxAge;
  }
  console.log('[SmartIframe] 全局配置已更新:', config);
}

/**
 * 批量预加载URL列表
 * @param {Array<string>} urls - URL列表
 * @returns {Promise<Array>} 预加载结果
 */
function preload(_x3) {
  return _preload.apply(this, arguments);
}
/**
 * 检查浏览器兼容性
 * @returns {Object} 兼容性检查结果
 */
function _preload() {
  _preload = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(urls) {
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          if (Array.isArray(urls)) {
            _context2.n = 1;
            break;
          }
          throw new Error('[SmartIframe] preload 参数必须是数组');
        case 1:
          console.log("[SmartIframe] \u5F00\u59CB\u6279\u91CF\u9884\u52A0\u8F7D ".concat(urls.length, " \u4E2AURL"));
          _context2.n = 2;
          return ResourceCache.preloadResources(urls);
        case 2:
          return _context2.a(2, _context2.v);
      }
    }, _callee2);
  }));
  return _preload.apply(this, arguments);
}
function checkCompatibility() {
  var isSupported = {
    shadowDOM: !!Element.prototype.attachShadow,
    webComponents: typeof customElements !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    proxy: typeof Proxy !== 'undefined',
    asyncAwait: true,
    // 如果代码能执行到这里就支持
    es6Classes: true,
    // 如果代码能执行到这里就支持
    es6Modules: true // 简化检测，如果能导入就支持
  };
  var allSupported = Object.values(isSupported).every(Boolean);
  return {
    supported: allSupported,
    features: isSupported,
    recommendation: allSupported ? '✅ 浏览器完全兼容SmartIframe SDK' : '⚠️ 部分功能可能不可用，建议使用现代浏览器'
  };
}

// 如果在浏览器环境中，自动注册到全局
if (typeof window !== 'undefined') {
  // 注册到全局对象
  window.SmartIframe = SmartIframe;
  window.SmartIframeSDK = {
    SmartIframe: SmartIframe,
    create: create,
    load: load,
    registerWebComponent: registerWebComponent,
    getInfo: getInfo,
    clearCache: clearCache,
    setGlobalConfig: setGlobalConfig,
    preload: preload,
    checkCompatibility: checkCompatibility,
    version: VERSION
  };

  // 自动注册Web Component
  registerWebComponent();
  console.log("[SmartIframe] SDK v".concat(VERSION, " \u5DF2\u52A0\u8F7D"));
  console.log('[SmartIframe] 兼容性检查:', checkCompatibility());
}

// 如果是CommonJS环境
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartIframe;
  module.exports.default = SmartIframe;
  module.exports.create = create;
  module.exports.load = load;
  module.exports.getInfo = getInfo;
  module.exports.clearCache = clearCache;
  module.exports.setGlobalConfig = setGlobalConfig;
  module.exports.preload = preload;
  module.exports.checkCompatibility = checkCompatibility;
  module.exports.version = VERSION;
}

export { HtmlParser, Renderer, ResourceCache, SmartIframe, SmartIframeElement, VERSION, checkCompatibility, clearCache, create, SmartIframe as default, getInfo, load, preload, registerWebComponent, setGlobalConfig };
//# sourceMappingURL=smart-iframe.esm.js.map
