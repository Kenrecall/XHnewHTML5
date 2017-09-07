
//--------------------------------------------------------------
// Copyright (C) 2006 Michael Schwarz (http://www.ajaxpro.info).
// All rights reserved.
//--------------------------------------------------------------

// prototype.js



Object.extend = function(dest, source, replace) {
	for(var prop in source) {
		if(replace == false && dest[prop] != null) { continue; }
		dest[prop] = source[prop];
	}
	return dest;
};

Object.extend(Function.prototype, {
	apply: function(o, a) {
		var r, x = "__fapply";
		if(typeof o != "object") { o = {}; }
		o[x] = this;
		var s = "r = o." + x + "(";
		for(var i=0; i<a.length; i++) {
			if(i>0) { s += ","; }
			s += "a[" + i + "]";
		}
		s += ");";
		eval(s);
		delete o[x];
		return r;
	},
	bind: function(o) {
		if(!Function.__objs) {
			Function.__objs = [];
			Function.__funcs = [];
		}
		var objId = o.__oid;
		if(!objId) {
			Function.__objs[objId = o.__oid = Function.__objs.length] = o;
		}

		var me = this;
		var funcId = me.__fid;
		if(!funcId) {
			Function.__funcs[funcId = me.__fid = Function.__funcs.length] = me;
		}

		if(!o.__closures) {
			o.__closures = [];
		}

		var closure = o.__closures[funcId];
		if(closure) {
			return closure;
		}

		o = null;
		me = null;

		return Function.__objs[objId].__closures[funcId] = function() {
			return Function.__funcs[funcId].apply(Function.__objs[objId], arguments);
		};
	}
}, false);

Object.extend(Array.prototype, {
	push: function(o) {
		this[this.length] = o;
	},
	addRange: function(items) {
		if(items.length > 0) {
			for(var i=0; i<items.length; i++) {
				this.push(items[i]);
			}
		}
	},
	clear: function() {
		this.length = 0;
		return this;
	},
	shift: function() {
		if(this.length == 0) { return null; }
		var o = this[0];
		for(var i=0; i<this.length-1; i++) {
			this[i] = this[i + 1];
		}
		this.length--;
		return o;
	}
}, false);

Object.extend(String.prototype, {
	trimLeft: function() {
		return this.replace(/^\s*/,"");
	},
	trimRight: function() {
		return this.replace(/\s*$/,"");
	},
	trim: function() {
		return this.trimRight().trimLeft();
	},
	endsWith: function(s) {
		if(this.length == 0 || this.length < s.length) { return false; }
		return (this.substr(this.length - s.length) == s);
	},
	startsWith: function(s) {
		if(this.length == 0 || this.length < s.length) { return false; }
		return (this.substr(0, s.length) == s);
	},
	split: function(c) {
		var a = [];
		if(this.length == 0) return a;
		var p = 0;
		for(var i=0; i<this.length; i++) {
			if(this.charAt(i) == c) {
				a.push(this.substring(p, i));
				p = ++i;
			}
		}
		a.push(s.substr(p));
		return a;
	}
}, false);

Object.extend(String, {
	format: function(s) {
		for(var i=1; i<arguments.length; i++) {
			s = s.replace("{" + (i -1) + "}", arguments[i]);
		}
		return s;
	},
	isNullOrEmpty: function(s) {
		if(s == null || s.length == 0) {
			return true;
		}
		return false;
	}
}, false);

if(typeof addEvent == "undefined")
	addEvent = function(o, evType, f, capture) {
		if(o == null) { return false; }
		if(o.addEventListener) {
			o.addEventListener(evType, f, capture);
			return true;
		} else if (o.attachEvent) {
			var r = o.attachEvent("on" + evType, f);
			return r;
		} else {
			try{ o["on" + evType] = f; }catch(e){}
		}
	};

if(typeof removeEvent == "undefined")
	removeEvent = function(o, evType, f, capture) {
		if(o == null) { return false; }
		if(o.removeEventListener) {
			o.removeEventListener(evType, f, capture);
			return true;
		} else if (o.detachEvent) {
			o.detachEvent("on" + evType, f);
		} else {
			try{ o["on" + evType] = function(){}; }catch(e){}
		}
	};




//--------------------------------------------------------------
// Copyright (C) 2006 Michael Schwarz (http://www.ajaxpro.info).
// All rights reserved.
//--------------------------------------------------------------

// core.js
Object.extend(Function.prototype, {
	getArguments: function() {
		var args = [];
		for(var i=0; i<this.arguments.length; i++) {
			args.push(this.arguments[i]);
		}
		return args;
	}
}, false);

var MS = {"Browser":{}};

Object.extend(MS.Browser, {
	isIE: navigator.userAgent.indexOf('MSIE') != -1,
	isFirefox: navigator.userAgent.indexOf('Firefox') != -1,
	isOpera: window.opera != null
}, false);

var AjaxPro = {};

AjaxPro.IFrameXmlHttp = function() {};
AjaxPro.IFrameXmlHttp.prototype = {
	onreadystatechange: null, headers: [], method: "POST", url: null, async: true, iframe: null,
	status: 0, readyState: 0, responseText: null,
	abort: function() {
	},
	readystatechanged: function() {
		var doc = this.iframe.contentDocument || this.iframe.document;
		if(doc != null && doc.readyState == "complete" && doc.body != null && doc.body.res != null) {
			this.status = 200;
			this.statusText = "OK";
			this.readyState = 4;
			this.responseText = doc.body.res;
			this.onreadystatechange();
			return;
		}
		setTimeout(this.readystatechanged.bind(this), 10);
	},
	open: function(method, url, async) {
		if(async == false) {
			alert("Synchronous call using IFrameXMLHttp is not supported.");
			return;
		}
		if(this.iframe == null) {
			var iframeID = "hans";
			if (document.createElement && document.documentElement &&
				(window.opera || navigator.userAgent.indexOf('MSIE 5.0') == -1))
			{
				var ifr = document.createElement('iframe');
				ifr.setAttribute('id', iframeID);
				ifr.style.visibility = 'hidden';
				ifr.style.position = 'absolute';
				ifr.style.width = ifr.style.height = ifr.borderWidth = '0px';

				this.iframe = document.getElementsByTagName('body')[0].appendChild(ifr);
			}
			else if (document.body && document.body.insertAdjacentHTML)
			{
				document.body.insertAdjacentHTML('beforeEnd', '<iframe name="' + iframeID + '" id="' + iframeID + '" style="border:1px solid black;display:none"></iframe>');
			}
			if (window.frames && window.frames[iframeID]) {
				this.iframe = window.frames[iframeID];
			}
			this.iframe.name = iframeID;
			this.iframe.document.open();
			this.iframe.document.write("<"+"html><"+"body></"+"body></"+"html>");
			this.iframe.document.close();
		}
		this.method = method;
		this.url = url;
		this.async = async;
	},
	setRequestHeader: function(name, value) {
		for(var i=0; i<this.headers.length; i++) {
			if(this.headers[i].name == name) {
				this.headers[i].value = value;
				return;
			}
		}
		this.headers.push({"name":name,"value":value});
	},
	getResponseHeader: function(name, value) {
		return null;
	},
	addInput: function(doc, form, name, value) {
		var ele;
		var tag = "input";
		if(value.indexOf("\n") >= 0) {
			tag = "textarea";
		}

		if(doc.all) {
			ele = doc.createElement("<" + tag + " name=\"" + name + "\" />");
		}else{
			ele = doc.createElement(tag);
			ele.setAttribute("name", name);
		}
		ele.setAttribute("value", value);
		form.appendChild(ele);
		ele = null;
	},
	send: function(data) {
		if(this.iframe == null) {
			return;
		}
		var doc = this.iframe.contentDocument || this.iframe.document;
		var form = doc.createElement("form");

		doc.body.appendChild(form);

		form.setAttribute("action", this.url);
		form.setAttribute("method", this.method);
		form.setAttribute("enctype", "application/x-www-form-urlencoded");

		for(var i=0; i<this.headers.length; i++) {
			switch(this.headers[i].name.toLowerCase()) {
				case "content-length":
				case "accept-encoding":
				case "content-type":
					break;
				default:
					this.addInput(doc, form, this.headers[i].name, this.headers[i].value);
			}
		}
		this.addInput(doc, form, "data", data);
		form.submit();

		setTimeout(this.readystatechanged.bind(this), 0);
	}
};

var progids = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
var progid = null;

if(typeof ActiveXObject != "undefined") {
	var ie7xmlhttp = false;
	if(typeof XMLHttpRequest == "object") {
		try{ var o = new XMLHttpRequest(); ie7xmlhttp = true; }catch(e){}
	}
	if(typeof XMLHttpRequest == "undefined" || !ie7xmlhttp) {
		XMLHttpRequest = function() {
			var xmlHttp = null;
			if(!AjaxPro.noActiveX) {
				if(progid != null) {
					return new ActiveXObject(progid);
				}
				for(var i=0; i<progids.length && xmlHttp == null; i++) {
					try {
						xmlHttp = new ActiveXObject(progids[i]);
						progid = progids[i];

					}catch(e){}
				}
			}
			if(xmlHttp == null && MS.Browser.isIE) {
				return new AjaxPro.IFrameXmlHttp();
			}
			return xmlHttp;
		};
	}
}

Object.extend(AjaxPro, {
	noOperation: function() {},
	onLoading: function() {},
	onError: function() {},
	onTimeout: function() { return true; },
	onStateChanged: function() {},
	cryptProvider: null,
	queue: null,
	token: "",
	version: "9.2.17.1",
	ID: "AjaxPro",
	noActiveX: false,
	timeoutPeriod: 15*1000,
	queue: null,
	noUtcTime: false,
	regExDate: function(str,p1, p2,offset,s) {
        str = str.substring(1).replace('"','');
        var date = str;

        if (str.substring(0,7) == "\\\/Date(") {
            str = str.match(/Date\((.*?)\)/)[1];
            date = "new Date(" +  parseInt(str) + ")";
        }
        else { // ISO Date 2007-12-31T23:59:59Z
            var matches = str.split( /[-,:,T,Z]/);
            matches[1] = (parseInt(matches[1],0)-1).toString();
            date = "new Date(Date.UTC(" + matches.join(",") + "))";
       }
        return date;
    },
    parse: function(text) {
		// not yet possible as we still return new type() JSON
//		if (!(!(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
//		text.replace(/"(\\.|[^"\\])*"/g, '')))  ))
//			throw new Error("Invalid characters in JSON parse string.");

        var regEx = /(\"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}.*?\")|(\"\\\/Date\(.*?\)\\\/")/g;
        text = text.replace(regEx,this.regExDate);

        return eval('(' + text + ')');
    },
	m : {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	},
	toJSON: function(o) {
		if(o == null) {
			return "null";
		}
		var v = [];
		var i;
		var c = o.constructor;
		if(c == Number) {
			return isFinite(o) ? o.toString() : AjaxPro.toJSON(null);
		} else if(c == Boolean) {
			return o.toString();
		} else if(c == String) {
			if (/["\\\x00-\x1f]/.test(o)) {
				o = o.replace(/([\x00-\x1f\\"])/g, function(a, b) {
					var c = AjaxPro.m[b];
					if (c) {
						return c;
					}
					c = b.charCodeAt();
					return '\\u00' +
						Math.floor(c / 16).toString(16) +
						(c % 16).toString(16);
				});
            }
			return '"' + o + '"';
		} else if (c == Array) {
			for(i=0; i<o.length; i++) {
				v.push(AjaxPro.toJSON(o[i]));
			}
			return "[" + v.join(",") + "]";
		} else if (c == Date) {
//			var d = {};
//			d.__type = "System.DateTime";
//			if(AjaxPro.noUtcTime == true) {
//				d.Year = o.getFullYear();
//				d.Month = o.getMonth() +1;
//				d.Day = o.getDate();
//				d.Hour = o.getHours();
//				d.Minute = o.getMinutes();
//				d.Second = o.getSeconds();
//				d.Millisecond = o.getMilliseconds();
//			} else {
//				d.Year = o.getUTCFullYear();
//				d.Month = o.getUTCMonth() +1;
//				d.Day = o.getUTCDate();
//				d.Hour = o.getUTCHours();
//				d.Minute = o.getUTCMinutes();
//				d.Second = o.getUTCSeconds();
//				d.Millisecond = o.getUTCMilliseconds();
//			}
			return AjaxPro.toJSON("/Date(" + new Date(Date.UTC(o.getUTCFullYear(), o.getUTCMonth(), o.getUTCDate(), o.getUTCHours(), o.getUTCMinutes(), o.getUTCSeconds(), o.getUTCMilliseconds())).getTime() + ")/");
		}
		if(typeof o.toJSON == "function") {
			return o.toJSON();
		}
		if(typeof o == "object") {
			for(var attr in o) {
				if(typeof o[attr] != "function") {
					v.push('"' + attr + '":' + AjaxPro.toJSON(o[attr]));
				}
			}
			if(v.length>0) {
				return "{" + v.join(",") + "}";
			}
			return "{}";
		}
		return o.toString();
	},
	dispose: function() {
		if(AjaxPro.queue != null) {
			AjaxPro.queue.dispose();
		}
	}
}, false);

addEvent(window, "unload", AjaxPro.dispose);

AjaxPro.Request = function(url) {
	this.url = url;
	this.xmlHttp = null;
};

AjaxPro.Request.prototype = {
	url: null,
	callback: null,
	onLoading: null,
	onError: null,
	onTimeout: null,
	onStateChanged: null,
	args: null,
	context: null,
	isRunning: false,
	abort: function() {
		if(this.timeoutTimer != null) {
			clearTimeout(this.timeoutTimer);
		}
		if(this.xmlHttp) {
			this.xmlHttp.onreadystatechange = AjaxPro.noOperation;
			this.xmlHttp.abort();
		}
		if(this.isRunning) {
			this.isRunning = false;
			this.onLoading(false);
		}
	},
	dispose: function() {
		this.abort();
	},
	getEmptyRes: function() {
		return {
			error: null,
			value: null,
			request: {method:this.method, args:this.args},
			context: this.context,
			duration: this.duration
		};
	},
	endRequest: function(res) {
		this.abort();
		if(res.error != null) {
			this.onError(res.error, this);
		}

		if(typeof this.callback == "function") {
			this.callback(res, this);
		}
	},
	mozerror: function() {
		if(this.timeoutTimer != null) {
			clearTimeout(this.timeoutTimer);
		}
		var res = this.getEmptyRes();
		res.error = {Message:"Unknown",Type:"ConnectFailure",Status:0};
		this.endRequest(res);
	},
	doStateChange: function() {
		this.onStateChanged(this.xmlHttp.readyState, this);
		if(this.xmlHttp.readyState != 4 || !this.isRunning) {
			return;
		}
		this.duration = new Date().getTime() - this.__start;
		if(this.timeoutTimer != null) {
			clearTimeout(this.timeoutTimer);
		}
		var res = this.getEmptyRes();
		if(this.xmlHttp.status == 200 && this.xmlHttp.statusText == "OK") {
			res = this.createResponse(res);
		} else {
			res = this.createResponse(res, true);
			res.error = {Message:this.xmlHttp.statusText,Type:"ConnectFailure",Status:this.xmlHttp.status};
		}

		this.endRequest(res);
	},
	createResponse: function(r, noContent) {
		if(!noContent) {
			if(typeof(this.xmlHttp.responseText) == "unknown") {
				r.error = {Message: "XmlHttpRequest error reading property responseText.", Type: "XmlHttpRequestException"};
				return r;
			}

			var responseText = "" + this.xmlHttp.responseText;

			if(AjaxPro.cryptProvider != null && typeof AjaxPro.cryptProvider.decrypt == "function") {
				responseText = AjaxPro.cryptProvider.decrypt(responseText);
			}

			if(this.xmlHttp.getResponseHeader("Content-Type") == "text/xml") {
				r.value = this.xmlHttp.responseXML;
			} else {
				if(responseText != null && responseText.trim().length > 0) {
					r.json = responseText;
					var v = null;
					v = AjaxPro.parse(responseText);
					if(v != null) {
						if(typeof v.value != "undefined") r.value = v.value;
						else if(typeof v.error != "undefined") r.error = v.error;
					}
				}
			}
		}
		/* if(this.xmlHttp.getResponseHeader("X-" + AjaxPro.ID + "-Cache") == "server") {
			r.isCached = true;
		} */
		return r;
	},
	timeout: function() {
		this.duration = new Date().getTime() - this.__start;
		var r = this.onTimeout(this.duration, this);
		if(typeof r == "undefined" || r != false) {
			this.abort();
		} else {
			this.timeoutTimer = setTimeout(this.timeout.bind(this), AjaxPro.timeoutPeriod);
		}
	},
	invoke: function(method, args, callback, context) {
		this.__start = new Date().getTime();

		// if(this.xmlHttp == null) {
			this.xmlHttp = new XMLHttpRequest();
		// }

		this.isRunning = true;
		this.method = method;
		this.args = args;
		this.callback = callback;
		this.context = context;

		var async = typeof(callback) == "function" && callback != AjaxPro.noOperation;

		if(async) {
			if(MS.Browser.isIE) {
				this.xmlHttp.onreadystatechange = this.doStateChange.bind(this);
			} else {
				this.xmlHttp.onload = this.doStateChange.bind(this);
				this.xmlHttp.onerror = this.mozerror.bind(this);
			}
			this.onLoading(true);
		}

		var json = AjaxPro.toJSON(args) + "";
		if(AjaxPro.cryptProvider != null && typeof AjaxPro.cryptProvider.encrypt == "function") {
			json = AjaxPro.cryptProvider.encrypt(json);
		}

		this.xmlHttp.open("POST", this.url, async);
		this.xmlHttp.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
		this.xmlHttp.setRequestHeader("X-" + AjaxPro.ID + "-Method", method);

		if(AjaxPro.token != null && AjaxPro.token.length > 0) {
			this.xmlHttp.setRequestHeader("X-" + AjaxPro.ID + "-Token", AjaxPro.token);
		}

		/* if(!MS.Browser.isIE) {
			this.xmlHttp.setRequestHeader("Connection", "close");
		} */

		this.timeoutTimer = setTimeout(this.timeout.bind(this), AjaxPro.timeoutPeriod);

		try{ this.xmlHttp.send(json); }catch(e){}	// IE offline exception

		if(!async) {
			return this.createResponse({error: null,value: null});
		}

		return true;
	}
};

AjaxPro.RequestQueue = function(conc) {
	this.queue = [];
	this.requests = [];
	this.timer = null;

	if(isNaN(conc)) { conc = 2; }

	for(var i=0; i<conc; i++) {		// max 2 http connections
		this.requests[i] = new AjaxPro.Request();
		this.requests[i].callback = function(res) {
			var r = res.context;
			res.context = r[3][1];

			r[3][0](res, this);
		};
		this.requests[i].callbackHandle = this.requests[i].callback.bind(this.requests[i]);
	}

	this.processHandle = this.process.bind(this);
};

AjaxPro.RequestQueue.prototype = {
	process: function() {
		this.timer = null;
		if(this.queue.length == 0) {
			return;
		}
		for(var i=0; i<this.requests.length && this.queue.length > 0; i++) {
			if(this.requests[i].isRunning == false) {
				var r = this.queue.shift();

				this.requests[i].url = r[0];
				this.requests[i].onLoading = r[3].length >2 && r[3][2] != null && typeof r[3][2] == "function" ? r[3][2] : AjaxPro.onLoading;
				this.requests[i].onError = r[3].length >3 && r[3][3] != null && typeof r[3][3] == "function" ? r[3][3] : AjaxPro.onError;
				this.requests[i].onTimeout = r[3].length >4 && r[3][4] != null && typeof r[3][4] == "function" ? r[3][4] : AjaxPro.onTimeout;
				this.requests[i].onStateChanged = r[3].length >5 && r[3][5] != null && typeof r[3][5] == "function" ? r[3][5] : AjaxPro.onStateChanged;

				this.requests[i].invoke(r[1], r[2], this.requests[i].callbackHandle, r);
				r = null;
			}
		}
		if(this.queue.length > 0 && this.timer == null) {
			this.timer = setTimeout(this.processHandle, 0);
		}
	},
	add: function(url, method, args, e) {
		this.queue.push([url, method, args, e]);
		if(this.timer == null) {
			this.timer = setTimeout(this.processHandle, 0);
		}
		// this.process();
	},
	abort: function() {
		this.queue.length = 0;
		if (this.timer != null) {
			clearTimeout(this.timer);
		}
		this.timer = null;
		for(var i=0; i<this.requests.length; i++) {
			if(this.requests[i].isRunning == true) {
				this.requests[i].abort();
			}
		}
	},
	dispose: function() {
		for(var i=0; i<this.requests.length; i++) {
			var r = this.requests[i];
			r.dispose();
		}
		this.requests.clear();
	}
};

AjaxPro.queue = new AjaxPro.RequestQueue(2);	// 2 http connections

AjaxPro.AjaxClass = function(url) {
	this.url = url;
};

AjaxPro.AjaxClass.prototype = {
    invoke: function(method, args, e) {

        if (e != null) {
            if (e.length != 6) {
                for (; e.length < 6; ) { e.push(null); }
            }
            if (e[0] != null && typeof (e[0]) == "function") {
                return AjaxPro.queue.add(this.url, method, args, e);
            }
        }
        var r = new AjaxPro.Request();
        r.url = this.url;
        return r.invoke(method, args);
    }
};


//--------------------------------------------------------------
// Copyright (C) 2006 Michael Schwarz (http://www.ajaxpro.info).
// All rights reserved.
//--------------------------------------------------------------
// Converter.js

// NameValueCollectionConverter
if(typeof Ajax == "undefined") Ajax={};
if(typeof Ajax.Web == "undefined") Ajax.Web={};
if(typeof Ajax.Web.NameValueCollection == "undefined") Ajax.Web.NameValueCollection={};

Ajax.Web.NameValueCollection = function(items) {
	this.__type = "System.Collections.Specialized.NameValueCollection";
	this.keys = [];
	this.values = [];

	if(items != null && !isNaN(items.length)) {
		for(var i=0; i<items.length; i++)
			this.add(items[i][0], items[i][1]);
	}
};
Object.extend(Ajax.Web.NameValueCollection.prototype, {
	add: function(k, v) {
		if(k == null || k.constructor != String || v == null || v.constructor != String)
			return -1;
		this.keys.push(k);
		this.values.push(v);
		return this.values.length -1;
	},
	containsKey: function(key) {
		for(var i=0; i<this.keys.length; i++) {
			if(this.keys[i] == key) return true;
		}
		return false;
	},
	getKeys: function() {
		return this.keys;
	},
	getValue: function(k) {
		for(var i=0; i<this.keys.length && i<this.values.length; i++) {
			if(this.keys[i] == k) return this.values[i];
		}
		return null;
	},
	setValue: function(k, v) {
		if(k == null || k.constructor != String || v == null || v.constructor != String)
			return -1;
		for(var i=0; i<this.keys.length && i<this.values.length; i++) {
			if(this.keys[i] == k) this.values[i] = v;
			return i;
		}
		return this.add(k, v);
	},
	toJSON: function() {
		return AjaxPro.toJSON({__type:this.__type,keys:this.keys,values:this.values});
	}
}, true);

// DataSetConverter
if(typeof Ajax == "undefined") Ajax={};
if(typeof Ajax.Web == "undefined") Ajax.Web={};
if(typeof Ajax.Web.DataSet == "undefined") Ajax.Web.DataSet={};

Ajax.Web.DataSet = function(t) {
	this.__type = "System.Data.DataSet,System.Data";
	this.Tables = [];
	this.addTable = function(t) {
		this.Tables.push(t);
	};
	if(t != null) {
		for(var i=0; i<t.length; i++) {
			this.addTable(t[i]);
		}
	}
};

// DataTableConverter
if(typeof Ajax == "undefined") Ajax={};
if(typeof Ajax.Web == "undefined") Ajax.Web={};
if(typeof Ajax.Web.DataTable == "undefined") Ajax.Web.DataTable={};

Ajax.Web.DataTable = function(c, r) {
	this.__type = "System.Data.DataTable,System.Data";
	this.Columns = [];
	this.Rows = [];
	this.addColumn = function(name, type) {
		this.Columns.push({Name:name,__type:type});
	};
	this.toJSON = function() {
		var dt = {};
		var i;
		dt.Columns = [];
		for(i=0; i<this.Columns.length; i++)
			dt.Columns.push([this.Columns[i].Name, this.Columns[i].__type]);
		dt.Rows = [];
		for(i=0; i<this.Rows.length; i++) {
			var row = [];
			for(var j=0; j<this.Columns.length; j++)
				row.push(this.Rows[i][this.Columns[j].Name]);
			dt.Rows.push(row);
		}
		return AjaxPro.toJSON(dt);
	};
	this.addRow = function(row) {
		this.Rows.push(row);
	};
	if(c != null) {
		for(var i=0; i<c.length; i++)
			this.addColumn(c[i][0], c[i][1]);
	}
	if(r != null) {
		for(var y=0; y<r.length; y++) {
			var row = {};
			for(var z=0; z<this.Columns.length && z<r[y].length; z++)
				row[this.Columns[z].Name] = r[y][z];
			this.addRow(row);
		}
	}
};

// ProfileBaseConverter
if(typeof Ajax == "undefined") Ajax={};
if(typeof Ajax.Web == "undefined") Ajax.Web={};
if(typeof Ajax.Web.Profile == "undefined") Ajax.Web.Profile={};

Ajax.Web.Profile = function() {
	this.toJSON = function() {
		throw "Ajax.Web.Profile cannot be converted to JSON format.";
	};
	this.setProperty_callback = function(res) {
	};
	this.setProperty = function(name, object) {
		this[name] = object;
		AjaxPro.Services.Profile.SetProfile({name:o}, this.setProperty_callback.bind(this));
	};
};

// IDictionaryConverter
if(typeof Ajax == "undefined") Ajax={};
if(typeof Ajax.Web == "undefined") Ajax.Web={};
if(typeof Ajax.Web.Dictionary == "undefined") Ajax.Web.Dictionary={};

Ajax.Web.Dictionary = function(type,items) {
	this.__type = type;
	this.keys = [];
	this.values = [];

	if(items != null && !isNaN(items.length)) {
		for(var i=0; i<items.length; i++)
			this.add(items[i][0], items[i][1]);
	}
};
Object.extend(Ajax.Web.Dictionary.prototype, {
	add: function(k, v) {
		this.keys.push(k);
		this.values.push(v);
		return this.values.length -1;
	},
	containsKey: function(key) {
		for(var i=0; i<this.keys.length; i++) {
			if(this.keys[i] == key) return true;
		}
		return false;
	},
	getKeys: function() {
		return this.keys;
	},
	getValue: function(key) {
		for(var i=0; i<this.keys.length && i<this.values.length; i++) {
			if(this.keys[i] == key){ return this.values[i]; }
		}
		return null;
	},
	setValue: function(k, v) {
		for(var i=0; i<this.keys.length && i<this.values.length; i++) {
			if(this.keys[i] == k){ this.values[i] = v; }
			return i;
		}
		return this.add(k, v);
	},
	toJSON: function() {
		return AjaxPro.toJSON({__type:this.__type,keys:this.keys,values:this.values});
	}
}, true);


if(typeof UairB2C == "undefined") UairB2C={};
if(typeof UairB2C.BusinessTravelTool_class == "undefined") UairB2C.BusinessTravelTool_class={};
UairB2C.BusinessTravelTool_class = function() {};
Object.extend(UairB2C.BusinessTravelTool_class.prototype, Object.extend(new AjaxPro.AjaxClass(), {
	CheckLoginIsTravel: function() {
		return this.invoke("CheckLoginIsTravel", {}, this.CheckLoginIsTravel.getArguments().slice(0));
	},
	url: '/ajaxpro/UairB2C.BusinessTravelTool,UairB2C.ashx'
}));
UairB2C.BusinessTravelTool = new UairB2C.BusinessTravelTool_class();



if(typeof UairB2C == "undefined") UairB2C={};
if(typeof UairB2C.Dept_class == "undefined") UairB2C.Dept_class={};
UairB2C.Dept_class = function() {};
Object.extend(UairB2C.Dept_class.prototype, Object.extend(new AjaxPro.AjaxClass(), {
	getDept: function(unitID) {
		return this.invoke("getDept", {"unitID":unitID}, this.getDept.getArguments().slice(1));
	},
	GetDeptTree: function(unitID, xslt) {
		return this.invoke("GetDeptTree", {"unitID":unitID, "xslt":xslt}, this.GetDeptTree.getArguments().slice(2));
	},
	GetDeptMember: function(unitID, xslt, deptID) {
		return this.invoke("GetDeptMember", {"unitID":unitID, "xslt":xslt, "deptID":deptID}, this.GetDeptMember.getArguments().slice(3));
	},
	GetUnitType: function(userid) {
		return this.invoke("GetUnitType", {"userid":userid}, this.GetUnitType.getArguments().slice(1));
	},
	Passengers: function(deptId, xslt) {
		return this.invoke("Passengers", {"deptId":deptId, "xslt":xslt}, this.Passengers.getArguments().slice(2));
	},
	PassengersCheck: function(PassengerList) {
		return this.invoke("PassengersCheck", {"PassengerList":PassengerList}, this.PassengersCheck.getArguments().slice(1));
	},
	Depts: function(DeptId, xslt) {
		return this.invoke("Depts", {"DeptId":DeptId, "xslt":xslt}, this.Depts.getArguments().slice(2));
	},
	GetBrother: function(sDeptId, xslt) {
		return this.invoke("GetBrother", {"sDeptId":sDeptId, "xslt":xslt}, this.GetBrother.getArguments().slice(2));
	},
	ChangeDept: function(sDeptId, sPassengerId) {
		return this.invoke("ChangeDept", {"sDeptId":sDeptId, "sPassengerId":sPassengerId}, this.ChangeDept.getArguments().slice(2));
	},
	AddDept: function(sDeptJson) {
		return this.invoke("AddDept", {"sDeptJson":sDeptJson}, this.AddDept.getArguments().slice(1));
	},
	SavePassenger: function(sPassengerJson, encryptionPwd) {
		return this.invoke("SavePassenger", {"sPassengerJson":sPassengerJson, "encryptionPwd":encryptionPwd}, this.SavePassenger.getArguments().slice(2));
	},
	RemovePassenger: function(sPassengerId) {
		return this.invoke("RemovePassenger", {"sPassengerId":sPassengerId}, this.RemovePassenger.getArguments().slice(1));
	},
	UpdateDept: function(sDeptJson) {
		return this.invoke("UpdateDept", {"sDeptJson":sDeptJson}, this.UpdateDept.getArguments().slice(1));
	},
	RemoveDept: function(sDeptId) {
		return this.invoke("RemoveDept", {"sDeptId":sDeptId}, this.RemoveDept.getArguments().slice(1));
	},
	ExitDept: function() {
		return this.invoke("ExitDept", {}, this.ExitDept.getArguments().slice(0));
	},
	url: '/ajaxpro/UairB2C.Dept,UairB2C.ashx'
}));
UairB2C.Dept = new UairB2C.Dept_class();



if(typeof UairB2C == "undefined") UairB2C={};
if(typeof UairB2C.MGOpt_class == "undefined") UairB2C.MGOpt_class={};
UairB2C.MGOpt_class = function() {};
Object.extend(UairB2C.MGOpt_class.prototype, Object.extend(new AjaxPro.AjaxClass(), {
	icbcIsPay: function(oid) {
		return this.invoke("icbcIsPay", {"oid":oid}, this.icbcIsPay.getArguments().slice(1));
	},
	repwdMG: function(mobile, pwd) {
		return this.invoke("repwdMG", {"mobile":mobile, "pwd":pwd}, this.repwdMG.getArguments().slice(2));
	},
	sendSmsMG: function(mobile) {
		return this.invoke("sendSmsMG", {"mobile":mobile}, this.sendSmsMG.getArguments().slice(1));
	},
	RegexSmsGM: function(code, mobile) {
		return this.invoke("RegexSmsGM", {"code":code, "mobile":mobile}, this.RegexSmsGM.getArguments().slice(2));
	},
	checkMobile: function(mobile) {
		return this.invoke("checkMobile", {"mobile":mobile}, this.checkMobile.getArguments().slice(1));
	},
	loginMg: function(mobile, pwd) {
		return this.invoke("loginMg", {"mobile":mobile, "pwd":pwd}, this.loginMg.getArguments().slice(2));
	},
	regMg: function(mobile, pwd, name, email, unitid) {
		return this.invoke("regMg", {"mobile":mobile, "pwd":pwd, "name":name, "email":email, "unitid":unitid}, this.regMg.getArguments().slice(5));
	},
	interRefundMg: function(json, type) {
		return this.invoke("interRefundMg", {"json":json, "type":type}, this.interRefundMg.getArguments().slice(2));
	},
	interGerRefundMg: function(oid) {
		return this.invoke("interGerRefundMg", {"oid":oid}, this.interGerRefundMg.getArguments().slice(1));
	},
	interGetAllRefund: function(start, end, xslt) {
		return this.invoke("interGetAllRefund", {"start":start, "end":end, "xslt":xslt}, this.interGetAllRefund.getArguments().slice(3));
	},
	GetContacters: function(xslpath) {
		return this.invoke("GetContacters", {"xslpath":xslpath}, this.GetContacters.getArguments().slice(1));
	},
	GetPassenger: function(passengerID) {
		return this.invoke("GetPassenger", {"passengerID":passengerID}, this.GetPassenger.getArguments().slice(1));
	},
	GetPassengers: function(xslpath) {
		return this.invoke("GetPassengers", {"xslpath":xslpath}, this.GetPassengers.getArguments().slice(1));
	},
	GetAddresser: function(xslpath) {
		return this.invoke("GetAddresser", {"xslpath":xslpath}, this.GetAddresser.getArguments().slice(1));
	},
	SavePassenger: function(json, encryptionAESPwd) {
		return this.invoke("SavePassenger", {"json":json, "encryptionAESPwd":encryptionAESPwd}, this.SavePassenger.getArguments().slice(2));
	},
	SaveContacter: function(json, encryptionAESPwd) {
		return this.invoke("SaveContacter", {"json":json, "encryptionAESPwd":encryptionAESPwd}, this.SaveContacter.getArguments().slice(2));
	},
	SaveAddress: function(json, encryptionAESPwd) {
		return this.invoke("SaveAddress", {"json":json, "encryptionAESPwd":encryptionAESPwd}, this.SaveAddress.getArguments().slice(2));
	},
	AddAddress: function(json) {
		return this.invoke("AddAddress", {"json":json}, this.AddAddress.getArguments().slice(1));
	},
	DelPassenger: function(id) {
		return this.invoke("DelPassenger", {"id":id}, this.DelPassenger.getArguments().slice(1));
	},
	DelContacter: function(id) {
		return this.invoke("DelContacter", {"id":id}, this.DelContacter.getArguments().slice(1));
	},
	DelAddress: function(id) {
		return this.invoke("DelAddress", {"id":id}, this.DelAddress.getArguments().slice(1));
	},
	url: '/ajaxpro/UairB2C.MGOpt,UairB2C.ashx'
}));
UairB2C.MGOpt = new UairB2C.MGOpt_class();




if(typeof UairB2C == "undefined") UairB2C={};
if(typeof UairB2C.MemberOpt_class == "undefined") UairB2C.MemberOpt_class={};
UairB2C.MemberOpt_class = function() {};
Object.extend(UairB2C.MemberOpt_class.prototype, Object.extend(new AjaxPro.AjaxClass(), {
	leaveMg: function() {
		return this.invoke("leaveMg", {}, this.leaveMg.getArguments().slice(0));
	},
	CheckMGLogin: function() {
		return this.invoke("CheckMGLogin", {}, this.CheckMGLogin.getArguments().slice(0));
	},
	AutoLoginMFW: function(uid) {
		return this.invoke("AutoLoginMFW", {"uid":uid}, this.AutoLoginMFW.getArguments().slice(1));
	},
	CheckIsAuthenticated: function() {
		return this.invoke("CheckIsAuthenticated", {}, this.CheckIsAuthenticated.getArguments().slice(0));
	},
	IsMfw: function(str, verify) {
		return this.invoke("IsMfw", {"str":str, "verify":verify}, this.IsMfw.getArguments().slice(2));
	},
	MemberLogin: function(cardNo, pwd) {
		return this.invoke("MemberLogin", {"cardNo":cardNo, "pwd":pwd}, this.MemberLogin.getArguments().slice(2));
	},
	SignOut: function() {
		return this.invoke("SignOut", {}, this.SignOut.getArguments().slice(0));
	},
	LocateUnit: function(agentID, pwd, unitNo) {
		return this.invoke("LocateUnit", {"agentID":agentID, "pwd":pwd, "unitNo":unitNo}, this.LocateUnit.getArguments().slice(3));
	},
	LoginByEmail: function(mail, pwd) {
		return this.invoke("LoginByEmail", {"mail":mail, "pwd":pwd}, this.LoginByEmail.getArguments().slice(2));
	},
	GetDeptList: function(deptID, UID, xslt) {
		return this.invoke("GetDeptList", {"deptID":deptID, "UID":UID, "xslt":xslt}, this.GetDeptList.getArguments().slice(3));
	},
	GetDeptListByDeptNo: function(deptno, xslt) {
		return this.invoke("GetDeptListByDeptNo", {"deptno":deptno, "xslt":xslt}, this.GetDeptListByDeptNo.getArguments().slice(2));
	},
	GetMemberInfo: function() {
		return this.invoke("GetMemberInfo", {}, this.GetMemberInfo.getArguments().slice(0));
	},
	GetContacters: function(uid, xslpath) {
		return this.invoke("GetContacters", {"uid":uid, "xslpath":xslpath}, this.GetContacters.getArguments().slice(2));
	},
	GetPassengers: function(uid, xslpath) {
		return this.invoke("GetPassengers", {"uid":uid, "xslpath":xslpath}, this.GetPassengers.getArguments().slice(2));
	},
	GetAddresser: function(xslpath) {
		return this.invoke("GetAddresser", {"xslpath":xslpath}, this.GetAddresser.getArguments().slice(1));
	},
	UpdateContacter: function(id, name, phone, email) {
		return this.invoke("UpdateContacter", {"id":id, "name":name, "phone":phone, "email":email}, this.UpdateContacter.getArguments().slice(4));
	},
	UpdatePassenger: function(id, name, agetype, idtype, idno, phone) {
		return this.invoke("UpdatePassenger", {"id":id, "name":name, "agetype":agetype, "idtype":idtype, "idno":idno, "phone":phone}, this.UpdatePassenger.getArguments().slice(6));
	},
	UpdateAddress: function(id, name, phone, post, province, city, town, addr) {
		return this.invoke("UpdateAddress", {"id":id, "name":name, "phone":phone, "post":post, "province":province, "city":city, "town":town, "addr":addr}, this.UpdateAddress.getArguments().slice(8));
	},
	UpdateMember: function(id, name, phone, email) {
		return this.invoke("UpdateMember", {"id":id, "name":name, "phone":phone, "email":email}, this.UpdateMember.getArguments().slice(4));
	},
	DelPassenger: function(id) {
		return this.invoke("DelPassenger", {"id":id}, this.DelPassenger.getArguments().slice(1));
	},
	DelContacter: function(id) {
		return this.invoke("DelContacter", {"id":id}, this.DelContacter.getArguments().slice(1));
	},
	DelAddress: function(id) {
		return this.invoke("DelAddress", {"id":id}, this.DelAddress.getArguments().slice(1));
	},
	AddPassenger: function(json) {
		return this.invoke("AddPassenger", {"json":json}, this.AddPassenger.getArguments().slice(1));
	},
	AddContacter: function(json) {
		return this.invoke("AddContacter", {"json":json}, this.AddContacter.getArguments().slice(1));
	},
	AddAddress: function(name, phone, post, province, city, town, addr) {
		return this.invoke("AddAddress", {"name":name, "phone":phone, "post":post, "province":province, "city":city, "town":town, "addr":addr}, this.AddAddress.getArguments().slice(7));
	},
	url: '/ajaxpro/UairB2C.MemberOpt,UairB2C.ashx'
}));
UairB2C.MemberOpt = new UairB2C.MemberOpt_class();


if(typeof UairB2C == "undefined") UairB2C={};
if(typeof UairB2C.OrderSubmitOpt_class == "undefined") UairB2C.OrderSubmitOpt_class={};
UairB2C.OrderSubmitOpt_class = function() {};
Object.extend(UairB2C.OrderSubmitOpt_class.prototype, Object.extend(new AjaxPro.AjaxClass(), {
	GetLoginMember: function() {
		return this.invoke("GetLoginMember", {}, this.GetLoginMember.getArguments().slice(0));
	},
	GetRefundDefByFlt: function(carrier, seat, date, from, to) {
		return this.invoke("GetRefundDefByFlt", {"carrier":carrier, "seat":seat, "date":date, "from":from, "to":to}, this.GetRefundDefByFlt.getArguments().slice(5));
	},
	ICBC_CheckHB: function() {
		return this.invoke("ICBC_CheckHB", {}, this.ICBC_CheckHB.getArguments().slice(0));
	},
	CheckCabinCount: function(flightNo, cabin, date, nowCount, from, to) {
		return this.invoke("CheckCabinCount", {"flightNo":flightNo, "cabin":cabin, "date":date, "nowCount":nowCount, "from":from, "to":to}, this.CheckCabinCount.getArguments().slice(6));
	},
	CheckCabin: function(url, param) {
		return this.invoke("CheckCabin", {"url":url, "param":param}, this.CheckCabin.getArguments().slice(2));
	},
	GetSignUrl: function(reUrl, name, mobile, email, uid, bk, insuretype) {
		return this.invoke("GetSignUrl", {"reUrl":reUrl, "name":name, "mobile":mobile, "email":email, "uid":uid, "bk":bk, "insuretype":insuretype}, this.GetSignUrl.getArguments().slice(7));
	},
	CysGetSignUrl: function(reUrl, bk, insuretype) {
		return this.invoke("CysGetSignUrl", {"reUrl":reUrl, "bk":bk, "insuretype":insuretype}, this.CysGetSignUrl.getArguments().slice(3));
	},
	MGGetSignUrl: function(reUrl, bk, contacter, psg, insuretype) {
		return this.invoke("MGGetSignUrl", {"reUrl":reUrl, "bk":bk, "contacter":contacter, "psg":psg, "insuretype":insuretype}, this.MGGetSignUrl.getArguments().slice(5));
	},
	SavePsgContAddr: function(uid, pjson, cjson, ajson) {
		return this.invoke("SavePsgContAddr", {"uid":uid, "pjson":pjson, "cjson":cjson, "ajson":ajson}, this.SavePsgContAddr.getArguments().slice(4));
	},
	B2CSavePsgContAddr: function(pjson, cjson, ajson) {
		return this.invoke("B2CSavePsgContAddr", {"pjson":pjson, "cjson":cjson, "ajson":ajson}, this.B2CSavePsgContAddr.getArguments().slice(3));
	},
	MGroundTripSubmit: function(http, bk, contacter, psg, insuretype) {
		return this.invoke("MGroundTripSubmit", {"http":http, "bk":bk, "contacter":contacter, "psg":psg, "insuretype":insuretype}, this.MGroundTripSubmit.getArguments().slice(5));
	},
	OpenOrderSubmit: function(url, bk, insuretype) {
		return this.invoke("OpenOrderSubmit", {"url":url, "bk":bk, "insuretype":insuretype}, this.OpenOrderSubmit.getArguments().slice(3));
	},
	roundTripSubmit: function(http, name, mobile, email, uid, bk, insuretype) {
		return this.invoke("roundTripSubmit", {"http":http, "name":name, "mobile":mobile, "email":email, "uid":uid, "bk":bk, "insuretype":insuretype}, this.roundTripSubmit.getArguments().slice(7));
	},
	RefundTicket: function(orderid, route, type, reason, ticknoStr, Source) {
		return this.invoke("RefundTicket", {"orderid":orderid, "route":route, "type":type, "reason":reason, "ticknoStr":ticknoStr, "Source":Source}, this.RefundTicket.getArguments().slice(6));
	},
	GetMember: function(cardNo, name) {
		return this.invoke("GetMember", {"cardNo":cardNo, "name":name}, this.GetMember.getArguments().slice(2));
	},
	setRegexCode: function(mobile) {
		return this.invoke("setRegexCode", {"mobile":mobile}, this.setRegexCode.getArguments().slice(1));
	},
	compareRegexCode: function(code, mobile) {
		return this.invoke("compareRegexCode", {"code":code, "mobile":mobile}, this.compareRegexCode.getArguments().slice(2));
	},
	GetCreditCardType: function(cardNo) {
		return this.invoke("GetCreditCardType", {"cardNo":cardNo}, this.GetCreditCardType.getArguments().slice(1));
	},
	getUrlFlts: function(fltstr, xsl, gorefundstr, backrefundstr) {
		return this.invoke("getUrlFlts", {"fltstr":fltstr, "xsl":xsl, "gorefundstr":gorefundstr, "backrefundstr":backrefundstr}, this.getUrlFlts.getArguments().slice(4));
	},
	url: '/ajaxpro/UairB2C.OrderSubmitOpt,UairB2C.ashx'
}));
UairB2C.OrderSubmitOpt = new UairB2C.OrderSubmitOpt_class();



if(typeof UairB2C == "undefined") UairB2C={};
if(typeof UairB2C.b2c == "undefined") UairB2C.b2c={};
if(typeof UairB2C.b2c.RsaTool_class == "undefined") UairB2C.b2c.RsaTool_class={};
UairB2C.b2c.RsaTool_class = function() {};
Object.extend(UairB2C.b2c.RsaTool_class.prototype, Object.extend(new AjaxPro.AjaxClass(), {
	GetRsaEntity: function() {
		return this.invoke("GetRsaEntity", {}, this.GetRsaEntity.getArguments().slice(0));
	},
	url: '/ajaxpro/UairB2C.b2c.RsaTool,UairB2C.ashx'
}));
UairB2C.b2c.RsaTool = new UairB2C.b2c.RsaTool_class();



export default myajaxpro;