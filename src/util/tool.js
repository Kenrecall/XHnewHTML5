/**
 * Created by way on 16/6/10.
 */

import {get as kget, post} from '../lib/kajax';

/* global txToken */
/* global wx */

/**
 * 格式化字符串，类似 node util中带的 format
 * @type {Function}
 */
export function format(f, ...args) {
  let i = 0;
  const len = args.length;
  const str = String(f).replace(/%[sdj%]/g, x => {
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

/**
 * 修改微信 title
 */
export function setTitle(val) {
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

export function urlParam(name) {
  let rc = null;

  const val = `&${location.search.substr(1)}&`;
  const rg = new RegExp(`&${name}=([^&]*)&`);
  const rgs = rg.exec(val);
  if (rgs) {
    rc = rgs[1];
    rc = decodeURIComponent(rc);
  }

  return rc;
}

export function wxConfig(api) {
  let apis = api;
  if (!apis)
    apis = [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'translateVoice',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'];

  getWxSign(rs => {
    // alert(`sign:${rs.sign} stamp:${rs.stamp}`);
    wx.config({
      debug: false,
      appId: 'wx02da95761cb1c55e',
      timestamp: rs.stamp,
      nonceStr: 'Wm3WZYTPz0wzccnW',
      signature: rs.sign,
      jsApiList: apis
    });
  });
}