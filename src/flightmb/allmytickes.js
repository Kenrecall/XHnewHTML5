/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层
//myalert('allmytickes','')
let _view = require('raw!./allmytickes.html');


var phonenum ='';// 存放ajax获取的电话号码
// var fcity = 'a';
// var tcity ='';
// var OT = 1;
// var theID ='';
// var theCarrier=''; //获取改签规则的数据


export default class {
      path = '/flightmb/allmytickes$';
      hash = '/flightmb/allmytickes';
      title = '我的机票';
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

          //setTitle(`我的机票`);

          let  myurl = (window.location.href).split('/');
          let myurlkey = myurl[myurl.length-1];
          console.log(myurlkey)

          //alert(`${history.length}`)
          //alert(`${history[0]}`)

          $.qu('.tab-item1').onclick = function(){
               $.router.go('#!/flightmb/join',{},false)
               $.qu('.thephone1').style.display ='none';
          }



          //  测试加入 所有电话
          pullallmyphone();
          $.qu('.tab-item31').onclick = function(){ // 电话弹层

              $.qu('.thephone1').style.display ='-webkit-box';
              //console.log(phonenum);
              pullnumtohtml(phonenum);
          }

        //  我的历史订单
        $.qu('.allmytickes-m10').onclick = function () {
            $.router.go('#!/flightmb/allmybook',{btype:1},true)
        }
          $.qu('.allmytickes-m11').onclick = function(){ // 乘机人
                $.router.go('#!/flightmb/passenger',{btype:2},true)
          }
          $.qu('.allmytickes-m12').onclick = function(){ // 联系人
                $.router.go('#!/flightmb/mychalinkp',{btype:3},true)
          }
          $.qu('.allmytickes-m13').onclick = function(){ // 地址
            $.router.go('#!/flightmb/contactpeople',{btype:4},true)
          }
        //退出登录 ../icbc/logout.aspx?type=wap
        $.qu('.allmytickes-sb').style.display ='none';

        $.qu('.allmytickes-sb').onclick = function(){
            //location.href = 'http://106.75.131.58:8015/icbc/logout.aspx?type=wap';
            document.cookie="xhtime=0";
            document.cookie="tkey=0";
            location.href = flightUrl+'/icbc/logout.aspx?type=wap';
            //console.log(document.cookie)
        }

      }
}


// 电话按顺序整合
function pullnumtohtml(phonenum){

    var arrdata = phonenum.split(',');
    //console.log(arrdata);
    arrdata.length = 5;
    var data = arrdata.sort(); //排序 按顺序后
    var data1 =[]
    for(var i=0;i<data.length;i++){
        data1.push((data[i].split('|'))[1])
    }
    //console.log(data1)

    var text = ['南航直营客服电话：','深航直营客服电话：','川航直营客服电话：','非直营机票客服电话：','投诉电话：']


    var str2 = ' <span class="thephone-sp1">确定</span>';
    //var

    var str1 ='';
    for(var i=0;i<data1.length;i++){
        var phone =data1[i].replace(/-/g,'');
        str1+='<p><span>'+text[i]+'</span><a href="tel:'+phone+'">'+phone+'</a></p>';

    }
    var str3 =str1+str2;
    $.qu('.thephone-wrap1').innerHTML =str3;
    // 隐藏 电话页面
    $.qu('.thephone-sp1').onclick = function(){
        $.qu('.thephone1').style.display ='none';
    }


}




function getallphonenum(key,n){
    var  oData3 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source=XHSV','false');
    xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+key,'false');

    xhr.send();
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                //  判断服务器返回的状态 200 表示 正常
                oData3 = eval('('+xhr.responseText+')');
                //console.log(oData3)
                var phonts =oData3.Result.Phone;
                var phontn =oData3.Result.Source;
                var dt = n+phontn+'|'+phonts;
                getmyphone(dt)


            }else{
                //alert('出错了，获取客服联系电话失败！');
                myalertp('router0','出错了，获取客服联系电话失败！')
            }
        }
    }
}
// 回调函数 获取电话
function getmyphone(data){
    phonenum +=  data+',';

}


//  5个电话 综合 篇
function pullallmyphone(){
    getallphonenum('XHSV',4)
    getallphonenum('XHTS',5 )
    getallphonenum('CZ',1)
    getallphonenum('ZH',2 )
    getallphonenum('3U',3 )


}