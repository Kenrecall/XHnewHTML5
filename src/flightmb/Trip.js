/**
 * Created by way on 17/2/7.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层
//myalertp('Trip','出错了，获取客服联系电话失败！')
let _view = require('raw!./Trip.html');

var btype = '';
var readata = '';

export default class {
    path = '/flightmb/Trip$';
    hash = '/flightmb/Trip';
    title = '订单详情';
    constructor(opt) {
        opt = opt || {};
        this.path = opt.path || this.path;
        this.hash = opt.hash || this.hash;
        this.title = opt.title || this.title;
    }

    // 输出视图
    view(cb) {
        if (!_view) {
            // 静态资源浏览器有缓存,增加时标,强制刷新!
            getView(`${cfg.view.searchJoin}?t=${(+new Date())}`, '', (rs) => {
                _view = rs;
                cb(null, _view);
            });
        } else{
            cb(null, _view);
        }
    }

    // 在已经加载的视图上操作
    bind(dv, params) {
        console.log(params)
        btype = params.btype;
        // 点击返回
        $.qu('.Trip-tt1').onclick =function (){
            $.router.go('#!/flightmb/book',{btype:btype,readata:''},false)
        }
        //  确认按钮
        reasondata();


    }
}
//  点击 带数据返回 book
function reasondata(){
    $.qu('.Trip-sb').onclick = function(){
         readata ={
             TripType: $.id('TripType').value,
             TripReason: $.id('TripReason').value,
             PriceReason: $.id('PriceReason').value,
             TripNote: $.qu('.Trip-main1-in').value
         }
         $.router.go('#!/flightmb/book',{btype:btype,readata:readata},true)
    }

}