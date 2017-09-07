/*!
 * nywx - nuoyadalu wechat version
 * @version v1.0.0
 * @link 
 * @license MIT
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _krouter = __webpack_require__(2);

	var _krouter2 = _interopRequireDefault(_krouter);

	var _kutil = __webpack_require__(6);

	var _api = __webpack_require__(7);

	var _join = __webpack_require__(9);

	var _join2 = _interopRequireDefault(_join);

	var _city = __webpack_require__(11);

	var _city2 = _interopRequireDefault(_city);

	var _adate = __webpack_require__(13);

	var _adate2 = _interopRequireDefault(_adate);

	var _detail = __webpack_require__(15);

	var _detail2 = _interopRequireDefault(_detail);

	var _picktime = __webpack_require__(17);

	var _picktime2 = _interopRequireDefault(_picktime);

	var _product = __webpack_require__(19);

	var _product2 = _interopRequireDefault(_product);

	var _allmytickes = __webpack_require__(21);

	var _allmytickes2 = _interopRequireDefault(_allmytickes);

	var _passenger = __webpack_require__(23);

	var _passenger2 = _interopRequireDefault(_passenger);

	var _changepassenger = __webpack_require__(25);

	var _changepassenger2 = _interopRequireDefault(_changepassenger);

	var _mychalinkp = __webpack_require__(27);

	var _mychalinkp2 = _interopRequireDefault(_mychalinkp);

	var _changelinkp = __webpack_require__(29);

	var _changelinkp2 = _interopRequireDefault(_changelinkp);

	var _book = __webpack_require__(31);

	var _book2 = _interopRequireDefault(_book);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by way on 16/9/21.
	 */

	var router = new _krouter2.default({
	  container: '#dvContainer'
	});

	document.ready(function () {
	  var code = (0, _kutil.urlParam)('code');
	  // alert(code);

	  router.push(new _join2.default()).push(new _city2.default()).push(new _detail2.default()).push(new _picktime2.default()).push(new _product2.default()).push(new _allmytickes2.default()).push(new _passenger2.default()).push(new _changepassenger2.default()).push(new _mychalinkp2.default()).push(new _changelinkp2.default()).push(new _book2.default()).push(new _adate2.default());
	  // 初始路由
	  var Lktype = localStorage.getItem('link1');
	  if (Lktype == 2) {
	    router.start('/flightmb/allmytickes');
	    localStorage.setItem('link1', 1);
	  } else {
	    router.start('/flightmb/join');
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	/**
	 * Created by way on 16/9/19.
	 */

	exports.default = {
	  app: {
	    token: 'nuoya.token',
	    code: 'nuoya.code',
	    lastCode: 'nuoya.lastCode',
	    docker: 'nuoya.docker',
	    hotCount: 20, // 热门分享一次获取数量
	    imgWHR: 1.9, // 上传图片宽高比
	    imgCompress: 0.3 // 图片压缩比
	  },
	  dev: {
	    /*
	        token: 'eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ'
	          + '.eyJwaWQiOiIwMjExMTYzMCJ9'
	          + '.-VFtlNpkxn5DPu3kTR2ZsFhY6I3OHfpMikwD8EMMRvs'
	    */
	  },
	  rel: {
	    host: 'http://rel.nuoyadalu.com/',
	    userInfo: 'user/api/getInfo',
	    token: 'user/api/getToken',
	    searchJoin: 'search/api/join',
	    searchCity: 'search/api/city',
	    searchGet: 'search/api/get',
	    searchSet: 'search/api/set',
	    couponGet: 'coupon/api/get',
	    couponPoster: 'coupon/api/poster',
	    couponPosterImg: 'http://nuoya-10038118.image.myqcloud.com/test1471935786508'
	  },
	  api: {
	    host: 'http://wx.nuoyadalu.com/',
	    book: 'prod/api/book',
	    token: 'user/api/getToken',
	    wxsign: 'wx/getSign',
	    prodLoad: 'prod/api/load',
	    prodList: 'prod/api/list',
	    prodHead: 'prod/api/getHeadUrl',
	    shipList: 'ship/api/list',
	    topicLoad: 'topic/api/load',
	    topicNewNo: 'topic/api/newTopicNo',
	    topicSave: 'topic/api/save',
	    articleLoad: 'topic/api/load',
	    articleNewNo: 'article/api/newTopicNo',
	    articleSave: 'article/api/save',
	    couponGet: 'coupon/api/get',
	    couponCheck: 'coupon/api/check',
	    mutualCalssRepGet: 'mutual/api/getClassRep'
	  },
	  view: {
	    host: 'http://nydl-10038118.cos.myqcloud.com/',
	    hot: 'view/hot.html',
	    book: 'view/book.html',
	    prod: 'view/prod.html',
	    crop: 'view/crop.html',
	    post: 'view/post.html',
	    poster: 'view/poster.html',
	    desc: 'view/desc.html',
	    topicEdit: 'topic/edit.html',
	    articleEdit: 'article/edit.html',
	    mutual: 'mutual/',
	    mutualCoupon: 'mutual/coupon.html',
	    mutualDetail: 'mutual/detail.html',
	    mutualBook: 'mutual/book.html',
	    mutualClassRep: 'mutual/classRep.html',
	    rel: 'rel/',
	    searchJoin: 'search/join.html',
	    searchCity: 'search/city.html',
	    couponGet: 'coupon/get.html',
	    couponPoster: 'coupon/poster.html'
	  },
	  doc: {
	    host: 'http://nydl-10038118.cos.myqcloud.com/doc/',
	    mutual: 'mutual/'
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/13.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 基于 knife ui的 路由组件
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 通过 hash实现页面切换导航,分离page到不同文件,实现动态加载,动画切换
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 由于 pushState 不支持微信侧滑返回, 因此采用了最传统的 hash模式,兼容性最好。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 建议与传统 hash 区分开来, 请使用 #! 作为 路由 hash!!!
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _kanimat = __webpack_require__(3);

	var _kanimat2 = _interopRequireDefault(_kanimat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CFG = {
	  sectionGroupClass: 'page-group',
	  // 用来辅助切换时表示 page 是 visible 的,
	  // 之所以不用 curPageClass，是因为 page-current 已被赋予了「当前 page」这一含义而不仅仅是 display: block
	  // 并且，别的地方已经使用了，所以不方便做变更，故新增一个
	  visiblePageClass: 'page-visible'
	};

	var DIRECTION = {
	  leftToRight: 'from-left-to-right',
	  rightToLeft: 'from-right-to-left'
	};

	var EVENTS = {
	  pageLoadStart: 'pageLoadStart', // ajax 开始加载新页面前
	  pageLoadCancel: 'pageLoadCancel', // 取消前一个 ajax 加载动作后
	  pageLoadError: 'pageLoadError', // ajax 加载页面失败后
	  pageLoadComplete: 'pageLoadComplete', // ajax 加载页面完成后（不论成功与否）
	  pageAnimationStart: 'pageAnimationStart', // 动画切换 page 前
	  pageAnimationEnd: 'pageAnimationEnd', // 动画切换 page 结束后
	  beforePageRemove: 'beforePageRemove', // 移除旧 document 前（适用于非内联 page 切换）
	  pageRemoved: 'pageRemoved', // 移除旧 document 后（适用于非内联 page 切换）
	  // page 切换前，pageAnimationStart 前，beforePageSwitch后会做一些额外的处理才触发 pageAnimationStart
	  beforePageSwitch: 'beforePageSwitch',
	  pageInit: 'pageInitInternal' // 目前是定义为一个 page 加载完毕后（实际和 pageAnimationEnd 等同）
	};

	/**
	 * 获取 url 的 fragment（即 hash 中去掉 # 的剩余部分）
	 *
	 * 如果没有则返回字符串
	 * 如: http://example.com/path/?query=d#123 => 123
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getHash(url) {
	  if (!url) return '';

	  var pos = url.indexOf('#!');
	  if (pos !== -1) pos++;else pos = url.indexOf('#');

	  return pos !== -1 ? url.substring(pos + 1) : ''; // ??? '/'
	}

	// google 支持 #! 格式
	function setHash(url) {
	  var hash = url;
	  if (url[0] !== '!') hash = '!' + url;
	  location.hash = hash;
	}

	/**
	 * 修改微信 title
	 */
	function setTitle(val) {
	  if (document.title === val) return;

	  if (/MicroMessenger/i.test(navigator.userAgent)) {
	    setTimeout(function () {
	      // 利用iframe的onload事件刷新页面
	      document.title = val;

	      var fr = document.createElement('iframe');
	      // fr.style.visibility = 'hidden';
	      fr.style.display = 'none';
	      fr.src = 'img/favicon.ico';
	      fr.onload = function () {
	        setTimeout(function () {
	          document.body.removeChild(fr);
	        }, 0);
	      };
	      document.body.appendChild(fr);
	    }, 0);
	  } else document.title = val;
	}

	/**
	 * 获取一个 url 的基本部分，即不包括 hash
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getBaseUrl(url) {
	  var pos = url.indexOf('#');
	  return pos === -1 ? url.slice(0) : url.slice(0, pos);
	}

	/**
	 * a very simple router for the **demo** of [weui](https://github.com/weui/weui)
	 */

	var Router = function () {

	  /**
	   * constructor
	   * @param opts
	   */


	  // array of route config
	  function Router(opts) {
	    var _this = this;

	    _classCallCheck(this, Router);

	    this._opts = {
	      container: '#dvContainer',
	      splashTime: 1000,
	      className: 'page',
	      showClass: 'page-current'
	    };
	    this._index = 1;
	    this._$container = null;
	    this._routes = [];
	    this._splash = false;
	    this.start = this.go;

	    this.getCurrentSec = function () {
	      return _kanimat2.default.qu('.' + _this._opts.showClass);
	    };

	    // this._opts = Object.assign({}, this._opts, opts);
	    this._opts.container = opts.container || this._opts.container;
	    this._opts.splashTime = opts.splashTime || this._opts.splashTime;
	    this._opts.className = opts.className || this._opts.className;
	    this._opts.showClass = opts.showClass || this._opts.showClass;

	    this._$container = _kanimat2.default.qu(this._opts.container);
	    this.params = null;
	    // 方便全局访问
	    _kanimat2.default.router = this;

	    // splash 开机画面不需要 动画
	    this._splash = true;
	    this.lastHash = '';
	    this.hash = '';
	    this.nextHash = '';

	    // why not `history.pushState`? see https://github.com/weui/weui/issues/26, Router in wechat webview
	    // pushState 不支持 微信侧滑返回
	    // 不带 hash 到 hash,返回时, 不能触发该事件,因此一开始就要设置 hash,否则无法回到 首页!
	    // 监控url hash变化
	    window.addEventListener('hashchange', function (event) {
	      _this.lastHash = getHash(event.oldURL);
	      _this.hash = getHash(event.newURL);
	      // fix '/' repeat see https://github.com/progrape/router/issues/21
	      if (_this.lastHash === _this.hash) {
	        _this.nextHash = '';
	        return;
	      }

	      // const state = history.state || {};
	      // this.to(hash, state._index <= this._index);
	      _this.routeTo(_this.hash, _this.params, _this.refresh); //  , oldHash);
	      _this.refresh = false;
	      _this.params = null;
	      _this.nextHash = '';
	    }, false);
	  }

	  /**
	   * 导航并传递对象参数, 更改当前路由 为 指定 路由，hash 直接导航只能传字符参数,不能传对象参数
	   * @param url hash
	   * @param params 对象参数 {name: val}，不是字符串！
	   * @param refresh 是否刷新, true 则显示时 重新  bind
	   */


	  // start route config


	  // container element


	  // default option


	  _createClass(Router, [{
	    key: 'go',
	    value: function go(url, params, refresh) {
	      // this._go = false;
	      /*
	       const r = this.getRoute(url);
	       if (r) {
	       r.params = r.params || {};
	       $.assign(r.params, params);
	       // this._go = true;
	       r.refresh = refresh;
	       }
	       */
	      if (!url) url = '!/';

	      // 当前网页重新加载，不会触发 hash 事件！
	      if (getHash(location.href) === url) {
	        // `#${url}`;
	        this.nextHash = getHash(url);
	        this.hash = this.nextHash;
	        this.routeTo(url, params, refresh);
	      } else {
	        // 切换页面
	        this.params = params;
	        this.refresh = refresh;
	        this.nextHash = url;
	        setHash(url);
	      }
	    }
	  }, {
	    key: 'back',
	    value: function back() {
	      history.back();
	    }

	    /**
	     * route to the specify url, 内部访问
	     * @param {String} url
	     * @param {Object} 参数对象
	     * @returns {Router}
	     */

	  }, {
	    key: 'routeTo',
	    value: function routeTo(url, params, refresh) {
	      var _this2 = this;

	      var r = this.getRoute(url, params, refresh);
	      if (r) {
	        (function () {
	          // alert(`routeTo url:${r.url}`);

	          // 返回
	          var rs = _this2.lasts = _this2.lasts || [];
	          var back = false;
	          if (rs.length > 0 && rs[rs.length - 1].id === r.id) {
	            rs.pop();
	            back = true;
	          } else if (_this2.route) {
	            rs.push(_this2.route);
	          }

	          // 记录当前 route
	          _this2.route = r;

	          /*
	           // 卸载
	           const leave = (hasChildren) => {
	           // if have child already, then remove it
	           if (hasChildren) {
	           const child = this._$container.children[0];
	           if (isBack) {
	           child.classList.add(this._opts.leave);
	           }
	            if (this._opts.leaveTimeout > 0) {
	           setTimeout(() => {
	           child.parentNode.removeChild(child);
	           }, this._opts.leaveTimeout);
	           } else
	           child.parentNode.removeChild(child);
	           }
	           };
	           */

	          var enter = function enter(html) {
	            var dv = _kanimat2.default.id(r.id);
	            if (!dv) {
	              dv = document.createElement('div');
	              dv.id = r.id;
	              dv.innerHTML = html;

	              if (_this2._opts.className) _kanimat2.default.addClass(dv, '' + _this2._opts.className);

	              // 插在前面,否则会直接覆盖当前页,动画效果不好!
	              if (_kanimat2.default.hasChild(_this2._$container)) _this2._$container.insertBefore(dv, _this2._$container.children[0]);else _this2._$container.appendChild(dv);
	            }

	            /*
	             // add class name
	             if (r.className || r.showClass) {
	             $.removeClass($.qu(`.${r.showClass}`), r.showClass);
	             $.addClass(dv, `${r.className} ${r.showClass}`);
	             if (r.title)
	             setTitle(r.title);
	             }
	             */

	            /*
	             // add class
	             if (!isBack && this._opts.enter && hasChild) {
	             dv.classList.add(this._opts.enter);
	             }
	              if (this._opts.enterTimeout > 0) {
	             setTimeout(() => {
	             dv.classList.remove(this._opts.enter);
	             }, this._opts.enterTimeout);
	             } else
	             dv.classList.remove(this._opts.enter);
	             */

	            /*
	             if (location.hash !== `#${url}`)
	             location.hash = `#${url}`;
	             */

	            /*
	             try {
	             if (isBack)
	             this._index--;
	             else this._index++;
	              if (history.replaceState)
	             history.replaceState({_index: this._index}, '', location.href);
	             console.log(`history state:${history.state}`);
	             } catch (e) {
	             alert(`replaceState exp:${e.message}`);
	             }
	             */
	            // 动画方式切换页面，如果页面在 bind 中被切换，则不再切换！
	            // 应该判断 hash 是否已经改变，如已改变，则不切换
	            // if (this.route === r)


	            if (!r.loaded) {
	              r.loaded = true;

	              if (r.bind) r.bind(dv, r.params); // .call(dv);

	              // 对所有 link 绑定 ontouch，消除 300ms等待
	              _kanimat2.default.fastLink();
	            } else if ((r.search !== r.lastSearch || r.refresh) && r.bind) {
	              // 参数变化, 重新 bind!
	              r.bind(dv, r.params); // .call(dv);
	              // $.fastLink();
	            }

	            //alert(`hash:${this.hash} => ${this.nextHash}`);
	            if (!_this2.nextHash || _this2.nextHash === _this2.hash) {
	              _this2.switchToSec(r, back);
	            }
	          };

	          // const hasChild = $.hasChild(this._$container);
	          // pop current page
	          // leave(hasChild);

	          // callback
	          var onload = function onload(err) {
	            var html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	            if (err) throw err;
	            // push next page
	            enter(html);
	          };

	          // const res = r.render(callback);
	          if (!r.loaded && r.view) r.view(onload);else if (!r.view) throw new Error('route ' + r.id + ' hasn\'t view function!');else enter();

	          /*
	           // promise
	           if (res && typeof res.then === 'function') {
	           res.then((html) => {
	           callback(null, html);
	           }, callback);
	           } else if (r.render.length === 0)  // synchronous
	           callback(null, res);
	           // callback
	           else {
	            }
	           */
	        })();
	      } else {}
	        // 处理 / pgIndex
	        // alert('not found!');

	        /*
	         else
	         throw new Error(`path ${url} was not found`);
	         */

	      return this;
	    }

	    /**
	     * get route from routes filter by url
	     * @param {String} url
	     * @param {Object} params
	     * @returns {Object}
	     */

	  }, {
	    key: 'getRoute',
	    value: function getRoute(url, params, refresh) {
	      var _this3 = this;

	      var _loop = function _loop(i, len) {
	        var r = _this3._routes[i];
	        // let keys = [];
	        // /prod/:no => /prod/999
	        // let ms = /\/:([^\/]+?)/?$/i.exec(r.path);
	        var search = '';
	        var path = url;

	        var pos = url.indexOf('?');
	        if (pos >= 0) {
	          search = url.substr(pos + 1);
	          path = url.substr(0, pos);
	        }

	        var rx = new RegExp(r.path); // pathToRegexp(r.url, keys);
	        var ms = rx.exec(path);
	        if (ms) {
	          // go 已经处理过参数, 不再重复处理
	          // if (!this._go) {
	          r.params = {};
	          if (search) {
	            var ps = search.split('&');
	            ps.forEach(function (p) {
	              pos = p.indexOf('=');
	              if (pos > 0) r.params[p.substr(0, pos)] = p.substr(pos + 1);
	            });
	          }

	          if (params) _kanimat2.default.assign(r.params, params);
	          // } else this._go = false;

	          /*
	           r.params = {};
	           for (let j = 0, l = keys.length; j < l; j++) {
	           const key = keys[j];
	           const name = key.name;
	           r.params[name] = ms[j + 1];
	           }
	           */
	          // 记录当前 url
	          r.url = url;
	          r.lastSearch = r.search;
	          r.search = search;
	          r.refresh = refresh;
	          return {
	            v: r
	          };
	        }
	      };

	      for (var i = 0, len = this._routes.length; i < len; i++) {
	        var _ret2 = _loop(i, len);

	        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	      }
	      return null;
	    }

	    /**
	     * push route config into routes array
	     * @param {Object} route
	     * @returns {Router}
	     */

	  }, {
	    key: 'push',
	    value: function push(route) {
	      try {
	        if (!route) throw new Error('route is empty!');

	        var exist = this._routes.filter(function (r) {
	          return r.path === route.path;
	        })[0];
	        if (exist) throw new Error('route ' + route.path + ' is existed!');

	        if (!route.hash) throw new Error('route\'s hash is empty!');

	        if (!route.view) throw new Error('route\'s view is empty!');

	        route.id = 'pg' + route.hash.replace(/\//g, '-');
	        route.path = route.path || '*';
	        route.bind = route.bind || _kanimat2.default.noop;
	        route.router = this;
	        /*
	         const r = Object.assign({}, {
	         path: '*',
	         // view: $.noop,
	         bind: $.noop
	         }, route);
	         */
	        this._routes.push(route);

	        return this;
	      } catch (e) {
	        //alert(`router.push exp: ${e.message}`);
	      }
	    }

	    /**
	     * 从一个文档切换为显示另一个文档
	     *
	     * @param $from 目前显示的文档
	     * @param $to 待切换显示的新文档
	     * @param $visibleSection 新文档中展示的 section 元素
	     * @param direction 新文档切入方向
	     * @private
	     */
	    /*
	     animateDoc($from, $to, $visibleSection, direction) {
	     var sectionId = $visibleSection.attr('id');
	      var $visibleSectionInFrom = $from.find('.' + this._opts.showClass);
	     $visibleSectionInFrom.addClass(CFG.visiblePageClass).removeClass(this._opts.showClass);
	      $visibleSection.trigger(EVENTS.pageAnimationStart, [sectionId, $visibleSection]);
	      this._animateElement($from, $to, direction);
	      $from.animationEnd(function () {
	     $visibleSectionInFrom.removeClass(CFG.visiblePageClass);
	     // 移除 document 前后，发送 beforePageRemove 和 pageRemoved 事件
	     $(window).trigger(EVENTS.beforePageRemove, [$from]);
	     $from.remove();
	     $(window).trigger(EVENTS.pageRemoved);
	     });
	      $to.animationEnd(function () {
	     $visibleSection.trigger(EVENTS.pageAnimationEnd, [sectionId, $visibleSection]);
	     // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
	     $visibleSection.trigger(EVENTS.pageInit, [sectionId, $visibleSection]);
	     });
	     };
	     */

	    /**
	     * 把当前文档的展示 section 从一个 section 切换到另一个 section
	     *
	     * @param from
	     * @param to
	     * @param dir
	     * @private
	     */

	  }, {
	    key: 'animateSec',
	    value: function animateSec(from, to, dir) {
	      if (!from && !to) return;

	      if (from) {
	        (0, _kanimat2.default)(from).trigger(EVENTS.beforePageSwitch, [from.id, from]);
	        _kanimat2.default.removeClass(from, this._opts.showClass);
	      }

	      var $to = null;
	      if (to) {
	        $to = (0, _kanimat2.default)(to);
	        _kanimat2.default.addClass(to, this._opts.showClass);
	        $to.trigger(EVENTS.pageAnimationStart, [to.id, to]);
	      }

	      if (from && to && !this._splash) {
	        this.animateEle(from, to, dir);
	        $to.animationEnd(function () {
	          $to.trigger(EVENTS.pageAnimationEnd, [to.id, to]);
	          // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
	          $to.trigger(EVENTS.pageInit, [to.id, to]);
	        });
	      }

	      if (this._splash) this._splash = false;
	    }

	    /**
	     * 切换显示两个元素
	     *
	     * 切换是通过更新 class 来实现的，而具体的切换动画则是 class 关联的 css 来实现
	     *
	     * @param $from 当前显示的元素
	     * @param $to 待显示的元素
	     * @param dir 切换的方向
	     * @private
	     */

	  }, {
	    key: 'animateEle',
	    value: function animateEle(from, to, direction) {
	      // todo: 可考虑如果入参不指定，那么尝试读取 $to 的属性，再没有再使用默认的
	      // 考虑读取点击的链接上指定的方向
	      var dir = direction;
	      if (typeof dir === 'undefined') {
	        dir = DIRECTION.rightToLeft;
	      }

	      var animPageClasses = ['page-from-center-to-left', 'page-from-center-to-right', 'page-from-right-to-center', 'page-from-left-to-center'].join(' ');

	      var classForFrom = '';
	      var classForTo = '';
	      switch (dir) {
	        case DIRECTION.rightToLeft:
	          classForFrom = 'page-from-center-to-left';
	          classForTo = 'page-from-right-to-center';
	          break;
	        case DIRECTION.leftToRight:
	          classForFrom = 'page-from-center-to-right';
	          classForTo = 'page-from-left-to-center';
	          break;
	        default:
	          classForFrom = 'page-from-center-to-left';
	          classForTo = 'page-from-right-to-center';
	          break;
	      }

	      if (from) {
	        _kanimat2.default.removeClass(from, animPageClasses);
	        _kanimat2.default.addClass(from, classForFrom);
	      }

	      if (to) {
	        _kanimat2.default.removeClass(to, animPageClasses);
	        _kanimat2.default.addClass(to, classForTo);
	      }

	      from && (0, _kanimat2.default)(from).animationEnd(function () {
	        return _kanimat2.default.removeClass(from, animPageClasses);
	      }); // eslint-disable-line
	      to && (0, _kanimat2.default)(to).animationEnd(function () {
	        return _kanimat2.default.removeClass(to, animPageClasses);
	      }); // eslint-disable-line
	    }

	    /**
	     * 获取当前显示的第一个 section
	     *
	     * @returns {*}
	     * @private
	     */

	  }, {
	    key: 'switchToSec',


	    /**
	     * 切换显示当前文档另一个块
	     *
	     * 把新块从右边切入展示，同时会把新的块的记录用 history.pushState 来保存起来
	     *
	     * 如果已经是当前显示的块，那么不做任何处理；
	     * 如果没对应的块，那么忽略。
	     *
	     * @param {String} sectionId 待切换显示的块的 id
	     * @private
	     */
	    value: function switchToSec(r, back) {
	      var _this4 = this;

	      if (!r) return;

	      var curPage = this.getCurrentSec();
	      var newPage = _kanimat2.default.id(r.id);

	      // 如果已经是当前页，不做任何处理
	      if (curPage === newPage) return;
	      /*
	       if (r.className || r.showClass) {
	       $.removeClass($.qu(`.${r.showClass}`), r.showClass);
	       $.addClass(dv, `${r.className} ${r.showClass}`);
	       if (r.title)
	       setTitle(r.title);
	       }
	       */
	      if (this._splash) {
	        setTimeout(function () {
	          return _this4.animateSec(curPage, newPage, back ? DIRECTION.leftToRight : DIRECTION.rightToLeft);
	        }, this._opts.splashTime);
	      } else this.animateSec(curPage, newPage, back ? DIRECTION.leftToRight : DIRECTION.rightToLeft);

	      setTitle(this.route.title);
	      // this.pushNewState('#' + sectionId, sectionId);
	    }

	    /*
	     sameDoc(url, anotherUrl) {
	     return getBase(url) === getBase(anotherUrl);
	     }
	     */

	  }]);

	  return Router;
	}();

	exports.default = Router;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _kevent = __webpack_require__(4);

	var _kevent2 = _interopRequireDefault(_kevent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* jshint ignore:start */
	_kevent2.default.requestAnimationFrame = function (callback) {
	  if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);else {
	    return window.setTimeout(callback, 1000 / 60);
	  }
	}; /**
	    * Created by way on 16/9/13.
	    */

	_kevent2.default.cancelAnimationFrame = function (id) {
	  if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);else {
	    return window.clearTimeout(id);
	  }
	};
	/* jshint ignore:end */

	// 动画处理
	_kevent2.default.cssEvent = function (events, callback) {
	  var dom = this; // jshint ignore:line

	  function fireCallBack(e) {
	    /*jshint validthis:true */
	    if (e.target !== this) return;
	    callback.call(this, e);
	    for (var i = 0; i < events.length; i++) {
	      dom.off(events[i], fireCallBack);
	    }
	  }

	  if (callback) {
	    for (var i = 0; i < events.length; i++) {
	      dom.on(events[i], fireCallBack);
	    }
	  }
	};

	// 动画事件
	//------------------------

	_kevent2.default.fn.animationEnd = function (callback) {
	  _kevent2.default.cssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
	  return this;
	};

	_kevent2.default.fn.transitionEnd = function (callback) {
	  _kevent2.default.cssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
	  return this;
	};

	_kevent2.default.fn.transition = function (duration) {
	  var dur = duration;
	  if (typeof duration !== 'string') {
	    dur = duration + 'ms';
	  }
	  for (var i = 0; i < this.length; i++) {
	    var elStyle = this[i].style;
	    elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = dur;
	  }
	  return this;
	};

	_kevent2.default.fn.transform = function (transform) {
	  for (var i = 0; i < this.length; i++) {
	    var elStyle = this[i].style;
	    elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
	  }
	  return this;
	};

	exports.default = _kevent2.default;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by way on 16/8/28.
	 * event trigger、define
	 * 使用伪dom方式实现 原生及自定义事件 响应与触发
	 * 每个事件只支持 一个响应, 添加响应自动卸载原来的事件
	 * 支持 匿名响应函数, 多次加载只有最后一个起作用
	 */

	var $ = __webpack_require__(5);

	// 一个包中所有引用共享该变量!
	var events = {};

	// 创建用户事件类
	if (!window.CustomEvent) {
	  window.CustomEvent = function (type, opts) {
	    var opt = opts || { bubbles: false, cancelable: false, detail: undefined };
	    var ev = document.createEvent('CustomEvent');
	    ev.initCustomEvent(type, opt.bubbles, opt.cancelable, opt.detail);
	    return ev;
	  };

	  window.CustomEvent.prototype = window.Event.prototype;
	}

	// 加在原型对象上, 所有对象实例均可调用

	$.on = function (event, fn) {
	  events[event] = events[name] || [];
	  events[event].push(fn);
	  return this;
	};

	/**
	 * 添加事件, 标准dom事件或自定义事件
	 * 只能加载一个处理函数, 覆盖式加载, 自动卸载之前的加载
	 * @param event 事件名称
	 * @param fn
	 * @param capture
	 * @returns {$}
	 */
	$.fn.on = function (event, fn) {
	  var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  var evs = this.events = this.events || {};
	  var ev = evs[event] = evs[event] || {};
	  if (ev.fn) this[0].removeEventListener(event, ev.fn, capture || false);
	  ev.fn = fn;
	  ev.capture = capture;
	  this[0].addEventListener(event, ev.fn, capture);
	  return this;
	};

	// 触发一次
	$.fn.once = function (event, fn) {
	  var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  var evs = this.events = this.events || {};
	  var ev = evs[event] = evs[event] || {};
	  ev.once = true;
	  /*
	   evs[ev].fn = () => {
	   // 卸载自己
	   this[0].removeEventListener(ev, arguments.callee, capture || false);
	   fn.apply(this, fn.arguments);
	   }
	    evs[ev].capture = capture;
	   this[0].addEventListener(ev, evs[ev].fn, capture);
	   */
	  return this.on(ev, fn, capture);
	};

	// 触发一次
	$.once = function (event, fn) {
	  fn._once = true;
	  $.on(event, fn);
	  return this;
	};

	/*
	$.once = function (el, ev, callback) {
	  el.addEventListener(ev, function () {
	    el.removeEventListener(ev, arguments.callee, false)
	    callback()
	  }, false)
	}
	*/

	/**
	 * 删除事件
	 * @param event
	 * @param handler 缺少删除该事件, 指定处理函数,则只删除指定处理函数
	 * @returns {off}
	 */
	$.fn.off = function (event) {
	  if (this.events && this.events[event]) {
	    this[0].removeEventListener(event, this.events[event].fn, this.events[event].capture || false);
	    delete this.events[event];
	  }
	  return this;
	};

	$.off = function (event) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  if (fn) events[event].splice(events[event].indexOf(fn), 1);else delete events[event];

	  return this;
	};

	/**
	 * 通过 dom 触发 事件
	 * @param event
	 * @returns {$}
	 */
	$.fn.trigger = function (event) {
	  var ev = new CustomEvent(event, {
	    bubbles: true,
	    cancelable: true
	  });

	  // remove handlers added with 'once'
	  var evs = this.events = this.events || {};
	  if (evs[event] && evs[event].once) this.off(event);

	  this[0].dispatchEvent(ev);
	  return this;
	};

	/**
	 * 直接带参数触发自定义
	 * @param event
	 * @param args
	 * @returns {emit}
	 */
	$.fn.emit = function (event) {
	  var evs = this.events = this.events || {};
	  var ev = evs[event] = evs[event] || {};
	  // only fire handlers if they exist
	  if (ev.once) this.off(event);
	  // set 'this' context, pass args to handlers

	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  ev.fn.apply(this, args);

	  return this;
	};

	$.emit = function (event) {
	  var _this = this;

	  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    args[_key2 - 1] = arguments[_key2];
	  }

	  // cache the events, to avoid consequences of mutation
	  var cache = events[event] && events[event].slice();

	  // only fire handlers if they exist
	  if (cache) {
	    cache.forEach(function (fn) {
	      // remove handlers added with 'once'
	      if (fn._once) $.off(event, fn);
	      // set 'this' context, pass args to handlers
	      fn.apply(_this, args);
	    });
	  }

	  return this;
	};

	// export {on, off, once, emit, emit as trigger};
	exports.default = $;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * Created by way on 16/8/28.
	 * 静态 dom 常用操作, 通过 $ 静态属性、方法访问
	 */

	(function (global, factory) {
	  if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return factory(global);
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else factory(global);
	})(typeof window !== "undefined" ? window : undefined, function (window) {
	  var Knife = function () {
	    // 函数内私有变量及函数
	    var $,
	        emptyArray = [],
	        classCache = {},
	        idCache = {},
	        readyRE = /complete|loaded|interactive/,
	        class2type = {},
	        toString = class2type.toString,
	        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	        knife = {},
	        propMap = {
	      'tabindex': 'tabIndex',
	      'readonly': 'readOnly',
	      'for': 'htmlFor',
	      'class': 'className',
	      'maxlength': 'maxLength',
	      'cellspacing': 'cellSpacing',
	      'cellpadding': 'cellPadding',
	      'rowspan': 'rowSpan',
	      'colspan': 'colSpan',
	      'usemap': 'useMap',
	      'frameborder': 'frameBorder',
	      'contenteditable': 'contentEditable'
	    };

	    function classRE(name) {
	      return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
	    }

	    // 私有方法
	    function funcArg(ctx, arg, idx, payload) {
	      return $.isFunction(arg) ? arg.call(ctx, idx, payload) : arg;
	    }

	    function setAttribute(node, name, value) {
	      value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
	    }

	    document.ready = function (callback) {
	      // need to check if document.body exists for IE as that browser reports
	      // document ready when it hasn't yet created the body element
	      if (readyRE.test(document.readyState) && document.body) callback();else document.addEventListener('DOMContentLoaded', function () {
	        document.removeEventListener('DOMContentLoaded', arguments.callee, false);
	        callback();
	      }, false);
	    };

	    // 构造函数
	    function K(dom, sel) {
	      this.selector = sel || '';
	      this[0] = this.dom = dom;
	      this.length = 1;
	      if (!dom) this.length = 0;
	    }

	    // `$.knife.K` swaps out the prototype of the given `dom` array
	    // of nodes with `$.fn` and thus supplying all the Knife functions
	    // to the array. This method can be overridden in plugins.
	    knife.K = function (dom, sel) {
	      return new K(dom, sel);
	    };

	    // `$.knife.isK` should return `true` if the given object is a Knife
	    // collection. This method can be overridden in plugins.
	    knife.isK = function (obj) {
	      return obj instanceof knife.K;
	    };

	    knife.id = function (x) {
	      return x in idCache ? idCache[x] : idCache[x] = knife.K(document.getElementById(x), x);
	    };

	    // knife 实现
	    knife.fragment = function (html, name, properties) {};
	    // `$.knife.init` is Knife's counterpart to jQuery's `$.fn.init` and
	    // takes a CSS selector and an optional context (and handles various
	    // special cases).
	    // This method can be overridden in plugins.
	    knife.init = function (sel, root) {
	      var dom = void 0;
	      // If nothing given, return an empty Zepto collection
	      if (!sel) return knife.K();
	      // Optimize for string selectors
	      if (typeof sel === 'string') {
	        if (sel[0] === '#') return knife.id(sel.substr(1));

	        if (sel[0] == '<' && fragmentRE.test(sel)) dom = knife.fragment(sel, RegExp.$1, root), sel = null;else dom = $.qu(sel, root);
	      } else if (knife.isK(sel)) return sel;
	      // Wrap DOM nodes.
	      else if ($.isObject(sel)) dom = sel, sel = null;

	      // create a new Knife collection from the nodes found
	      return knife.K(dom, sel);
	    };

	    // `$` will be the base `Knife` object. When calling this
	    // function just call `$.knife.init, which makes the implementation
	    // details of selecting nodes and creating Knife collections
	    // patchable in plugins.
	    // 实例化函数调用, $() 返回一个新的实例!
	    $ = function $(selector, context) {
	      return knife.init(selector, context);
	    };

	    $.K = K;
	    $.knife = knife;

	    // plugin compatibility
	    $.uuid = 0;
	    $.expr = {};
	    $.noop = function () {};
	    $.concat = emptyArray.concat;
	    $.filter = emptyArray.filter;
	    $.slice = emptyArray.slice;
	    // 静态属性,可直接调用
	    $.type = function (obj) {
	      return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
	    };
	    $.isFunction = function (value) {
	      return $.type(value) == 'function';
	    };
	    $.isWindow = function (obj) {
	      return obj != null && obj == obj.window;
	    };
	    $.isDocument = function (obj) {
	      return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
	    };
	    $.isObject = function (obj) {
	      return $.type(obj) == 'object';
	    };
	    $.isPlainObject = function (obj) {
	      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
	    };
	    $.isArray = Array.isArray || function (object) {
	      return object instanceof Array;
	    };
	    $.isNumeric = function (val) {
	      var num = Number(val),
	          type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	      return val != null && type != 'boolean' && (type != 'string' || val.length) && !isNaN(num) && isFinite(num) || false;
	    };
	    $.trim = function (str) {
	      return str == null ? '' : String.prototype.trim.call(str);
	    };

	    /**
	     * Copy all but undefined properties from one or more to dst
	     * Object.assign 在安卓微信上无不支持
	     * @param dst
	     * @param srcs 支持单个对象 或 多个对象
	     * @param deep 深拷贝
	     */
	    $.assign = function (dst) {
	      if (!dst) return;
	      var srcs = $.slice.call(arguments, 1);
	      srcs && srcs.forEach(function (src) {
	        for (var key in src) {
	          if (src.hasOwnProperty(key) && src[key] !== undefined) dst[key] = src[key];
	        }
	      });
	    };

	    /*
	        $.extend = function (dst, src, deep) {
	          var frms = $.isArray(src) ? src : [src]
	          frms.forEach(frm => {
	            for (const key in frm) {
	              // if (!frm.hasOwnProperty(key)) {
	              if (deep && ($.isPlainObject(frm[key]) || $.isArray(frm[key]))) {
	                if ($.isPlainObject(frm[key]) && !$.isPlainObject(dst[key]))
	                  dst[key] = {}
	                if ($.isArray(frm[key]) && !$.isArray(dst[key]))
	                  dst[key] = []
	                $.assign(dst[key], frm[key], deep)
	              }
	              else if (frm[key] !== undefined) dst[key] = frm[key]
	              // }
	            }
	          })
	        }
	    */

	    /**
	     * 判断浏览器是否支持 sessionStorage，支持返回 true，否则返回 false
	     * @returns {Boolean}
	     */
	    function hasStorage() {
	      var mod = 'krouter.storage.ability';
	      try {
	        sessionStorage.setItem(mod, mod);
	        sessionStorage.removeItem(mod);
	        return true;
	      } catch (e) {
	        return false;
	      }
	    }

	    $.support = function () {
	      var support = {
	        touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
	        storage: hasStorage()
	      };
	      return support;
	    }();

	    $.touchEvents = {
	      start: $.support.touch ? 'touchstart' : 'mousedown',
	      move: $.support.touch ? 'touchmove' : 'mousemove',
	      end: $.support.touch ? 'touchend' : 'mouseup'
	    };

	    $.likeArray = function (obj) {
	      var length = !!obj && 'length' in obj && obj.length,
	          type = $.type(obj);

	      return 'function' != type && !$.isWindow(obj) && ('array' == type || length === 0 || typeof length == 'number' && length > 0 && length - 1 in obj);
	    };
	    $.each = function (els, callback) {
	      var i, key;
	      if ($.likeArray(els)) {
	        for (i = 0; i < els.length; i++) {
	          if (callback.call(els[i], i, els[i]) === false) return els;
	        }
	      } else {
	        for (key in els) {
	          if (callback.call(els[key], key, els[key]) === false) return els;
	        }
	      }
	      return els;
	    };
	    // Populate the class2type map
	    $.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
	      class2type['[object ' + name + ']'] = name.toLowerCase();
	    });

	    $.id = function (x) {
	      return document.getElementById(x);
	      return x in idCache ? idCache[x] : idCache[x] = knife.K(document.getElementById(x), x);
	    };
	    $.qu = function (sel, root) {
	      if (root) return knife.isK(root) ? root[0].querySelector(sel) : root.querySelector(sel);
	      return document.querySelector(sel);
	    };
	    // 返回数组, 便于 forEach
	    $.qus = function (sel, root) {
	      var es = null;
	      if (root) es = knife.isK(root) ? root[0].querySelectorAll(sel) : root.querySelectorAll(sel);else es = document.querySelectorAll(sel);
	      if (es.length > 0) return Array.prototype.slice.call(es);else return [];
	    };
	    $.nms = function (name) {
	      return document.getElementsByName(name);
	    };
	    //找到obj下相应tag
	    $.tags = function (el, tag) {
	      el = el || document;
	      return el.getElementsByTagName(tag.toUpperCase());
	    };
	    $.dc = function (obj, tag, cls) {
	      var el = document.createElement(tag);
	      if (cls) el.className = cls;
	      if (obj) obj.appendChild(el);
	      return el;
	    };
	    $.html = function (el, html) {
	      if (html !== undefined) {
	        // var originHtml = el.innerHTML
	        // el.innerHTML = ''
	        // $(el).append(funcArg(el, html, 0, originHtml))
	        el.innerHTML = html;
	      } else return el ? el.innerHTML : null;
	    };
	    $.attr = function (el, name, value) {
	      var result;
	      if (!el) return '';
	      if (typeof name == 'string' && value === undefined) return el && el.nodeType == 1 && (result = el.getAttribute(name)) != null ? result : ''; // undefined)

	      if (el.nodeType !== 1) return false;
	      if (isObject(name)) for (key in name) {
	        setAttribute(el, key, name[key]);
	      } else setAttribute(el, name, funcArg(el, value, 0, el.getAttribute(name)));
	      return true;
	    };
	    $.attrn = function (el, name) {
	      if (!el) return '';

	      var rc = el.getAttribute(name);
	      if (rc == null) rc = '';
	      if (rc) rc = name + '=' + rc + ';';
	      return rc;
	    };
	    $.removeAttr = function (el, name) {
	      el.nodeType === 1 && name.split(' ').forEach(function (attribute) {
	        setAttribute(el, attribute);
	      });
	    };
	    $.removeNode = function (el) {
	      el.parentNode.removeChild(el);
	    };
	    $.prop = function (el, name, value) {
	      name = propMap[name] || name;
	      return value !== undefined ? (el[name] = funcArg(el, value, 0, el[name]), true) : el && el[name];
	    };
	    $.removeProp = function (el, name) {
	      name = propMap[name] || name;
	      delete el[name];
	    };
	    // access className property while respecting SVGAnimatedString
	    $.className = function (node, value) {
	      var cls = (node.className || '').trim(),
	          svg = cls && cls.baseVal !== undefined;

	      if (value === undefined) return svg ? cls.baseVal : cls;
	      svg ? cls.baseVal = value : node.className = value;
	    };
	    // 筛选class
	    $.hasClass = function (el, name) {
	      if (!el || !name) return false;
	      return classRE(name).test($.className(el));
	    };
	    $.addClass = function (el, name) {
	      if (!el || !name) return false;
	      var cs = [];
	      var cl = $.className(el),
	          newName = funcArg(el, name, 0, cl);
	      newName.split(/\s+/g).forEach(function (klass) {
	        if (!$.hasClass(el, klass)) cs.push(klass);
	      });
	      cs.length && $.className(el, cl + (cl ? ' ' : '') + cs.join(' '));
	      return true;
	    };
	    $.removeClass = function (el, name) {
	      if (name === undefined) return $.className(el, '');
	      var classList = $.className(el);
	      funcArg(el, name, 0, classList).split(/\s+/g).forEach(function (cls) {
	        classList = classList.replace(classRE(cls), ' ');
	      });
	      $.className(el, classList.trim());
	    };
	    $.toggleClass = function (el, name, when) {
	      if (!el || !name) return false;
	      var names = funcArg(el, name, 0, $.className(el));
	      names.split(/\s+/g).forEach(function (klass) {
	        (when === undefined ? !$.hasClass(el, klass) : when) ? $.addClass(el, klass) : $.removeClass(el, klass);
	      });
	    };
	    $.toggle = function (el) {
	      if (el.style.display === 'none') el.style.display = '';else el.style.display = 'none';
	    };
	    // 第一个子元素节点或非空文本节点 Object.prototype. ie 不支持
	    $.firstChild = function (el) {
	      var RC = null;
	      if (!el) return null;

	      try {
	        for (var i = 0; i < el.childNodes.length; i++) {
	          var nd = el.childNodes[i];

	          // alert(nd.nodeType + "/" + nd.nodeName + "/"
	          //	+ (nd.nodeValue ? escape(nd.nodeValue) : "null") );

	          if (nd.nodeType === 1 // 元素节点
	          // 有效文本节点，nodeName == "#text"
	          || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	            RC = nd;
	            break;
	          }
	        }
	      } catch (e) {
	        alert('firstChild exp:' + e.message);
	      }
	      return RC;
	    };
	    // 下一个子元素节点或非空文本节点
	    $.nextNode = function (el) {
	      var RC = null;
	      if (!el) return null;

	      var nd = el.nextSibling;
	      while (nd) {
	        if (nd.nodeType === 1 // 元素节点
	        // 有效文本节点，nodeName == "#text"
	        || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	          RC = nd;
	          break;
	        }
	        nd = nd.nextSibling;
	      }
	      return RC;
	    };
	    // 最后一个子元素节点或非空文本节点 Object.prototype. ie 不支持
	    $.lastChild = function (el) {
	      var RC = null;
	      if (!el) return null;

	      for (var i = el.childNodes.length - 1; i >= 0; i--) {
	        var nd = el.childNodes[i];

	        // alert(nd.nodeType + "/" + nd.nodeName + "/"
	        //	+ (nd.nodeValue ? escape(nd.nodeValue) : "null") );

	        if (nd.nodeType === 1 // 元素节点，元素节点没有 nodeValue
	        // 有效文本节点，nodeName == "#text"
	        || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	          RC = nd;
	          break;
	        }
	      }
	      return RC;
	    };
	    // 元素子节点或非空文本节点数量
	    $.childCount = function (el) {
	      var RC = 0;

	      if (!el) return 0;

	      for (var i = 0; i < el.childNodes.length; i++) {
	        var nd = el.childNodes[i];

	        // alert(nd.nodeType + "/" + nd.nodeName + "/"
	        //	+ (nd.nodeValue ? escape(nd.nodeValue) : "null") );

	        if (nd.nodeType === 1 // 元素节点，元素节点没有 nodeValue
	        // 有效文本节点，nodeName === "#text"
	        || nd.nodeType === 3 && nd.nodeValue && nd.nodeValue.trim()) {
	          RC++;
	        }
	      }
	      return RC;
	    };
	    $.hasChild = function (el) {
	      if (!el) return false;
	      var child = el.children;
	      return child.length > 0;
	    };

	    // 得到obj的上级元素TagName
	    // ff parentNode 会返回 空 节点
	    // ff textNode节点 没有 tagName
	    $.upperTag = function (el, tagName) {
	      var RC = null;

	      var tn = tagName.toUpperCase();

	      var i = 0;
	      var nd = el;
	      while (nd) {
	        i++;
	        if (i >= 10) break;
	        if (nd.tagName && nd.tagName === tn) {
	          RC = nd;
	          break;
	        }
	        nd = nd.parentNode;
	      }
	      return RC;
	    };

	    // 得到obj的上级元素TagName
	    // ff parentNode 会返回 空 节点
	    // ff textNode节点 没有 tagName
	    /**
	     * 获取 指定 tagName的子元素
	     * @param el
	     * @param tagName
	     * @returns {*}
	     */
	    $.childTag = function (el, tag) {
	      var RC = null;

	      if (!el) return null;

	      try {
	        for (var i = 0; i < el.childNodes.length; i++) {
	          var nd = el.childNodes[i];

	          if (nd.tagName && nd.tagName === tag.toUpperCase()) {
	            RC = nd;
	            break;
	          }
	        }
	      } catch (e) {
	        alert('childTag exp:' + e.message);
	      }

	      return RC;
	    };
	    /**
	     * 光标放入尾部
	     * @param el
	     */
	    $.cursorEnd = function (el) {
	      el.focus();

	      if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
	        var rg = document.createRange();
	        rg.selectNodeContents(el);
	        // 合并光标
	        rg.collapse(false);
	        var sel = window.getSelection();
	        sel.removeAllRanges();
	        sel.addRange(rg);
	      } else if (typeof document.body.createTextRangrge !== 'undefined') {
	        var _rg = document.body.createTextRange();
	        _rg.moveToElementText(el);
	        // 合并光标
	        _rg.collapse(false);
	        // textRange.moveStart('character', 3);
	        _rg.select();
	      }
	    };

	    /**
	     * 获取光标位置
	     * @param el
	     * @returns {number}
	     */
	    $.getCursorPos = function (el) {
	      var rs = 0;

	      if (!el) return 0;

	      // obj.focus();
	      if (el.selectionStart) {
	        // IE以外
	        rs = el.selectionStart;
	      } else {
	        // IE
	        var rg = null;
	        if (el.tagName.toLowerCase() === 'textarea') {
	          // TEXTAREA
	          rg = event.srcElement.createTextRange();
	          rg.moveToPoint(event.x, event.y);
	        } else {
	          // Text
	          rg = document.selection.createRange();
	        }
	        rg.moveStart('character', -event.srcElement.value.length);
	        // rg.setEndPoint("StartToStart", obj.createTextRange())
	        rs = rg.text.length;
	      }
	      return rs;
	    };

	    // 得到光标的位置
	    $.getCursorPosition = function (el) {
	      var qswh = '@#%#^&#*$';
	      // obj.focus();
	      var rng = document.selection.createRange();
	      rng.text = qswh;
	      var nPosition = el.value.indexOf(qswh);
	      rng.moveStart('character', -qswh.length);
	      rng.text = '';
	      return nPosition;
	    };

	    // 设置光标位置
	    $.setCursorPos = function (el, pos) {
	      var rg = el.createTextRange();
	      rg.collapse(true);
	      rg.moveStart('character', pos);
	      rg.select();
	    };

	    $.moveFirst = function () {
	      this.rowindex = 0;
	    };
	    $.fastLink = function () {
	      // a 标签加载 touchstart 事件,避免 300毫秒等待
	      try {
	        var links = $.qus('a');
	        links.forEach(function (link) {
	          if (link.href && link.hasAttribute('fastlink')) {
	            //!$.has(link, 'no-fast')) {
	            var touchStartY;
	            link.ontouchstart = function (e) {
	              touchStartY = e.changedTouches[0].clientY;
	              /*
	                            ev.preventDefault();
	                            if (!ev.touches.length)
	                              return;
	                            if ($.hasClass(link, 'back'))
	                              return history.back();
	                            location.href = link.href;
	              */
	            };
	            link.ontouchend = function (e) {
	              if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

	              e.preventDefault();
	              /*
	                            if (!e.touches.length)
	                              return;
	              */
	              if ($.hasClass(link, 'back')) return history.back();
	              location.href = link.href;
	            };
	          }
	        });
	      } catch (e) {
	        alert('fastLink exp: ' + e.message);
	      }
	    };

	    // Define methods that will be available on all
	    // Knife collections
	    // 原型, 在$()后可调用
	    $.fn = {
	      constructor: knife.K,
	      length: 0,

	      // Because a collection acts like an array
	      // copy over these useful array functions.
	      forEach: emptyArray.forEach,
	      reduce: emptyArray.reduce,
	      push: emptyArray.push,
	      sort: emptyArray.sort,
	      splice: emptyArray.splice,
	      indexOf: emptyArray.indexOf
	    };

	    $.K.prototype = $.knife.K.prototype = $.fn;

	    // 返回 $ 类,可以直接调用其静态属性和方法
	    return $;
	  }();

	  // If `$` is not yet defined, point it to `Knife`
	  window.Knife = Knife;
	  window.$ === undefined && (window.$ = Knife);
	  return Knife;
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.trim = trim;
	exports.format = format;
	exports.urlParam = urlParam;
	exports.getHash = getHash;
	exports.hashParam = hashParam;
	exports.session = session;
	exports.getAbsUrl = getAbsUrl;
	exports.getBaseUrl = getBaseUrl;
	/**
	 * Created by way on 16/6/10.
	 */

	function trim(s) {
	  return s == null ? '' : String(s).replace(/(^\s*)|(\s*$)/g, '');
	}

	/**
	 * 格式化字符串，类似 node util中带的 format
	 * @type {Function}
	 */
	function format(f) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  var i = 0;
	  var len = args.length;
	  var str = String(f).replace(/%[sdj%]/g, function (x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s':
	        return String(args[i++]);
	      case '%d':
	        return Number(args[i++]);
	      case '%j':
	        return JSON.stringify(args[i++]);
	      default:
	        return x;
	    }
	  });

	  return str;
	}

	function urlParam(name) {
	  var rc = null;

	  var val = '&' + location.search.substr(1) + '&';
	  var rg = new RegExp('&' + name + '=([^&]*)&');
	  var rgs = rg.exec(val);
	  if (rgs) {
	    rc = rgs[1];
	    rc = decodeURIComponent(rc);
	    rc = trim(rc);
	  }

	  return rc;
	}

	/**
	 * 获取 url 的 fragment（即 hash 中去掉 # 的剩余部分）
	 *
	 * 如果没有则返回字符串
	 * 如: http://example.com/path/?query=d#123 => 123
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getHash(url) {
	  if (!url) return '';

	  var pos = url.indexOf('#!');
	  if (pos !== -1) pos++;else pos = url.indexOf('#');

	  return pos !== -1 ? url.substring(pos + 1) : ''; // ??? '/'
	}

	function hashParam(name) {
	  var rc = null;

	  var hash = getHash(location.hash);
	  if (!hash) return '';

	  var pos = hash.indexOf('?');
	  if (pos === -1) return '';

	  var val = '&' + hash.substr(pos + 1) + '&';
	  var rg = new RegExp('&' + name + '=([^&]*)&');
	  var rgs = rg.exec(val);
	  if (rgs) {
	    rc = rgs[1];
	    rc = decodeURIComponent(rc);
	    rc = trim(rc);
	  }

	  return rc;
	}

	function session(name, val) {
	  if (val !== undefined) sessionStorage.setItem(name, val);else {
	    return sessionStorage.getItem(name) || '';
	  }
	}

	// import pathToRegexp from 'path-to-regexp';

	/**
	 * 获取一个链接相对于当前页面的绝对地址形式
	 *
	 * 假设当前页面是 http://a.com/b/c
	 * 那么有以下情况:
	 * d => http://a.com/b/d
	 * /e => http://a.com/e
	 * #1 => http://a.com/b/c#1
	 * http://b.com/f => http://b.com/f
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getAbsUrl(url) {
	  var link = document.createElement('a');
	  link.setAttribute('href', url);
	  var abs = link.href;
	  link = null;
	  return abs;
	}

	/**
	 * 获取一个 url 的基本部分，即不包括 hash
	 *
	 * @param {String} url url
	 * @returns {String}
	 */
	function getBaseUrl(url) {
	  var pos = url.indexOf('#');
	  return pos === -1 ? url.slice(0) : url.slice(0, pos);
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                                               * Created by way on 16/9/19.
	                                                                                                                                                                                                                                                                               * 调用后台api接口
	                                                                                                                                                                                                                                                                               * 所有调用需要 token 身份, 如没有则自动获取, 并保存到 sessionStorage
	                                                                                                                                                                                                                                                                               */

	exports.token = token;
	exports.code = code;
	exports.lastCode = lastCode;
	exports.docker = docker;
	exports.host = host;
	exports.getToken = getToken;
	exports.get = get;
	exports.getView = getView;
	exports.getDoc = getDoc;
	exports.post = post;
	exports.postForm = postForm;
	exports.getWxSign = getWxSign;

	var _kajax = __webpack_require__(8);

	var ajax = _interopRequireWildcard(_kajax);

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _kutil = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function token(val) {
	  if (val !== undefined) sessionStorage.setItem(_config2.default.app.token, val);else {
	    return _config2.default.dev.token ? _config2.default.dev.token : sessionStorage.getItem(_config2.default.app.token) || '';
	  }
	}

	function code(val) {
	  if (val !== undefined) sessionStorage.setItem(_config2.default.app.code, val);else {
	    return sessionStorage.getItem(_config2.default.app.code) || '';
	  }
	}

	function lastCode(val) {
	  if (val !== undefined) sessionStorage.setItem(_config2.default.app.lastCode, val);else {
	    return sessionStorage.getItem(_config2.default.app.lastCode) || '';
	  }
	}

	function docker(val) {
	  if (val !== undefined) sessionStorage.setItem(_config2.default.app.docker, val);else {
	    return sessionStorage.getItem(_config2.default.app.docker) || 'wx';
	  }
	}

	function host() {
	  return docker() === 'rel' ? _config2.default.rel.host : _config2.default.api.host;
	}

	/**
	 * 通过url中的code获得openid
	 * @param tx 存储 token的 input
	 * @param cb
	 */
	function getToken(cb) {
	  if (token()) cb(null, token());else {
	    if (!code()) code((0, _kutil.urlParam)('code')); // search.substring(search.indexOf('=') + 1, search.length);
	    // alert(`getToken code:${code}`);
	    /*
	     if (AUTH_URL && (!code || code === 'undefined') && failcnt < 3) {
	     failcnt++;
	     location.href = AUTH_URL;
	     }
	     */

	    if (code() && code() !== lastCode()) {
	      var url = docker() === 'rel' ? '' + _config2.default.rel.host + _config2.default.rel.token : '' + _config2.default.api.host + _config2.default.api.token;
	      // alert(`getToken url:${url} code:${code()}`);
	      ajax.get(url, 'code=' + code(), function (rs) {
	        // alert(`getToken code:${code()} rs:${rs}`);
	        lastCode(code());
	        if (rs) {
	          var r = JSON.parse(rs);
	          if (r.rc === 200) {
	            token(r.token);
	            cb(null, r.token);
	          } else cb(new Error('获取身份信息失败,请退出重新打开或联系客服!'), '');
	        }
	      });
	    } else {
	      // alert(`code:${code()} code===lastCode: ${code() === lastCode()}`);
	      cb(new Error('获取身份信息失败,请退出重新打开或联系客服!'), '');
	    }
	  }
	}

	/**
	 *
	 * @param url
	 * @param param
	 * @param cb
	 * @param tk  是否必须 token，否则错误返回
	 */
	function get(url, param, cb, tk) {
	  if (token()) {
	    param = param ? param + '&token=' + token() : 'token=' + token();
	    url = url.indexOf(host()) === -1 ? '' + host() + url : url;
	    // alert(`url:${url} para:${para} token:${token()}`);
	    ajax.get(url, param, cb);
	  } else {
	    if (/rel.nuoyadalu.com/.test(url)) docker('rel');

	    getToken(function (err, tok) {
	      if (tk && err) {
	        cb('');
	        // alert(err.message);
	      } else {
	        param = param ? param + '&token=' + tok : 'token=' + tok;
	        url = url.indexOf(host()) === -1 ? '' + host() + url : url;
	        // alert(`get url:${url} para:${param}`);
	        ajax.get(url, param, cb);
	      }
	    });
	  }
	}

	function getView(url, param, cb) {
	  // alert(`url:${url} para:${para}`);
	  ajax.get(url.indexOf(_config2.default.view.host) === -1 ? '' + _config2.default.view.host + url : url, param, cb);
	}

	function getDoc(url, param, cb) {
	  // alert(`url:${url} para:${para}`);
	  ajax.get(url.indexOf(_config2.default.doc.host) === -1 ? '' + _config2.default.doc.host + url : url, param, cb);
	}

	/**
	 *
	 * @param url
	 * @param data
	 * @param cb
	 * @param tk  是否必须 token，否则错误返回
	 */
	function post(url, data, cb, tk) {
	  if (token()) {
	    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') data.token = token();else data = data ? data + '&token=' + token() : 'token=' + token();

	    url = url.indexOf(host()) === -1 ? '' + host() + url : url;
	    // alert(`url:${url} para:${data} token:${token()}`);
	    ajax.post(url, data, cb);
	  } else {
	    if (/rel.nuoyadalu.com/.test(url)) docker('rel');

	    getToken(function (err, tok) {
	      if (tk && err) {
	        cb(err, '');
	        // alert(err.message);
	      } else {
	        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') data.token = tok;else data = data ? data + '&token=' + tok : 'token=' + tok;

	        url = url.indexOf(host()) === -1 ? '' + host() + url : url;
	        // alert(`post url:${url} para:${data}`);
	        ajax.post(url, data, cb);
	      }
	    });
	  }
	}

	function postForm(url, data, cb) {
	  if (token()) {
	    data.append('token', token());
	    ajax.postForm(url.indexOf(host()) === -1 ? '' + host() + url : url, data, cb);
	  } else {
	    if (/rel.nuoyadalu.com/.test(url)) docker('rel');
	    getToken(function (err, tk) {
	      data.append('token', tk);
	      ajax.postForm(url.indexOf(host()) === -1 ? '' + host() + url : url, data, cb);
	    });
	  }
	}

	/**
	 * 从服务器获取微信上传签名、时标
	 * @param type
	 * @returns {string}
	 */
	function getWxSign(cb) {
	  var href = 'url=' + location.href;
	  href = href.replace(/&/, '%26');
	  href = href.replace(/#[\s\S]*$/, '');
	  ajax.get('' + _config2.default.api.host + _config2.default.api.wxsign, href, function (rs) {
	    cb(JSON.parse(rs));
	  });
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * Created by way on 16/8/28.
	 * ajax get、post
	 */

	/**
	 创建xmlHttpRequest,返回xmlHttpRequest实例,根据不同的浏览器做兼容
	 */
	function getXhr() {
	  var rs = null;

	  if (window.XMLHttpRequest) rs = new XMLHttpRequest();else if (window.ActiveXObject) rs = new ActiveXObject('Microsoft.XMLHTTP');

	  return rs;
	}

	function objToParam(obj) {
	  var rs = '';

	  var arr = [];
	  for (var k in obj) {
	    if (obj.hasOwnProperty(k)) {
	      arr.push(k + '=' + obj[k]);
	    }
	    // rs += `${k}=${obj[k]}&`;
	  }
	  // 排序
	  rs = arr.sort().join('&');
	  // alert(rs);
	  return rs;
	}

	function post(url, data, cb) {
	  var xhr = getXhr();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && cb) {
	      if (xhr.status === 200) cb(null, xhr.responseText);else cb(new Error(xhr.status), xhr.responseText);
	    }
	    /*
	        if ((xhr.readyState === 4) && (xhr.status === 200)) {
	          cb(xhr.responseText);
	        }
	    */
	  };

	  // 异步 post,回调通知
	  xhr.open('POST', url, true);
	  var param = data;
	  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') param = objToParam(data);

	  // 发送 FormData 数据, 会自动设置为 multipart/form-data
	  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	  // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=AaB03x');
	  // alert(param);
	  xhr.send(param);
	}

	/**
	 * xmlHttpRequest POST 方法
	 * 发送 FormData 数据, 会自动设置为 multipart/form-data
	 * 其他数据,应该是 application/x-www-form-urlencoded
	 * @param url post的url地址
	 * @param data 要post的数据
	 * @param cb 回调
	 */
	function postForm(url, data, cb) {
	  var xhr = getXhr();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && cb) {
	      if (xhr.status === 200) cb(null, xhr.responseText);else cb(new Error(xhr.status), xhr.responseText);
	    }
	  };

	  // 异步 post,回调通知
	  xhr.open('POST', url, true);
	  // 发送 FormData 数据, 会自动设置为 multipart/form-data
	  // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	  // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=AaB03x');
	  xhr.send(data);
	}

	/**
	 * xmlHttpRequest GET 方法
	 * @param url get的URL地址
	 * @param data 要get的数据
	 * @param cb 回调
	 */
	function get(url, param, cb) {
	  var xhr = getXhr();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	      if (cb) cb(xhr.responseText);
	    }
	  };

	  if (param) xhr.open('GET', url + '?' + param, true);else xhr.open('GET', url, true);
	  xhr.send(null);
	}

	exports.get = get;
	exports.post = post;
	exports.postForm = postForm;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(10);
	var fcity = 'a';
	var tcity = '';
	var OT = 1;

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/join$';
	        this.hash = '/flightmb/join';
	        this.title = '机票查询';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.flightmbJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {

	            $.qu('.input1').innerHTML = Ntime();

	            if (params.city) {
	                var dType = params.citytype;
	                var ydata = decodeURIComponent(params.city);
	                fcity = ydata;
	                if (dType == 0) {

	                    $.id('city0').innerHTML = ydata;
	                } else {
	                    $.id('city1').innerHTML = ydata;
	                }
	            }

	            if (params.timetype == 0) {

	                $.qu('.input1').innerHTML = params.stime;
	            }
	            if (params.timetype == 1) {
	                $.qu('.input2').innerHTML = params.stime;
	                $.qu('.input1').innerHTML = params.stime1;
	            }

	            $.qu('.tab-item2').onclick = function () {
	                //$.router.go('#!/flightmb/allmytickes', {}, true);
	                userOnoff();
	            };
	            $.qu('.tab-item3').onclick = function () {
	                $.qu('.thephone').style.display = '-webkit-box';
	            };
	            $.qu('.thephone-sp1').onclick = function () {
	                $.qu('.thephone').style.display = 'none';
	            };

	            ttbtn1.onclick = function () {
	                $.removeClass(ttbtn2, 'active');
	                $.addClass(this, 'active');
	                $.qu('.tab-ul9').style.display = 'none';
	                $.qu('.input1').innerHTML = Ntime();
	                $.qu('.input2').innerHTML = '';
	                OT = 1;
	            };
	            ttbtn2.onclick = function () {
	                $.removeClass(ttbtn1, 'active');
	                $.addClass(this, 'active');
	                $.qu('.tab-ul9').style.display = 'block';

	                $.qu('.input2').innerHTML = Ntime1();
	                OT = 2;
	            };
	            city0.onclick = function () {
	                $.router.go('#!/flightmb/city', { citytype: 0, fscity: fcity }, true);
	            };
	            city1.onclick = function () {
	                $.router.go('#!/flightmb/city', { citytype: 1, fscity: fcity }, true);
	            };
	            // 地点切换
	            $.qu('.tab-ul4').onclick = function () {
	                var city0 = $.id('city0').innerHTML;
	                var city1 = $.id('city1').innerHTML;
	                $.id('city0').innerHTML = city1;
	                $.id('city1').innerHTML = city0;
	            };

	            $.qu('.input1').onclick = function () {
	                $.router.go('#!/flightmb/adate', { timetype: 0 }, true);
	            };

	            $.qu('.input2').onclick = function () {
	                var ftime = $.qu('.input1').innerHTML;
	                $.router.go('#!/flightmb/adate', { timetype: 1, ftim: ftime }, true);
	            };
	            $.qu('.search-b').onclick = function () {
	                var city00 = $.id('city0').innerHTML;
	                var city11 = $.id('city1').innerHTML;
	                var time00 = $.qu('.input1').innerHTML;
	                var time11 = $.qu('.input2').innerHTML;
	                var num2 = time11;
	                if (num2 == '') {
	                    num2 = 0;
	                }
	                if (jiondateChange(time00) > jiondateChange(num2)) {
	                    alert('出发日期不能大于返回日期~~！');
	                } else {
	                    $.router.go('#!/flightmb/detail', { citydetail1: city00, citydetail2: city11, timedetail1: time00, timedetail2: time11, cliktype: 1, backtype: 1 }, true);
	                }
	            };
	        }
	    }]);

	    return _class;
	}();

	exports.default = _class;

	function Ntime() {
	    var myTime = new Date();
	    var iYear = myTime.getFullYear();
	    var iMonth = myTime.getMonth() + 1;
	    var iDate = myTime.getDate();
	    var ssr = iYear + '-' + iMonth + '-' + iDate;

	    return ssr;
	}
	function Ntime1() {
	    var myTime = new Date();
	    var iYear = myTime.getFullYear();
	    var iMonth = myTime.getMonth() + 1;
	    var iDate = myTime.getDate() + 1;
	    var ssr = iYear + '-' + iMonth + '-' + iDate;

	    return ssr;
	}
	//重组时间
	function jiondateChange(date) {

	    //对date进行重新组装成yyyy-MM-dd的格式
	    //2014 - 8 - 7
	    try {
	        var tempDate1Arr = date.split("-");
	        date = tempDate1Arr[0] + "";
	        if (tempDate1Arr[1].length == 1) {
	            date += "-0" + tempDate1Arr[1];
	        } else {
	            date += "-" + tempDate1Arr[1];
	        }
	        if (tempDate1Arr[2].length == 1) {
	            date += "-0" + tempDate1Arr[2];
	        } else {
	            date += "-" + tempDate1Arr[2];
	        }
	    } catch (e) {}

	    return date;
	}

	function userOnoff() {
	    var myUrl = window.location.href;

	    var oData2 = '';
	    var xhr = new XMLHttpRequest();

	    var reqPath = '/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
	    xhr.open('get', reqPath, 'true');

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                oData2 = JSON.parse(xhr.responseText);
	                //oData2 =eval(xhr.responseText)
	                var sta = oData2.Status;
	                var url = oData2.Result;
	                if (sta == 1) {
	                    // 1表示已经登录了
	                    $.router.go('#!/flightmb/allmytickes', {}, true);
	                    console.log('每次都要验证！');
	                } else {
	                    localStorage.setItem('link1', 2);
	                    //console.log(localStorage.getItem('link1'))
	                    location.href = "/icbc/" + url;
	                }
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<!-- 页面内容 -->\n\n\n<div class=\"page-c\" id=\"router0\">\n    <div class=\"thephone\">\n        <div class=\"thephone-wrap\">\n            <p><span>客服电话：</span><a href=\"tel:18580040217\">18580040217</a></p>\n            <p><span>客服电话：</span><a href=\"tel:4000662188\">4000662188</a></p>\n            <p><span>客服电话：</span><a href=\"tel:15184447593\">15184447593</a></p>\n            <span class=\"thephone-sp1\">确定</span>\n        </div>\n\n    </div>\n    <nav class=\"bar bar-tab\">\n        <strong class=\"tab-item tab-item1 active \" >\n             <span class=\"tab-label1\">机票查询</span>\n        </strong>\n        <strong class=\"tab-item tab-item2 \" >\n             <span class=\"tab-label2\">我的机票</span>\n        </strong>\n        <strong class=\"tab-item tab-item3 \" >\n             <span class=\"tab-label3\">联系客服</span>\n        </strong>\n    </nav>\n    <div class=\"content\">\n        <div class=\"content-block content-bg\">\n                <div class=\"buttons-tab button-c\">\n                    <span  class=\"tab-link active button button-cs\" id=\"ttbtn1\">单程</span>\n                    <span class=\"tab-link button button-cs\" id=\"ttbtn2\">往返</span>\n                </div>\n                <div class=\"content-block content-wrap\">\n                   <div class=\"tabs\">\n\n                     <div id=\"tab1\" class=\"tab\">\n                            <ul class=\"tab-ul \">\n                               <li class=\"tab-ul1\">出发地点</li>\n                               <li class=\"tab-ul2\">到达地点</li>\n                               <li class=\"tab-ul3\"><strong id=\"city0\" class=\"creat-firstcity\">重庆</strong></li>\n                               <li class=\"change-li tab-ul4\"><img src=\"img/change.png\" alt=\"\" class=\"change\"></li>\n                               <li class=\"tab-ul5\"><strong id=\"city1\" class=\"creat-firstcity1\">北京</strong></li>\n                               <li class=\"tab-ul6\">出发日期</li>\n                               <li class=\"tab-ul7\">返程日期</li>\n                               <li class=\"tab-ul8\"><span class=\"input1\"></span></li>\n                               <li class=\"tab-ul9\"><span class=\"input2\"></span></li>\n\n\n                            </ul>\n                     </div>\n\n                   </div>\n                </div>\n                <p class=\"search-p\"><a href=\"#\" class=\"search-b\">查询</a></p>\n\n        </div>\n    </div>\n\n\n</div>\n"

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(12);
	var dataType = '';dataC;
	var dataC = '';

	var _class = function () {
	  function _class(opt) {
	    _classCallCheck(this, _class);

	    this.path = '/flightmb/city$';
	    this.hash = '/flightmb/city';
	    this.title = '幸运抽奖';

	    opt = opt || {};
	    this.path = opt.path || this.path;
	    this.hash = opt.hash || this.hash;
	    this.title = opt.title || this.title;
	  }

	  // 输出视图


	  _createClass(_class, [{
	    key: 'view',
	    value: function view(cb) {
	      if (!_view) {
	        // 静态资源浏览器有缓存,增加时标,强制刷新!
	        (0, _api.getView)(_config2.default.view.lotteryOpen + '?t=' + +new Date(), '', function (rs) {
	          _view = rs;
	          cb(null, _view);
	        });
	      } else {
	        cb(null, _view);
	      }
	    }

	    // 在已经加载的视图上操作

	  }, {
	    key: 'bind',
	    value: function bind(dv, params) {

	      dataType = params.citytype;
	      dataC = params.fscity;
	      $.html(pickCity, cityHtml()); // 加载页面代码
	      // 点击返回 可能带参数
	      $.qu('.wrap-ft-ba').onclick = function () {

	        $.router.go('#!/flightmb/join', '', true);
	        toTOP();
	      };
	      pullDom();
	    }
	  }]);

	  return _class;
	}();

	//页面相关操作


	exports.default = _class;
	function pullDom() {

	  var aLIbody = $.qus('.li-body');

	  for (var i = 0; i < aLIbody.length; i++) {
	    aLIbody[i].onclick = function () {
	      var cityda = encodeURIComponent(this.innerHTML);
	      $.router.go('#!/flightmb/join', { city: cityda, citytype: dataType }, true);
	      toTOP();
	    };
	  }
	  var aHCli = $.qus('.hc-li');
	  for (var i = 0; i < aHCli.length; i++) {
	    aHCli[i].onclick = function () {
	      //$.html(pickCity, ''); //清空上一次加载的 html代码

	      if (dataC != this.innerHTML) {
	        var cityda = encodeURIComponent(this.innerHTML);
	        $.router.go('#!/flightmb/join', { city: cityda, citytype: dataType }, true);
	        toTOP();
	      } else {
	        alert('地点不能重复！~');
	      }
	    };
	  }
	  var Amycode = $.qus('.myCOde-a');
	  for (var i = 0; i < Amycode.length; i++) {
	    Amycode[i].onclick = function () {
	      var theTop = $.qu('.wrap-ft').getBoundingClientRect().top;
	      var myID2 = this.innerHTML;
	      $.qu('.wrap-ft').style.paddingTop = '2.2rem';
	      $.id(myID2).scrollIntoView(true);
	      $.qu('.wrap-ft').style.paddingTop = '4.4rem';
	    };
	  }
	  var odP = $.id('pickCity');
	  odP.onscroll = function () {
	    if (odP.scrollTop < 50) {
	      $.qu('.wrap-ft').style.paddingTop = '2.2rem';
	    }
	  };
	}
	function toTOP() {
	  var odP = $.id('pickCity');
	  if (odP.scrollTop != 0) {
	    odP.scrollTop = 0; // 返回顶部
	  }
	}

	// 页面布局函数
	function cityHtml() {
	  // 此处可以传递相关数据进去

	  var dataHotCity = [// 为2个虚拟数据
	  { id: "PEK", value: "Beijing", info: "北京" }, { id: "SHA", value: "Shanghai", info: "上海" }, { id: "SZX", value: "Shenzhen", info: "深圳" }, { id: "CAN", value: "Guangzhou", info: "广州" }, { id: "TAO", value: "Qingdao", info: "青岛" }, { id: "CTU", value: "Chengdu", info: "成都" }, { id: "HGH", value: "Hangzhou", info: "杭州" }, { id: "WUH", value: "Wuhan", info: "武汉" }, { id: "TSN", value: "Tianjin", info: "天津" }, { id: "DLC", value: "Dalian", info: "大连" }, { id: "XMN", value: "Xiamen", info: "厦门" }, { id: "CKG", value: "Chongqing", info: "重庆" }];
	  var dataHisCity = [{ id: "PEK", value: "Beijing", info: "北京" }, { id: "SHA", value: "Shanghai", info: "上海" }, { id: "SZX", value: "Shenzhen", info: "深圳" }, { id: "CAN", value: "Guangzhou", info: "广州" }];

	  var putData = '<ul class="data-ul">' + creatHmlt() + '</ul>';
	  var str0 = '';
	  var str1 = '';
	  for (var i = 0; i < dataHotCity.length; i++) {
	    str0 += '<li class="hc-li">' + dataHotCity[i].info + '</li>';
	  }

	  for (var i = 0; i < dataHisCity.length; i++) {
	    str1 += '<li class="hc-li">' + dataHisCity[i].info + '</li>';
	  }

	  var dCityt1 = '<div class="div2 ">' + '<span class="sp1">热门城市</span>' + '<div class="div3"></div>' + '</div >' + '<ul class="hc-ul clear">';
	  var dCityt = '<div class="div2 " id="divTop">' + '<span class="sp1">历史查询</span>' + '<div class="div3"></div>' + '</div >' + '<ul class="hc-ul clear">';
	  var dCityb = '</ul>';

	  var ahotCity = dCityt1 + str0 + dCityb;
	  var ahisCity = dCityt + str1 + dCityb;

	  var popupHTMLt = '<div class="popup wrap-city">' + '<p class="wrap-ft-p1"><a href="#" class="close-popup wrap-ft-ba">关闭</a></p>' + '<div class="content-block wrap-ft">';
	  var popupHTMLb = '</div>' + '</div>';
	  // 侧边栏点击
	  var myCOde = '';
	  var mytagArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	  for (var i = 0; i < mytagArray.length; i++) {
	    myCOde += '<a href="#" class="myCOde-a">' + mytagArray[i] + '</a>';
	  }
	  var myBar = '<div class="mybar clear">' + myCOde + '</div>';
	  // 整合好所有代码 装备加进 div层
	  var theinHtml = popupHTMLt + ahisCity + ahotCity + myBar + putData + popupHTMLb;

	  return theinHtml;
	}

	// 转换为json
	function strToJson(str) {
	  var json = new Function("return" + str)();
	  return json;
	}
	//为一个数组 数据来源
	//console.log(flightmbData)
	function pushData() {

	  var searchData = strToJson(getCityObj()).results;

	  var cityArray = new Array();
	  var myAlldata = new Array();
	  var mytagArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	  for (var i = 0; i < mytagArray.length; i++) {
	    var tag = mytagArray[i];
	    var tagCityArray = new Array();

	    var allCitys = searchData;
	    for (var j = 0; j < allCitys.length; j++) {
	      if (allCitys[j].value.indexOf(tag) == 0) {
	        tagCityArray.push(allCitys[j].info);
	      }
	    }
	    cityArray.push(tagCityArray);
	  };

	  for (var i = 0; i < mytagArray.length; i++) {
	    myAlldata.push(mytagArray[i] + ',' + cityArray[i]);
	  }
	  return myAlldata;
	};
	//console.log(pushData()[0].split(',')[0])
	// 创建html
	function creatHmlt() {
	  var creatDatas = pushData(); //为一长度为26的数组
	  var createLis = new Array();
	  var sTrs = '';
	  for (var i = 0; i < creatDatas.length; i++) {
	    var creatData = creatDatas[i].split(',');
	    if (creatData[1] == '') {
	      //console.log(creatData[0])
	      var str = '<li id="' + creatData[0] + '" class="li-head li-head-dis">' + creatData[0] + '</li>';
	    } else {
	      var str = '<li id="' + creatData[0] + '" class="li-head">' + creatData[0] + '</li>';
	      for (var j = 1; j < creatData.length; j++) {

	        str += '<li class="li-body">' + creatData[j] + '</li>';
	      }
	    }

	    createLis.push(str);
	  }
	  //return createLis
	  //
	  for (var n = 0; n < createLis.length; n++) {
	    sTrs += createLis[n];
	  }

	  return sTrs;
	}

	function getCityObj() {
	  return '{results:[{id:"AKU",value:"Akesu",info:"阿克苏"},{id:"AAT",value:"Aletai",info:"阿勒泰"},{id:"AKA",value:"Ankang",info:"安康"},{id:"AQG",value:"Anqing",info:"安庆"},{id:"AOG",value:"Anshan",info:"鞍山"},{id:"AVA",value:"Anshun",info:"安顺"},{id:"AYN",value:"Anyang",info:"安阳"},{id:"BSD",value:"Baoshan",info:"保山"},{id:"BAV",value:"Baotou",info:"包头"},{id:"BHY",value:"Beihai",info:"北海"},{id:"PEK",value:"Beijing",info:"北京"},{id:"BFU",value:"Bengbu",info:"蚌埠"},{id:"CGQ",value:"Changchun",info:"长春"},{id:"CGD",value:"Changde",info:"常德"},{id:"CNI",value:"Changhai",info:"长海"},{id:"CSX",value:"Changsha",info:"长沙"},{id:"CIH",value:"Changzhi",info:"长治"},{id:"CZX",value:"Changzhou",info:"常州"},{id:"CHG",value:"Chaoyang",info:"朝阳"},{id:"CCC",value:"Chaozhou",info:"潮州"},{id:"CTU",value:"Chengdu",info:"成都"},{id:"CIF",value:"Chifeng",info:"赤峰"},{id:"CKG",value:"Chongqing",info:"重庆"},{id:"DLU",value:"Dali",info:"大理"},{id:"DLC",value:"Dalian",info:"大连"},{id:"DDG",value:"Dandong",info:"丹东"},{id:"DAT",value:"Datong",info:"大同"},{id:"DAX",value:"Daxian",info:"达县"},{id:"DZU",value:"Dazu",info:"大足"},{id:"DIQ",value:"Diqing",info:"迪庆"},{id:"DSN",value:"Dongsheng",info:"东胜"},{id:"DOY",value:"Dongying",info:"东营"},{id:"DNH",value:"Dunhuang",info:"敦煌"},{id:"ENH",value:"Enshi",info:"恩施"},{id:"FUO",value:"Fuoshan",info:"佛山"},{id:"FUG",value:"Fuyang",info:"阜阳"},{id:"FUG",value:"Fuyang",info:"阜阳"},{id:"FYN",value:"Fuyun",info:"富蕴"},{id:"FOC",value:"Fuzhou",info:"福州"},{id:"GYS",value:"Guangyuan",info:"广元"},{id:"KOW",value:"Ganzhou",info:"赣州"},{id:"KHH",value:"Gaoxiong",info:"高雄"},{id:"GOQ",value:"Germu",info:"格尔木"},{id:"GHN",value:"Guanghan",info:"广汉"},{id:"CAN",value:"Guangzhou",info:"广州"},{id:"KWL",value:"Guilin",info:"桂林"},{id:"KWE",value:"Guiyang",info:"贵阳"},{id:"HRB",value:"Haerbin",info:"哈尔滨"},{id:"HAK",value:"Haikou",info:"海口"},{id:"HLD",value:"Hailaer",info:"海拉尔"},{id:"HMI",value:"Hami",info:"哈密"},{id:"HGH",value:"Hangzhou",info:"杭州"},{id:"HZG",value:"Hanzhong",info:"汉中"},{id:"HFE",value:"Hefei",info:"合肥"},{id:"HEK",value:"Heihe",info:"黑河"},{id:"HNY",value:"Hengyang",info:"衡阳"},{id:"HTN",value:"Hetian",info:"和田"},{id:"TXN",value:"Huangshan",info:"黄山"},{id:"HYN",value:"Huangyan",info:"黄岩"},{id:"HET",value:"Huheht",info:"呼和浩特"},{id:"HUZ",value:"Huizhou",info:"徽州"},{id:"JMU",value:"Jiamusi",info:"佳木斯"},{id:"KNC",value:"Jian",info:"吉安"},{id:"JGN",value:"Jiayuguan",info:"嘉峪关"},{id:"JIL",value:"Jilin",info:"吉林"},{id:"TNA",value:"Jinan",info:"济南"},{id:"JDZ",value:"Jingdezhen",info:"景德镇"},{id:"JHG",value:"Jinghong",info:"景洪"},{id:"JNG",value:"Jining",info:"济宁"},{id:"JNZ",value:"Jinzhou",info:"锦州"},{id:"JIU",value:"Jiujiang",info:"九江"},{id:"CHW",value:"Jiuquan",info:"酒泉"},{id:"JZH",value:"Jiuzhaigou",info:"九寨沟"},{id:"KHG",value:"Keshi",info:"喀什"},{id:"KRY",value:"Kelamayi",info:"克拉玛依"},{id:"KCA",value:"Kuche",info:"库车"},{id:"KRL",value:"Kuerle",info:"库尔勒"},{id:"KMG",value:"Kunming",info:"昆明"},{id:"LHW",value:"Lanzhou",info:"兰州"},{id:"LXA",value:"Lasa",info:"拉萨"},{id:"LIA",value:"Liangping",info:"梁平"},{id:"LYG",value:"Lianyungang",info:"连云港"},{id:"LJG",value:"Lijiang",info:"丽江"},{id:"LXI",value:"Linxi",info:"林西"},{id:"LYI",value:"Linyi",info:"临沂"},{id:"LHN",value:"Lishan",info:"梨山"},{id:"LZH",value:"Liuzhou",info:"柳州"},{id:"LYA",value:"Luoyang",info:"洛阳"},{id:"LUZ",value:"Lushan",info:"庐山"},{id:"LZO",value:"Luzhou",info:"泸州"},{id:"LUM",value:"Mangshi",info:"芒市"},{id:"MXZ",value:"Meixian",info:"梅县"},{id:"MIG",value:"Mianyang",info:"绵阳"},{id:"MDG",value:"Mudanjiang",info:"牡丹江"},{id:"KHN",value:"Nanchang",info:"南昌"},{id:"NAY",value:"NanYuan",info:"北京南苑"},{id:"NAO",value:"Nanchong",info:"南充"},{id:"NKG",value:"Nanjing",info:"南京"},{id:"NNG",value:"Nanning",info:"南宁"},{id:"NTG",value:"Nantong",info:"南通"},{id:"NNY",value:"Nanyang",info:"南阳"},{id:"NGB",value:"Ningbo",info:"宁波"},{id:"IQM",value:"Qiemo",info:"且末"},{id:"TAO",value:"Qingdao",info:"青岛"},{id:"IQN",value:"Qingyang",info:"庆阳"},{id:"SHP",value:"Qinghuangdao",info:"秦皇岛"},{id:"NDG",value:"Qiqihar",info:"齐齐哈尔"},{id:"JJN",value:"Quanzhou",info:"泉州"},{id:"JUZ",value:"Quzhou",info:"衢州"},{id:"SYX",value:"Sanya",info:"三亚"},{id:"SHA",value:"Shanghai",info:"上海"},{id:"PVG",value:"Pudong",info:"浦东"},{id:"SXJ",value:"Shanshan",info:"鄯善"},{id:"SWA",value:"Shantou",info:"汕头"},{id:"SHE",value:"Shenyang",info:"沈阳"},{id:"SZX",value:"Shenzhen",info:"深圳"},{id:"SJW",value:"Shijiazhuang",info:"石家庄"},{id:"SYM",value:"Simao",info:"思茅"},{id:"SZV",value:"Suzhou",info:"苏州"},{id:"TCG",value:"Tacheng",info:"塔城"},{id:"TYN",value:"Taiyuan",info:"太原"},{id:"TSN",value:"Tianjin",info:"天津"},{id:"TNH",value:"Tonghua",info:"通化"},{id:"TGO",value:"Tongliao",info:"通辽"},{id:"TEN",value:"Tongren",info:"铜仁"},{id:"WXN",value:"Wanxian",info:"万县"},{id:"WEF",value:"Weifang",info:"潍坊"},{id:"WEH",value:"Weihai",info:"威海"},{id:"WNZ",value:"Wenzhou",info:"温州"},{id:"WUH",value:"Wuhan",info:"武汉"},{id:"WHU",value:"Wuhu",info:"芜湖"},{id:"HLH",value:"Wulanhaote",info:"乌兰浩特"},{id:"URC",value:"Wulumuqi",info:"乌鲁木齐"},{id:"WUX",value:"Wuxi",info:"无锡"},{id:"WUS",value:"Wuyishan",info:"武夷山"},{id:"WUZ",value:"Wuzhou",info:"梧州"},{id:"XMN",value:"Xiamen",info:"厦门"},{id:"XIY",value:"Xian",info:"西安"},{id:"XFN",value:"Xiangfan",info:"襄樊"},{id:"XIC",value:"Xichang",info:"西昌"},{id:"XIL",value:"Xilinhot",info:"锡林浩特"},{id:"XEN",value:"Xingcheng",info:"兴城"},{id:"XIN",value:"Xingning",info:"兴宁"},{id:"XNT",value:"Xingtai",info:"邢台"},{id:"XNN",value:"Xining",info:"西宁"},{id:"XUZ",value:"Xuzhou",info:"徐州"},{id:"ENY",value:"Yanan",info:"延安"},{id:"YNZ",value:"Yancheng",info:"盐城"},{id:"YNJ",value:"Yanji",info:"延吉"},{id:"YNT",value:"Yantai",info:"烟台"},{id:"YBP",value:"Yibin",info:"宜宾"},{id:"YIH",value:"Yichang",info:"宜昌"},{id:"INC",value:"Yinchuan",info:"银川"},{id:"YIN",value:"Yining",info:"伊宁"},{id:"YIW",value:"Yiwu",info:"义乌"},{id:"YUA",value:"Yuanmou",info:"元谋"},{id:"UYN",value:"Yulin",info:"榆林"},{id:"DYG",value:"Zhangjiajie",info:"张家界"},{id:"ZHA",value:"Zhanjiang",info:"湛江"},{id:"ZAT",value:"Zhaotong",info:"昭通"},{id:"CGO",value:"Zhengzhou",info:"郑州"},{id:"DIG",value:"Zhongdian",info:"中甸"},{id:"HSN",value:"Zhoushan",info:"舟山"},{id:"ZUH",value:"Zhuhai",info:"珠海"},{id:"HJJ",value:"Zhijiang",info:"芷江"},{id:"ZYI",value:"Zunyi",info:"遵义"},{id:"YUS",value:"Yushu",info:"玉树"},{id:"LLB",value:"Libo",info:"荔波"},{id:"LLB",value:"Duyun",info:"都匀"},{id:"BFJ",value:"Bijie",info:"毕节"},{id:"KJH",value:"Kaili",info:"凯里"},{id:"HZH",value:"Liping",info:"黎平"},{id:"ACX",value:"Xingyi",info:"兴义"},{id:"NGQ",value:"Ali",info:"阿里"},{id:"AXF",value:"Alaszq",info:"阿拉善左旗"},{id:"YIE",value:"Aershan",info:"阿尔山"},{id:"BPL",value:"Bole",info:"博乐"},{id:"RLK",value:"Bayannaoer",info:"巴彦淖尔"},{id:"JUH",value:"Chizhou",info:"池州"},{id:"DCY",value:"Daocheng",info:"稻城"},{id:"LUM",value:"Dehong",info:"德宏"},{id:"EJN",value:"Ejinaqi",info:"额济纳旗"},{id:"ERL",value:"Erlianhaote",info:"二连浩特"},{id:"LHK",value:"Guanghua",info:"光化"},{id:"HIA",value:"Huaian",info:"淮安"},{id:"HJJ",value:"Huaihua",info:"怀化"},{id:"JGD",value:"Jiagedaqi",info:"加格达奇"},{id:"JIC",value:"Jingchang",info:"金昌"},{id:"JXA",value:"Jixi",info:"鸡西"},{id:"SWA",value:"Jieyang",info:"揭阳"},{id:"SYM",value:"Puer",info:"普洱"},{id:"HPG",value:"Shennongjia",info:"神农架"},{id:"SHS",value:"Shashi",info:"沙市"},{id:"TLQ",value:"Tulufan",info:"吐鲁番"},{id:"TVS",value:"Tangshan",info:"唐山"},{id:"LDS",value:"Yichun",info:"伊春"},{id:"YIC",value:"Yichun",info:"宜春"},{id:"YTY",value:"Yangzhou",info:"扬州"},{id:"YZY",value:"Zhangye",info:"张掖"},{id:"ZGN",value:"Zhongshan",info:"中山"},{id:"JHG",value:"Xishuangbanna",info:"西双版纳"}]}';
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = "<div id=\"pickCity\">\r\n\r\n</div>\r\n"

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	/**
	 * Created by way on 16/9/28.
	 */


	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(14);
	var TTitype = '';
	var Ftime = '';

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/adate$';
	        this.hash = '/flightmb/adate';
	        this.title = '幸运抽奖';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.lotteryOpen + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            console.log(params);
	            TTitype = params.timetype;
	            if (TTitype == 1) {
	                Ftime = params.ftim;
	            }
	            var nowDate = new Date();
	            var nDt = new Date();

	            var backDate = nowDate;
	            backDate.setDate(backDate.getDate() + 7);
	            returnDate("date-m1", nDt.Format("yyyy"), nDt.Format("MM"), nDt.Format("dd"), 1);
	            var AdayNext = $.qus('.dayNext');
	            // console.log(AdayNext.length)
	            for (var i = 0; i < AdayNext.length; i++) {
	                var _that = AdayNext[i];
	                eClick(_that);
	            }
	            eClick($.qu(".dayNow"));

	            // 返回按钮
	            $.id('dateBack').onclick = function () {
	                $.router.go('#!/flightmb/join', '', true);
	            };
	        }
	    }]);

	    return _class;
	}();

	exports.default = _class;


	function toTOP() {
	    var odP = $.id('date-m');
	    if (odP.scrollTop != 0) {
	        odP.scrollTop = 0; // 返回顶部
	    }
	}

	Date.prototype.Format = function (formatStr) {
	    var str = formatStr;
	    var Week = ['日', '一', '二', '三', '四', '五', '六'];

	    str = str.replace(/yyyy|YYYY/, this.getFullYear());
	    str = str.replace(/yy|YY/, this.getYear() % 100 > 9 ? (this.getYear() % 100).toString() : '0' + this.getYear() % 100);

	    str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	    str = str.replace(/M/g, this.getMonth() + 1);

	    str = str.replace(/w|W/g, Week[this.getDay()]);

	    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	    str = str.replace(/d|D/g, this.getDate());

	    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	    str = str.replace(/h|H/g, this.getHours());
	    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	    str = str.replace(/m/g, this.getMinutes());

	    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	    str = str.replace(/s|S/g, this.getSeconds());

	    return str;
	};

	function eClick(obj) {
	    obj.onclick = function () {
	        // var selectDate = this.find("font").eq(0).html();
	        var selectDate = $.firstChild(this).innerHTML;
	        //console.log(selectDate)
	        if (selectDate === "今天") {
	            selectDate = new Date().getDate();
	        }
	        var dateCls = $.lastChild(this).innerHTML;
	        var hID = this.parentNode.parentNode.parentNode.id;
	        var dateString = $.nextNode($.firstChild($.firstChild($.id(hID)))).innerHTML;
	        //console.log(dateString)
	        var _date = new Date(dateString.replace(/-/g, "/"));
	        if (dateCls == undefined) {
	            dateCls = getWeek(_date.getDay());
	        }
	        if (selectDate != "") {
	            // $("#emTime").html(dateString);
	            // $("#headerID").hide();
	            // $("#calendarCover").remove();
	            // $("#emTime").next().html("&nbsp" + dateCls);
	            // $("body").scrollTop(0);
	            var Ttime = dateString + '-' + selectDate;
	            var Tprice = dateCls;
	            if (Ftime != '') {
	                var t2 = Ttime;
	                var t1 = Ftime;
	                if (t1.replace(/\-/g, "") > t2.replace(/\-/g, "")) {
	                    alert('回程日期应该大于去程日期');
	                } else {
	                    //  点击 带时间 返回
	                    $.router.go('#!/flightmb/join', { timetype: TTitype, stime: Ttime, stime1: Ftime, Tprice: Tprice }, true);
	                    toTOP();
	                }
	            } else {
	                $.router.go('#!/flightmb/join', { timetype: TTitype, stime: Ttime, stime1: Ftime, Tprice: Tprice }, true);
	                toTOP();
	            }
	        }
	    };
	}
	function adaeeChange(date) {

	    //对date进行重新组装成yyyy-MM-dd的格式
	    //2014 - 8 - 7
	    try {
	        var tempDate1Arr = date.split("-");
	        date = tempDate1Arr[0] + "";
	        if (tempDate1Arr[1].length == 1) {
	            date += "-0" + tempDate1Arr[1];
	        } else {
	            date += "-" + tempDate1Arr[1];
	        }
	        if (tempDate1Arr[2].length == 1) {
	            date += "-0" + tempDate1Arr[2];
	        } else {
	            date += "-" + tempDate1Arr[2];
	        }
	    } catch (e) {}

	    return date;
	}

	//获取星期几
	function getWeek(num) {
	    switch (num) {
	        case 0:
	            return "周日";
	        case 1:
	            return "周一";
	        case 2:
	            return "周二";
	        case 3:
	            return "周三";
	        case 4:
	            return "周四";
	        case 5:
	            return "周五";
	        case 6:
	            return "周六";
	    }
	}

	//得到五个日历表的方法
	function returnDate(id, nYear, nMonth, nDay, num) {
	    var selectDate = "";
	    // if (num == 1) {
	    //     selectDate = $("#emTime").text();
	    // } else {
	    //     selectDate = $("#backTime").text();
	    // }
	    var year = nYear,
	        month = nMonth;

	    var size = 7;
	    // var calendarBox = "<div id='calendarBox'></div>"
	    // $("#calendarCover").append(calendarBox);
	    var html = '';
	    for (var i = 0; i < size; i++) {
	        html += calendar("calendar" + i, year, month, selectDate, false);
	        //$("#" + id).append(html);
	        month++;
	        if (month == 13) {
	            month = 1;
	            year++;
	        }
	    }
	    $.html($.id(id), html);
	    // $("#headerID").show();
	    // $("#headerID").find("h1").html("选择日期");
	}

	function calendar(id, yy, mm, selectDate, showBtn) {
	    //日历控件id:日历控件组id,yymm,开始的年份/月份,showBtn是否显示前一个月后一个月按钮
	    var year = parseInt(yy) < 1900 ? 1900 : parseInt(yy);
	    year = year > 2030 ? 2030 : year;
	    var month = parseInt(mm, 10) < 1 ? 1 : parseInt(mm, 10);
	    month = month > 12 ? 12 : month;
	    var calendarHTML = "<div class='calendar' id=" + id + " date=" + selectDate + ">" + "<div class='calendar_t'>";
	    if (showBtn) {
	        //显示按钮
	        calendarHTML += "<div class='calendar_t_prev' onclick='changeCalendar(this,-1);'><</div>" + "<div class='calendar_t_day'>" + year + "-" + month + "</div>" + "<div class='calendar_t_next'onclick='changeCalendar(this,1);'>></div>";
	    } else {
	        //无按钮
	        calendarHTML += "<div class='calendar_t_prev'></div>" + "<div class='calendar_t_day'>" + year + "-" + month + "</div>" + "<div class='calendar_t_next'></div>";
	    }
	    calendarHTML += "<div class='clear'></div>" + "</div>" + "<div class='calendar_c'>" + "<div class='calendar_c_week'>" + "<div class='calendar_c_week_day'>日</div>" + "<div class='calendar_c_week_day'>一</div>" + "<div class='calendar_c_week_day'>二</div>" + "<div class='calendar_c_week_day'>三</div>" + "<div class='calendar_c_week_day'>四</div>" + "<div class='calendar_c_week_day'>五</div>" + "<div class='calendar_c_week_day'>六</div>" + "<div class='clear'></div>" + "</div>" + "<div class='calendar_c_box'>";
	    calendarHTML += loadCalendar(year, month, selectDate);
	    calendarHTML += "</div>" + "</div>" + "</div>";
	    return calendarHTML;
	}

	function loadCalendar(year, month, selectDate) {
	    var rc = "";
	    var dateObj = new Date();
	    var nowYear = dateObj.getFullYear(); //年
	    var nowMonth = dateObj.getMonth() + 1; //月
	    var nowDate = dateObj.getDate(); //日
	    var nowDay = dateObj.getDay(); //周几
	    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	    year = year < 1900 ? 1900 : year;
	    year = year > 2030 ? 2030 : year;
	    month = month < 1 ? 1 : month;
	    month = month > 12 ? 12 : month;
	    months[1] = year % 4 == 0 ? 29 : 28; //闰年判断
	    dateObj.setFullYear(year, month - 1, 1);
	    var day1 = dateObj.getDay();
	    for (var i = 0; i < day1; i++) {
	        rc += "<div class='day dayEmpty dayWhite'><font class='thett'></font><font class='thett thett1'></font></div>";
	    }
	    var tomorrow = 0;
	    var afterTomorrow = 0;
	    var minPrice = "¥" + 750;
	    minPrice = "";
	    for (var i = 1; i <= months[month - 1]; i++) {
	        var dateString = year + "-" + month + "-" + i; //当前日历日期
	        {
	            //变成标准的日期格式如：2016-09-09
	            var tempDate1Arr = dateString.split("-");
	            dateString = tempDate1Arr[0] + "";
	            if (tempDate1Arr[1].length == 1) {
	                dateString += "-0" + tempDate1Arr[1];
	            } else {
	                dateString += "-" + tempDate1Arr[1];
	            }
	            if (tempDate1Arr[2].length == 1) {
	                dateString += "-0" + tempDate1Arr[2];
	            } else {
	                dateString += "-" + tempDate1Arr[2];
	            }
	        }

	        if (dateString == selectDate) {
	            if (year == nowYear && month == nowMonth && i == nowDate) {
	                tomorrow = i + 1;
	                rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>今天</font><br/><font class='thett1'>" + minPrice + "</font><font style='display: none;'>今天</font></div>";
	            } else {
	                if (i == tomorrow) {
	                    tomorrow = 0;
	                    afterTomorrow = i + 1;
	                    rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1'>" + minPrice + "</font><font style='display: none;'>明天</font></div>";
	                } else {
	                    if (afterTomorrow == i) {
	                        afterTomorrow = 0;
	                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><fontclass='thett1'>" + minPrice + "</font><font style='display: none;'>后天</font></div>";
	                    } else {
	                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1'>" + minPrice + "</font></div>";
	                    }
	                }
	            }
	        } else {
	            if (year < nowYear) {
	                rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thett'>" + i + "</font><font class='thett1'></font></div>";
	            } else if (year == nowYear) {
	                if (month < nowMonth) {
	                    rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thett'>" + i + "</font><font class='thett1'></font></div>";
	                } else if (month == nowMonth) {
	                    if (i < nowDate) {
	                        rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thett'>" + i + "</font><font class='thett1'></font></div>";
	                    } else if (i == nowDate) {
	                        tomorrow = i + 1;
	                        rc += "<div class='day dayNow';' data=" + dateString + "><font class='thett'>今天</font><br/><font class='thett1' >" + minPrice + "</font><font style='display: none;'>今天</font></div>";
	                    } else {
	                        if (i == tomorrow) {
	                            tomorrow = 0;
	                            afterTomorrow = i + 1;
	                            rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1' >" + minPrice + "</font><font style='display: none;'>明天</font></div>";
	                        } else {
	                            if (afterTomorrow == i) {
	                                afterTomorrow == 0;
	                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1' >" + minPrice + "</font><font style='display: none;'>后天</font></div>";
	                            } else {
	                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1'>" + minPrice + "</font></div>";
	                            }
	                        }
	                    }
	                } else {
	                    rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1' >" + minPrice + "</font></div>";
	                }
	            } else {
	                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1'>" + minPrice + "</font></div>";
	            }
	        }
	    }
	    rc += "<div class='clear'></div>";
	    return rc;
	}
	// 显示按钮的时候调用
	function changeCalendar(element, meth) {
	    var calendarBox = $(element).parents(".calendar");
	    var date = calendarBox.find(".calendar_t_day").html();
	    var dateArray = date.split("-");
	    var year = parseInt(dateArray[0]);
	    var month = parseInt(dateArray[1]);
	    var selectDate = calendarBox.attr("date");
	    if (meth == -1) {
	        month--;
	        if (month == 0) {
	            month = 12;
	            year--;
	        }
	    } else if (meth == 1) {
	        month++;
	        if (month == 13) {
	            month = 1;
	            year++;
	        }
	    }
	    var calendarHTML = loadCalendar(year, month, selectDate);
	    calendarBox.find(".calendar_t_day").html(year + "-" + month);
	    calendarBox.find(".calendar_c_box").html(calendarHTML);
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = "<div id=\"date\">\r\n\t   <div id=\"date-t\">\r\n\t   \t  <a  id='dateBack' href=\"javascript:;\">关闭</a>\r\n\t   </div>\r\n\t   <div id=\"date-m\">\r\n\t   \t    <div id=\"date-m1\"></div>\r\n\t   </div>\r\n</div>\r\n"

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	/**
	 * Created by way on 16/9/28.
	 */


	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(16);
	var TTitype = '';
	// 虚拟数据
	var urlFrom = '';
	var urlTo = '';
	var urlTime = '';
	var urlTime1 = ''; //返程日期
	var date2 = ''; //返程日期
	var searchtype = ''; //判断往返
	var backdata = {}; // 存放返程数据 地点以及切换
	var backtype = ''; // 判断显示 返
	var zhefromData = ''; // 存放第一查询的准备提交的数据

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/detail$';
	        this.hash = '/flightmb/detail';
	        this.title = '机票详情';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.lotteryOpen + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            // console.log(params)
	            if (params.cliktype == 1) {
	                // console.log(params)
	                urlFrom = params.citydetail1;
	                urlTo = params.citydetail2;
	                urlTime = params.timedetail1;
	                urlTime1 = params.timedetail2;
	                backtype = '';

	                // 清空 价格
	                $.id('detail-nowdata3').innerHTML = '';
	                $.id('detail-odldata').innerHTML = '';
	                $.id('detail-nexdata1').innerHTML = '';
	            } else if (params.cliktype == 2) {
	                urlTime = params.stime;
	                urlTime1 = params.bt;
	            } else if (params.cliktype == 4) {
	                //去程数据需要提交的数据
	                console.log(params.searchbdata);
	                urlFrom = params.searchbdata.bcity1;
	                urlTo = params.searchbdata.bcity2;
	                urlTime = params.searchbdata.btime;
	                urlTime1 = '';
	                backtype = params.searchbdata.backtype;
	                zhefromData = params.ptbdata1;
	            }
	            // 返回点击
	            $.qu('.detail-t1').onclick = function () {
	                $.router.go('#!/flightmb/join', '', true);
	            };

	            var reg = /[A-Za-z]{3}/;
	            var from = urlFrom;
	            var to = urlTo;
	            var date = urlTime;

	            date2 = urlTime1;
	            date = detailChange(date);
	            date2 = detailChange(date2);
	            //console.log(date2)

	            // from = from == null ? "北京" : from; //重庆CKG
	            // to = to == null ? "广州" : to; //广州
	            // date = date == null ? "2014-07-25" : date;

	            var id = 1; //默认为单程
	            if (date2 != '') {
	                id = 2;
	                $.qu('.detail-t2').style.display = 'block';
	            } else {
	                id = 1;
	                $.qu('.detail-t2').style.display = 'none';
	                if (backtype == 2) {
	                    $.qu('.detail-t2').style.display = 'block';
	                    $.qu('.detail-t2').innerHTML = '返:';
	                }
	            }
	            // 标题  北京—— 上海
	            $.id('detailcity0').innerHTML = from;
	            $.id("detailcity1").innerHTML = to;
	            //头部加载数据
	            changeDateOfTop(date);
	            if (id == 1) {
	                //单程
	                searchtype = 1;
	                backdata = {
	                    backtype: 1 // 判断是否要返回 继续预订机票
	                };
	            } else {
	                //往返
	                searchtype = 2;

	                backdata = {
	                    btime: date2,
	                    bcity1: to,
	                    bcity2: from,
	                    backtype: 2,
	                    searcht: 2

	                };
	            }

	            //加载数据
	            //search(searchtype, null);

	            //BindFilterCarrier(); //初始化筛选
	            //BindSort(); //初始化排序
	            //BindMoreCabin(); //初始化更多舱位
	            //BindBookClick(); //单程预定
	            //BindBookGoClick(); //去程选择
	            //BindBookBackClick(); //回程预定
	            ////bookOnlyGoClick(); //只订去程
	            //BindClassTypeOfCF(); //仅查看公务舱/头等舱
	            //BindRefund(); //退改签
	            //BindInsuredTips(); //保险提示
	            //CabinType();//仓位类别提示
	            //myAjaxGetLowprice()
	            // var from = urlFrom;
	            // var to =urlTo;
	            // var date =urlTime;

	            //function myAjaxGetLowprice(fromcity,tocity,date,searchtype){}
	            // 查询最低价

	            myAjaxGetLowprice(getCityCode(from), getCityCode(to), date, searchtype); //加载航班
	            initialAction(); //绑定部分点击事件

	        }
	    }]);

	    return _class;
	}();

	//获取航班


	exports.default = _class;
	function myAjaxGetLowprice(fromcity, tocity, date, searchtype) {
	    getLowPrict(getPointedDate(urlTime, 1, "-")); //获取最低价
	    $.qu('.lodin').style.display = '-webkit-box';

	    var param = {
	        "act": "SearchFlightICBCJson",
	        "org_city": fromcity,
	        "dst_city": tocity,
	        "org_date": date, //date.substring(0, 10),
	        "xsltPath": "HTML5",
	        "search_type": searchtype //searchtype
	    };

	    var oData2 = '';
	    var xhr = new XMLHttpRequest();
	    xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&jsoncallback=jQuery183011878398158009507_1481529281930&act=' + param.act + '&org_city=' + param.org_city + '&dst_city=' + param.dst_city + '&org_date=' + param.org_date + '&xsltPath=HTML5&search_type=' + param.search_type + '&firstShowType=1&_=1481529832360', 'false');
	    // xhr.open('get','http://222.180.162.217:8015/icbc/ajax.aspx?jsoncallback=jQuery183011878398158009507_1481529281930&act=SearchFlightICBCJson&org_city=PEK&dst_city=CAN&org_date=2017-03-16&xsltPath=HTML5&search_type=1&firstShowType=1&_=1481529832360','true');
	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                $.qu('.lodin').style.display = 'none';
	                //  判断服务器返回的状态 200 表示 正常
	                if (xhr.responseText != '') {
	                    oData2 = JSON.parse(xhr.responseText);
	                    var alldatas = oData2.Flights;
	                    console.log(alldatas);
	                    var ty = 1;
	                    var n = 1;

	                    //console.log(alldatas[0]) ty 时间/ 价格   n 高低
	                    $.id('detail-m1').innerHTML = pullData(ty, n, alldatas);
	                    var theCp = removedata(getAllcp(alldatas));
	                    toproduct();
	                    // removedata(fCity(alldata))
	                    // removedata(toCity(alldata))
	                    pullCp(theCp); // 加载公司
	                    fCitydata(removedata(fCity(alldatas)), removedata(toCity(alldatas))); //加载起落机场
	                    picBox(); // 开启筛选功能

	                    thePrice(ty, n, alldatas); // 价格高低筛选
	                    theTime(ty, n, alldatas); // 时间筛选


	                    $.id('detail-fl1').onclick = function () {
	                        $.qu('.detail-fl1pick').style.top = '-7.6rem';
	                    };
	                    $.id('fl1pick-h1s1').onclick = function () {
	                        $.qu('.detail-fl1pick').style.top = '2.6rem';
	                    };
	                    $.id('fl1pick-h1s3').onclick = function () {
	                        $.id('detail-m1').innerHTML = ''; //清空所有页面内容 再加载
	                        $.qu('.detail-fl1pick').style.top = '2.6rem';

	                        //找出所有被选中的 元素
	                        var allSles = $.qus('.check_it');

	                        var sttime = [];
	                        var stcp = [];
	                        var sttype = [];
	                        var stairport = [];
	                        for (var i = 0; i < allSles.length; i++) {
	                            if ($.hasClass(allSles[i].parentNode.parentNode, 'pickbox-time')) {
	                                sttime.push($.firstChild(allSles[i].parentNode).innerHTML);
	                            }
	                            if ($.hasClass(allSles[i].parentNode.parentNode, 'pickbox-cp')) {
	                                stcp.push($.firstChild(allSles[i].parentNode).innerHTML);
	                            }
	                            if ($.hasClass(allSles[i].parentNode.parentNode, 'pickbox-type')) {
	                                sttype.push($.firstChild(allSles[i].parentNode).innerHTML);
	                            }
	                            if ($.hasClass(allSles[i].parentNode.parentNode, 'pickbox-airport')) {
	                                stairport.push($.firstChild(allSles[i].parentNode).innerHTML);
	                            }
	                        }
	                        var thedata = youData(sttime, stcp, sttype, stairport, alldatas);
	                        $.id('detail-m1').innerHTML = pullData(ty, n, thedata);
	                        thePrice(ty, n, thedata);
	                        theTime(ty, n, thedata);
	                        toproduct();
	                    };
	                } else {
	                    alert('航班查询出错！');
	                }
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}

	function toproduct() {
	    // 进入 产品页面

	    var bottns = $.qus('.dedata-wrap');
	    for (var i = 0; i < bottns.length; i++) {
	        bottns[i].onclick = function () {
	            var theWen = $.id('detail-nowdata2').innerHTML;
	            var dataArr = {
	                prWen: theWen,
	                prDate: this.getAttribute('flightdate'),
	                arrtime: this.getAttribute('arrtime'),
	                FlyTime: this.getAttribute('FlyTime'),
	                fromairport: this.getAttribute('fromairport') + this.getAttribute('arrhall'),
	                //进出站　互换
	                toairport: this.getAttribute('toairport') + this.getAttribute('Terminal'),
	                carrierabb: this.getAttribute('carrierabb'),
	                carrierabb1: this.getAttribute('carrierabb1'),
	                carrierabb2: this.getAttribute('carrierabb2'),
	                model: this.getAttribute('model'),
	                RouteFrom: this.getAttribute('RouteFrom'),
	                RouteTo: this.getAttribute('RouteTo'),
	                pulId: this.id,
	                theCarrier: this.getAttribute('Carrier'),
	                ZYtype: this.getAttribute('ZYtype'),
	                Discount: this.getAttribute('Discount'),
	                YPrice: this.getAttribute('YPrice'),
	                RouteFromCode: this.getAttribute('RouteFromCode'),
	                RouteToCode: this.getAttribute('RouteToCode'),
	                Lmodel: this.getAttribute('model') + this.getAttribute('Modelchar'),
	                Cabin: this.getAttribute('Cabin'),
	                Terminal: this.getAttribute('Terminal')

	            };
	            alert(this.getAttribute('Cabin'));

	            if (backtype == '') {
	                // 单程
	                $.router.go('#!/flightmb/product', { prData: dataArr, prot: 1, bdata: backdata }, true);
	            } else {
	                // 带着去程数据 进去产品页面
	                $.router.go('#!/flightmb/product', { prData: dataArr, prot: 3, bdata: zhefromData }, true);
	            }
	        };
	    }
	}

	// 绑定所有点击事件
	function initialAction() {
	    // 下一天
	    $.id('detail-tms2').onclick = function () {
	        var date = this.getAttribute('date');
	        var from = $.id('detailcity0').innerHTML;
	        var to = $.id('detailcity1').innerHTML;
	        $.qu('.detail-f-ulsp3').innerHTML = '价格';
	        $.qu('.detail-f-ulsp2').innerHTML = '时间';

	        if (checkDateIsOK(date)) {
	            changeDateOfTop(date);

	            //search(searchtype, null);
	        }
	        getLowPrict($.id('detail-tms1').getAttribute('date'));
	        myAjaxGetLowprice(getCityCode(from), getCityCode(to), date, searchtype);
	    };
	    // 上一天
	    $.id('detail-tms1').onclick = function () {
	        var date = this.getAttribute('date');
	        var from = $.id('detailcity0').innerHTML;
	        var to = $.id('detailcity1').innerHTML;
	        $.qu('.detail-f-ulsp3').innerHTML = '价格';
	        $.qu('.detail-f-ulsp2').innerHTML = '时间';
	        if (checkDateIsOK(date)) {
	            changeDateOfTop(date);

	            //search(searchtype, null);
	        }
	        getLowPrict($.id('detail-tms1').getAttribute('date'));
	        myAjaxGetLowprice(getCityCode(from), getCityCode(to), date, searchtype);
	    };
	    //  日历弹出
	    $.id('detail-tmmai').onclick = function () {
	        $.router.go('#!/flightmb/picktime', { backtime: urlTime1 }, true);
	    };
	}

	// 价格筛选函数
	function thePrice(ty, n, alldatas) {
	    var onOffprice = true;

	    $.id('detail-fl3').onclick = function () {
	        $.qu('.detail-f-ulo2').style.background = '#E4DCDC';
	        $.qu('.detail-f-ulo3').style.background = '#FCA40B';
	        $.qu('.detail-f-ulsp2').innerHTML = '时间';
	        if (onOffprice) {
	            n = 1;
	            ty = 2;
	            $.qu('.detail-f-ulsp3').innerHTML = '从低到高';
	            onOffprice = false;
	        } else {
	            n = 2;
	            ty = 2;
	            $.qu('.detail-f-ulsp3').innerHTML = '从高到低';
	            onOffprice = true;
	        }
	        $.id('detail-m1').innerHTML = pullData(ty, n, alldatas);
	        toproduct();
	    };
	}
	// 时间筛选函数
	function theTime(ty, n, alldatas) {
	    var onOfftime = true;

	    $.id('detail-fl2').onclick = function () {
	        $.qu('.detail-f-ulo2').style.background = '#FCA40B';
	        $.qu('.detail-f-ulo3').style.background = '#E4DCDC';
	        $.qu('.detail-f-ulsp3').innerHTML = '价格';
	        if (onOfftime) {
	            n = 2;
	            ty = 1;
	            $.qu('.detail-f-ulsp2').innerHTML = '从晚到早';
	            onOfftime = false;
	        } else {
	            n = 1;
	            ty = 1;
	            $.qu('.detail-f-ulsp2').innerHTML = '从早到晚';
	            onOfftime = true;
	        }
	        $.id('detail-m1').innerHTML = pullData(ty, n, alldatas);
	        toproduct();
	    };
	}

	// 航空公司及降落地点动态加载
	// removedata(fCity(alldata))
	// removedata(toCity(alldata))
	function fCitydata(data1, data2) {
	    var st1 = '<li ><span class="cityfrom"><em>北京</em>起飞</span></li>';
	    var st2 = '<li class="pickbox-airport1"><span>不限</span><label class="check_it pickbox-airport11  "><input type="radio" value=" " name="airportFrom"></label></li>';
	    var st3 = '';
	    var st4 = '<li ><span class="cityto"><em>上海</em>降落</span></li>';
	    var st5 = '<li class="pickbox-airport2 "><span>不限</span><label class="check_it pickbox-airport22"><input type="radio" value=" " name="airportTo"></label></li>';
	    var st6 = '';
	    for (var i = 0; i < data1.length; i++) {
	        st3 += '<li class="pickbox-airport1"><span>' + data1[i] + '</span><label ><input type="radio" value=" " name="airportFrom"></label></li>';
	    }
	    for (var i = 0; i < data2.length; i++) {
	        st6 += '<li class="pickbox-airport2" ><span >' + data2[i] + '</span><label ><input type="radio" value=" " name="airportTo"></label></li>';
	    }
	    $.qu('.pickbox-airport').innerHTML = st1 + st2 + st3 + st4 + st5 + st6;
	}

	//根据条件筛选数据
	function youData(sttime, stcp, sttype, stairport, alldatas) {
	    var thelastdata = [];
	    var thelastdata1 = [];
	    var thelastdata2 = [];
	    var thelastdata3 = [];
	    if (sttime[0] != '不限') {
	        thelastdata = [];
	        var sttime1 = [];
	        sttime1.push(sttime[0].split('--', 2)[0]);
	        sttime1.push(sttime[sttime.length - 1].split('--', 2)[1]);
	        var t1 = strKo(sttime1[0]);
	        var t2 = strKo(sttime1[1]);

	        for (var j = 0; j < alldatas.length; j++) {
	            var ff1 = strKo(alldatas[j].FlyTime);

	            if (t1 <= ff1 && ff1 <= t2) {
	                thelastdata.push(alldatas[j]);
	            }
	        }
	        if (thelastdata.length == 0) {
	            return '';
	        }
	    } else {
	        thelastdata = alldatas;
	    }

	    if (stcp[0] != '不限') {
	        for (var i = 0; i < stcp.length; i++) {
	            for (var j = 0; j < alldatas.length; j++) {
	                if (stcp[i] == alldatas[j].CarrierAbb) {
	                    thelastdata1.push(alldatas[j]);
	                }
	            }
	        }
	        if (thelastdata1.length == 0) {
	            return '';
	        }
	    } else {
	        thelastdata1 = alldatas;
	    }

	    if (sttype[0] != '不限') {
	        for (var i = 0; i < sttype.length; i++) {
	            for (var j = 0; j < alldatas.length; j++) {
	                if (sttype[i] == alldatas[j].Model) {
	                    thelastdata2.push(alldatas[j]);
	                }
	            }
	        }
	        if (thelastdata2.length == 0) {
	            return '';
	        }
	    } else {
	        thelastdata2 = alldatas;
	    }
	    if (stairport[0] != '不限' && stairport[1] != '不限') {
	        var p1 = [];
	        var p2 = [];
	        for (var i = 0; i < alldatas.length; i++) {
	            if (stairport[0] == alldatas[i].FromAirport) {
	                p1.push(alldatas[i]);
	            }
	        };
	        for (var i = 0; i < p1.length; i++) {
	            if (stairport[1] == p1[i].ToAirport) {
	                p2.push(p1[i]);
	            }
	        }
	        thelastdata3 = p2;
	    } else if (stairport[0] != '不限' && stairport[1] == '不限') {
	        var p3 = [];
	        for (var i = 0; i < alldatas.length; i++) {
	            if (stairport[0] == alldatas[i].FromAirport) {
	                p3.push(alldatas[i]);
	            }
	        };
	        thelastdata3 = p3;
	    } else if (stairport[0] == '不限' && stairport[1] == '不限') {
	        thelastdata3 = alldatas;
	    } else if (stairport[0] == '不限' && stairport[1] != '不限') {
	        var p4 = [];
	        for (var i = 0; i < alldatas.length; i++) {
	            if (stairport[1] == alldatas[i].ToAirport) {
	                p4.push(alldatas[i]);
	            }
	        };
	        thelastdata3 = p4;
	    }

	    var d1 = [];
	    for (var i = 0; i < thelastdata.length; i++) {
	        for (var j = 0; j < thelastdata1.length; j++) {
	            if (thelastdata[i].CabinFlag == thelastdata1[j].CabinFlag) {
	                d1.push(thelastdata[i]);
	            }
	        }
	    }

	    var d2 = [];
	    for (var i = 0; i < thelastdata2.length; i++) {
	        for (var j = 0; j < thelastdata3.length; j++) {
	            if (thelastdata2[i].CabinFlag == thelastdata3[j].CabinFlag) {
	                d2.push(thelastdata2[i]);
	            }
	        }
	    }
	    var d3 = [];
	    for (var i = 0; i < d1.length; i++) {
	        for (var j = 0; j < d2.length; j++) {
	            if (d1[i].CabinFlag == d2[j].CabinFlag) {
	                d3.push(d1[i]);
	            }
	        }
	    }
	    // console.log(d3)

	    return d3;
	}

	function strKo(data) {

	    return Number(data.split(":").join(""));
	}

	// 绑定 筛选 功能
	function picBox() {

	    // 机场选择
	    var air2 = $.qus('.pickbox-airport2');
	    for (var i = 0; i < air2.length; i++) {
	        air2[i].onclick = function () {
	            if ($.hasClass($.lastChild(this), 'check_it')) {
	                $.removeClass($.lastChild(this), 'check_it');
	                $.addClass($.qu('.pickbox-airport22'), 'check_it');
	            } else {
	                $.each(air2, function () {
	                    $.removeClass($.lastChild(this), 'check_it');
	                });
	                $.addClass($.lastChild(this), 'check_it');
	            }
	            return false;
	        };
	    }
	    var air1 = $.qus('.pickbox-airport1');
	    for (var i = 0; i < air1.length; i++) {
	        air1[i].onclick = function () {
	            if ($.hasClass($.lastChild(this), 'check_it')) {
	                $.removeClass($.lastChild(this), 'check_it');
	                $.addClass($.qu('.pickbox-airport11'), 'check_it');
	            } else {
	                $.each(air1, function () {
	                    $.removeClass($.lastChild(this), 'check_it');
	                });
	                $.addClass($.lastChild(this), 'check_it');
	            }
	            return false;
	        };
	    }
	    // 筛选类型切换
	    var ptitles = $.qus('.pickbox-title1');
	    for (var i = 0; i < ptitles.length; i++) {
	        ptitles[i].onclick = function () {
	            $.each(ptitles, function () {
	                $.removeClass(this, 'title-active');
	            });
	            $.addClass(this, 'title-active');
	            if ($.hasClass($.qu('.pickbox-title11'), 'title-active')) {
	                $.each($.qus('.pickbox-mian'), function () {
	                    this.style.display = 'none';
	                });
	                $.qu('.pickbox-time').style.display = 'block';
	            } else if ($.hasClass($.qu('.pickbox-title12'), 'title-active')) {
	                $.each($.qus('.pickbox-mian'), function () {
	                    this.style.display = 'none';
	                });
	                $.qu('.pickbox-cp').style.display = 'block';
	            } else if ($.hasClass($.qu('.pickbox-title13'), 'title-active')) {
	                $.each($.qus('.pickbox-mian'), function () {
	                    this.style.display = 'none';
	                });
	                $.qu('.pickbox-type').style.display = 'block';
	            } else if ($.hasClass($.qu('.pickbox-title14'), 'title-active')) {
	                $.each($.qus('.pickbox-mian'), function () {
	                    this.style.display = 'none';
	                });
	                $.qu('.pickbox-airport').style.display = 'block';
	            }
	        };
	    }
	    // 时间选择
	    slectPick('.pickbox-time', '.pickbox-time1', '.pickbox-time2', 'check_it');
	    // 公司选择
	    slectPick('.pickbox-cp', '.pickbox-cp1', '.pickbox-cp2', 'check_it');
	    // 机型
	    slectPick('.pickbox-type', '.pickbox-type1', '.pickbox-type2', 'check_it');
	    function slectPick(class1, class11, class12, atr) {
	        // class1 为大类型的calss calsss11 为不限制的class  calsss12为 可选 的class
	        var aType = $.tags($.qu(class1), 'li');
	        for (var i = 1; i < aType.length; i++) {
	            aType[i].onclick = function () {
	                if ($.hasClass($.tags(this, 'label')[0], atr)) {
	                    $.removeClass($.tags(this, 'label')[0], atr);
	                    var aType1 = $.qus(class12);
	                    var k = 0;
	                    for (var i = 0; i < aType1.length; i++) {
	                        k += $.hasClass(aType1[i], atr);
	                    }
	                    if (k == 0) {
	                        $.addClass($.qu(class11), atr);
	                    }
	                } else {
	                    $.removeClass($.qu(class11), atr);
	                    $.addClass($.tags(this, 'label')[0], atr);
	                }
	                return false;
	            };
	        }
	        aType[0].onclick = function () {
	            var aType12 = $.qus(class12);
	            for (var i = 0; i < aType12.length; i++) {
	                $.removeClass(aType12[i], atr);
	            }
	            $.addClass($.qu(class11), atr);
	        };
	    }

	    $.id('fl1pick-h1s2').onclick = function () {
	        allreMaddClass();
	    };
	    // 初始化筛选

	}
	// 清空筛选
	function allreMaddClass() {
	    var kk = $.tags($.qu('.detail-pickbox'), 'label');

	    for (var i = 0; i < kk.length; i++) {
	        if ($.hasClass(kk[i], 'check_it')) {
	            $.removeClass(kk[i], 'check_it');
	        }
	    }

	    var alrr = ['.pickbox-time1', '.pickbox-cp1', '.pickbox-type1', '.pickbox-airport11', '.pickbox-airport22'];
	    for (var i = 0; i < alrr.length; i++) {
	        reMaddClass(alrr[i]);
	    }
	    function reMaddClass(latr) {
	        $.addClass($.qu(latr), 'check_it');
	    }
	}

	// 数据处理函数  所有航班加入页面
	function pullData(type, n, alldata) {

	    if (alldata != '') {
	        //判断筛选类型 时间 价格 type=1 时间， type=2 价格
	        if (type == 1) {
	            // 为时间类型 偶然的？
	            if (n == 1) {
	                //时间 早到晚
	                var alldata1 = alldata.sort(function (a, b) {
	                    return strKo(a.FlyTime) - strKo(b.FlyTime);
	                });
	            } else {
	                //时间 晚到早
	                var alldata1 = alldata.sort(function (a, b) {
	                    return strKo(b.FlyTime) - strKo(a.FlyTime);
	                });
	            }
	        } else if (type == 2) {
	            //  为价格类型
	            if (n == 1) {
	                //价格 低到高
	                var alldata1 = alldata.sort(function (a, b) {
	                    return a.Fare - b.Fare;
	                });
	            } else {
	                //价格   高到底 alldata1[i].Fare
	                var alldata1 = alldata.sort(function (a, b) {
	                    return b.Fare - a.Fare;
	                });
	            }
	        }

	        // console.log(alldata1)
	        var strs = '';
	        for (var i = 0; i < alldata1.length; i++) {
	            strs += '<ul class="dedata-wrap" id="' + alldata1[i].CabinFlag + '" ArrTime="' + alldata1[i].ArrTime + '"  CabinLevel="' + alldata1[i].CabinLevel + '"  ArrHall="' + alldata1[i].ArrHall + '" ZYtype="' + alldata1[i].Cabins[0].CabinType + '"  Model="' + alldata1[i].Model + '"  CarrierAbb="' + alldata1[i].CarrierAbb + alldata1[i].Carrier + alldata1[i].FlightNo + '" CarrierAbb1="' + alldata1[i].CarrierAbb + '"  CarrierAbb2="' + alldata1[i].Carrier + alldata1[i].FlightNo + '"  FlightDate="' + alldata1[i].FlightDate + '"  Terminal="' + alldata1[i].Terminal + '"  ToAirport="' + alldata1[i].ToAirport + '" FlyTime="' + alldata1[i].FlyTime + '" FromAirport="' + alldata1[i].FromAirport + '" RouteFrom="' + alldata1[i].RouteFrom + '"  RouteTo="' + alldata1[i].RouteTo + '" Carrier="' + alldata1[i].Carrier + '" YPrice ="' + alldata1[i].YPrice + '" Discount="' + alldata1[i].Discount + '" RouteFromCode="' + alldata1[i].RouteFromCode + '" RouteToCode="' + alldata1[i].RouteToCode + '" ModelChar="' + alldata1[i].ModelChar + '" Cabin="' + alldata1[i].Cabin + '"  Terminal="' + alldata1[i].Terminal + '"><li class="d-wrapl1" ><span class="d-wrapl1-sp1">' + alldata1[i].FlyTime + '</span><span class="d-wrapl1-sp2"><strong></strong></span><span class="d-wrapl1-sp3">' + alldata1[i].ArrTime + '</span><span class="d-wrapl1-sp4">¥<em class="d-wrapl1price">' + alldata1[i].Fare + '</em></span> </li><li class="d-wrapl2"><span class="d-wrapl2-sp1">' + alldata1[i].FromAirport + '</span><span class="d-wrapl2-sp2">' + alldata1[i].ToAirport + '</span></li><li class="d-wrapl3"> <span class="d-wrapl3-sp1">' + alldata1[i].CarrierAbb + alldata1[i].Carrier + alldata1[i].FlightNo + '</span><span class="d-wrapl3-sp2">' + alldata1[i].Model + '</span></li></ul>';
	        }

	        return strs;
	    } else {
	        return '没有找到航班！';
	    }
	}

	// 获取所有的航空公司
	function getAllcp(alldata) {
	    var strcp = [];
	    for (var i = 0; i < alldata.length; i++) {
	        strcp.push(alldata[i].CarrierAbb);
	    }
	    return strcp;
	}
	//数组去重
	function removedata(ar) {
	    var a1 = new Date().getTime();
	    var m = [],
	        f;
	    for (var i = 0; i < ar.length; i++) {
	        f = true;
	        for (var j = 0; j < m.length; j++) {
	            if (ar[i] === m[j]) {
	                f = false;break;
	            }
	        };
	        if (f) m.push(ar[i]);
	    }

	    return m.sort(function (a, b) {
	        return a - b;
	    });
	}
	//加载筛选项 公司
	function pullCp(dataCp) {
	    var str1 = '<li ><span>不限</span><label class="check_it pickbox-cp1"><input type="radio" value=" "></label></li>';
	    var str2 = '';
	    for (var i = 0; i < dataCp.length; i++) {
	        str2 += '<li><span>' + dataCp[i] + '</span><label class="pickbox-cp2"><input type="checkbox" value=" "></label></li>';
	    }

	    $.qu('.pickbox-cp').innerHTML = str1 + str2;
	}
	//加载筛选项 起落机场
	function fCity(alldata) {
	    var strcp = [];
	    for (var i = 0; i < alldata.length; i++) {
	        strcp.push(alldata[i].FromAirport);
	    }
	    return strcp;
	}
	function toCity(alldata) {
	    var strcp = [];
	    for (var i = 0; i < alldata.length; i++) {
	        strcp.push(alldata[i].ToAirport);
	    }
	    return strcp;
	}

	function detailChange(date) {

	    //对date进行重新组装成yyyy-MM-dd的格式
	    //2014 - 8 - 7
	    try {
	        var tempDate1Arr = date.split("-");
	        date = tempDate1Arr[0] + "";
	        if (tempDate1Arr[1].length == 1) {
	            date += "-0" + tempDate1Arr[1];
	        } else {
	            date += "-" + tempDate1Arr[1];
	        }
	        if (tempDate1Arr[2].length == 1) {
	            date += "-0" + tempDate1Arr[2];
	        } else {
	            date += "-" + tempDate1Arr[2];
	        }
	    } catch (e) {}

	    return date;
	}

	//获取前一天或者后一天的时间
	function getPointedDate(d, dateCount, dataDirect) {
	    // d 2016-12-12
	    Date.prototype.Format = function (formatStr) {
	        var str = formatStr;
	        var Week = ['日', '一', '二', '三', '四', '五', '六'];

	        str = str.replace(/yyyy|YYYY/, this.getFullYear());
	        str = str.replace(/yy|YY/, this.getYear() % 100 > 9 ? (this.getYear() % 100).toString() : '0' + this.getYear() % 100);

	        str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	        str = str.replace(/M/g, this.getMonth() + 1);

	        str = str.replace(/w|W/g, Week[this.getDay()]);

	        str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	        str = str.replace(/d|D/g, this.getDate());

	        str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	        str = str.replace(/h|H/g, this.getHours());
	        str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	        str = str.replace(/m/g, this.getMinutes());

	        str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	        str = str.replace(/s|S/g, this.getSeconds());

	        return str;
	    };

	    var dTime = new Date();

	    var dString = d.split("-");
	    dTime.setFullYear(dString[0], parseInt(dString[1] - 1), dString[2]);
	    if (dataDirect == "+") {
	        dTime.setDate(parseInt(dString[2]) + dateCount);
	    } else if (dataDirect == "-") {
	        dTime.setDate(parseInt(dString[2]) - dateCount);
	    }

	    return dTime.Format("yyyy-MM-dd");
	}

	//获取星期几
	function getWeek(num) {
	    switch (num) {
	        case 0:
	            return "周日";
	        case 1:
	            return "周一";
	        case 2:
	            return "周二";
	        case 3:
	            return "周三";
	        case 4:
	            return "周四";
	        case 5:
	            return "周五";
	        case 6:
	            return "周六";
	    }
	}
	//如果是往返，则需要判断是否日期超出范围
	function checkDateIsOK(nowDate) {
	    var time2 = urlTime1; //返回时间

	    if (nowDate < new Date().Format("yyyy-MM-dd")) {
	        alert("历史机票不可查询");
	        //改变样式
	        $.qu('.detail-tms1d2').style.display = 'none';
	        $.qu('.detail-tms1d1').style.lineHeight = '2.4rem';
	        $.qu('.detail-tms1d1').style.color = '#A6A5A5';
	        $.id('detail-tmbn1').style.color = '#A6A5A5';

	        return false;
	    } else {
	        $.qu('.detail-tms1d2').style.display = 'block';
	        $.qu('.detail-tms1d1').style.lineHeight = '1.9rem';
	        $.qu('.detail-tms1d1').style.color = '#fff';
	        $.id('detail-tmbn1').style.color = '#fff';
	    }
	    if (time2 != "") {
	        //返程的时候用到
	        nowDate = nowDate.replace(/-/g, ""); //现在要查询的时间
	        nowDate = parseInt(nowDate); //转换为数字类型
	        //还在选择去程
	        time2 = time2.replace(/-/g, "");
	        time2 = parseInt(time2);
	        if (time2 < nowDate) {
	            alert("去程时间不能大于返程时间");
	            return false;
	        }
	    }
	    return true;
	}

	//通过现在查询的时间改变顶部的日期
	function changeDateOfTop(date) {
	    //date ='2016-12-12'

	    $.id('detail-m1').innerHTML = '';
	    var yesDay = getPointedDate(date, 1, "-");
	    var nextDay = getPointedDate(date, 1, "+");
	    //$.id('txTime2').setAttribute('data','39302')
	    $.id('detail-tms1').setAttribute('date', yesDay);
	    $.id('detail-tms2').setAttribute('date', nextDay);
	    $.id('detail-tmmai').setAttribute('date', date);
	    $.id('detail-nowdata1').innerHTML = date;
	    var _date = new Date(date);
	    $.id('detail-nowdata2').innerHTML = getWeek(_date.getDay());
	}
	// city1:PEK
	// city2:CKG
	// date:2016-12-12&
	// days :10
	// 获取最低价
	function getLowPrict(date) {
	    $.qu('.lodin-p').style.display = '-webkit-box';
	    //console.log(date)
	    var jsonData = {
	        from: getCityCode(urlFrom),
	        to: getCityCode(urlTo),
	        date: date
	    };
	    myAjaxGetLowprice(jsonData.from, jsonData.to, jsonData.date, '10');
	    function myAjaxGetLowprice(city1, city2, date, days) {

	        var oData2 = '';
	        var xhr = new XMLHttpRequest();
	        xhr.open('get', 'http://121.52.212.39:83/CabinCountSearch/api/LowPriceController/Search.do?from=' + city1 + '&to=' + city2 + '&date=' + date + '&day=' + days, 'true');
	        xhr.send();
	        xhr.onreadystatechange = function () {
	            if (xhr.readyState == 4) {
	                // ajax 响内容解析完成，可以在客户端调用了
	                if (xhr.status == 200) {
	                    //  判断服务器返回的状态 200 表示 正常
	                    $.qu('.lodin-p').style.display = 'none';
	                    oData2 = JSON.parse(xhr.responseText);
	                    //console.log(oData2)

	                    var yesDay = jsonData.date;
	                    var nowDate = getPointedDate(yesDay, 1, "+");
	                    var nextDay = getPointedDate(nowDate, 1, "+");
	                    for (var p in oData2) {
	                        var dateDiv = p.replace(jsonData.from + "_" + jsonData.to + "_", "");
	                        //console.log(dateDiv) // 时间
	                        //console.log(oData2[p]) //价格
	                        if (false) {} // 给日历中加价格
	                        // $("#calendarBox div[data=" + dateDiv + "]").find("font:eq(1)").html("￥" + result[p]);


	                        // //顶部三天价格
	                        if (dateDiv == nowDate) {
	                            $.id('detail-nowdata3').innerHTML = oData2[p];
	                        }
	                        if (dateDiv == yesDay) {
	                            $.id('detail-odldata').innerHTML = oData2[p];
	                        }
	                        if (dateDiv == nextDay) {
	                            $.id('detail-nexdata1').innerHTML = oData2[p];
	                        }
	                    }
	                } else {
	                    alert('出错了，价格查询异常！');
	                }
	            }
	        };
	    }
	}

	//根据三字码取城市
	function getCityName(code) {
	    var citys = eval("(" + getCityObj() + ")").results;
	    for (var i = 0; i < citys.length; i++) {
	        if (citys[i].id.toUpperCase() == code.toUpperCase()) {
	            return citys[i].info;
	        }
	    }
	}

	//根据城市取三字码
	function getCityCode(city) {
	    var citys = eval("(" + getCityObj() + ")").results;
	    for (var i = 0; i < citys.length; i++) {
	        if (citys[i].info.toUpperCase() == city.toUpperCase()) {
	            return citys[i].id;
	            alert(citys[i].id);
	        }
	    }
	}

	function toTOP() {
	    var odP = $.id('date-m');
	    if (odP.scrollTop != 0) {
	        odP.scrollTop = 0; // 返回顶部
	    }
	}

	function getCityObj() {
	    return '{results:[{id:"AKU",value:"Akesu",info:"阿克苏",isHot:"0"},{id:"AAT",value:"Aletai",info:"阿勒泰",isHot:"0"},{id:"AKA",value:"Ankang",info:"安康",isHot:"0"},{id:"AQG",value:"Anqing",info:"安庆",isHot:"0"},{id:"AOG",value:"Anshan",info:"鞍山",isHot:"0"},{id:"AVA",value:"Anshun",info:"安顺",isHot:"0"},{id:"AYN",value:"Anyang",info:"安阳",isHot:"0"},{id:"BSD",value:"Baoshan",info:"保山",isHot:"0"},{id:"BAV",value:"Baotou",info:"包头",isHot:"0"},{id:"BHY",value:"Beihai",info:"北海",isHot:"0"},{id:"PEK",value:"Beijing",info:"北京",isHot:"1"},{id:"BFU",value:"Bengbu",info:"蚌埠",isHot:"0"},{id:"CGQ",value:"Changchun",info:"长春",isHot:"0"},{id:"CGD",value:"Changde",info:"常德",isHot:"0"},{id:"CNI",value:"Changhai",info:"长海",isHot:"0"},{id:"CSX",value:"Changsha",info:"长沙",isHot:"0"},{id:"CIH",value:"Changzhi",info:"长治",isHot:"0"},{id:"CZX",value:"Changzhou",info:"常州",isHot:"0"},{id:"CHG",value:"Chaoyang",info:"朝阳",isHot:"0"},{id:"CCC",value:"Chaozhou",info:"潮州",isHot:"0"},{id:"CTU",value:"Chengdu",info:"成都",isHot:"1"},{id:"CIF",value:"Chifeng",info:"赤峰",isHot:"0"},{id:"CKG",value:"Chongqing",info:"重庆",isHot:"1"},{id:"DLU",value:"Dali",info:"大理",isHot:"0"},{id:"DLC",value:"Dalian",info:"大连",isHot:"1"},{id:"DDG",value:"Dandong",info:"丹东",isHot:"0"},{id:"DAT",value:"Datong",info:"大同",isHot:"0"},{id:"DAX",value:"Daxian",info:"达县",isHot:"0"},{id:"DZU",value:"Dazu",info:"大足",isHot:"0"},{id:"DIQ",value:"Diqing",info:"迪庆",isHot:"0"},{id:"DSN",value:"EERDUOSI",info:"鄂尔多斯",isHot:"0"},{id:"DOY",value:"Dongying",info:"东营",isHot:"0"},{id:"DNH",value:"Dunhuang",info:"敦煌",isHot:"0"},{id:"ENH",value:"Enshi",info:"恩施",isHot:"0"},{id:"FUO",value:"Fuoshan",info:"佛山",isHot:"0"},{id:"FUG",value:"Fuyang",info:"阜阳",isHot:"0"},{id:"FYN",value:"Fuyun",info:"富蕴",isHot:"0"},{id:"FOC",value:"Fuzhou",info:"福州",isHot:"0"},{id:"GYS",value:"Guangyuan",info:"广元",isHot:"0"},{id:"KOW",value:"Ganzhou",info:"赣州",isHot:"0"},{id:"KHH",value:"Gaoxiong",info:"高雄",isHot:"0"},{id:"    Q",value:"Germu",info:"格尔木",isHot:"0"},{id:"GHN",value:"Guanghan",info:"广汉",isHot:"0"},{id:"CAN",value:"Guangzhou",info:"广州",isHot:"1"},{id:"KWL",value:"Guilin",info:"桂林",isHot:"0"},{id:"KWE",value:"Guiyang",info:"贵阳",isHot:"0"},{id:"HRB",value:"Haerbin",info:"哈尔滨",isHot:"0"},{id:"HAK",value:"Haikou",info:"海口",isHot:"0"},{id:"HLD",value:"Hailaer",info:"海拉尔",isHot:"0"},{id:"HMI",value:"Hami",info:"哈密",isHot:"0"},{id:"HGH",value:"Hangzhou",info:"杭州",isHot:"1"},{id:"HZG",value:"Hanzhong",info:"汉中",isHot:"0"},{id:"HFE",value:"Hefei",info:"合肥",isHot:"0"},{id:"HEK",value:"Heihe",info:"黑河",isHot:"0"},{id:"HNY",value:"Hengyang",info:"衡阳",isHot:"0"},{id:"HTN",value:"Hetian",info:"和田",isHot:"0"},{id:"TXN",value:"Huangshan",info:"黄山",isHot:"0"},{id:"HYN",value:"Huangyan",info:"黄岩",isHot:"0"},{id:"HET",value:"Huheht",info:"呼和浩特",isHot:"0"},{id:"HUZ",value:"Huizhou",info:"徽州",isHot:"0"},{id:"JMU",value:"Jiamusi",info:"佳木斯",isHot:"0"},{id:"KNC",value:"Jian",info:"吉安",isHot:"0"},{id:"JGN",value:"Jiayuguan",info:"嘉峪关",isHot:"0"},{id:"JIL",value:"Jilin",info:"吉林",isHot:"0"},{id:"TNA",value:"Jinan",info:"济南",isHot:"0"},{id:"JDZ",value:"Jingdezhen",info:"景德镇",isHot:"0"},{id:"JHG",value:"Jinghong",info:"景洪",isHot:"0"},{id:"JNG",value:"Jining",info:"济宁",isHot:"0"},{id:"JNZ",value:"Jinzhou",info:"锦州",isHot:"0"},{id:"JIU",value:"Jiujiang",info:"九江",isHot:"0"},{id:"CHW",value:"Jiuquan",info:"酒泉",isHot:"0"},{id:"JZH",value:"Jiuzhai    u",info:"九寨沟",isHot:"0"},{id:"KHG",value:"Keshi",info:"喀什",isHot:"0"},{id:"KRY",value:"Kelamayi",info:"克拉玛依",isHot:"0"},{id:"KCA",value:"Kuche",info:"库车",isHot:"0"},{id:"KRL",value:"Kuerle",info:"库尔勒",isHot:"0"},{id:"KMG",value:"Kunming",info:"昆明",isHot:"0"},{id:"LHW",value:"Lanzhou",info:"兰州",isHot:"0"},{id:"LXA",value:"Lasa",info:"拉萨",isHot:"0"},{id:"LIA",value:"Liangping",info:"梁平",isHot:"0"},{id:"LYG",value:"Lianyungang",info:"连云港",isHot:"0"},{id:"LJG",value:"Lijiang",info:"丽江",isHot:"0"},{id:"LXI",value:"Linxi",info:"林西",isHot:"0"},{id:"LYI",value:"Linyi",info:"临沂",isHot:"0"},{id:"LHN",value:"Lishan",info:"梨山",isHot:"0"},{id:"LZH",value:"Liuzhou",info:"柳州",isHot:"0"},{id:"LYA",value:"Luoyang",info:"洛阳",isHot:"0"},{id:"LUZ",value:"Lushan",info:"庐山",isHot:"0"},{id:"LZO",value:"Luzhou",info:"泸州",isHot:"0"},{id:"LUM",value:"Mangshi",info:"芒市",isHot:"0"},{id:"MXZ",value:"Meixian",info:"梅县",isHot:"0"},{id:"MIG",value:"Mianyang",info:"绵阳",isHot:"0"},{id:"MDG",value:"Mudanjiang",info:"牡丹江",isHot:"0"},{id:"KHN",value:"Nanchang",info:"南昌",isHot:"0"},{id:"NAY",value:"NanYuan",info:"北京南苑",isHot:"0"},{id:"NAO",value:"Nanchong",info:"南充",isHot:"0"},{id:"NKG",value:"Nanjing",info:"南京",isHot:"0"},{id:"NNG",value:"Nanning",info:"南宁",isHot:"0"},{id:"NTG",value:"Nantong",info:"南通",isHot:"0"},{id:"NNY",value:"Nanyang",info:"南阳",isHot:"0"},{id:"NGB",value:"Ningbo",info:"宁波",isHot:"0"},{id:"IQM",value:"Qiemo",info:"且末",isHot:"0"},{id:"TAO",value:"Qingdao",info:"青岛",isHot:"1"},{id:"IQN",value:"Qingyang",info:"庆阳",isHot:"0"},{id:"SHP",value:"Qinghuangdao",info:"秦皇岛",isHot:"0"},{id:"NDG",value:"Qiqihar",info:"齐齐哈尔",isHot:"0"},{id:"JJN",value:"Quanzhou",info:"泉州",isHot:"0"},{id:"JUZ",value:"Quzhou",info:"衢州",isHot:"0"},{id:"SYX",value:"Sanya",info:"三亚",isHot:"0"},{id:"SHA",value:"Shanghai",info:"上海",isHot:"1"},{id:"PVG",value:"Pudong",info:"浦东",isHot:"0"},{id:"SXJ",value:"Shanshan",info:"鄯善",isHot:"0"},{id:"SHE",value:"Shenyang",info:"沈阳",isHot:"0"},{id:"SZX",value:"Shenzhen",info:"深圳",isHot:"1"},{id:"SJW",value:"Shijiazhuang",info:"石家庄",isHot:"0"},{id:"SYM",value:"Simao",info:"思茅",isHot:"0"},{id:"SZV",value:"Suzhou",info:"苏州",isHot:"0"},{id:"TCG",value:"Tacheng",info:"塔城",isHot:"0"},{id:"TYN",value:"Taiyuan",info:"太原",isHot:"0"},{id:"TSN",value:"Tianjin",info:"天津",isHot:"1"},{id:"TNH",value:"Tonghua",info:"通化",isHot:"0"},{id:"T    ",value:"Tongliao",info:"通辽",isHot:"0"},{id:"TEN",value:"Tongren",info:"铜仁",isHot:"0"},{id:"WXN",value:"Wanxian",info:"万县",isHot:"0"},{id:"WEF",value:"Weifang",info:"潍坊",isHot:"0"},{id:"WEH",value:"Weihai",info:"威海",isHot:"0"},{id:"WNZ",value:"Wenzhou",info:"温州",isHot:"0"},{id:"WUH",value:"Wuhan",info:"武汉",isHot:"1"},{id:"WHU",value:"Wuhu",info:"芜湖",isHot:"0"},{id:"HLH",value:"Wulanhaote",info:"乌兰浩特",isHot:"0"},{id:"URC",value:"Wulumuqi",info:"乌鲁木齐",isHot:"0"},{id:"WUX",value:"Wuxi",info:"无锡",isHot:"0"},{id:"WUS",value:"Wuyishan",info:"武夷山",isHot:"0"},{id:"WUZ",value:"Wuzhou",info:"梧州",isHot:"0"},{id:"XMN",value:"Xiamen",info:"厦门",isHot:"1"},{id:"XIY",value:"Xian",info:"西安",isHot:"0"},{id:"XFN",value:"Xiangfan",info:"襄樊",isHot:"0"},{id:"XIC",value:"Xichang",info:"西昌",isHot:"0"},{id:"XIL",value:"Xilinhot",info:"锡林浩特",isHot:"0"},{id:"XEN",value:"Xingcheng",info:"兴城",isHot:"0"},{id:"XIN",value:"Xingning",info:"兴宁",isHot:"0"},{id:"XNT",value:"Xingtai",info:"邢台",isHot:"0"},{id:"XNN",value:"Xining",info:"西宁",isHot:"0"},{id:"XUZ",value:"Xuzhou",info:"徐州",isHot:"0"},{id:"ENY",value:"Yanan",info:"延安",isHot:"0"},{id:"YNZ",value:"Yancheng",info:"盐城",isHot:"0"},{id:"YNJ",value:"Yanji",info:"延吉",isHot:"0"},{id:"YNT",value:"Yantai",info:"烟台",isHot:"0"},{id:"YBP",value:"Yibin",info:"宜宾",isHot:"0"},{id:"YIH",value:"Yichang",info:"宜昌",isHot:"0"},{id:"INC",value:"Yinchuan",info:"银川",isHot:"0"},{id:"YIN",value:"Yining",info:"伊宁",isHot:"0"},{id:"YIW",value:"Yiwu",info:"义乌",isHot:"0"},{id:"YUA",value:"Yuanmou",info:"元谋",isHot:"0"},{id:"UYN",value:"Yulin",info:"榆林",isHot:"0"},{id:"DYG",value:"Zhangjiajie",info:"张家界",isHot:"0"},{id:"ZHA",value:"Zhanjiang",info:"湛江",isHot:"0"},{id:"ZAT",value:"Zhaotong",info:"昭通",isHot:"0"},{id:"CGO",value:"Zhengzhou",info:"郑州",isHot:"0"},{id:"DIG",value:"Zhongdian",info:"中甸",isHot:"0"},{id:"HSN",value:"Zhoushan",info:"舟山",isHot:"0"},{id:"ZUH",value:"Zhuhai",info:"珠海",isHot:"0"},{id:"HJJ",value:"Zhijiang",info:"芷江",isHot:"0"},{id:"ZYI",value:"Zunyi",info:"遵义",isHot:"0"},{id:"YUS",value:"Yushu",info:"玉树",isHot:"0"},{id:"LLB",value:"Libo",info:"荔波",isHot:"0"},{id:"LLB",value:"Duyun",info:"都匀",isHot:"0"},{id:"BFJ",value:"Bijie",info:"毕节",isHot:"0"},{id:"KJH",value:"Kaili",info:"凯里",isHot:"0"},{id:"HZH",value:"Liping",info:"黎平",isHot:"0"},{id:"ACX",value:"Xingyi",info:"兴义",isHot:"0"},{id:"NGQ",value:"Ali",info:"阿里",isHot:"0"},{id:"AXF",value:"Alaszq",info:"阿拉善左旗",isHot:"0"},{id:"YIE",value:"Aershan",info:"阿尔山",isHot:"0"},{id:"BPL",value:"Bole",info:"博乐",isHot:"0"},{id:"RLK",value:"Bayannaoer",info:"巴彦淖尔",isHot:"0"},{id:"JUH",value:"Chizhou",info:"池州",isHot:"0"},{id:"DCY",value:"Daocheng",info:"稻城",isHot:"0"},{id:"LUM",value:"Dehong",info:"德宏",isHot:"0"},{id:"EJN",value:"Ejinaqi",info:"额济纳旗",isHot:"0"},{id:"ERL",value:"Erlianhaote",info:"二连浩特",isHot:"0"},{id:"LHK",value:"Guanghua",info:"光化",isHot:"0"},{id:"HIA",value:"Huaian",info:"淮安",isHot:"0"},{id:"HJJ",value:"Huaihua",info:"怀化",isHot:"0"},{id:"JGD",value:"Jiagedaqi",info:"加格达奇",isHot:"0"},{id:"JIC",value:"Jingchang",info:"金昌",isHot:"0"},{id:"JXA",value:"Jixi",info:"鸡西",isHot:"0"},{id:"SWA",value:"Jieyang",info:"揭阳",isHot:"0"},{id:"SYM",value:"Puer",info:"普洱",isHot:"0"},{id:"HPG",value:"Shennongjia",info:"神农架",isHot:"0"},{id:"SHS",value:"Shashi",info:"沙市",isHot:"0"},{id:"TLQ",value:"Tulufan",info:"吐鲁番",isHot:"0"},{id:"TVS",value:"Tangshan",info:"唐山",isHot:"0"},{id:"LDS",value:"Yichun",info:"伊春",isHot:"0"},{id:"YIC",value:"Yichun",info:"宜春",isHot:"0"},{id:"YTY",value:"Yangzhou",info:"扬州",isHot:"0"},{id:"YZY",value:"Zhangye",info:"张掖",isHot:"0"},{id:"ZGN",value:"Zhongshan",info:"中山",isHot:"0"},{id:"JHG",value:"Xishuangbanna",info:"西双版纳",isHot:"0"},{id:"NZH",value:"Manzhouli",info:"满洲里",isHot:"0"},{id:"LLV",value:"Lvliang",info:"吕梁",isHot:"0"},{id:"JGS",value:"Jinggangshan",info:"井冈山",isHot:"0"},{id:"JJN",value:"Jinjiang",info:"晋江",isHot:"0"},{id:"XIY",value:"xianxianyang",info:"西安咸阳",isHot:"0"},{id:"PVG",value:"Shanghaipudong",info:"上海浦东",isHot:"0"}]}';
	}

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "<div id=\"mydetail\">\r\n     <div class=\"lodin\">\r\n          <div id=\"caseBlanche\">\r\n            <div id=\"rond\">\r\n              <div id=\"test\"></div>\r\n            </div>\r\n            <div id=\"load\">\r\n              <p>航班查询中...</p>\r\n            </div>\r\n          </div>\r\n     </div>\r\n     <div class=\"lodin-p\">\r\n          <div id=\"caseBlanche-p\">\r\n            <div id=\"rond-p\">\r\n              <div id=\"test-p\"></div>\r\n            </div>\r\n            <div id=\"load-p\">\r\n              <p>价格查询中...</p>\r\n            </div>\r\n          </div>\r\n     </div>\r\n     <div id=\"detail-t\">\r\n        <span class=\"detail-t1\">\r\n            <img src=\"img/back.bg.png\" alt=\"\">\r\n        </span>\r\n        <div class=\"detailcity\">\r\n            <span class=\"detail-t2\">去:</span>\r\n           <span id=\"detailcity0\"></span>\r\n           <span id=\"detailcity2\">→</span>\r\n           <span id=\"detailcity1\"></span>\r\n        </div>\r\n\r\n     </div>\r\n     <div id=\"detail-tm\">\r\n         <div id=\"detail-tms1\" >\r\n               <div id=\"detail-tmbn1\">\r\n                  <img src=\"img/back.bg.png\" alt=\"\">\r\n               </div>\r\n               <span class=\"detail-tms1d1\">前一天</span>\r\n               <span class=\"detail-tms1d2\">¥<em id=\"detail-odldata\"></em></span>\r\n         </div>\r\n         <div id=\"detail-tmmai\">\r\n               <span class=\"detail-tmmais1\">\r\n                      <img src=\"img/data.png\" alt=\"\">\r\n               </span>\r\n               <span class=\"detail-tmmais2\"><em id=\"detail-nowdata1\"></em></span>\r\n               <span class=\"detail-tmmais3\"><em id=\"detail-nowdata2\"></em></span>\r\n               <span class=\"detail-tmmais4\">¥<em id=\"detail-nowdata3\"></em></span>\r\n               <span class=\"detail-tmmais5\"></span>\r\n         </div>\r\n         <div id=\"detail-tms2\" >\r\n               <span class=\"detail-tms2d1\">后一天</span>\r\n               <span class=\"detail-tms2d2\">¥<em id=\"detail-nexdata1\"></em></span>\r\n               <div id=\"detail-tmbn2\">\r\n                    <img src=\"img/back1.bg.png\" alt=\"\">\r\n               </div>\r\n         </div>\r\n     </div>\r\n     <div id=\"detail-m\">\r\n         <div id=\"detail-m1\">\r\n\r\n         </div>\r\n     </div>\r\n     <div id=\"detail-f\">\r\n        <ul class=\"detail-f-ul\">\r\n          <li id=\"detail-fl1\">\r\n               <div class=\"detail-f-uld\">\r\n                   <img src=\"img/detail-f-bg1.png\" alt=\"\">\r\n               </div>\r\n\r\n              <span class=\"detail-f-ulsp detail-f-ulsp1\">筛选</span>\r\n              <div class=\"detail-f-ulo\"></div>\r\n\r\n          </li>\r\n          <li id=\"detail-fl2\">\r\n               <div class=\"detail-f-uld\">\r\n                   <img src=\"img/detail-f-bg2.png\" alt=\"\">\r\n               </div>\r\n\r\n              <span class=\"detail-f-ulsp detail-f-ulsp2\">时间</span>\r\n               <div class=\"detail-f-ulo2\"></div>\r\n          </li>\r\n          <li id=\"detail-fl3\">\r\n                <div class=\"detail-f-uld\">\r\n                   <img src=\"img/detail-f-bg3.png\" alt=\"\">\r\n                </div>\r\n\r\n              <span class=\"detail-f-ulsp detail-f-ulsp3\">价格</span>\r\n               <div class=\"detail-f-ulo3\"></div>\r\n          </li>\r\n        </ul>\r\n        <div class=\"detail-fl1pick\">\r\n             <ul class=\"detail-fl1pick-h\">\r\n                 <li class=\"fl1pick-h1\"><span id=\"fl1pick-h1s1\" >取消</span></li>\r\n                 <li class=\"fl1pick-h1\"><span id=\"fl1pick-h1s2\" >清空筛选</span></li>\r\n                 <li class=\"fl1pick-h1\"><span id=\"fl1pick-h1s3\" >确定</span></li>\r\n             </ul>\r\n             <div class=\"detail-pickbox\">\r\n                 <ul class=\"pickbox-title\">\r\n                      <li class=\"title-active pickbox-title1 pickbox-title11\">起飞时间</li>\r\n                      <li class=\"pickbox-title1 pickbox-title12\">航空公司</li>\r\n                      <li class=\"pickbox-title1 pickbox-title13\">机型</li>\r\n                      <li class=\"pickbox-title1 pickbox-title14\">机场</li>\r\n                  </ul>\r\n                  <ul class=\"pickbox-mian pickbox-time\">\r\n                      <li >\r\n                          <span>不限</span>\r\n                         <label class=\"check_it pickbox-time1\"><input type=\"radio\" value=\" \"></label>\r\n                      </li>\r\n\r\n                      <li >\r\n                          <span>6:00--12:00</span>\r\n                         <label class=\"pickbox-time2\"><input type=\"checkbox\" value=\" \"></label>\r\n                      </li>\r\n                      <li >\r\n                          <span>12:00--18:00</span>\r\n                          <label class=\"pickbox-time2\" ><input type=\"checkbox\" value=\" \"></label>\r\n                      </li>\r\n                      <li >\r\n                          <span>18:00--24:00</span>\r\n                          <label class=\"pickbox-time2\" ><input type=\"checkbox\" value=\" \"></label>\r\n                      </li>\r\n                  </ul>\r\n                  <ul class=\"pickbox-mian pickbox-cp\">\r\n\r\n                  </ul>\r\n                  <ul class=\"pickbox-mian pickbox-type\">\r\n                     <li >\r\n                         <span>不限</span>\r\n                        <label class=\"check_it pickbox-type1\"><input type=\"radio\" value=\" \"></label>\r\n                     </li>\r\n                     <li>\r\n                         <span>小型机</span>\r\n                         <label class=\"pickbox-type2\"><input type=\"checkbox\" value=\" \"></label>\r\n                     </li>\r\n                     <li >\r\n                         <span>中型机</span>\r\n                         <label class=\" pickbox-type2\"  >\r\n                            <input type=\"checkbox\" value=\" \">\r\n                         </label>\r\n                     </li>\r\n                     <li >\r\n                         <span>大型机</span>\r\n                         <label class=\" pickbox-type2\"  >\r\n                            <input type=\"checkbox\" value=\" \">\r\n                         </label>\r\n                      </li>\r\n                  </ul>\r\n                  <ul class=\"pickbox-mian pickbox-airport\">\r\n\r\n                  </ul>\r\n             </div>\r\n        </div>\r\n     </div>\r\n</div>\r\n"

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	/**
	 * Created by way on 16/9/28.
	 */


	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(18);
	var TTitype = '';
	var pbackt = '';
	var pbackt1 = '';

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/picktime$';
	        this.hash = '/flightmb/picktime';
	        this.title = '幸运抽奖';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.lotteryOpen + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {

	            var nowDate = new Date();
	            var nDt = new Date();
	            pbackt = params.backtime;
	            if (pbackt != '') {
	                pbackt1 = picktimedateChange(pbackt);
	            };

	            var backDate = nowDate;
	            backDate.setDate(backDate.getDate() + 7);
	            returnDate("date-m1", nDt.Format("yyyy"), nDt.Format("MM"), nDt.Format("dd"), 1);
	            var AdayNext = $.qus('.dayNext');
	            // console.log(AdayNext.length)
	            for (var i = 0; i < AdayNext.length; i++) {
	                var _that = AdayNext[i];
	                eClick(_that);
	            }
	            eClick($.qu(".dayNow"));

	            // 返回按钮
	            $.id('dateBack').onclick = function () {
	                $.router.go('#!/flightmb/detail', { cliktype: 3 }, true);
	            };
	        }
	    }]);

	    return _class;
	}();

	//重组时间


	exports.default = _class;
	function picktimedateChange(date) {

	    //对date进行重新组装成yyyy-MM-dd的格式
	    //2014 - 8 - 7
	    try {
	        var tempDate1Arr = date.split("-");
	        date = tempDate1Arr[0] + "";
	        if (tempDate1Arr[1].length == 1) {
	            date += "-0" + tempDate1Arr[1];
	        } else {
	            date += "-" + tempDate1Arr[1];
	        }
	        if (tempDate1Arr[2].length == 1) {
	            date += "-0" + tempDate1Arr[2];
	        } else {
	            date += "-" + tempDate1Arr[2];
	        }
	    } catch (e) {}

	    return date;
	}

	function toTOP() {
	    var odP = $.id('date-m');
	    if (odP.scrollTop != 0) {
	        odP.scrollTop = 0; // 返回顶部
	    }
	}

	Date.prototype.Format = function (formatStr) {
	    var str = formatStr;
	    var Week = ['日', '一', '二', '三', '四', '五', '六'];

	    str = str.replace(/yyyy|YYYY/, this.getFullYear());
	    str = str.replace(/yy|YY/, this.getYear() % 100 > 9 ? (this.getYear() % 100).toString() : '0' + this.getYear() % 100);

	    str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	    str = str.replace(/M/g, this.getMonth() + 1);

	    str = str.replace(/w|W/g, Week[this.getDay()]);

	    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	    str = str.replace(/d|D/g, this.getDate());

	    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	    str = str.replace(/h|H/g, this.getHours());
	    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	    str = str.replace(/m/g, this.getMinutes());

	    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	    str = str.replace(/s|S/g, this.getSeconds());

	    return str;
	};

	function eClick(obj) {
	    obj.onclick = function () {
	        // var selectDate = this.find("font").eq(0).html();
	        var selectDate = $.firstChild(this).innerHTML;
	        //console.log(selectDate)
	        if (selectDate === "今天") {
	            selectDate = nDt.getDate();
	        }
	        var dateCls = $.lastChild(this).innerHTML;
	        var hID = this.parentNode.parentNode.parentNode.id;
	        var dateString = $.nextNode($.firstChild($.firstChild($.id(hID)))).innerHTML;
	        //console.log(dateString)
	        var _date = new Date(dateString.replace(/-/g, "/"));
	        if (dateCls == undefined) {
	            dateCls = getWeek(_date.getDay());
	        }
	        if (selectDate != "") {
	            // $("#emTime").html(dateString);
	            // $("#headerID").hide();
	            // $("#calendarCover").remove();
	            // $("#emTime").next().html("&nbsp" + dateCls);
	            // $("body").scrollTop(0);
	            var Ttime = dateString + '-' + selectDate;
	            var Tprice = dateCls;
	            //console.log(pbackt)
	            // console.log(picktimedateChange(Ttime))
	            if (pbackt == '') {
	                //  点击 带时间 返回
	                $.router.go('#!/flightmb/detail', { cliktype: 2, timetype: TTitype, stime: Ttime, sprice: Tprice }, true);
	                toTOP();
	            } else {
	                if (pbackt1 < picktimedateChange(Ttime)) {
	                    alert('去程日期不能大于返程日期~');
	                } else {
	                    $.router.go('#!/flightmb/detail', { cliktype: 2, timetype: TTitype, stime: Ttime, bt: pbackt, sprice: Tprice }, true);
	                    toTOP();
	                }
	            }
	        }
	    };
	}

	//获取星期几
	function getWeek(num) {
	    switch (num) {
	        case 0:
	            return "周日";
	        case 1:
	            return "周一";
	        case 2:
	            return "周二";
	        case 3:
	            return "周三";
	        case 4:
	            return "周四";
	        case 5:
	            return "周五";
	        case 6:
	            return "周六";
	    }
	}

	//得到五个日历表的方法
	function returnDate(id, nYear, nMonth, nDay, num) {
	    var selectDate = "";
	    // if (num == 1) {
	    //     selectDate = $("#emTime").text();
	    // } else {
	    //     selectDate = $("#backTime").text();
	    // }
	    var year = nYear,
	        month = nMonth;

	    var size = 7;
	    // var calendarBox = "<div id='calendarBox'></div>"
	    // $("#calendarCover").append(calendarBox);
	    var html = '';
	    for (var i = 0; i < size; i++) {
	        html += calendar("calendar" + i, year, month, selectDate, false);
	        //$("#" + id).append(html);
	        month++;
	        if (month == 13) {
	            month = 1;
	            year++;
	        }
	    }
	    $.html($.id(id), html);
	    // $("#headerID").show();
	    // $("#headerID").find("h1").html("选择日期");
	}

	function calendar(id, yy, mm, selectDate, showBtn) {
	    //日历控件id:日历控件组id,yymm,开始的年份/月份,showBtn是否显示前一个月后一个月按钮
	    var year = parseInt(yy) < 1900 ? 1900 : parseInt(yy);
	    year = year > 2030 ? 2030 : year;
	    var month = parseInt(mm, 10) < 1 ? 1 : parseInt(mm, 10);
	    month = month > 12 ? 12 : month;
	    var calendarHTML = "<div class='calendar' id=" + id + " date=" + selectDate + ">" + "<div class='calendar_t'>";
	    if (showBtn) {
	        //显示按钮
	        calendarHTML += "<div class='calendar_t_prev' onclick='changeCalendar(this,-1);'><</div>" + "<div class='calendar_t_day'>" + year + "-" + month + "</div>" + "<div class='calendar_t_next'onclick='changeCalendar(this,1);'>></div>";
	    } else {
	        //无按钮
	        calendarHTML += "<div class='calendar_t_prev'></div>" + "<div class='calendar_t_day'>" + year + "-" + month + "</div>" + "<div class='calendar_t_next'></div>";
	    }
	    calendarHTML += "<div class='clear'></div>" + "</div>" + "<div class='calendar_c'>" + "<div class='calendar_c_week'>" + "<div class='calendar_c_week_day'>日</div>" + "<div class='calendar_c_week_day'>一</div>" + "<div class='calendar_c_week_day'>二</div>" + "<div class='calendar_c_week_day'>三</div>" + "<div class='calendar_c_week_day'>四</div>" + "<div class='calendar_c_week_day'>五</div>" + "<div class='calendar_c_week_day'>六</div>" + "<div class='clear'></div>" + "</div>" + "<div class='calendar_c_box'>";
	    calendarHTML += loadCalendar(year, month, selectDate);
	    calendarHTML += "</div>" + "</div>" + "</div>";
	    return calendarHTML;
	}

	function loadCalendar(year, month, selectDate) {
	    var rc = "";
	    var dateObj = new Date();
	    var nowYear = dateObj.getFullYear(); //年
	    var nowMonth = dateObj.getMonth() + 1; //月
	    var nowDate = dateObj.getDate(); //日
	    var nowDay = dateObj.getDay(); //周几
	    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	    year = year < 1900 ? 1900 : year;
	    year = year > 2030 ? 2030 : year;
	    month = month < 1 ? 1 : month;
	    month = month > 12 ? 12 : month;
	    months[1] = year % 4 == 0 ? 29 : 28; //闰年判断
	    dateObj.setFullYear(year, month - 1, 1);
	    var day1 = dateObj.getDay();
	    for (var i = 0; i < day1; i++) {
	        rc += "<div class='day dayEmpty dayWhite'><font class='thett'></font><font class='thett thett1'></font></div>";
	    }
	    var tomorrow = 0;
	    var afterTomorrow = 0;
	    var minPrice = "¥" + 750;
	    minPrice = "";
	    for (var i = 1; i <= months[month - 1]; i++) {
	        var dateString = year + "-" + month + "-" + i; //当前日历日期
	        {
	            //变成标准的日期格式如：2016-09-09
	            var tempDate1Arr = dateString.split("-");
	            dateString = tempDate1Arr[0] + "";
	            if (tempDate1Arr[1].length == 1) {
	                dateString += "-0" + tempDate1Arr[1];
	            } else {
	                dateString += "-" + tempDate1Arr[1];
	            }
	            if (tempDate1Arr[2].length == 1) {
	                dateString += "-0" + tempDate1Arr[2];
	            } else {
	                dateString += "-" + tempDate1Arr[2];
	            }
	        }

	        if (dateString == selectDate) {
	            if (year == nowYear && month == nowMonth && i == nowDate) {
	                tomorrow = i + 1;
	                rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>今天</font><br/><font class='thett1'>" + minPrice + "</font><font style='display: none;'>今天</font></div>";
	            } else {
	                if (i == tomorrow) {
	                    tomorrow = 0;
	                    afterTomorrow = i + 1;
	                    rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1'>" + minPrice + "</font><font style='display: none;'>明天</font></div>";
	                } else {
	                    if (afterTomorrow == i) {
	                        afterTomorrow = 0;
	                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><fontclass='thett1'>" + minPrice + "</font><font style='display: none;'>后天</font></div>";
	                    } else {
	                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1'>" + minPrice + "</font></div>";
	                    }
	                }
	            }
	        } else {
	            if (year < nowYear) {
	                rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thett'>" + i + "</font><font class='thett1'></font></div>";
	            } else if (year == nowYear) {
	                if (month < nowMonth) {
	                    rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thett'>" + i + "</font><font class='thett1'></font></div>";
	                } else if (month == nowMonth) {
	                    if (i < nowDate) {
	                        rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thett'>" + i + "</font><font class='thett1'></font></div>";
	                    } else if (i == nowDate) {
	                        tomorrow = i + 1;
	                        rc += "<div class='day dayNow';' data=" + dateString + "><font class='thett'>今天</font><br/><font class='thett1' >" + minPrice + "</font><font style='display: none;'>今天</font></div>";
	                    } else {
	                        if (i == tomorrow) {
	                            tomorrow = 0;
	                            afterTomorrow = i + 1;
	                            rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1' >" + minPrice + "</font><font style='display: none;'>明天</font></div>";
	                        } else {
	                            if (afterTomorrow == i) {
	                                afterTomorrow == 0;
	                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1' >" + minPrice + "</font><font style='display: none;'>后天</font></div>";
	                            } else {
	                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1'>" + minPrice + "</font></div>";
	                            }
	                        }
	                    }
	                } else {
	                    rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1' >" + minPrice + "</font></div>";
	                }
	            } else {
	                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font><br/><font class='thett1'>" + minPrice + "</font></div>";
	            }
	        }
	    }
	    rc += "<div class='clear'></div>";
	    return rc;
	}
	// 显示按钮的时候调用
	function changeCalendar(element, meth) {
	    var calendarBox = $(element).parents(".calendar");
	    var date = calendarBox.find(".calendar_t_day").html();
	    var dateArray = date.split("-");
	    var year = parseInt(dateArray[0]);
	    var month = parseInt(dateArray[1]);
	    var selectDate = calendarBox.attr("date");
	    if (meth == -1) {
	        month--;
	        if (month == 0) {
	            month = 12;
	            year--;
	        }
	    } else if (meth == 1) {
	        month++;
	        if (month == 13) {
	            month = 1;
	            year++;
	        }
	    }
	    var calendarHTML = loadCalendar(year, month, selectDate);
	    calendarBox.find(".calendar_t_day").html(year + "-" + month);
	    calendarBox.find(".calendar_c_box").html(calendarHTML);
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "<div id=\"date\">\r\n\t   <div id=\"date-t\">\r\n\t   \t  <a  id='dateBack' href=\"javascript:;\">关闭</a>\r\n\t   </div>\r\n\t   <div id=\"date-m\">\r\n\t   \t    <div id=\"date-m1\"></div>\r\n\t   </div>\r\n</div>\r\n"

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(20);
	var fcity = 'a'; //返回详情页面参数
	var tcity = '';
	var OT = 1;
	var theID = '';
	var theCarrier = ''; //获取改签规则的数据
	var tobookdata1 = {}; // 单程数据→ book
	var backdatapro = ''; // 返程数据包
	var backprtyep = ''; // 判断是否要返程 在返程数据包里
	var myfromData = {}; //  去程需要调转的数据包 需要带回进行返程查找 最后在一起提交
	var fitstData = '';

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/product$';
	        this.hash = '/flightmb/product';
	        this.title = '机票查询';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            // 页面返回
	            $.qu('.product-t1').onclick = function () {
	                $.router.go('#!/flightmb/detail', { cliktype: 3, fscity: fcity }, true);
	            };
	            console.log(params);

	            var prt = params.prot;
	            if (prt == 1) {
	                var prAlldata = params.prData;
	                backdatapro = params.bdata;
	                backprtyep = backdatapro.backtype;
	                console.log(backprtyep);
	                productPulldata(prAlldata);
	            } else if (prt == 3) {
	                console.log(params);
	                var prAlldata = params.prData;
	                fitstData = params.bdata;
	                backprtyep = 3;
	                productPulldata(prAlldata);
	            } else {
	                // 什么都不做
	            }
	        }
	    }]);

	    return _class;
	}();
	//页面填写数据


	exports.default = _class;
	function productPulldata(prAlldata) {

	    $.id('productcity0').innerHTML = prAlldata.RouteFrom;
	    $.id('productcity1').innerHTML = prAlldata.RouteTo;
	    $.id('ptime').innerHTML = prAlldata.prDate;
	    $.id('pwen').innerHTML = prAlldata.prWen;
	    $.qu('.phw-ml1sp1').innerHTML = prAlldata.FlyTime;
	    $.qu('.phw-ml1sp2').innerHTML = prAlldata.arrtime;
	    $.qu('.phw-ml3sp1').innerHTML = prAlldata.fromairport;
	    $.qu('.phw-ml31sp2').innerHTML = prAlldata.toairport;
	    $.id('pc').innerHTML = prAlldata.carrierabb;
	    $.id('plane').innerHTML = prAlldata.model; //bdata


	    theCarrier = prAlldata.theCarrier;

	    theID = prAlldata.pulId;
	    tobookdata1 = { // 单程 主要数据 不包含价格
	        data1: prAlldata.prDate,
	        pc: prAlldata.carrierabb1,
	        pcnum: prAlldata.carrierabb2,
	        ftime: prAlldata.FlyTime,
	        fplace: prAlldata.RouteFrom + prAlldata.fromairport,
	        ttime: prAlldata.arrtime,
	        tplace: prAlldata.RouteTo + prAlldata.toairport,
	        ZYtype: prAlldata.ZYtype,
	        theCarrier1: prAlldata.theCarrier,
	        Discount: prAlldata.Discount,
	        YPrice: prAlldata.YPrice,
	        RouteFromCode: prAlldata.RouteFromCode,
	        RouteToCode: prAlldata.RouteToCode,
	        Lmodel: prAlldata.Lmodel,
	        Cabin1: prAlldata.Cabin,
	        Terminal: prAlldata.Terminal
	    };
	    myAjaxGetLowprice(theID);
	}

	function myAjaxGetLowprice(theID) {
	    var param = {
	        "act": "SearchByCabinFlagJson",
	        "cabinFlag": theID
	    };
	    var oData2 = '';

	    var xhr = new XMLHttpRequest();
	    //xhr.open('get','http://222.180.162.217:8015/icbc/ajax.aspx?act=SearchByCabinFlagJson&cabinFlag=9df80423-3fd4-4421-935b-5c9a6d678340','false');
	    xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=' + param.act + '&cabinFlag=' + param.cabinFlag, 'false');

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                oData2 = JSON.parse(xhr.responseText);
	                //oData2 = xhr.responseText;
	                console.log(oData2);
	                $.qu('.pro-main-wrap').innerHTML = '';
	                $.qu('.pro-main-wrap').innerHTML = proPulldata(oData2);
	                getjiad();
	                ptoMybook();
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}
	//预订函数
	function ptoMybook() {
	    $.each($.qus('.promiandata-l3'), function () {
	        this.onclick = function () {
	            tobookdata1.pice1 = this.getAttribute('proprice'); // 添加价格
	            tobookdata1.theCa = this.getAttribute('seachprice'); // 添加查询价格 必备参数
	            tobookdata1.CabinType = this.getAttribute('cabinType'); // 判断是否是直营
	            tobookdata1.InsureType = this.getAttribute('insureType'); // 保险类型
	            console.log(tobookdata1);
	            myfromData = tobookdata1; // 去程数据打包
	            // backprtyep  值 为1 或者2  2为往返

	            if (backprtyep == 1) {
	                // 单程直接进入预定界面
	                $.router.go('#!/flightmb/book', { pbtype: 3, ptbdata1: tobookdata1, ptbdata2: '' }, true);
	            } else if (backprtyep == 2) {
	                // 返回查找返程航班
	                $.router.go('#!/flightmb/detail', { cliktype: 4, ptbdata1: myfromData, searchbdata: backdatapro }, true);
	            } else if (backprtyep == 3) {
	                $.router.go('#!/flightmb/book', { pbtype: 3, ptbdata1: tobookdata1, ptbdata2: fitstData }, true);
	            }
	        };
	    });
	}

	function proPulldata(data) {
	    var str = '';
	    for (var i = 0; i < data.length; i++) {
	        str += '<ul class="promiandata"><li class="promiandata-l1" ><strong  class="thecabin">' + data[i].CabinLevel + '</strong><span class="themore">红包</span><span class="prprice">￥<strong  class="theprice">' + data[i].Fare + '</strong></span></li><li class="promiandata-l2"><span class="changepage" data="' + data[i].Cabin + '" prPRice="' + data[i].Fare + '" CabinLevel="' + data[i].CabinLevel + '">改签规则</span><span class="numticks"><em class="prnum">' + data[i].CbCount + '</em>张<em class="prmove prmove' + (i + 1) + '">+</em></span></li><li class="promiandata-l3" proprice ="' + data[i].Fare + '" seachprice="' + data[i].Cabin + '" CabinType="' + data[i].CabinType + '" InsureType="' + data[i].InsureType + '" ><strong>预订</strong></li></ul>';
	    }

	    return str;
	}
	function changeticket() {
	    var mychangepages = $.qus('.changepage');
	    for (var i = 0; i < mychangepages.length; i++) {
	        this.onclick = function () {};
	    }
	}
	function getChangeData() {
	    var changes = $.qus('.changepage');
	    for (var i = 0; i < changes.length; i++) {

	        changes[i].onclick = function () {
	            var dt1 = this.getAttribute('data');
	            var dt2 = $.nextNode(this).innerHTML;
	            //$.qu('.numticks1').innerHTML =dt2;
	            $.qu('.changepagbox-price-sp3').innerHTML = this.getAttribute('cabinlevel');
	            $.qu('.x-price-sp11').innerHTML = this.getAttribute('prprice');

	            $.qu('.changepagbox').style.display = 'block';
	            myAjaxChange(theCarrier, dt1);
	        };
	    }
	    $.qu('.changepagbox-close').onclick = function () {
	        $.qu('.changepagbox').style.display = 'none';
	        // $.qu('.numticks1').innerHTML ='';

	    };
	}
	function myAjaxChange(carrier, seat) {
	    //console.log(carrier+seat)
	    var oData2 = '';
	    var xhr = new XMLHttpRequest();
	    xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier=' + carrier + '&seat=' + seat + '&reqPath=utlsiteservice.aspx', 'false');
	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                if (xhr.responseText != '') {
	                    oData2 = eval(xhr.responseText);
	                    $.qu('.changetex1').innerHTML = oData2[0].EndorseNotice;
	                    $.qu('.changetex2').innerHTML = oData2[0].UpNotice;
	                    $.qu('.changetex3').innerHTML = oData2[0].RefundNotice;
	                } else {
	                    $.qu('.changetex1').innerHTML = '退改签规则以航空公司最新规则为准';
	                    $.qu('.changetex2').innerHTML = '退改签规则以航空公司最新规则为准';
	                    $.qu('.changetex3').innerHTML = '退改签规则以航空公司最新规则为准';
	                }
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}
	function getjiad() {
	    var thenums = $.qus('.prnum');
	    //console.log(thenums.length)
	    for (var i = 0; i < thenums.length; i++) {

	        if (thenums[i].innerHTML == 'A') {
	            thenums[i].innerHTML = '9';
	        } else {
	            $.qu('.prmove' + (i + 1)).style.display = 'none';
	        }
	    };
	    getChangeData();
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "\n\n<div id=\"myproduct\">\n\n        <div id=\"product-t\">\n           <span class=\"product-t1\"><img src=\"img/back.bg.png\" alt=\"\"></span>\n           <div class=\"productcity\">\n               <span class=\"product-t2\">去:</span>\n              <span id=\"productcity0\"></span>\n              <span id=\"productcity2\">→</span>\n              <span id=\"productcity1\"></span>\n           </div>\n        </div>\n        <div class=\"product-h\">\n             <div class=\"product-hwrap\">\n                    <div class=\"phw-t\">\n                        <span class=\"phw-tsp1\" ><em id=\"ptime\" ></em> <em id=\"pwen\"></em> <em id=\"pH1\">1</em>H<em id=\"pH2\">26</em>m</span>\n\n                    </div>\n                    <ul class=\"phw-m\">\n                        <li class=\"phw-ml1\">\n                            <span class=\"phw-ml1sp1\"></span>\n                            <span class=\"phw-ml1sp2\"></span>\n                        </li >\n                        <li class=\"phw-ml2\"><img src=\"img/to.bg.png\" alt=\"\"></li>\n                        <li class=\"phw-ml3\">\n                            <span class=\"phw-ml3sp1\"></span>\n                            <span class=\"phw-ml31sp2\"></span>\n                        </li >\n                        <li class=\"phw-ml4\">\n                             <span class=\"phw-ml4sp1\"><em id=\"pc\"></em> | <em id=\"plane\"></em></span>\n                        </li>\n                        <li class=\"theJT\"><span>经停</span></li>\n                    </ul>\n             </div>\n        </div>\n        <div id=\"pro-main\">\n            <div class=\"pro-main-wrap\">\n\n\n            </div>\n\n\n        </div>\n        <div class=\"changepagbox\" >\n            <div class=\"changepagbox-wrap\">\n                 <div class=\"changepagbox-t\">\n                    <strong >改签说明</strong>\n                    <img class=\"changepagbox-close\" src=\"img/close.bg.png\" alt=\"\">\n                 </div>\n                 <ul class=\"changepagbox-text\">\n                    <li>\n                        <strong>签转规定:</strong>\n                        <span class=\"changetex1\">不允许</span>\n                    </li>\n                    <li>\n                         <strong>改期规定:</strong>\n                         <span class=\"changetex2\">起飞前（含）收取票面价10%的改期费；起飞后收取票面价20%的改期费；涉及升舱，则改签费和升舱费需同时收取</span>\n                    </li>\n                    <li>\n                         <strong>退票规定:</strong>\n                         <span class=\"changetex3\">起飞前（含）收取票面价20%的退票费；起飞后收取票面价30%的退票费</span>\n                    </li>\n                 </ul>\n                 <strong  class=\"changepagbox-p\">退改签规则以航空公司最新规则为准</strong>\n                 <div class=\"changepagbox-price\">\n\n                        <span class=\"changepagbox-price-sp1\"><em>￥</em><em class=\"x-price-sp11\">570</em></span>\n                        <!-- <span class=\"numticks numticks1\"></span> -->\n                        <span  class=\"changepagbox-price-sp3\">经济舱</span>\n                        <span  class=\"thebookBtton\">预订</span>\n                 </div>\n            </div>\n        </div>\n\n\n</div>\n"

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(22);
	// var fcity = 'a';
	// var tcity ='';
	// var OT = 1;
	// var theID ='';
	// var theCarrier=''; //获取改签规则的数据


	var _class = function () {
	  function _class(opt) {
	    _classCallCheck(this, _class);

	    this.path = '/flightmb/allmytickes$';
	    this.hash = '/flightmb/allmytickes';
	    this.title = '机票查询';

	    opt = opt || {};
	    this.path = opt.path || this.path;
	    this.hash = opt.hash || this.hash;
	    this.title = opt.title || this.title;
	  }

	  // 输出视图


	  _createClass(_class, [{
	    key: 'view',
	    value: function view(cb) {
	      if (!_view) {
	        // 静态资源浏览器有缓存,增加时标,强制刷新!
	        (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	          _view = rs;
	          cb(null, _view);
	        });
	      } else {
	        cb(null, _view);
	      }
	    }

	    // 在已经加载的视图上操作

	  }, {
	    key: 'bind',
	    value: function bind(dv, params) {
	      $.qu('.tab-item1').onclick = function () {
	        $.router.go('#!/flightmb/join', {}, true);
	        $.qu('.thephone1').style.display = 'none';
	      };
	      $.qu('.tab-item3').onclick = function () {

	        $.qu('.thephone1').style.display = '-webkit-box';
	      };
	      $.qu('.thephone-sp11').onclick = function () {
	        $.qu('.thephone1').style.display = 'none';
	      };
	      $.qu('.allmytickes-m11').onclick = function () {
	        $.router.go('#!/flightmb/passenger', { btype: 2 }, true);
	      };
	      $.qu('.allmytickes-m12').onclick = function () {
	        $.router.go('#!/flightmb/mychalinkp', {}, true);
	      };
	    }
	  }]);

	  return _class;
	}();

	exports.default = _class;


	function myAjaxGetLowprice(theID) {
	  var param = {
	    "act": "SearchByCabinFlagJson",
	    "cabinFlag": theID
	  };
	  var oData2 = '';

	  var xhr = new XMLHttpRequest();
	  //xhr.open('get','http://222.180.162.217:8015/icbc/ajax.aspx?act=SearchByCabinFlagJson&cabinFlag=9df80423-3fd4-4421-935b-5c9a6d678340','false');
	  xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=' + param.act + '&cabinFlag=' + param.cabinFlag, 'false');

	  xhr.send();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState == 4) {
	      // ajax 响内容解析完成，可以在客户端调用了
	      if (xhr.status == 200) {
	        //  判断服务器返回的状态 200 表示 正常
	        oData2 = JSON.parse(xhr.responseText);
	        //oData2 = xhr.responseText;
	        console.log(oData2);
	        $.qu('.pro-main-wrap').innerHTML = '';
	        $.qu('.pro-main-wrap').innerHTML = proPulldata(oData2);
	        getjiad();
	      } else {
	        alert('出错了，Err' + xhr.status);
	      }
	    }
	  };
	}

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "<div id=\"allmytickes\">\n      <div class=\"thephone1\">\n          <div class=\"thephone-wrap1\">\n              <p><span>客服电话：</span><a href=\"tel:18325078979\">18325078979</a></p>\n              <p><span>客服电话：</span><a href=\"tel:4000662188\">4000662188</a></p>\n              <p><span>客服电话：</span><a href=\"tel:18325078979\">18325078979</a></p>\n              <span class=\"thephone-sp11\">确定</span>\n          </div>\n\n      </div>\n      <div class=\"allmytickes-t\">\n          <span class=\"allmytickes-tt2\">我的机票</span>\n      </div>\n      <div class=\"allmytickes-m1 allmytickes-m10\"><span>机票订单</span><img src=\"img/right.png\" alt=\"\"></div>\n      <div class=\"allmytickes-m1 allmytickes-m11\"><span>常用乘机人</span><img src=\"img/right.png\" alt=\"\"></div>\n      <div class=\"allmytickes-m1 allmytickes-m12\"><span>常用联系人</span><img src=\"img/right.png\" alt=\"\"></div>\n      <div class=\"allmytickes-m1 allmytickes-m13\"><span>常用地址</span><img src=\"img/right.png\" alt=\"\"></div>\n\n      <span class=\"allmytickes-sb\">退出登录</span>\n      <nav class=\"bar bar-tab\">\n          <strong class=\"tab-item  tab-item1 \" >\n               <span class=\"tab-label1\">机票查询</span>\n          </strong>\n          <strong class=\"tab-item  tab-item2 active \" >\n               <span class=\"tab-label2\">我的机票</span>\n          </strong>\n          <strong class=\"tab-item tab-item3 \" >\n               <span class=\"tab-label3\">联系客服</span>\n          </strong>\n      </nav>\n\n</div>\n"

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(24);

	var bte = 2;

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/passenger$';
	        this.hash = '/flightmb/passenger';
	        this.title = '机票查询';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            bte = params.btype;
	            if (bte == 1) {
	                //  返回上一页
	                $.qu('.passenger-tt1').onclick = function () {
	                    $.router.go('#!/flightmb/book', {}, true);
	                };
	            } else {
	                $.qu('.passenger-tt1').onclick = function () {
	                    $.router.go('#!/flightmb/allmytickes', {}, true);
	                };
	            }
	            // 乘机人数据加载
	            pullPassData();
	            // 初始点击事件
	            theClick();
	            // 带数据返回预定界面
	            addthePeople();
	        }
	    }]);

	    return _class;
	}();
	//借口模板


	exports.default = _class;
	function myAjaxGetLowprice(theID) {
	    var param = {
	        "act": "SearchByCabinFlagJson",
	        "cabinFlag": theID
	    };
	    var oData2 = '';

	    var xhr = new XMLHttpRequest();
	    //xhr.open('get','http://222.180.162.217:8015/icbc/ajax.aspx?act=SearchByCabinFlagJson&cabinFlag=9df80423-3fd4-4421-935b-5c9a6d678340','false');
	    xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=' + param.act + '&cabinFlag=' + param.cabinFlag, 'false');

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                oData2 = JSON.parse(xhr.responseText);
	                //oData2 = xhr.responseText;
	                console.log(oData2);
	                $.qu('.pro-main-wrap').innerHTML = '';
	                $.qu('.pro-main-wrap').innerHTML = proPulldata(oData2);
	                getjiad();
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}
	//  初始点击事件
	function theClick() {
	    //删除弹层
	    $.each($.qus('.mianpger-boxbtn1'), function () {
	        this.onclick = function (e) {
	            var that = this;
	            //弹层
	            $.qu('.mianpger-boxbtn1lay').style.display = '-webkit-box';
	            $.qu('.boxbtn1lay-boxsp1').onclick = function () {
	                that.parentNode.style.display = 'none';
	                $.qu('.mianpger-boxbtn1lay').style.display = 'none';
	            };
	            $.qu('.boxbtn1lay-boxsp2').onclick = function () {
	                $.qu('.mianpger-boxbtn1lay').style.display = 'none';
	            };

	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    });
	    //修改乘机人
	    $.each($.qus('.mianpger-boxbtn2'), function () {
	        var _that = this;
	        _that.onclick = function (e) {
	            var passdata = {
	                name: _that.getAttribute('name'),
	                card: _that.getAttribute('card'),
	                nb: _that.getAttribute('nb'),
	                ftype: _that.getAttribute('ftype'),
	                fnumber: _that.getAttribute('fnumber')
	            };

	            $.router.go('#!/flightmb/changepassenger', { type: 2, linktype: bte, pda: passdata }, true);
	            var e = e || window.e;
	            e.stopPropagation();
	        };
	    });
	    // 新增加乘机人
	    $.qu('.addpger').onclick = function () {
	        $.router.go('#!/flightmb/changepassenger', { type: 1, linktype: bte }, true);
	    };
	}

	//选择乘机人
	function addthePeople() {
	    $.each($.qus('.mianpger-box'), function () {
	        this.onclick = function () {

	            var odat = {
	                pnamep: $.firstChild($.firstChild(this)).innerHTML,
	                cardNump: $.firstChild($.nextNode($.firstChild(this))).innerHTML,
	                nump: $.lastChild($.nextNode($.firstChild(this))).innerHTML
	            };
	            if (bte == 1) {
	                //  返回上一页
	                $.router.go('#!/flightmb/book', { pbtype: 1, pdata: odat }, true);
	            } else {
	                // $.router.go('#!/flightmb/allmytickes',{},true)
	            }
	        };
	    });
	}

	// 乘机人数据加载
	function pullPassData() {
	    var psData = [{ name: '神龙教主(成人)', card: '身份证', nb: '500233198911175467', ftype: '电话号', fnumber: '13888888888' }, { name: '东方不败(成人)', card: '军官证', nb: '500233198911175456', ftype: '电话号', fnumber: '13888888890' }, { name: '独孤求败(成人)', card: '驾照', nb: '500233198911175217', ftype: '电话号', fnumber: '13888884567' }, { name: '令狐冲(儿童)', card: '护照', nb: '500233198911175499', ftype: '电话号', fnumber: '88813885678' }, { name: '风清扬(成人)', card: '身份证', nb: '500233198911175890', ftype: '电话号', fnumber: '1388881234221' }];

	    var str = '';
	    for (var i = 0; i < psData.length; i++) {
	        str += '<div class="mianpger-box"><p><span class="mianpger-name">' + psData[i].name + '</span></p>' + '<p><span class="mianpger-card">' + psData[i].card + '</span><span class="mianpger-num">' + psData[i].nb + '</span></p>' + '<p><span class="mianpger-ph">' + psData[i].ftype + '</span><span class="mianpger-phnum">' + psData[i].fnumber + '</span></p>' + '<span class="mianpger-boxbtn1">删除</span>' + '<span class="mianpger-boxbtn2" name="' + psData[i].name + '"  card="' + psData[i].card + '"  nb="' + psData[i].nb + '"  ftype ="' + i + '"  fnumber="' + psData[i].fnumber + '"  >修改</span></div>';
	    }

	    $.qu('.pger-wrap').innerHTML = str;
	}
	var myTime = new Date();
	var iMin = myTime.getMinutes();
	if (iMin < 10) {
	    iMin = '0' + iMin;
	}

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = "\n\n<div id=\"passenger\">\n      <div class=\"passenger-t\">\n          <span class=\"passenger-tt1\"><img src=\"img/back.bg.png\" alt=\"\"></span>\n          <span class=\"passenger-tt2\">常用乘机人</span>\n      </div>\n      <div class=\"searpger\">\n            <input class=\"searpger-te\" type=\"text\" placeholder=\"搜索乘机人\">\n            <span class=\"searpger-bn\">搜索</span>\n\n      </div>\n       <div class=\"addpger\">\n            + 新增加乘机人\n       </div>\n       <div class=\"mianpger-boxbtn1lay\">\n           <div class=\"mia-boxbtn1lay-box\">\n              <p class=\"boxbtn1lay-boxp1\">删除该乘机人信息？</p>\n              <span class=\"boxbtn1lay-boxsp1\">确定</span>\n              <span class=\"boxbtn1lay-boxsp2\">取消</span>\n           </div>\n       </div>\n       <div class=\"mianpger\">\n           <div class=\"pger-wrap\">\n\n           </div>\n\n       </div>\n</div>\n"

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(26);

	var mylinktype = '';
	var theindex = ''; // 存放 待修改的数据索引

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/changepassenger$';
	        this.hash = '/flightmb/changepassenger';
	        this.title = '机票查询';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {

	            var mytype = params.type;
	            mylinktype = params.linktype;
	            if (mytype == 1) {
	                $.qu('.chpassenger-tt2').innerHTML = '新增加乘机人';
	                // 让成人筛选变红
	                $.qu('.chpassenger-o1').style.background = 'red';
	                $.qu('.chpassenger-o1').setAttribute('CO', 'red');
	                $.qu('.chpassenger-o12').setAttribute('CO', 'AC');
	                $.qu('.chpassenger-o12').style.background = '#ACA8A8';
	                // 清空数据
	                $.qu('.chname').value = '';
	                $.qu('.chpassenger-myse').value = '身份证';
	                $.qu('.nbT').value = '';
	                $.qu('.fnumberT').value = '';
	            } else if (mytype == 2) {
	                $.qu('.chpassenger-tt2').innerHTML = '修改乘机人';
	                console.log(params.pda);
	                thechangepa(params.pda); //  添加 要修改的数据
	                theindex = params.pda.ftype;
	            }

	            // 页面返回
	            $.qu('.chpassenger-tt1').onclick = function () {
	                $.router.go('#!/flightmb/passenger', { btype: mylinktype }, true);
	            };
	            $.qu('.chpassenger-o1').onclick = function () {
	                if (this.getAttribute('CO') == 'red') {} else {
	                    this.style.background = 'red';
	                    this.setAttribute('CO', 'red1');
	                    $.qu('.chpassenger-o12').setAttribute('CO', 'AC');
	                    $.qu('.chpassenger-o12').style.background = '#ACA8A8';
	                }
	            };
	            $.qu('.chpassenger-o12').onclick = function () {
	                if (this.getAttribute('CO') == 'AC') {
	                    this.style.background = 'red';
	                    $.qu('.chpassenger-o1').style.background = '#ACA8A8';
	                    $.qu('.chpassenger-o1').setAttribute('CO', 'red1');
	                }
	            };
	            addpeople(); //确认修改

	        }
	    }]);

	    return _class;
	}();
	// 服务器 加载数据 模板


	exports.default = _class;
	function myAjaxGetLowprice(theID) {
	    var param = {
	        "act": "SearchByCabinFlagJson",
	        "cabinFlag": theID
	    };
	    var oData2 = '';

	    var xhr = new XMLHttpRequest();
	    //xhr.open('get','http://222.180.162.217:8015/icbc/ajax.aspx?act=SearchByCabinFlagJson&cabinFlag=9df80423-3fd4-4421-935b-5c9a6d678340','false');
	    xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=' + param.act + '&cabinFlag=' + param.cabinFlag, 'false');

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                oData2 = JSON.parse(xhr.responseText);
	                //oData2 = xhr.responseText;
	                console.log(oData2);
	                $.qu('.pro-main-wrap').innerHTML = '';
	                $.qu('.pro-main-wrap').innerHTML = proPulldata(oData2);
	                getjiad();
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}

	// 修改数据添加
	function thechangepa(data) {
	    var pname = data.name;
	    var nametype = pname.substring(pname.length - 3, pname.length - 1);
	    if (nametype == '儿童') {
	        $.qu('.chpassenger-o1').style.background = '#ACA8A8';
	        $.qu('.chpassenger-o1').setAttribute('CO', 'red1');
	        $.qu('.chpassenger-o12').setAttribute('CO', 'AC');
	        $.qu('.chpassenger-o12').style.background = 'red';
	    } else {
	        $.qu('.chpassenger-o1').style.background = 'red';
	        $.qu('.chpassenger-o1').setAttribute('CO', 'red');
	        $.qu('.chpassenger-o12').setAttribute('CO', 'AC');
	        $.qu('.chpassenger-o12').style.background = '#ACA8A8';
	    }
	    var pcard = data.card;
	    var pnb = data.nb;
	    var pfnumber = data.fnumber;
	    $.qu('.chname').value = pname.substring(0, pname.length - 4);
	    $.qu('.chpassenger-myse').value = pcard;
	    $.qu('.nbT').value = pnb;
	    $.qu('.fnumberT').value = pfnumber;
	}

	function addpeople() {

	    $.qu('.chpassenger-sb').onclick = function () {
	        var todata = {
	            name: $.qu('.chname').value,
	            card: $.qu('.chpassenger-myse').value,
	            nb: $.qu('.nbT').value,
	            pfnumber: $.qu('.fnumberT').value,
	            ftype: theindex
	        };
	        console.log(todata);
	    };
	}

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = "\n\n<div id=\"chpassenger\">\n      <div class=\"chpassenger-t\">\n          <span class=\"chpassenger-tt1\"><img src=\"img/back.bg.png\" alt=\"\"></span>\n          <span class=\"chpassenger-tt2\">修改常用乘机人</span>\n      </div>\n      <ul class=\"chpassenger-main\">\n            <li class=\"chpassenger-mainl1\"><span>成人(12岁以上)</span><strong class=\"chpassenger-o1\" CO='red'><span class=\"chpassenger-o2\"></span></strong></li>\n            <li class=\"chpassenger-mainl1\"><span>儿童(2-12)</span><strong class=\"chpassenger-o12\" CO='AC'><span class=\"chpassenger-o22\"></span></strong></li>\n            <li><span class=\"chpassenger-main-sp\">姓名</span><input  type=\"text\" class=\"chname\" placeholder=\"输入姓名\"></li>\n            <li>\n            <span class=\"chpassenger-main-sp\">证件类型</span>\n            <select class=\"chpassenger-myse\">\n               <option value =\"身份证\">身份证</option>\n               <option value =\"军官证\">军官证</option>\n               <option value=\"护照\">护照</option>\n               <option value=\"驾照\">驾照</option>\n            </select>\n            </li>\n            <li><span class=\"chpassenger-main-sp\">证件号码</span><input type=\"text\" class=\"nbT\" placeholder=\"输入证件号码\"></li>\n            <li class=\"chpassenger-mainlla\"><span class=\"chpassenger-main-sp \">手机号码</span><input type=\"text\" class=\"fnumberT\" placeholder=\"输入手机号码\"></li>\n      </ul>\n      <span class=\"chpassenger-sb\">确认</span>\n\n</div>\n"

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(28);

	var lint = '';

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/mychalinkp$';
	        this.hash = '/flightmb/mychalinkp';
	        this.title = '机票查询';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            lint = params.btype;

	            // 页面返回
	            $.qu('.chalinkp-tt1').onclick = function () {
	                if (lint == 2) {
	                    $.router.go('#!/flightmb/book', {}, true);
	                } else {
	                    $.router.go('#!/flightmb/allmytickes', {}, true);
	                }
	            };

	            //新增加联系人
	            $.qu('.chalinkp-addpger').onclick = function () {
	                $.router.go('#!/flightmb/changelinkp', { type: 1, linktype: lint }, true);
	            };
	            // 删除
	            $.each($.qus('.chalinkp-boxbtn1'), function () {
	                this.onclick = function (e) {
	                    var that = this;
	                    //弹层
	                    $.qu('.chalinkp-chalinkpt').style.display = '-webkit-box';
	                    $.qu('.chalinkpt-boxsp1').onclick = function () {
	                        that.parentNode.style.display = 'none';
	                        $.qu('.chalinkp-chalinkpt').style.display = 'none';
	                    };
	                    $.qu('.chalinkpt-boxsp2').onclick = function () {
	                        $.qu('.chalinkp-chalinkpt').style.display = 'none';
	                    };
	                    var e = e || window.e;
	                    e.stopPropagation();
	                };
	            });
	            //修改
	            $.each($.qus('.chalinkp-boxbtn2'), function () {
	                this.onclick = function (e) {

	                    console.log('修改');
	                    var e = e || window.e;
	                    e.stopPropagation();
	                };
	            });
	            //带数据返回 chalinkp-box
	            addtheLinkpe();
	        }
	    }]);

	    return _class;
	}();

	exports.default = _class;


	function myAjaxGetLowprice(theID) {
	    var param = {
	        "act": "SearchByCabinFlagJson",
	        "cabinFlag": theID
	    };
	    var oData2 = '';

	    var xhr = new XMLHttpRequest();
	    //xhr.open('get','http://222.180.162.217:8015/icbc/ajax.aspx?act=SearchByCabinFlagJson&cabinFlag=9df80423-3fd4-4421-935b-5c9a6d678340','false');
	    xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=' + param.act + '&cabinFlag=' + param.cabinFlag, 'false');

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                oData2 = JSON.parse(xhr.responseText);
	                //oData2 = xhr.responseText;
	                console.log(oData2);
	                $.qu('.pro-main-wrap').innerHTML = '';
	                $.qu('.pro-main-wrap').innerHTML = proPulldata(oData2);
	                getjiad();
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}
	//增加/更换乘机人
	function addtheLinkpe() {
	    $.each($.qus('.chalinkp-box'), function () {
	        this.onclick = function () {

	            var odalin = {
	                linkname: $.lastChild($.firstChild(this)).innerHTML,
	                linknump: $.lastChild($.nextNode($.firstChild(this))).innerHTML
	            };
	            if (lint == 2) {
	                //  返回上一页
	                $.router.go('#!/flightmb/book', { pbtype: 2, linkdata: odalin }, true);
	            }
	        };
	    });
	}

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = "\n\n\n<div id=\"chalinkp\">\n     <div class=\"chalinkp-t\">\n        <span class=\"chalinkp-tt1\"><img src=\"img/back.bg.png\" alt=\"\"></span>\n        <span class=\"chalinkp-tt2\">常用联系人</span>\n     </div>\n     <div class=\"chalinkp-addpger\">\n            + 新增联系人\n     </div>\n     <div class=\"chalinkp-chalinkpt\">\n         <div class=\"mia-chalinkpt-box\">\n              <p class=\"chalinkpt-boxp1\">删除该联系人信息？</p>\n              <span class=\"chalinkpt-boxsp1\">确定</span>\n              <span class=\"chalinkpt-boxsp2\">取消</span>\n         </div>\n     </div>\n     <div class=\"chalinkp\">\n          <div class=\"chalinkp-wrap\">\n                  <div class=\"chalinkp-box\">\n                        <p><span class=\"chalinkp-card\">姓名：</span></soan><span class=\"chalinkp-name\">鲁道夫</span></p>\n                        <p><span class=\"chalinkp-card\">电话：</span><span class=\"chalinkp-num\">16666666666</span></p>\n                        <p><span class=\"chalinkp-ph\">邮箱：</span><span class=\"chalinkp-phnum\">50505050@qq.com</span></p>\n                          <span class=\"chalinkp-boxbtn1\">删除</span>\n                          <span class=\"chalinkp-boxbtn2\">修改</span>\n                  </div>\n                  <div class=\"chalinkp-box\">\n                        <p><span class=\"chalinkp-card\">姓名：</span></soan><span class=\"chalinkp-name\">雨果</span></p>\n                        <p><span class=\"chalinkp-card\">电话：</span><span class=\"chalinkp-num\">16666666667</span></p>\n                        <p><span class=\"chalinkp-ph\">邮箱：</span><span class=\"chalinkp-phnum\">50505050@qq.com</span></p>\n                          <span class=\"chalinkp-boxbtn1\">删除</span>\n                          <span class=\"chalinkp-boxbtn2\">修改</span>\n                  </div>\n                  <div class=\"chalinkp-box\">\n                        <p><span class=\"chalinkp-card\">姓名：</span></soan><span class=\"chalinkp-name\">莱昂纳多</span></p>\n                        <p><span class=\"chalinkp-card\">电话：</span><span class=\"chalinkp-num\">16666666668</span></p>\n                        <p><span class=\"chalinkp-ph\">邮箱：</span><span class=\"chalinkp-phnum\">50505050@qq.com</span></p>\n                          <span class=\"chalinkp-boxbtn1\">删除</span>\n                          <span class=\"chalinkp-boxbtn2\">修改</span>\n                  </div>\n\n\n          </div>\n\n      </div>\n\n\n\n</div>\n"

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(30);
	var thelinkt = '';

	var _class = function () {
	  function _class(opt) {
	    _classCallCheck(this, _class);

	    this.path = '/flightmb/changelinkp$';
	    this.hash = '/flightmb/changelinkp';
	    this.title = '机票查询';

	    opt = opt || {};
	    this.path = opt.path || this.path;
	    this.hash = opt.hash || this.hash;
	    this.title = opt.title || this.title;
	  }

	  // 输出视图


	  _createClass(_class, [{
	    key: 'view',
	    value: function view(cb) {
	      if (!_view) {
	        // 静态资源浏览器有缓存,增加时标,强制刷新!
	        (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	          _view = rs;
	          cb(null, _view);
	        });
	      } else {
	        cb(null, _view);
	      }
	    }

	    // 在已经加载的视图上操作

	  }, {
	    key: 'bind',
	    value: function bind(dv, params) {

	      var mytype = params.type;
	      thelinkt = params.linktype;
	      if (mytype == 1) {
	        $.qu('.changelinkp-tt2').innerHTML = '新增加乘机人';
	      }

	      // 页面返回
	      $.qu('.changelinkp-tt1').onclick = function () {
	        if (thelinkt == 2) {
	          $.router.go('#!/flightmb/mychalinkp', { btype: 2 }, true);
	        }
	      };
	    }
	  }]);

	  return _class;
	}();

	exports.default = _class;


	function myAjaxGetLowprice(theID) {
	  var param = {
	    "act": "SearchByCabinFlagJson",
	    "cabinFlag": theID
	  };
	  var oData2 = '';

	  var xhr = new XMLHttpRequest();
	  //xhr.open('get','http://222.180.162.217:8015/icbc/ajax.aspx?act=SearchByCabinFlagJson&cabinFlag=9df80423-3fd4-4421-935b-5c9a6d678340','false');
	  xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=' + param.act + '&cabinFlag=' + param.cabinFlag, 'false');

	  xhr.send();
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState == 4) {
	      // ajax 响内容解析完成，可以在客户端调用了
	      if (xhr.status == 200) {
	        //  判断服务器返回的状态 200 表示 正常
	        oData2 = JSON.parse(xhr.responseText);
	        //oData2 = xhr.responseText;
	        console.log(oData2);
	        $.qu('.pro-main-wrap').innerHTML = '';
	        $.qu('.pro-main-wrap').innerHTML = proPulldata(oData2);
	        getjiad();
	      } else {
	        alert('出错了，Err' + xhr.status);
	      }
	    }
	  };
	}

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "\n\n\n<div id=\"changelinkp\">\n     <div class=\"changelinkp-t\">\n        <span class=\"changelinkp-tt1\"><img src=\"img/back.bg.png\" alt=\"\"></span>\n        <span class=\"changelinkp-tt2\">新增常用联系人</span>\n     </div>\n     <ul class=\"changelinkp-main\">\n        <li class=\"changelinkp-main1\" >\n          <div >姓名</div>\n          <input type=\"text\" placeholder=\"输入姓名\" class=\"changelinkp-mainin1\">\n        </li>\n        <li class=\"changelinkp-main1\" >\n          <div >电话</div>\n          <input type=\"text\" placeholder=\"输入电话\" class=\"changelinkp-mainin1\">\n        </li>\n        <li class=\"changelinkp-main1 changelinkp-mainla\" >\n          <div >邮箱</div>\n          <input type=\"text\" placeholder=\"输入邮箱\" class=\"changelinkp-mainin1\">\n        </li>\n\n     </ul>\n\n     <span class=\"changelinkp-sb\">确认</span>\n\n</div>\n"

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by way on 16/9/28.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(5);

	var _view = __webpack_require__(32);
	var fcity = 'a';
	var tcity = '';
	var OT = 1;
	var theID = '';
	var theCarrier = ''; //获取改签规则的数据
	var bookdata1 = {}; // 单程数据包
	var bookdata2 = {}; // 返程数据包

	var onOFFs = true; // 改签开关按钮
	var onOFF = true; // 保险开关按钮
	//var onOFFt =false;// 保险开关按钮
	var onOFFp = true; // 凭证开关
	var ShipFeeOnoff = ''; // 快递费
	var shipMoney = 15; //  收费用的时候为 15 这个价格可以改变
	var insureType = ''; //  保险类型 用于加载保险说明
	var cabinType = ''; // 判断是否是直营
	var onepiect1 = ''; //  单程 或去程票面价格
	var onepiect2 = ''; //  返程程票面价格
	var Fprice = ''; // 单全价 儿童不能往返
	var DS = ''; // 折扣
	var ynum = 0; //  儿童个数
	var onum = 0; // 成人个数
	var odnum = 0; // 老年个数

	var _class = function () {
	    function _class(opt) {
	        _classCallCheck(this, _class);

	        this.path = '/flightmb/book$';
	        this.hash = '/flightmb/book';
	        this.title = '机票查询';

	        opt = opt || {};
	        this.path = opt.path || this.path;
	        this.hash = opt.hash || this.hash;
	        this.title = opt.title || this.title;
	    }

	    // 输出视图


	    _createClass(_class, [{
	        key: 'view',
	        value: function view(cb) {
	            if (!_view) {
	                // 静态资源浏览器有缓存,增加时标,强制刷新!
	                (0, _api.getView)(_config2.default.view.searchJoin + '?t=' + +new Date(), '', function (rs) {
	                    _view = rs;
	                    cb(null, _view);
	                });
	            } else {
	                cb(null, _view);
	            }
	        }

	        // 在已经加载的视图上操作

	    }, {
	        key: 'bind',
	        value: function bind(dv, params) {
	            console.log(params);

	            // 页面返回
	            $.qu('.myBook-tt1').onclick = function () {
	                $.router.go('#!/flightmb/product', { prot: 2 }, true);
	            };
	            if (params.pbtype == 1) {
	                //  判断进入该页面的上一步操作
	                addPass(params.pdata); // 更改乘机人
	                alloneMone();
	            } else if (params.pbtype == 2) {
	                addLinkpe(params.linkdata); // 更改联系人
	            } else if (params.pbtype == 3) {
	                // 单或者双程页面进入
	                bookdata1 = params.ptbdata1;
	                bookdata2 = params.ptbdata2;
	                var Flight = [];

	                if (bookdata1.Discount == '全价') {
	                    DS = 1;
	                } else {
	                    DS = Number(bookdata1.Discount);
	                }
	                console.log(DS);
	                // 获取保险类型，用于后面函数调用
	                insureType = bookdata1.InsureType;
	                cabinType = bookdata1.CabinType; //判断直营


	                if (bookdata2 == '') {
	                    // 单程航班
	                    $.qu('.myBook-flightbox2').style.display = 'none';
	                    $.qu('.flightbox1-text').style.display = 'none';
	                    $.qu('.myBook-mtfsp1').style.lineHeight = '3.2rem';
	                    $.qu('.myBook-mtfsp2').style.lineHeight = '3.2rem';
	                    $.qu('.myBook-mtfsp3').style.lineHeight = '3.2rem';
	                    bookPulldata1(bookdata1);
	                    onepiect1 = bookdata1.pice1;
	                    Fprice = bookdata1.YPrice;
	                } else {
	                    // 往返
	                    $.qu('.myBook-flightbox2').style.display = 'block';
	                    $.qu('.flightbox1-text').style.display = 'block';
	                    $.qu('.myBook-mtfsp1').style.lineHeight = '3.9rem';
	                    $.qu('.myBook-mtfsp2').style.lineHeight = '3.9rem';
	                    $.qu('.myBook-mtfsp3').style.lineHeight = '3.9rem';
	                    bookPulldata1(bookdata2);
	                    bookPulldata2(bookdata1);
	                }
	            }

	            allmyClickbook(); //初始话点击事件
	            // ajax 获取数据并加载
	            getsafeText(insureType);
	            alloneMone(); // 总计价格
	            // 重头戏  提交订单按钮  成人加儿童 和 往返 都提交2次订单
	            $.qu('.allprice2').onclick = function () {

	                if (!onOFFp) {
	                    ShipFeeOnoff = shipMoney;
	                } else {
	                    ShipFeeOnoff = 0;
	                }
	                var Passenger = passengerAlldata(); // 乘客信息数据整合完毕
	                console.log(Passenger);
	                //var Member ={name:'kenrecall1',No:'MFW1611210050159038'}; //会员信息
	                var Contact = contactdata(); //{name:'肖浩',phone:'1388004134'};// 联系人信息
	                console.log(Contact);
	                var ShipAddr = '重庆市沙坪坝区西永白路天街99号(刘谦收)1588004123';
	                pullAlldatatoBook(bookdata1, ShipFeeOnoff, Passenger, Contact, ShipAddr, DS);
	            };
	        }
	    }]);

	    return _class;
	}();

	//页面填写数据


	exports.default = _class;
	function bookPulldata1(bookdata1) {
	    //返程数据
	    myBookChange1(bookdata1.theCarrier1, bookdata1.theCa); //退改签
	    $.qu('.myBook-mtfsp1').innerHTML = bookdata1.data1; //日期
	    $.qu('.myBook-mtfsp2').innerHTML = bookdata1.pc; //公司
	    $.qu('.myBook-mtfsp3').innerHTML = bookdata1.pcnum; //航班编码
	    $.qu('.myBook-mttsp1').innerHTML = bookdata1.ftime; //起飞时间
	    $.qu('.myBook-mttsp11').innerHTML = bookdata1.fplace; //起飞地点
	    $.qu('.myBook-mttsp2').innerHTML = bookdata1.ttime; //降落时间
	    $.qu('.myBook-mttsp22').innerHTML = bookdata1.tplace; //降落地点
	    $.qu('.mttbookprice').innerHTML = bookdata1.pice1; //价格
	}
	function bookPulldata2(bookdata2) {
	    //去程/ 单程数据数据
	    myBookChange1(bookdata2.theCarrier1, bookdata2.theCa); //退改签
	    $.qu('.myBook1-mtfsp1').innerHTML = bookdata2.data1; //日期
	    $.qu('.myBook1-mtfsp2').innerHTML = bookdata2.pc; //公司
	    $.qu('.myBook1-mtfsp3').innerHTML = bookdata2.pcnum; //航班编码
	    $.qu('.myBook1-mttsp1').innerHTML = bookdata2.ftime; //起飞时间
	    $.qu('.myBook1-mttsp11').innerHTML = bookdata2.fplace; //起飞地点
	    $.qu('.myBook1-mttsp2').innerHTML = bookdata2.ttime; //降落时间
	    $.qu('.myBook1-mttsp22').innerHTML = bookdata2.tplace; //降落地点
	    $.qu('.mttbookprice4').innerHTML = bookdata2.pice1; //价格
	}

	// 数据接口模板
	function myAjaxGetLowprice(theID) {
	    var param = {
	        "act": "SearchByCabinFlagJson",
	        "cabinFlag": theID
	    };
	    var oData2 = '';

	    var xhr = new XMLHttpRequest();
	    //xhr.open('get','http://222.180.162.217:8015/icbc/ajax.aspx?act=SearchByCabinFlagJson&cabinFlag=9df80423-3fd4-4421-935b-5c9a6d678340','false');
	    xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=' + param.act + '&cabinFlag=' + param.cabinFlag, 'false');

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                oData2 = JSON.parse(xhr.responseText);
	                //oData2 = xhr.responseText;
	                //console.log(oData2)
	                $.qu('.pro-main-wrap').innerHTML = '';
	                $.qu('.pro-main-wrap').innerHTML = proPulldata(oData2);
	                getjiad();
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}
	// 预定接口数据整合函数 数据量较大
	// bookdata1:航班信息  ShipFeeOnoff:凭证开关 是否收快递费
	// Passenger：乘客信息
	// Member: 会员信息 数组或者json
	// Contact: 联系人消息 数组或者json
	// ShipAddr: 收件人具体地址

	function pullAlldatatoBook(bookdata1, ShipFeeOnoff, Passenger, Contact, ShipAddr, DS) {
	    BookuserOnoff(); // 验证用户 成功则存在本地

	    var mynaeme = localStorage.getItem('NA');
	    var myNo = localStorage.getItem('NO');
	    var Member = {
	        name: mynaeme,
	        No: myNo
	    };
	    var allData = {};
	    var saferule1 = $.qu('.looktext1-changetex3').innerHTML; //退票
	    var saferule2 = $.qu('.looktext1-changetex2').innerHTML; //改期
	    var saferule3 = $.qu('.looktext1-changetex1').innerHTML; //签转
	    var therefundrule = '退票： ' + saferule1 + '改期： ' + saferule2 + '签转：' + saferule3;

	    var cptype = bookdata1.CabinType;
	    var cptype1 = bookdata1.theCarrier1;
	    if (cptype != '6') {
	        cptype1 = 'wap';
	    }
	    var price = Number(bookdata1.YPrice);
	    var fltsStr = '["' + bookdata1.RouteFromCode + '","' + bookdata1.RouteToCode + '","' + bookdata1.pcnum + '","' + bookdata1.Cabin1 + '","' + bookdata1.data1 + '","' + bookdata1.ftime + '","' + bookdata1.ttime + '","' + bookdata1.pice1 + '", "' + 50 + '", "' + 0 + '", ' + price + ',' + DS + ',0,"' + bookdata1.theCa + '","' + bookdata1.Lmodel + '", 0 ,1,"' + bookdata1.Terminal + '", 0,3]';

	    var bookType = 3;
	    var cabinType = bookdata1.CabinType;
	    var priceFrom = 0;
	    var source = cptype1;
	    var hongbao = 0;
	    var refundrule = therefundrule;
	    var shipfee = ShipFeeOnoff;
	    var psg_service_fee = 0;
	    var SupplyID = 0;
	    var passenger = Passenger;

	    var cardNo = Member.No;
	    var memberName = Member.name;
	    var contact_id = '';
	    var name = Contact.name; //  联系人名字
	    var mobile = Contact.phone; // 联系人电话
	    var email = ''; //联系人邮箱
	    var shipType = 4; // 固定写死
	    var shipAddr = ShipAddr; //  收件人具体地址
	    var shipReq = ''; // 固定值写死
	    var UnitNo = '010135.00008006'; // 似乎为这个固定值
	    var TripType = '无'; // 似乎 为固定值 无
	    var TripReason = '无'; // 似乎 为固定值 无
	    var PriceReason = '无'; // 似乎 为固定值 无
	    var TripNote = ''; //  收件人信息里面的 备注？  似乎为固定值 为 空
	    var appnt = []; // 安盛保险？

	    var bkdata = "{'Flight':['" + fltsStr + "'],'BookType':'" + bookType + "','CabinType':'" + cabinType + "','PriceType':'1','PriceFrom':'" + priceFrom + "','source':'" + source + "','HongBao':'" + hongbao + "','RefundRule':'" + refundrule + "','ShipFee':'" + shipfee + "','ServiceFee':'" + psg_service_fee + "','SupplyID':'" + SupplyID + "','Passenger':[" + passenger + "],'CardNo':'" + cardNo + "','MemberName':'" + memberName + "','ContactID':'" + contact_id + "','ContactName':'" + name + "','ContactPhone':'" + mobile + "','Email':'" + email + "','ShipVia':" + shipType + ",'ShipAddr':'" + shipAddr + "','ShipReq':'" + shipReq + "','Notes':'','Price':0,'Rate':0,'Payfee':0,'Insurance':0,'Addfee':0,'Total':0,'Remark':'','Restrictions':'不得签转','UnitNo':'','SubUnitNo':'" + UnitNo + "','TripType':'" + TripType + "','TripReason':'" + TripReason + "','PriceReason':'" + PriceReason + "','TripNote':'" + TripNote + "','Appnt':['" + appnt + "'],'PnrNo':'','PNR':''}";

	    console.log(bkdata);
	    var bk = "bk=" + bkdata;
	    var insuretype = "&insuretype=" + bookdata1.InsureType;
	    var Dire = bookdata1.CabinType == "6" ? bookdata1.theCarrier1 : '';
	    var DirectSale = "&DirectSale=" + Dire;
	    var DSPo = bookdata1.theCarrier1 == 'ZH' ? 'ZH' : '';
	    var DSPolicyID = "&DSPolicyID=" + DSPo;
	    var makeZyOrder = "&makeZyOrder=false";

	    var urldata = bk + insuretype + DirectSale + DSPolicyID + makeZyOrder;
	    console.log(urldata);
	    var oData2 = '';
	    var xhr = new XMLHttpRequest();
	    xhr.open('post', 'http://106.75.131.58:8015/icbc/xhService.ashx', 'false');
	    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=utf-8');
	    xhr.send("isKyReq=1&act=ORDERBOOK&url=''&reqPath=icbc/OrderSumit.aspx&" + urldata);
	    // console.log(isKyReq"=1&act=ORDERBOOK&url=''&reqPath='icbc/OrderSumit.aspx'&" + urldata)
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                console.log(xhr.responseText);
	                console.log(_typeof(xhr.responseText));
	                oData2 = eval('(' + xhr.responseText + ')');
	                console.log(oData2.OrderID);
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}

	// 联系人信息 数据打包函数
	function contactdata() {
	    var cname = $.qu('.linkman2').innerHTML;
	    var cphone = $.qu('.linkman4').innerHTML;
	    return { name: cname, phone: cphone };
	}

	//  passenger 乘客信息 格式处理
	function passengerhtml(data) {
	    var name = data.name;
	    var age = data.age;
	    var card = data.card;
	    var num = data.num;
	    var phone = data.phone;
	    var ptype = age == '成人' ? 1 : 0; //  数字类型 成人1  儿童0
	    var price = data.price; //  价格 成人  儿童
	    var addfee = ptype == 1 ? 50 : 0;
	    return '[0,0,"' + name + '","' + age + '","' + card + '","' + num + '","",' + ptype + ',' + price + ',' + addfee + ',0,"' + phone + '","","",0,0,0,0,0,0,0,"",0]';
	}

	// 乘客信息 筛选函数 打包函数
	function passengerAlldata() {

	    // 乘客信息 分 成人 儿童
	    var allpassenger = $.qus('.myBook-namel');
	    var allpassengerData = [];
	    var allpassengerDataPull = []; // 打包好数据 形成一个新数组
	    for (var i = 0; i < allpassenger.length; i++) {
	        var nameall = allpassenger[i].getAttribute('name'); //('肖浩(成人)')
	        var age = nameall.substring(nameall.length - 3, nameall.length - 1); //  成人  儿童
	        var myname1 = nameall.substring(nameall.length - 4, nameall.length); //(成人) （儿童）
	        var name = nameall.replace(myname1, ''); // 肖浩
	        var card = allpassenger[i].getAttribute('card');
	        var num = allpassenger[i].getAttribute('num');
	        var price = age == '成人' ? onepiect1 : Fprice / 2; // 儿童价格为全价的一半
	        var passengerData = {
	            'name': name,
	            'age': age,
	            'card': card,
	            'num': num,
	            'phone': '',
	            'price': price
	        };

	        allpassengerData.push(passengerData);
	    }
	    for (var i = 0; i < allpassengerData.length; i++) {
	        allpassengerDataPull.push("'" + passengerhtml(allpassengerData[i]) + "'");
	    }

	    return allpassengerDataPull;
	}

	// 相关点击事件
	function allmyClickbook() {

	    //保险份
	    var safenum = $.qus('.myBook-namel').length;
	    $.qu('.buysafe-nums').innerHTML = safenum;

	    $.qu('.looktext-sp1').onclick = function () {

	        if (onOFFs) {

	            $.qu('.looktext1-text').style.display = 'none';
	            $.qu('.looktext-im1').src = 'img/top.png';
	            $.qu('.looktext-im1').style.top = '0.4rem';
	            onOFFs = false;
	        } else {

	            $.qu('.looktext1-text').style.display = 'block';
	            $.qu('.looktext-im1').src = 'img/botom.png';
	            $.qu('.looktext-im1').style.top = '0.6rem';

	            onOFFs = true;
	        }
	        alloneMone();
	    };
	    // 开启保险弹层
	    $.qu('.safetexth').onclick = function () {
	        $.qu('.thesafebox').style.display = '-webkit-box';
	    };
	    $.qu('.safetexthy').onclick = function () {
	        $.qu('.thesafebox').style.display = '-webkit-box';
	    };

	    $.qu('.buysafe-btnbox').onclick = function () {
	        if (onOFF) {
	            // $.qu('.buysafe-btnbox1').style.left ='0.1rem';
	            $.addClass($.qu('.buysafe-btnbox1'), 'buysafe-btnbox1left');
	            //this.style.backgroundColor ='#ccc';
	            $.addClass(this, 'buysafe-btnboxbcf');

	            onOFF = false;
	        } else {

	            //$.qu('.buysafe-btnbox1').style.left ='1.2rem';
	            $.removeClass($.qu('.buysafe-btnbox1'), 'buysafe-btnbox1left');
	            //this.style.backgroundColor ='#f4734b';
	            $.removeClass(this, 'buysafe-btnboxbcf');
	            onOFF = true;
	        }
	        alloneMone();
	    };

	    $.qu('.proof-btnbox').onclick = function () {
	        if (onOFFp) {
	            $.qu('.proof-btnbox1').style.left = '1.2rem';
	            this.style.backgroundColor = '#f4734b';
	            $.qu('.proof-box').style.display = 'block';
	            onOFFp = false;
	        } else {
	            $.qu('.proof-btnbox1').style.left = '0.1rem';
	            this.style.backgroundColor = '#ccc';
	            $.qu('.proof-box').style.display = 'none';
	            onOFFp = true;
	        }
	        alloneMone();
	    };
	    //删除乘机人
	    $.each($.qus('.bookdelete'), function () {
	        this.onclick = function () {
	            this.parentNode.parentNode.removeChild(this.parentNode);
	            var safenum = $.qus('.myBook-namel').length;
	            $.qu('.buysafe-nums').innerHTML = safenum;
	            alloneMone();
	        };
	    });
	    // 添加乘机人 路由
	    $.qu('.namepick2').onclick = function () {
	        $.router.go('#!/flightmb/passenger', { btype: 1 }, true);
	    };
	    // 添加联系人
	    $.qu('.linkmanpick2').onclick = function () {
	        $.router.go('#!/flightmb/mychalinkp', { btype: 2 }, true);
	    };
	}

	//增加乘机人
	function addPass(data) {
	    var str = '<li class="myBook-namel" name ="' + data.pnamep + '" card="' + data.cardNump + '" num="' + data.nump + '" ><div class="bookdelete"><div class="bookdelete1"></div></div><p class="myBook-namelp1"><span class="namelp1sp1">' + data.pnamep + '</span></p><p class="myBook-namelp1"><span class="namelp1sp3">' + data.cardNump + '</span><span class="namelp1sp4">' + data.nump + '</span></p></li>';
	    var n = 1;
	    var alp = $.qus('.namelp1sp4');
	    for (var i = 0; i < alp.length; i++) {
	        if (alp[i].innerHTML == data.nump) {
	            n = 2;
	        }
	    }
	    if (n == 1) {
	        $.qu('.myBook-nameul').innerHTML += str;
	    } else {}
	    //  选择乘机人 重复

	    // 查找是否有儿童
	    var aPs = $.qus('.myBook-namel');

	    var safenum = aPs.length; // 根据人数 显示保险数量
	    $.qu('.buysafe-nums').innerHTML = safenum;
	}

	//增加/更换联系人
	function addLinkpe(data) {
	    var num = $.qu('.linkman4').innerHTML;
	    if (num != data.linknump) {
	        $.qu('.linkman4').innerHTML = data.linknump;
	        $.qu('.linkman2').innerHTML = data.linkname;
	    }
	}

	// 累计总价函数  删除 或者添加联系人 儿童显示 及
	function alloneMone() {
	    if (!onOFFp) {
	        ShipFeeOnoff = shipMoney;
	    } else {
	        ShipFeeOnoff = 0;
	    }
	    var aPs = $.qus('.myBook-namel');
	    var oarr = [];
	    var yarr = [];
	    var odarr = [];
	    for (var j = 0; j < aPs.length; j++) {
	        var theage1 = aPs[j].getAttribute('name');
	        var theage2 = theage1.substring(theage1.length - 3, theage1.length - 1);
	        if (theage2 == '儿童') {
	            //有老人或者儿童
	            //ynum++; 儿童
	            yarr.push(1);
	        } else if (theage2 == '老人') {
	            //odnum++ 老人
	            odarr.push(3);
	        } else {
	            //onum++ 成人
	            oarr.push(2);
	        }
	    }

	    onum = oarr.length;
	    odnum = odarr.length;
	    ynum = yarr.length;
	    //onOFF =true; // 保险开关按钮
	    // onOFFt =false;// 保险开关按钮

	    if (ynum != 0 || odnum != 0) {
	        // 有儿童或者老人
	        if (ynum != 0) {
	            $.qu('.myBook-mttdatay').style.display = 'block';
	            $.qu('.mttbookpricey').innerHTML = Fprice / 2;
	        } else {
	            $.qu('.myBook-mttdatay').style.display = 'none';
	        }

	        if (cabinType == 6) {
	            $.qu('.buysafe-price').innerHTML = '20';
	            $.qu('.mttbookprice2').innerHTML = '20';
	            $.qu('.mttbookprice2y').innerHTML = '20';
	            getsafeText(3); // 更换保险说明
	        } else {
	            $.qu('.buysafe-price').innerHTML = '30';
	            $.qu('.mttbookprice2').innerHTML = '30';
	            getsafeText(insureType); //更换保险说明
	        }
	    } else {
	        $.qu('.myBook-mttdatay').style.display = 'none';
	        $.qu('.buysafe-price').innerHTML = '30';
	        $.qu('.mttbookprice2').innerHTML = '30';
	        getsafeText(insureType); //更换保险说明
	    }

	    var tickeprice1 = parseInt($.qu('.mttbookprice').innerHTML); // 票面价
	    var oilprice1 = 50; // 基建燃油
	    var safe1 = parseInt($.qu('.mttbookprice2').innerHTML); // 保险
	    if (!onOFF) {
	        safe1 = 0;
	    }
	    // var allprice =(tickeprice1+oilprice1+safe1)*($.qus('.myBook-namel').length)
	    //    成人+老人    儿童   快递费用
	    var allprice = (tickeprice1 + oilprice1 + safe1) * (onum + odnum) + ynum * (Fprice / 2 + safe1) + ShipFeeOnoff;

	    $.qu('.allprice11').innerHTML = allprice;
	}
	// 查询退改规则
	function myBookChange1(carrier, seat) {
	    //console.log(carrier+seat)
	    var oData2 = '';
	    var xhr = new XMLHttpRequest();
	    xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier=' + carrier + '&seat=' + seat + '&reqPath=utlsiteservice.aspx', 'false');
	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                if (xhr.responseText != '') {
	                    oData2 = eval(xhr.responseText);
	                    $.qu('.looktext1-changetex1').innerHTML = oData2[0].EndorseNotice;
	                    $.qu('.looktext1-changetex2').innerHTML = oData2[0].UpNotice;
	                    $.qu('.looktext1-changetex3').innerHTML = oData2[0].RefundNotice;
	                } else {
	                    $.qu('.changetex1').innerHTML = '退改签规则以航空公司最新规则为准';
	                    $.qu('.changetex2').innerHTML = '退改签规则以航空公司最新规则为准';
	                    $.qu('.changetex3').innerHTML = '退改签规则以航空公司最新规则为准';
	                }
	            } else {
	                alert('出错了，Err' + xhr.status);
	            }
	        }
	    };
	}

	// 保险说明函数 及数据加载
	function getsafeText(insureType) {
	    // 获取保险说明接口  只需要传递 保险类型 insureType 其他字段都是固定的
	    function myinsuredata(insureType1) {
	        //console.log(carrier+seat)
	        var oData2 = '';
	        var xhr = new XMLHttpRequest();
	        xhr.open('get', 'http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=GetInsure&insuretype=' + insureType1, 'true');
	        xhr.send();
	        xhr.onreadystatechange = function () {
	            if (xhr.readyState == 4) {
	                // ajax 响内容解析完成，可以在客户端调用了
	                if (xhr.status == 200) {
	                    //  判断服务器返回的状态 200 表示 正常
	                    oData2 = eval('(' + xhr.responseText + ')');
	                    //console.log(oData2)
	                    var ptext = oData2.Info;
	                    var safeprice = Number(oData2.Price);
	                    $.qu('.mttbookprice2').innerHTML = safeprice; //  改变保险价格

	                    var str = '<p class="theword">' + ptext + '</p><a href="javascript:;" class="thesafebox-ok">我已知晓</a>';
	                    $.qu('.thesafebox-div').innerHTML = str;
	                    $.qu('.thesafebox-ok').onclick = function () {
	                        $.qu('.thesafebox').style.display = 'none'; // 关闭弹层
	                    };
	                } else {
	                    alert('出错了，Err' + xhr.status);
	                }
	            }
	        };
	    }
	    myinsuredata(insureType);
	}

	// book 预定身份验证
	function BookuserOnoff() {
	    var myUrl = window.location.href;

	    var oData2 = '';
	    var xhr = new XMLHttpRequest();

	    var reqPath = '/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
	    xhr.open('get', reqPath, 'true');

	    xhr.send();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            // ajax 响内容解析完成，可以在客户端调用了
	            if (xhr.status == 200) {
	                //  判断服务器返回的状态 200 表示 正常
	                oData2 = JSON.parse(xhr.responseText);
	                //oData2 =eval(xhr.responseText)
	                var sta = oData2.Status;
	                var url = oData2.Result;
	                if (sta == 1) {
	                    // 1表示已经登录了
	                    var NO = url.CardNo;
	                    var NA = url.MemberName;
	                    localStorage.setItem('NO', NO); // 将会有名称 和 id 存储在 本地
	                    localStorage.setItem('NA', NA);
	                } else {
	                    localStorage.setItem('link1', 3); // 3 为预定时候跳转 2为 我的机票跳转
	                    //console.log(localStorage.getItem('link1'))
	                    location.href = "/icbc/" + url;
	                }
	            } else {
	                alert('出错了,验证用户出错！');
	            }
	        }
	    };
	}

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = "\n\n<div id=\"myBook\">\n        <!--<div class=\"lodin-b\">-->\n             <!--<div id=\"caseBlanche-b\">-->\n               <!--<div id=\"rond-b\">-->\n                 <!--<div id=\"test-b\"></div>-->\n               <!--</div>-->\n               <!--<div id=\"load-b\">-->\n                 <!--<p>退改签查询中...</p>-->\n               <!--</div>-->\n             <!--</div>-->\n        <!--</div>-->\n        <div class=\"thesafebox\">\n                 <div class=\"thesafebox-div\">\n\n\n                 </div>\n        </div>\n        <div class=\"myBook-t\">\n              <span class=\"myBook-tt1\"><img src=\"img/back.bg.png\" alt=\"\"></span>\n              <span class=\"myBook-tt2\">填写订单</span>\n        </div>\n        <div class=\"myBook-m\">\n            <div class=\"myBook-mwrap\">\n                         <div class=\"myBook-flightbox1\">\n\n                                  <div class=\"myBook-mtf\">\n                                     <div class=\"flightbox1-text\">\n                                         去程\n                                     </div>\n                                     <strong class=\"myBook-mtfsp1\">2016-12-14</strong>\n                                     <strong class=\"myBook-mtfsp2\">中国国航</strong>\n                                     <strong class=\"myBook-mtfsp3\">CA1718</strong>\n                                  </div>\n                                  <ul class=\"myBook-mtt\">\n                                       <li class=\"myBook-mttl1\">\n                                          <strong class=\"myBook-mttsp1\">07:25</strong>\n                                          <span class=\"myBook-mttsp11\">杭州萧山机场</span>\n                                       </li>\n                                       <li class=\"myBook-mttl2\">\n                                          <strong class=\"myBook-mttsp2\">09:55</strong>\n                                          <span class=\"myBook-mttsp22\">广州新白云机场</span>\n                                       </li>\n                                  </ul>\n                                  <div class=\"myBook-mttext\">\n                                            <div class=\"myBook-mttdata\">\n                                                  <span class=\"mttdata-sp1\"><em class=\"mttdata-sp1e3\">成人票</em><em class=\"mttdata-sp1e1\">￥</em><em class=\"mttbookprice\">760</em></span>\n                                                  <span class=\"mttdata-sp2\"><em class=\"mttdata-sp1e4\">基建/燃油</em><em class=\"mttdata-sp1e2\">￥</em><em class=\"mttbookprice1\">50</em></span>\n                                                  <span class=\"mttdata-sp3\"><em class=\"mttdata-sp1e5\">保险</em><em class=\"mttdata-sp1e2\">￥</em><em class=\"mttbookprice2\">30</em><a class=\"safetexth\" href=\"javascript:;\"><img class=\"safetext\" src=\"img/more.png\" alt=\"\"></a></span>\n\n                                            </div>\n                                            <div class=\"myBook-mttdatay\">\n                                                  <span class=\"mttdata-sp1y\"><em class=\"mttdata-sp1e3y\">儿童票</em><em class=\"mttdata-sp1e1y\">￥</em><em class=\"mttbookpricey\">760</em></span>\n                                                  <span class=\"mttdata-sp2y\"><em class=\"mttdata-sp1e4y\">基建/燃油</em><em class=\"mttdata-sp1e2y\">￥</em><em class=\"mttbookprice1y\">0</em></span>\n                                                  <span class=\"mttdata-sp3y\"><em class=\"mttdata-sp1e5y\">保险</em><em class=\"mttdata-sp1e2y\">￥</em><em class=\"mttbookprice2y\">30</em><a class=\"safetexthy\" href=\"javascript:;\"><img class=\"safetexty\" src=\"img/more.png\" alt=\"\"></a></span>\n\n                                            </div>\n\n                                            <div class=\"looktext\">\n                                                  <span class=\"looktext-sp1\">查看退改签<img class=\"looktext-im1\" src=\"img/botom.png\" alt=\"\"></span>\n                                                  <ul class=\"looktext1-text\">\n                                                     <li>\n                                                         <strong>签转规定:</strong>\n                                                         <span class=\"looktext1-changetex1\">不允许</span>\n                                                     </li>\n                                                     <li>\n                                                          <strong>改期规定:</strong>\n                                                          <span class=\"looktext1-changetex2\">起飞前（含）收取票面价10%的改期费；起飞后收取票面价20%的改期费；涉及升舱，则改签费和升舱费需同时收取</span>\n                                                     </li>\n                                                     <li>\n                                                          <strong>退票规定:</strong>\n                                                          <span class=\"looktext1-changetex3\">起飞前（含）收取票面价20%的退票费；起飞后收取票面价30%的退票费</span>\n                                                     </li>\n                                                  </ul>\n                                            </div>\n\n                                  </div>\n                         </div>\n                         <div class=\"myBook-flightbox2\">\n\n                                  <div class=\"myBook1-mtf\">\n                                     <div class=\"flightbox2-text\">\n                                         返程\n                                     </div>\n                                     <strong class=\"myBook1-mtfsp1\">2016-12-14</strong>\n                                     <strong class=\"myBook1-mtfsp2\">中国国航</strong>\n                                     <strong class=\"myBook1-mtfsp3\">CA1718</strong>\n                                  </div>\n                                  <ul class=\"myBook1-mtt\">\n                                       <li class=\"myBook1-mttl1\">\n                                          <strong class=\"myBook1-mttsp1\">07:25</strong>\n                                          <span class=\"myBook1-mttsp11\">杭州萧山机场</span>\n                                       </li>\n                                       <li class=\"myBook1-mttl2\">\n                                          <strong class=\"myBook1-mttsp2\">09:55</strong>\n                                          <span class=\"myBook1-mttsp22\">广州新白云机场</span>\n                                       </li>\n                                  </ul>\n                                  <div class=\"myBook1-mttext\">\n                                             <div class=\"myBook1-mttdata\">\n                                                  <span class=\"mttdata1-sp1\"><em class=\"mttdata1-sp1e3\">成人票</em><em class=\"mttdata1-sp1e1\">￥</em><em class=\"mttbookprice4\">760</em></span>\n                                                  <span class=\"mttdata1-sp2\"><em class=\"mttdata11-sp1e4\">基建/燃油</em><em class=\"mttdata1-sp1e2\">￥</em><em class=\"mttbookprice14\">50</em></span>\n                                                  <span class=\"mttdata1-sp3\"><em class=\"mttdata1-sp1e5\">保险</em><em class=\"mttdata1-sp1e2\">￥</em><em class=\"mttbookprice24\">30</em><img class=\"safetext\" src=\"img/more.png\" alt=\"\"></span>\n\n                                            </div>\n                                            <div class=\"looktext1\">\n                                                  <span class=\"looktext1-sp1\">查看退改签<img class=\"looktext1-im1\" src=\"img/botom.png\" alt=\"\"></span>\n                                                  <ul class=\"looktext11-text\">\n                                                     <li>\n                                                         <strong>签转规定:</strong>\n                                                         <span class=\"looktext11-changetex1\">不允许</span>\n                                                     </li>\n                                                     <li>\n                                                          <strong>改期规定:</strong>\n                                                          <span class=\"looktext11-changetex2\">起飞前（含）收取票面价10%的改期费；起飞后收取票面价20%的改期费；涉及升舱，则改签费和升舱费需同时收取</span>\n                                                     </li>\n                                                     <li>\n                                                          <strong>退票规定:</strong>\n                                                          <span class=\"looktext11-changetex3\">起飞前（含）收取票面价20%的退票费；起飞后收取票面价30%的退票费</span>\n                                                     </li>\n                                                  </ul>\n                                            </div>\n                                   </div>\n                         </div>\n\n\t                     <div class=\"myBook-name\">\n\t\t                         <div class=\"myBook-namepick\">\n\t\t                              <strong class=\"namepick1\">乘机人信息</strong>\n\t\t                              <span class=\"namepick2\">请选择乘机人</span>\n\t\t                         </div>\n\t\t                         <ul class=\"myBook-nameul\">\n\t\t                              <li class=\"myBook-namel\" name=\"杰森(成人)\" card=\"身份证\" num=\"500233198911165879\">\n\t\t                                  <div class=\"bookdelete\">\n\t\t                                      <div class=\"bookdelete1\"></div>\n\t\t                                  </div>\n\t\t                                  <p class=\"myBook-namelp1\"><span class=\"namelp1sp1\">杰森</span>(<span class=\"namelp1sp2\">成人</span>)</p>\n\t\t                                  <p class=\"myBook-namelp1\"><span class=\"namelp1sp3\">身份证</span><span class=\"namelp1sp4\">500233198911165879</span></p>\n\t\t                              </li>\n\t\t                              <li class=\"myBook-namel\" name=\"刘明(成人)\" card=\"身份证\" num=\"500233198911165666\">\n\t\t                                  <div class=\"bookdelete\">\n\t\t                                      <div class=\"bookdelete1\"></div>\n\t\t                                  </div>\n\t\t                                  <p class=\"myBook-namelp1\"><span class=\"namelp1sp1\">刘明</span>(<span class=\"namelp1sp2\">成人</span>)</p>\n\t\t                                  <p class=\"myBook-namelp1\"><span class=\"namelp1sp3\">身份证</span><span class=\"namelp1sp4\">500233198911165666</span></p>\n\t\t                              </li>\n\n\n\t\t                         </ul>\n\t\t                  </div>\n\t                     <div class=\"myBook-linkman\">\n\t\t                         <div class=\"myBook-linkmanpick\">\n\t\t                              <strong class=\"linkmanpick1\">联系人信息</strong>\n\t\t                              <span class=\"linkmanpick2\">请选择联系人</span>\n\t\t                         </div>\n\t\t                         <div class=\"linkman-box\">\n\t\t                            <p>\n\t\t                                <span class=\"linkman1\">联系人</span>\n\t\t                                <span class=\"linkman2\">无名</span>\n\t\t                            </p>\n\t\t                            <p>\n\t\t                                <span class=\"linkman1\">手机</span>\n\t\t                                <span class=\"linkman4\">1369999999</span>\n\t\t                            </p>\n\t\t                         </div>\n\n\t\t                  </div>\n\t                     <div class=\"buysafe\">\n\t\t                        <span class=\"buysafesp1\">保险</span><span><em class=\"buysafeem1\">￥</em><span class=\"buysafe-price\">30</span><em>×</em><span class=\"buysafe-nums\"></span>份</span>\n\t\t                        <a href=\"javascript:;\" class=\"buysafe-btnbox\">\n\t\t                              <div class=\"buysafe-btnbox1\"></div>\n\t\t                        </a>\n                         </div>\n\n\t                     <div class=\"proof\">\n\t\t                           <span class=\"proof1\">报销凭证<span class=\"proof2\"></span></span>\n\t\t                           <div class=\"proof-btnbox\">\n\t\t                              <div class=\"proof-btnbox1\"></div>\n\t\t                           </div>\n\t\t                  </div>\n\t                     <ul class=\"proof-box\">\n\t\t                      <li class=\"proof-box1\">\n                                <p>\n                                     <span class=\"proof-boxt1\">收件人</span>\n                                     <span class=\"proof-boxt2\"></span>\n                                </p>\n                          </li>\n\t\t                      <li class=\"proof-box1\">\n                                   <p>\n                                       <span class=\"proof-boxt1\">所在地区</span>\n                                       <span class=\"proof-boxt2\"></span>\n                                   </p>\n                              </li>\n\t\t                      <li class=\"proof-box1\">\n                                  <p>\n                                      <span class=\"proof-boxt1\">详细地址</span >\n                                      <span class=\"proof-boxt2  proof-boxt3\"></span>\n                                  </p>\n                              </li>\n\t                     </ul>\n            </div>\n        </div>\n        <div class=\"allprice\">\n            <span class=\"allprice1\"><em>应付：</em>￥<em></em><span  class=\"allprice11\">650</span></span>\n            <span class=\"allprice2\">下一步</span>\n        </div>\n</div>\n"

/***/ }
/******/ ]);