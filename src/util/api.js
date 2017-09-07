/**
 * Created by way on 16/9/19.
 * 调用后台api接口
 * 所有调用需要 token 身份, 如没有则自动获取, 并保存到 sessionStorage
 */

import * as ajax from '../lib/kajax';
import cfg from '../config';
import {urlParam,getBaseUrl} from '../lib/kutil';

export function token(val) {
  if (val !== undefined)
    sessionStorage.setItem(cfg.app.token, val);
  else {
    return cfg.dev.token ? cfg.dev.token : sessionStorage.getItem(cfg.app.token) || '';
  }
}

export function code(val) {
  if (val !== undefined)
    sessionStorage.setItem(cfg.app.code, val);
  else {
    return sessionStorage.getItem(cfg.app.code) || '';
  }
}

export function lastCode(val) {
  if (val !== undefined)
    sessionStorage.setItem(cfg.app.lastCode, val);
  else {
    return sessionStorage.getItem(cfg.app.lastCode) || '';
  }
}

export function docker(val) {
  if (val !== undefined)
    sessionStorage.setItem(cfg.app.docker, val);
  else {
    return sessionStorage.getItem(cfg.app.docker) || 'wx';
  }
}

export function host() {
  return docker() === 'rel' ? cfg.rel.host : cfg.api.host;
}

/**
 * 通过url中的code获得openid
 * @param tx 存储 token的 input
 * @param cb
 */
export function getToken(cb) {
  if (token())
    cb(null, token());
  else {
    if (!code())
      code(urlParam('code')); // search.substring(search.indexOf('=') + 1, search.length);
    // alert(`getToken code:${code}`);
    /*
     if (AUTH_URL && (!code || code === 'undefined') && failcnt < 3) {
     failcnt++;
     location.href = AUTH_URL;
     }
     */

    if (code() && code() !== lastCode()) {
      const url = docker() === 'rel' ? `${cfg.rel.host}${cfg.rel.token}`
        : `${cfg.api.host}${cfg.api.token}`;
      // alert(`getToken url:${url} code:${code()}`);
      ajax.get(url, `code=${code()}`, rs => {
        // alert(`getToken code:${code()} rs:${rs}`);
        lastCode(code());
        if (rs) {
          const r = JSON.parse(rs);
          if (r.rc === 200) {
            token(r.token);
            cb(null, r.token);
          } else
            cb(new Error('获取身份信息失败,请退出重新打开或联系客服!'), '');
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
/*
export function get(url, param, cb, tk) {
  if (token()) {
    param = param ? `${param}&token=${token()}` : `token=${token()}`;
    url = url.indexOf(host()) === -1 ? `${host()}${url}` : url;
    // alert(`url:${url} para:${para} token:${token()}`);
    ajax.get(url, param, cb);
  } else {
    if (/rel.nuoyadalu.com/.test(url))
      docker('rel');

    getToken((err, tok) => {
      if (tk && err) {
        cb('');
        // alert(err.message);
      } else {
        param = param ? `${param}&token=${tok}` : `token=${tok}`;
        url = url.indexOf(host()) === -1 ? `${host()}${url}` : url;
        // alert(`get url:${url} para:${param}`);
        ajax.get(url, param, cb);
      }
    });
  }
}
*/

export function getView(url, param, cb) {
  // alert(`url:${url} para:${para}`);
  ajax.get(url.indexOf(cfg.view.host) === -1 ? `${cfg.view.host}${url}` : url, param, cb);
}

export function getDoc(url, param, cb) {
  // alert(`url:${url} para:${para}`);
  ajax.get(url.indexOf(cfg.doc.host) === -1 ? `${cfg.doc.host}${url}` : url, param, cb);
}

/**
 *
 * @param url
 * @param data
 * @param cb
 * @param tk  是否必须 token，否则错误返回
 */
/*
export function post(url, data, cb, tk) {
  if (token()) {
    if ((typeof data) === 'object')
      data.token = token();
    else
      data = data ? `${data}&token=${token()}` : `token=${token()}`;

    url = url.indexOf(host()) === -1 ? `${host()}${url}` : url;
    // alert(`url:${url} para:${data} token:${token()}`);
    ajax.post(url, data, cb);
  } else {
    if (/rel.nuoyadalu.com/.test(url))
      docker('rel');

    getToken((err, tok) => {
      if (tk && err) {
        cb(err, '');
        // alert(err.message);
      } else {
        if ((typeof data) === 'object')
          data.token = tok;
        else
          data = data ? `${data}&token=${tok}` : `token=${tok}`;

        url = url.indexOf(host()) === -1 ? `${host()}${url}` : url;
        // alert(`post url:${url} para:${data}`);
        ajax.post(url, data, cb);
      }
    });
  }
}
*/

export function postForm(url, data, cb) {
  if (token()) {
    data.append('token', token());
    ajax.postForm(url.indexOf(host()) === -1 ? `${host()}${url}` : url, data, cb);
  } else {
    if (/rel.nuoyadalu.com/.test(url))
      docker('rel');
    getToken((err, tk) => {
      data.append('token', tk);
      ajax.postForm(url.indexOf(host()) === -1 ? `${host()}${url}` : url, data, cb);
    });
  }
}

/**
 * 从服务器获取微信上传签名、时标
 * @param type
 * @returns {string}
 */
export function getWxSign(cb) {
  let href = `url=${location.href}`;
  href = href.replace(/&/, '%26');
  href = href.replace(/#[\s\S]*$/, '');
  ajax.get(`${cfg.api.host}${cfg.api.wxsign}`, href, rs => {
    cb(JSON.parse(rs));
  });
}

// alert 弹层 优化函数  //没有函数  就只是提示  有函数 则执行
export function myalertp(id,message,fn){
    //var str1 = '<div class="mianpger-boxbtn1lay"></div>';
    if(!$.qu('.city-a-wrap')){
      var div = document.createElement("div");
      var div_html ='<div class="city-a"><p class="city-a-boxp1">'+message+'</p><span class="city-a-boxsp1">确定</span></div>'
      div.setAttribute("class", "city-a-wrap");
      var fdiv = $.id(id);
      fdiv.appendChild(div);


      div.innerHTML =div_html;
      $.qu('.city-a-boxsp1').onclick = function(){
        $.id(id).removeChild($.qu('.city-a-wrap'));
        fn&&fn()

      }
    }

}



// 新的登陆方式
//具体参数说明
// num  路由跳转关键字 可以在 主js文件 看初始路由跳转
// fn   判断已经登陆的成功的 回调函数
// pageid  当前层的id 用于alert弹层
// layercla  ajxa请求动画  对应的是当前页的 动画class
// data  返回搜索页面 初始路由跳转的 参数
//alertms 弹层 提示信息
//isalert 是否需要弹出提示  1 表示不需要  空 则表示需要

export function userOnoffpp(num,fn,pageid,layercla,data,alertms,isalert) {
  if(layercla){
     $.qu(layercla).style.display = '-webkit-box';
  }


 //var mycode = encodeURIComponent(String(num));


  var myUrlad =getBaseUrl( window.location.href);
  var key ='';
  if(myUrlad.indexOf('?')!= -1){// 有问号 ？了
      key ='&';
  }else{
     key ='?';
  }
  var mycoden = encodeURIComponent(key+'entry_code='+num);
  //var myUrl =getBaseUrl( window.location.href)+key+'entry_code='+mycode;
  var myUrl =getBaseUrl( window.location.href)+mycoden;

  var oData2 = '';
  var xhr = new XMLHttpRequest();
  var reqPath = flightUrl+'/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
  //var reqPath = flightUrl+'/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
  xhr.open('get', reqPath, 'false');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      // ajax 响内容解析完成，可以在客户端调用了
      if (xhr.status == 200) {
        if(layercla){
          $.qu(layercla).style.display = 'none';
        }

        //  判断服务器返回的状态 200 表示 正常
        oData2 = JSON.parse(xhr.responseText);
        //oData2 =eval(xhr.responseText)
        var sta = oData2.Status;
        var url = oData2.Result;
        //alert(url)
        if (sta == 1) {
          // 1表示已经登录了

          var  theuserdata={
              userName: url.MemberName,
              userID  : url.CardNo,
              xhUnitId: url.UnitId,
              xhPerms: url.Perms
          };
          //alert(`登陆返回perm${url.Perms}`)
          //alert(`UnitId${url.UnitId}`)
          document.cookie = "theUserdata=" + JSON.stringify(theuserdata);
          fn();
          //alert('已经登陆')
          console.log('初次每次都要验证！');
        } else {
          //没有登录
          //alert('没有登陆')
          // document.cookie = "tkey=0";
          document.cookie = "theUserdata=";
          //document.cookie = "userName=";
          //document.cookie = "userID=";
          var  ms = alertms ? alertms:'抱歉，登录超时，将重新登录，请稍后';
          if(isalert){
            location.href = "/html5/" + url;
          }else{
            myalertp(pageid,ms,function(){
              location.href = "/html5/" + url;
            });
          }

          localStorage.setItem('allbookdatastr',data)

        }
      } else {
        //alert('初次验证出错了，Err' + xhr.status);
        myalertp(pageid,'验证用户登录出问题。')
      }
    }
  };
}


//设置本地 定时器  使用了cookie的方法
//取Cookie的值
export function GetCookie(name) {
  var arg = name + "=";
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break;
  }
  return null;
}
//写入到Cookie
//name:cookie名称  value:cookie值
//t :分钟数
export function SetCookie(name, value,t) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60000 * t);//过期时间 2分钟
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

export function getCookieVal(offset) {
  var endstr = document.cookie.indexOf(";", offset);
  if (endstr == -1) endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}

//ajax 封装的方法  之后要优化 asyn 是否异步 如果空 则为true 否则为当前的 asyn
export function mypost(url, data, method, cb,asyn) {
    var  xhr ='';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && cb) {
            if (xhr.status === 200)
                cb(null, xhr.responseText);
            else
                cb(new Error(xhr.status), xhr.responseText);
        }
    };

    // 异步 post,回调通知

    let isasyn=true;
    if(asyn){
      isasyn =asyn;
    }

    xhr.open('POST', url, isasyn);
    let param = data;
    if ((typeof data) === 'object')
        param = JSON.stringify(data);

    xhr.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
    if(method){
      xhr.setRequestHeader('X-AjaxPro-Method', method);
    }
    xhr.send(param);
}

//ajax 封装的方法  之后要优化
export function myget(url, data, asyn, cb) {
  var xhr = '';
  if(window.XMLHttpRequest){
    xhr = new XMLHttpRequest();
  }else{
    xhr =new ActiveXObject(' Microsoft . XMLHTTP')
  }
  //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source=XHSV','false');
  xhr.open('get',url+'?'+data ,asyn);
  xhr.send();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && cb) {
      if (xhr.status === 200)
        cb(null, xhr.responseText);
      else
        cb(new Error(xhr.status), xhr.responseText);
    }
  };
}


// 新的 post方法
export function mypostn(url, data, asyn,cb) {
  var  xhr ='';
  if(window.XMLHttpRequest){
    xhr = new XMLHttpRequest();
  }else{
    xhr =new ActiveXObject(' Microsoft . XMLHTTP')
  }

  xhr.onreadystatechange =function() {
    if (xhr.readyState === 4 && cb) {
      if (xhr.status === 200)
        cb(null, xhr.responseText);
      else
        cb(new Error(xhr.status), xhr.responseText);
    }
  };

  // 异步 post,回调通知

  let isasyn=true;
  if(asyn){
    isasyn =asyn;
  }

  xhr.open('POST', url, isasyn);
  let param = data;
  if ((typeof data) === 'object')
    param = JSON.stringify(data);

  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(param);
}

//设置 titile
export function setTitle(val) {

  //let  myurl = (window.location.href).split('/');
  //let myurlkey = myurl[myurl.lentth-1];
  //console.log(myurlkey)


  setTimeout(() => {
    // 利用iframe的onload事件刷新页面
    document.title = val;

    const fr = document.createElement('iframe');
    // fr.style.visibility = 'hidden';
    fr.style.display = 'none';
    fr.src = 'img/back.bg.png';
    fr.onload = () => {
      setTimeout(() => {
        document.body.removeChild(fr);
      }, 0);
    };
    document.body.appendChild(fr);
  }, 0);
}
