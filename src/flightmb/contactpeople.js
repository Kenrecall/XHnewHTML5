/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp ,mycheckuser,SetCookie,getCookieVal,GetCookie,userOnoffpp ,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层
//myalertp('contactpeople','出错了，获取客服联系电话失败！')
let _view = require('raw!./contactpeople.html');


var bte ='';
var backFlight = '';// 存放 往返标记

export default class {
      path = '/flightmb/contactpeople$';
      hash = '/flightmb/contactpeople';
      title = '常用地址';
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
            bte =params.btype;
            //console.log(bte)
            //if (bte ==40) { // 40 为预定页面进入的
            //    //  返回上一页 参照的 乘机人
            //    $.qu('.contactpeople-tt1').onclick = function(){
            //        $.router.go('#!/flightmb/book',{pbtype:40,data:''},false)
            //
            //    }
            //    //backFlight =params.backFlight; 乘机人 区别儿童 往返
            //}else{
            //    $.qu('.contactpeople-tt1').onclick = function(){
            //        $.router.go('#!/flightmb/allmytickes',{},false)
            //    }
            //}



          $.qu('.contactpeople-tt1').onclick = function(){
              if (bte ==40) { // 40 为预定页面进入的
                  //  返回上一页 参照的 乘机人
                  $.router.go('#!/flightmb/book',{pbtype:40,data:''},false)
              }else{
                  $.router.go('#!/flightmb/allmytickes',{},false)
              }



          }
            // 模拟数据 填充 页面
          //mycheckuser('contactpeople',function (){
          //    console.log('常用地址验证登录通过')
          //    pullContactData();//  服务器 拉取数据
          //})


          //if(GetCookie('xhtime') ==1){
          //    console.log('常用地址验证登录通过')
          //    pullContactData();//  服务器 拉取数据
          //}else{
          //    mycheckuser('contactpeople',function (){
          //        SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
          //        console.log('常用地址验证登录通过')
          //        pullContactData();//  服务器 拉取数据
          //    })
          //}

          //pullContactData();
          userOnoffpp('c', pullContactData,'contactpeople','','','抱歉，您登录超时，请前往登陆页面~~');
      }
}

//  点击相关函数
function allclickF(){
    // 删除联系地址
    $.each( $.qus('.contactpeople-boxbtn1'),function () {
        this.onclick = function (e) {
            var that = this;
            //弹层
            $.qu('.contactpeople-boxbtn1lay').style.display ='-webkit-box';
            $.qu('.contactpeople-boxsp1').onclick = function(){
                //that.parentNode.style.display = 'none';
                var  thecontactid = that.parentNode.getAttribute('valueid')
                //console.log(thecontactid)
                var  dataass ={
                    id:thecontactid
                }
                //if(GetCookie('xhtime') ==1){
                //    console.log('删除常用地址失败登录验证通过，无')
                //    //UairB2C.MGOpt.DelAddress(thecontactid, function (rs) {
                //    //    if (rs.value) {
                //    //        rs = eval("(" + rs.value + ")");
                //    //        //console.log(rs)
                //    //        if (rs.ret) {
                //    //            // 模拟数据 填充 页面
                //    //            pullContactData();
                //    //
                //    //        } else {
                //    //            //alert("删除常用地址失败");
                //    //            myalertp('contactpeople','删除常用地址失败,请重试')
                //    //        }
                //    //    }
                //    //});
                //
                //
                //
                //    mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelAddress', (err, res) => {
                //        console.log(err)
                //        console.log(res)
                //        var bdata =eval('(' +res+ ')');
                //        if (bdata.value) {
                //            var rs = eval("(" + bdata.value + ")");
                //            //console.log(rs)
                //            if (rs.ret) {
                //                // 模拟数据 填充 页面
                //                pullContactData();
                //            } else {
                //                //alert("删除常用地址失败");
                //                myalertp('contactpeople','删除常用地址失败,请重试')
                //            }
                //        }
                //    });
                //
                //}else{
                //    mycheckuser('contactpeople',function (){
                //        SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
                //        console.log('删除乘机人登录验证通过')
                //        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelAddress', (err, res) => {
                //            console.log(err)
                //            console.log(res)
                //            var bdata =eval('(' +res+ ')');
                //            if (bdata.value) {
                //                var rs = eval("(" + bdata.value + ")");
                //                //console.log(rs)
                //                if (rs.ret) {
                //                    // 模拟数据 填充 页面
                //                    pullContactData();
                //                } else {
                //                    //alert("删除常用地址失败");
                //                    myalertp('contactpeople','删除常用地址失败,请重试')
                //                }
                //            }
                //        });
                //    })
                //}



                userOnoffpp('c', function () {
                    mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelAddress', (err, res) => {
                        console.log(err)
                        console.log(res)
                        var bdata =eval('(' +res+ ')');
                        if (bdata.value) {
                            var rs = eval("(" + bdata.value + ")");
                            //console.log(rs)
                            if (rs.ret) {
                                // 模拟数据 填充 页面
                                pullContactData();
                            } else {
                                //alert("删除常用地址失败");
                                myalertp('contactpeople','删除常用地址失败,请重试')
                            }
                        }
                    });

                },'contactpeople','','','报告小主，您登录超时，请前往登陆页面~~');




                $.qu('.contactpeople-boxbtn1lay').style.display ='none';
            }
            $.qu('.contactpeople-boxsp2').onclick = function(){
                $.qu('.contactpeople-boxbtn1lay').style.display ='none';
            }
            var e = e || window.e;
            e.stopPropagation();
        }
    })
    //修改地址
    $.each( $.qus('.contactpeople-boxbtn2'),function () {
        this.onclick = function (e) {
            var that = this;
            var data =JSON.parse(this.parentNode.getAttribute('data'));
            $.router.go('#!/flightmb/changeadd',{type:2,linktype:bte,addrdata:data},true)


            var e = e || window.e;
            e.stopPropagation();
        }
    })
    //  增加联系地址
    $.qu('.addcontactpeople').onclick= function(){
        $.router.go('#!/flightmb/changeadd',{type:1,linktype:bte},true)
    }


}

//选择地址  点击地址
function  theaddredatatobook(){
    var  alladdbox = $.qus('.contactpeople-box');
    for(var i=0;i<alladdbox.length;i++){
        alladdbox[i].onclick = function(){
            var cdat ={
                psid: this.getAttribute('valueid'),
                data: JSON.parse(this.getAttribute('data'))
            }
            if(bte==40){
                $.router.go('#!/flightmb/book',{pbtype:40,data:cdat},true)
            }

        }
    }

}

//  联系地址 页面数据拉取

function pullContactData(){
    //$.qu('.lodin-pa').style.display ='-webkit-box';

    var oData2 = '';
    var conData ='';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETADDRESSES','false');
    xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETADDRESSES','false');
    xhr.send();
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                //$.qu('.lodin-pa').style.display ='none';
                //  判断服务器返回的状态 200 表示 正常
                var data =xhr.responseText;
                var  data1 = eval('('+data+')');
                //console.log(typeof data1)
               // console.log(data1)
                if(data1.Status == 1){ // 1 表示 有数据
                    conData =data1.Result.Addresses;

                        // 页面填充数据
                        topasengerHtml(conData);
                        // 点击事件 必须放在 页面填充数据完成 之后
                        allclickF();
                        // 点击带数据 返回book页面
                        theaddredatatobook();
                }else{ // 2 表示 没有填充数据
                        $.qu('.contactpeople-wrap').innerHTML='';
                        //  增加联系地址
                        $.qu('.addcontactpeople').onclick= function(){
                             $.router.go('#!/flightmb/changeadd',{type:1,linktype:bte},false)
                        }
                }
            }else{
                //alert('出错了，Err' +xhr.status);
                myalertp('contactpeople','获取常用地址出错了，Err' +xhr.status)
            }
        }
    }

}

// 地址数据整合html
function topasengerHtml(addressData){


    var str1 ='';
    for(var i=0;i<addressData.length;i++){
        var  data =JSON.stringify(addressData[i])
        str1 +='<div class="contactpeople-box  clear" valueid="'+addressData[i].ID+'" data='+data+' ><ul class="contactpeople-box1"><li class="contactpeople-sp1">姓名</li><li class="contactpeople-sp1">电话</li><li class="contactpeople-sp1">地址</li></ul><ul class="contactpeople-box2 clear"><li class="contactpeople-name">'+addressData[i].Name+'</li><li class="contactpeople-phone">'+addressData[i].Phone+'</li><li class="contactpeople-addre">'+addressData[i].Province+addressData[i].City+addressData[i].Town+addressData[i].Addr+'</li></ul><span class="contactpeople-boxbtn1">删除</span><span class="contactpeople-boxbtn2" >修改</span></div>';
    }
    $.qu('.contactpeople-wrap').innerHTML =str1;
}
