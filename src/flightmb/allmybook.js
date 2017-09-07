

/**
 * Created by way on 17/2/20.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,mycheckuser,SetCookie,getCookieVal,GetCookie,userOnoffpp,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层
let _view = require('raw!./allmybook.html');
// var fcity = 'a';
// var tcity ='';
// var OT = 1;
// var theID ='';
// var theCarrier=''; //获取改签规则的数据


export default class {
    path = '/flightmb/allmybook$';
    hash = '/flightmb/allmybook';
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
        //setTitle(`历史订单`);
        //setRygTile();

        let  myurl = (window.location.href).split('/');
        let myurlkey = myurl[myurl.length-1];
        console.log(myurlkey)

        //匿名函数
        function setRygTile(){
            getHistory();
            var flag=false;
            setTimeout(function(){
                flag=true
            },1000)
            window.addEventListener('popstate',function(e){
                //监听到返回事件
                if(flag){
                    //自己想要做的事情
                }
                getHistory();
            },false);
            function getHistory(){
                var state={
                    title:'',
                    url:'#'//可写返回事件的跳转路径
                } ;
                window.history.pushState(state,'title','#');
            }
        }

        userOnoffpp('s',function(){
            getorderdata(GetDateStrH(getnowdate(),-720),getnowdate())//  30天 24小时 后退 多少小时
        },'allmybook','.lodinab','','抱歉，登录超时，将重新登录!');



        // 页面返回
        $.qu('.allmybook-tt1').onclick = function (){
            $.router.go('#!/flightmb/allmytickes',{prot:1},false)
        }


        //mycheckuser('allmybook',function (){
        //    console.log('历史订单验证登录通过')
        //    getorderdata(GetDateStrH(getnowdate(),-168),getnowdate());
        //})

    }
}

// 获取当前时间
function getnowdate(){
    var myTime = new Date();
    var iYear = myTime.getFullYear();
    var iMonth = myTime.getMonth()+1;
    var iDate = myTime.getDate();

    var str = iYear+ '-' +toTwo(iMonth)+'-'+ toTwo(iDate);
    return str
}

function toTwo(n) {    //  转换为 带0的
    return  n < 10 ?  '0' + n : '' + n;
}
//  某个时间的 前后几个小时
// function GetDateStrH(data1,h) {

//     var  Y1 = data1.substring(0, 4);
//     var  m1 = data1.substring(5, 7)-1;
//     var  d1 = data1.substring(8, 10);
//     // var  h1 = data1.substring(11, 13);
//     // var  M1 = data1.substring(14, 17);
//     var  dd = new Date(Y1,m1,d1)
//     dd.setHours(dd.getHours() + h);//获取AddDayCount天后的日期
//     var y = dd.getFullYear();
//     var m = dd.getMonth() + 1;//获取当前月份的日期
//     var d = dd.getDate();

//     if ((m + "").length == 1) {
//         m = "0" + m;
//     }
//     if ((d + "").length == 1) {
//         d = "0" + d;
//     }

//     return  y + "-" + m + "-" + d

// }


// 获取历史订单

function getorderdata(date1,date2){
    $.qu('.lodinab').style.display ='-webkit-box';
    //$.id('loadorder-type').innerHTML ='加载数据中...';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft.XMLHTTP')
    }
    // xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETUSEDORDERS&ST='+date1+'&ET='+date2,'false');
    // //xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETDSONEPRICE','false');
    // xhr.send();

    xhr.open('post',flightUrl+'/icbc/xhService.ashx','false');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send('act=GETUSEDORDERS&ST='+date1+'&ET='+date2);
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                $.qu('.lodinab').style.display ='none';
                //$.id('loadorder-type').innerHTML ='加载数据中...';
                //  判断服务器返回的状态 200 表示 正常
                var  data1 = eval('('+xhr.responseText+')');
                console.log(data1);
                if(data1.Status == 1){//  获取数据成功
                     var mydata = data1.Result.Orders;
                     toorderhtml(mydata);

                }else{
                    //alert('登陆状态超时或获取数据失败，请重试或者登陆！')
                    myalertp('allmybook','登陆状态超时或获取数据失败，请重试或者登陆！')
                }
            }else{
                //alert('出错了，Err' +xhr.status);
                myalertp('allmybook','获取历史订单出错了，Err'+xhr.status)
            }
        }
    }
}

// 根据数据  整合到页面
function toorderhtml(data){
    var str ='';
    for(var i=0;i<data.length;i++){
        if(data[i].IsShow ==1){

            var isft = '';// 判断 往返 儿童 成人
            var n = data[i].Type;// 判断是否要写 成人儿童 往返
            var twoordernum = '';
            var order1 = '';// 去程 或者 成年订单
            var order2 = '';// 返程 或者 儿童订单
            var OrderID = '';
            var looktype  =0 ;// 默认为 一个订单  非混合订单
            if(n != '0'){　//不为0　　则为混合订单
                if(n == '11' || n == '12'){
                    isft = '(成人儿童)';
                }else if( n == '22' || n == '21'){
                    isft = '(往返)';
                }
                twoordernum ='twoordernum';// 特殊class
                data[i].Order1[0].personal = data[i].personal;
                data[i].Order2[0].personal = data[i].personal;
                order1 = JSON.stringify(data[i].Order1);
                order2 = JSON.stringify(data[i].Order2);
                OrderID = data[i].Order2[0].OrderID +','+data[i].Order1[0].OrderID;
                looktype =1;

            }else{//　为０　　则不为混合订单
                isft ='';
                twoordernum = '';
                order1 = '';
                order2 = '';
                OrderID = data[i].OrderID;
                looktype =0;
            }

            if(data[i].OrderStatus == "未付款" || data[i].OrderStatus == ""){// 底部按钮
                if( n !="0") {
                    //混合订单
                    var str1 ='<span class="allmybook-boxtblook boxtblook" looktype ="'+looktype+'" OrderID ="'+data[i].OrderID+'" ordertime ="'+data[i].OrderDate+' '+data[i].OrderTime+'" isdft="'+isDirect(data[i].FltNo, data[i].personal,data[i].CabinType)+'" personal="'+data[i].personal+'" >查看</span>'+'<span class="allmybook-boxtblook boxtbpay" OrderID ="'+OrderID+'" looktype ="'+looktype+'"  personal = "'+data[i].personal+'" >支付</span>' +'<span class="allmybook-boxtblook boxtbcansel"  OrderID = "'+OrderID+'" looktype ="'+looktype+'">取消订单</span>';
                }else{
                    //单程订单
                    var str1 ='<span class="allmybook-boxtblook boxtblook" looktype ="'+looktype+'" OrderID ="'+data[i].OrderID+'" ordertime ="'+data[i].OrderDate+' '+data[i].OrderTime+'" isdft="'+isDirect(data[i].FltNo, data[i].personal,data[i].CabinType)+'" personal="'+data[i].personal+'" >查看</span>'+'<span class="allmybook-boxtblook boxtbpay" OrderID ="'+data[i].OrderID+'" looktype ="'+looktype+'"   personal = "'+data[i].personal+'">支付</span>' +'<span class="allmybook-boxtblook boxtbcansel"  OrderID = "'+OrderID+'" looktype ="'+looktype+'">取消订单</span>';
                }
            }else if(data[i].HasTickets == "1"){
                //改期or 退票
                //直营航班没有改期 只有退票
                var str1 = '<span class="allmybook-boxtblook boxtblook" looktype ="'+looktype+'" OrderID ="'+data[i].OrderID+'" ordertime ="'+data[i].OrderDate+' '+data[i].OrderTime+'" isdft="'+isDirect(data[i].FltNo, data[i].personal,data[i].CabinType)+'" personal="'+data[i].personal+'" >查看</span>'+'<span class="allmybook-boxtblook boxtRefunds" OrderID ="'+data[i].OrderID+'" wStatus="1" ordertime ="'+data[i].OrderDate+' '+data[i].OrderTime+'" looktype ="'+looktype+'" isdft="'+isDirect(data[i].FltNo, data[i].personal,data[i].CabinType)+'">退票</span>' +'<span class="allmybook-boxtblook  boxtChange" OrderID ="'+data[i].OrderID+'" wStatus="2" ordertime ="'+data[i].OrderDate+' '+data[i].OrderTime+'" looktype ="'+looktype+'" isdft="'+isDirect(data[i].FltNo, data[i].personal,data[i].CabinType)+'" twoMa="'+getTwoMa(data[i].FltNo)+'">改期</span>';
            }else{
                if(looktype ==1){
                    var str1 = '<span class="allmybook-boxtblook boxtblook" OrderID ="'+data[i].OrderID+'" ordertime ="'+data[i].OrderDate+' '+data[i].OrderTime+'" looktype ="'+looktype+'" isdft="'+isDirect(data[i].FltNo, data[i].personal,data[i].CabinType)+'" personal="'+data[i].personal+'" >查看</span>';
                }else{
                    var str1 = '<span class="allmybook-boxtblook boxtblook" OrderID ="'+data[i].OrderID+'" ordertime ="'+data[i].OrderDate+' '+data[i].OrderTime+'" looktype ="'+looktype+'" isdft="'+isDirect(data[i].FltNo, data[i].personal,data[i].CabinType)+'" personal="'+data[i].personal+'" >查看</span>';
                }
            }
            str  +='<div class="allmybook-box '+twoordernum+'"  order1='+order1+'  order2='+order2+'><p class="allmybook-boxtm"><img class="flight-logo" src="https://cos.uair.cn/mb/img/flight-logo.png"><span class="allmybook-boxtm1  allmybookf">'+data[i].From+'</span><span class="d-wrapl1-right2"><strong></strong></span><span class="allmybook-boxtm5 allmybookt">'+data[i].To+'</span><span class="flight-lines"><em class="allmybook-boxtem2">'+data[i].FltNo+'</em></span><span class="allmybook-boxtsp3 price-right"><em class="price-icon">￥</em><em class="allmybook-boxtem3">'+data[i].Price+'</em></span></p><div class="allmybook-boxt"><span class="allmybook-boxtsp1"><em class="flight-n">订单号:</em><em class="flight-NM">'+data[i].OrderID+'</em><em class="theage">'+isft+'</em></span><span class="allmybook-boxtsp2"><em class="allmybook-boxtem1">'+data[i].OrderStatus+'</em></span></div><div class="allmybook-boxtb"><span class="allmybook-boxtm3"><em class="allmybook-boxtm32">'+getLastFive(data[i].FltDate)+'</em><em class="allmybook-boxtm31">'+data[i].FltTime+'</em></span><span class="line-width">至</span><span class="allmybook-boxtm4"><em class="allmybook-boxtm42">'+isNextDay(data[i].FltTime,data[i].ArrTime,data[i].FltDate)+'</em><em class="allmybook-boxtm41">'+data[i].ArrTime+'</em></span></div><p class="last-btns">'+str1+'</p></div>';
        }else{ // IsShow ==0

        }
    }
    var str2 ='<div class="allmybook-more">点击查看一个月内的订单！';
    $.qu('.allmybook-mainwrap').innerHTML =str+str2;
    // 添加点击事件
    // theookfn();
    oneClickFn($.qus(".boxtblook"));
    //退票点击
    oneClickFn($.qus(".boxtRefunds"));
    //改期点击
    oneClickFn($.qus(".boxtChange"));
    //
    // 添加 混合订单 弹层
    getblendorder();
    // 取消订单
    boxtbcansel();
    // 支付
    payallmybook();


}

function getTwoMa(obj){
    return obj.substring(0, 2);
}
// 点击 混合订单  往返   成人儿童 显示弹层
function getblendorder(){
    var  twoordernums = $.qus('.twoordernum');
    if(twoordernums.length != 0){
        for(var i=0; i<twoordernums.length;i++){
            twoordernums[i].onclick = function (){
                $.qu('.allmybook-boxlayer').style.display = '-webkit-box';
                var border1 = JSON.parse( this.getAttribute('order1'))[0];
                var border2 = JSON.parse( this.getAttribute('order2'))[0];
                //  支付状态 会出现异常  第一个订单 支付状态不会改变
                if(border2.OrderStatus  == "未付款" || border2.OrderStatus == ""){

                    border2.OrderStatus =  border1.OrderStatus;
                }
                // 弹层 填入数据
                $.qu('.allmybook-boxlayerr').innerHTML =tohtml(border2)+ tohtml(border1);
                // 添加点击事件 查看
                twoClickFn($.qus(".boxtblook"));
                //改期点击
                twoClickFn($.qus(".boxtChange"));
                //退票点击
                twoClickFn($.qus(".boxtRefunds"));
                // 取消弹层
                $.qu('.allmybook-boxlayerr').onclick =function (){
                    this.innerHTML ='';
                    $.qu('.allmybook-boxlayer').style.display = 'none';

                }
                $.qu('.allmybook-boxlayer').onclick = function() {
                    $.qu('.allmybook-boxlayerr').innerHTML = '';
                    $.qu('.allmybook-boxlayer').style.display = 'none';
                }


            }
        }
    }
}
// 混合 弹层 数据 打包
function tohtml(data){
    var str ='';
    var isft = '';// 判断 往返 儿童 成人
    var n = data.Type;// 判断是否要写 成人儿童 往返
    if(n == '11' ){
        isft = '(儿童)';
    }else if( n == '22' ){
        isft = '(去程)';
    }else if(n == '12'){
        isft = '(成人)';
    }else if( n == '21'){
        isft = '(返程)';
    }
    var str1 = '';
    var looktype  =0
    if(data.OrderStatus == "未付款" || data.OrderStatus == ""){// 底部按钮
        str1 = '<span class="allmybook-boxtblook boxtblook boxtblookh" looktype ="'+looktype+'" OrderID ="'+data.OrderID+'" ordertime ="'+data.OrderDate+' '+data.OrderTime+'" isdft="'+isDirect(data.FltNo, data.personal,data.CabinType)+'" personal="'+data.personal+'"  >查看</span>';
    }else if(data.HasTickets == "1"){
        //直营航班没有改期 只有退票
            var str1 = '<span class="allmybook-boxtblook boxtblook" OrderID ="'+data.OrderID+'" looktype="'+looktype+'" ordertime ="'+data.OrderDate+' '+data.OrderTime+'" isdft="'+isDirect(data.FltNo, data.personal,data.CabinType)+'"  personal="'+data.personal+'" >查看</span>'+'<span class="allmybook-boxtblook boxtRefunds" OrderID ="'+data.OrderID+'" looktype="'+looktype+'" wStatus="1" ordertime ="'+data.OrderDate+' '+data.OrderTime+'" isdft="'+isDirect(data.FltNo, data.personal,data.CabinType)+'">退票</span>' +'<span class="allmybook-boxtblook  boxtChange" OrderID ="'+data.OrderID+'" looktype="'+looktype+'"  wStatus="2" ordertime ="'+data.OrderDate+' '+data.OrderTime+'" isdft="'+isDirect(data.FltNo, data.personal,data.CabinType)+'" twoMa="'+getTwoMa(data.FltNo)+'">改期</span>';
    }else {
        str1 = '<span class="allmybook-boxtblook boxtblook boxtblookh" OrderID ="'+data.OrderID+'" looktype="'+looktype+'" ordertime ="'+data.OrderDate+' '+data.OrderTime+'" isdft="'+isDirect(data.FltNo, data.personal,data.CabinType)+'" personal="'+data.personal+'" >查看</span>';
    }
    str='<div class="allmybook-box"><p class="allmybook-boxtm"><img class="flight-logo" src="https://cos.uair.cn/mb/img/flight-logo.png"><span class="allmybook-boxtm1  allmybookf">'+data.From+'</span><span class="d-wrapl1-right2"><strong></strong></span><span class="allmybook-boxtm5 allmybookt">'+data.To+'</span><span class="flight-lines"><em class="allmybook-boxtem2">'+data.FltNo+'</em></span><span class="allmybook-boxtsp3"><em class="price-icon">￥</em><em class="allmybook-boxtem3">'+data.Price+'</em></span></p><div class="allmybook-boxt"><span class="allmybook-boxtsp1"><em class="flight-n">订单号:</em><em class="flight-NM">'+data.OrderID+'</em><em class="theage">'+isft+'</em></span><span class="allmybook-boxtsp2"><em class="allmybook-boxtem1">'+data.OrderStatus+'</em></span></div><div class="allmybook-boxtb"><span class="allmybook-boxtm3"><em class="allmybook-boxtm32">'+getLastFive(data.FltDate)+'</em><em class="allmybook-boxtm31">'+data.FltTime+'</em></span><span class="line-width">至</span><span class="allmybook-boxtm4"><em class="allmybook-boxtm42">'+isNextDay(data.FltTime,data.ArrTime,data.FltDate)+'</em><em class="allmybook-boxtm41">'+data.ArrTime+'</em></span></div><p class="last-btns">'+str1+'</p></div>';

    return str;
}

// 取消订单
function boxtbcansel(){
    var thecansele = $.qus('.boxtbcansel');
    for(let i=0; i<thecansele.length;i++){
        thecansele[i].onclick = function(e){// 阻止事件冒泡
            var theid = this.getAttribute('orderid');
            canseleajax(theid);
            var e = e || window.e;
            e.stopPropagation();
        }
    }

}

// 取消 ajax
function canseleajax(theid){
    $.qu('.lodinab').style.display ='-webkit-box';
    //$.id('loadorder-type').innerHTML ='订单取消中...';
    var oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft.XMLHTTP')
    }
    // xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETUSEDORDERS&ST='+date1+'&ET='+date2,'false');
    // //xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETDSONEPRICE','false');
    // xhr.send();

    xhr.open('post',flightUrl+'/icbc/OrderResult.aspx','false');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send('action=1&OrderID='+theid);
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                $.qu('.lodinab').style.display ='none';
                //$.id('loadorder-type').innerHTML ='加载数据中...';
                //  判断服务器返回的状态 200 表示 正常
                var  data1 = eval('('+xhr.responseText+')');
                //console.log(data1)
                if(data1.Status ==1){//  取消订单成功
                    // 重新页面加载数据
                    getorderdata(GetDateStrH(getnowdate(),-168),getnowdate());
                }else{
                    //alert('取消订单失败，请重试或者登陆！')
                    myalertp('allmybook','取消订单失败，请重试或者登陆！')
                }
            }else{
                //alert('出错了，Err' +xhr.status);
                myalertp('allmybook','取消订单出错，Err'+xhr.status)
            }
        }
    }
}

// 点击 查看 按钮 事件
// function theookfnh(){
//     var allbn = $.qus('.boxtblookh');
//     for(let i=0; i<allbn.length;i++){
//              var thetype =allbn[i].getAttribute('looktype');
//              allbn[i].onclick = function (e){
//                  if(thetype ==0) { // 直接 跳转到详情页面
//                      var theorder = allbn[i].getAttribute('orderid');
//                      $.router.go('#!/flightmb/orderd',{orderid:theorder},true);
//                      console.log(theorder);
//                  }
//                  var e = e || window.e;
//                  e.stopPropagation();
//              }
//     }
// }
//退票单程点击

//退票返程点击
//改期单程点击
// function boxtChangeFn() {
//     var changeBtn = $.qus(".boxtChange");
//     for(let i = 0; i< changeBtn.length; i++) {
//         changeBtn[i].onclick = function(e) {
//             var theorder = this.getAttribute("orderid");
//             $.router.go('#!/flightmb/orderd',{orderid:theorder},true);
//             console.log(theorder);        
//             var e = e || window.e;
//              e.stopPropagation();
//         }
//     }
// }
//单层点击封装
function oneClickFn(obj) {
    var changeBtn = obj;
    for(let i = 0; i< changeBtn.length; i++) {
        changeBtn[i].onclick = function() {
            var thetype =this.getAttribute('looktype');
            var theorder = this.getAttribute("orderid");
            var wStatus = this.getAttribute("wStatus");
            var orderTime = this.getAttribute("ordertime");
            var isdft = this.getAttribute("isdft");
            var getTwo = this.getAttribute("twoMa");
            var personal =  this.getAttribute("personal");
            if(thetype == 0) {
                if(wStatus == null) {
                    var nStatus = null;
                    $.router.go('#!/flightmb/orderd',{orderid:theorder,nStatus:wStatus, OrderTime:orderTime, isDft:isdft,Personal:personal},true);
                }else{
                    if(wStatus==2 && isdft == 1) {
                        var arrInfo = getDtel(getTwo);
                        myalertp("allmybook","改期服务请致电"+arrInfo[0]+"客服电话"+arrInfo[1]+",改期服务敬请期待！");
                        return false;
                    }
                    $.router.go('#!/flightmb/orderd',{orderid:theorder, nStatus:wStatus, OrderTime:orderTime, isDft:isdft,Personal:personal},true);
                }
            }
            // console.log(theorder);        
            // var e = e || window.e;
            //  e.stopPropagation();
        }
    }
}

//直营电话。目前只有 南航CZ,深航ZH,川航3U
function getDtel(obj){
    var arr = [];
    switch(obj){
        case "3U":
        arr.push("川航");
        arr.push("95378");
        break;
        case "ZH":
        arr.push("深航");
        arr.push("400-777-4567");
        break;
        case "CZ":
        arr.push("南航");
        arr.push("95539");
        break;
        default:
        arr.push("星合联盟");
        arr.push("4000-662-188");
    }
    return arr;
}
//返程点击封装
function twoClickFn(obj) {
    var changeBtn = obj;
    for(let i = 0; i< changeBtn.length; i++) {
        changeBtn[i].onclick = function(e) {
            var thetype = this.getAttribute("looktype");
            if(thetype == 0) {
                var theorder = this.getAttribute("orderid");
                var wStatus = this.getAttribute("wStatus");
                var orderTime = this.getAttribute("ordertime");
                var isdft = this.getAttribute("isdft");
                var getTwo = this.getAttribute("twoMa");
                if(wStatus == null) {
                    var nStatus = null;
                    $.router.go('#!/flightmb/orderd',{orderid:theorder, nStatus:wStatus, OrderTime:orderTime, isDft:isdft},true);
                }else{
                    if(wStatus==2 && isdft == 1) {
                        var arrInfo = getDtel(getTwo);
                        myalertp("allmybook","改期服务请致电"+arrInfo[0]+"客服电话"+arrInfo[1]+",改期服务敬请期待！");
                        return false;
                    }
                    $.router.go('#!/flightmb/orderd',{orderid:theorder, nStatus:wStatus, OrderTime:orderTime, isDft:isdft},true);
                }
                //console.log(theorder);
            }          
            // var e = e || window.e;
            // e.stopPropagation();
        }
    }
}

// //改期混合弹层点击
// function boxtChangelayerFn() {
//     var changeBtn = $.qus(".boxtChange");
//     for(let i = 0; i< changeBtn.length; i++) {
//         var thetype = changeBtn[i].getAttribute("looktype");
//         changeBtn[i].onclick = function(e) {
//             if(thetype == 0) {
//                 var theorder = this.getAttribute("orderid");
//                 $.router.go('#!/flightmb/orderd',{orderid:theorder},true);
//                 console.log(theorder);
//             }          
//             var e = e || window.e;
//             e.stopPropagation();
//         }
//     }
// }

// 点击 查看 按钮 事件 列表页面
// function theookfn(){
//     var allbn = $.qus('.boxtblook');
//     for(let i=0; i<allbn.length;i++){
//         allbn[i].onclick = function (e){
//             var theorder = allbn[i].getAttribute('orderid');
//             $.router.go('#!/flightmb/orderd',{orderid:theorder},true);
//             console.log(theorder)
//             var e = e || window.e;
//             e.stopPropagation();
//         }
//     }
// }

// 支付订单
function payallmybook(){
    var thecansele = $.qus('.boxtbpay');
    for(let i=0; i<thecansele.length;i++){
        thecansele[i].onclick = function(e){// 阻止事件冒泡
            var theid = this.getAttribute('orderid');
            var personal = this.getAttribute('personal');
            if(personal ==2){// 授信且选择了公 直接弹出层 选择支付
                gopaymoneya(theid,1);// 支付

            }else{
            // goAndPaya(theid.split(',')[0]);// 不是因公就直接 走工商银行 只传一个订单号
                goAndPaya(theid);// 不是因公就直接 走工商银行   传2个订单号
            }
            //canseleajax(theid);
            //gopaymoneya(theid,1);// 支付
            var e = e || window.e;
            e.stopPropagation();
        }
    }

}


// 授信 支付接口
function gopaymoneya(theOid,type){
    //console.log(theOid+'-'+type)
    //if( type == 2){
    //    $.id('loadorder-type').innerHTML ='授信支付中...';
    //    $.qu('.lodin-ab').style.display ='-webkit-box';
    //
    //}else{
    //    $.id('loadorder-type').innerHTML ='授信查询中...';
    //    $.qu('.lodin-ab').style.display ='-webkit-box';
    //
    //}
    $.qu('.lodinab').style.display ='-webkit-box';
    var oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //http://106.75.131.58:8015/icbc/xhService.ashx?act=UAIRCDTPAY&OrderID=474664&Type=1
    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc2,'false');
    xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=UAIRCDTPAY&OrderID='+theOid+'&Type='+type,'true');
    xhr.send();
    xhr.onreadystatechange = function(){

        $.qu('.lodinab').style.display ='none';
        //$.id('loadorder-type').innerHTML ='加载数据中...';

        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                //  判断服务器返回的状态 200 表示 正常
                if(type ==1){ //授信权限 查询
                    oData2 = eval('('+xhr.responseText+')');
                    console.log(oData2);
                    var oid = theOid.split(',')[0];
                    if(oData2.Status ==1  && oData2.Msg =='成功'){// 是 授信企业
                        getbanka(oData2.Result,oid,theOid)
                    }else{
                        var mst = oData2.Msg;
                        if(mst = '无授信账户!'){
                            myalertp('allmybook','抱歉，该账户的差旅授信功能已关闭')
                        }else{
                            myalertp('allmybook','抱歉，该账户的差旅授信功能发生异常')

                        }
                    }
                }else if(type ==2){ //授信支付
                    oData2 = eval('('+xhr.responseText+')');
                    //console.log(oData2);
                    if(oData2.Status ==1  && oData2.Msg =='成功'){// 支付成功！
                        //alert('恭喜，支付成功！！')
                        myalertp('allmybook','恭喜，支付成功！！')
                        $.qu('.creditboxa').style.display ='none';
                        getorderdata(GetDateStrH(getnowdate(),-720),getnowdate());
                    }else if(oData2.Status ==2){
                        //alert('对不起,该单位余额不足,不能支付。')
                        myalertp('allmybook','对不起,'+oData2.Msg)
                        //goAndPay(oid);// 直接跳转到 工商银行
                    }
                }
            }else{
                //alert('支付异常，请重试！');
                myalertp('allmybook','支付异常，请重试！')

            }
        }
    }
}
//  回调 授信 账号 theisTripbank
function  getbanka(backms,oid,theOid){
    //theisTripbank =backms;
    $.qu('.creditboxa').style.display ='-webkit-box';
    $.qu('.payownbtnca').innerHTML = backms;

    $.qu('.credit-closea').onclick = function(){// 关闭弹层 取消支付
        $.qu('.creditboxa').style.display ='none';
        $.qu('.payownbtnca').innerHTML = '代扣账号';
    }

    $.qu('.payownbtnca').onclick = function (){
        gopaymoneya(theOid,2);// 授信支付
    }


}
// 支付跳转函数
function goAndPaya(oid) {
    //alert("支付");

    var clientType = getClientType();// 设备型号
    //console.log(oid)
    //console.log(clientType)
    var href = flightUrl+ "/HTML5/PayJump.aspx?OrderID=" + oid + "&ReturnUrl=&ToUrl=GoPay.aspx?&PayVia=5&clientType=" + clientType + "&PayBank=";
    //load.open("跳转中...");
    location.href = href;
}

//获取客户端设备类型
function getClientType() {
    var clientType = "PC";
    if (/android/i.test(navigator.userAgent)) {
        clientType = "android";
    }
    if (/ipad/i.test(navigator.userAgent)) {
        clientType = "ipad";
    }
    if (/iphone/i.test(navigator.userAgent)) {
        clientType = "iphone";
    }
    return clientType;
}


//判断时间是否应该加一天
function isNextDay(date1,date2,dateM) {
    let str1 = removeM(date1) - removeM(date2) >0?GetDateStrH(dateM,"24"):dateM;
    return getLastFive(str1);
}
//日期中去除年份
function getLastFive(date) {
    return date.substring(date.length-5,date.length);
}
//去除"\:"
function removeM(date) {
    return parseInt(date.replace(/\:/g,""));
}
//天数加一
function GetDateStrH(data1,h) {

    var  Y1 = data1.substring(0, 4);
    var  m1 = data1.substring(5, 7)-1;
    var  d1 = data1.substring(8, 10);
    // var  h1 = data1.substring(11, 13);
    // var  M1 = data1.substring(14, 17);
    var  dd = new Date(Y1,m1,d1)
    dd.setHours(dd.getHours() + h);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();

    if ((m + "").length == 1) {
        m = "0" + m;
    }
    if ((d + "").length == 1) {
        d = "0" + d;
    }

    return y + "-" + m + "-" + d

}

//检查是否是直营航班 切排除差旅用户 CA ZH
function isDirect(str,per,type) {
    //CZ南航 ZH深航
    var arr = ["CZ","ZH","3U"];
    if(type == 6) {
        for(var i = 0, len = arr.length; i<len; i++) {
            if(str.indexOf(arr[i]) != -1 && per != 2) {
                return 1;
            };
        }
    }else {
        return 0;
    }
}