

/**
 * Created by way on 16/9/28.
 */
import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp ,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层
//myalertp('detail','出错了，获取客服联系电话失败！')

let _view = require('raw!./detail.html');
var TTitype = '';
// 虚拟数据
var urlFrom = '';
var urlTo = '';
var urlTime = '';
var urlTime1 = ''; //返程日期
var date2  = '' ;//返程日期
var searchtype = '' ; //判断往返
var  searchtypeg ={}; // 4.1 龚老师新加参数
var backdata={}; // 存放返程数据 地点以及切换
var backtype=''; // 判断显示 返
var zhefromData ='' ;// 存放第一查询的准备提交的数据
var Member='';// 接受 产品页面 传递过来的 用户信息 name id
var ftime1 = '';// 返程是时候 存放 去程时间
var pcnumdata ='';//存放 去程航班编码 MU5181_N

export default class {
  path = '/flightmb/detail$';
  hash = '/flightmb/detail';
  title = '机票详情';
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
      getView(`${cfg.view.lotteryOpen}?t=${(+new Date())}`, '', (rs) => {
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

      if(params.cliktype ==1){
        // console.log(params)
         urlFrom = params.citydetail1;
         urlTo = params.citydetail2;
         urlTime = params.timedetail1;
         urlTime1 = params.timedetail2;
         backtype = '';
          tobeforetable();// 刷新 时间 价格 状态函数

         // 清空 价格
          $.id('detail-nowdata3').innerHTML ='';
          $.id('detail-odldata').innerHTML ='';
          $.id('detail-nexdata1').innerHTML ='';

      }else if(params.cliktype ==2){ // 日历插件 返回的
          urlTime =params.stime;
          urlTime1 =params.bt;
          $.qu('.detail-tms1d2').style.display ='block';
          $.qu('.detail-tms1d1').style.lineHeight ='1.9rem';
          $.qu('.detail-tms1d1').style.color ='#fff';
          $.id('detail-tmbn1').style.color ='#fff';
          //alert(urlTime1)


      } else if(params.cliktype ==4){ // 产品 返回详情页面 带数据返回
            //去程 数据需要提交的数据
            //console.log(params.searchbdata)
            urlFrom = params.searchbdata.bcity1;
            urlTo = params.searchbdata.bcity2;
            urlTime = params.searchbdata.btime;// 返程时间
            urlTime1= '';
            backtype =params.searchbdata.backtype;
            zhefromData =params.ptbdata1;// 去程数据 打包
            ftime1 =params.ptbdata1.data1; // 去程时间
            pcnumdata =params.ptbdata1.pcnum +'_'+params.ptbdata1.theCa; // 去程时间
            Member:params.Member;


      }
      else  if(params.cliktype ==3){// 直接返回 不带数据
          urlTime =params.ptdata

      }

       var reg = /[A-Za-z]{3}/;
       var from = urlFrom;
       var to =urlTo;
       var date =urlTime;

       date2 = urlTime1;
       date =detailChange(date)
       date2 =detailChange(date2)
       //console.log(date2)

       // from = from == null ? "北京" : from; //重庆CKG
       // to = to == null ? "广州" : to; //广州
       // date = date == null ? "2014-07-25" : date;

       var id = 1;//默认为单程
       if (date2 != '') {// 有数据
           id = 2;
           $.qu('.detail-t2').style.display ='block';
           $.qu('.detail-t2').innerHTML ='去:';
       } else { //没有数据
           id = 1;
           $.qu('.detail-t2').style.display ='none';
           if(backtype ==2){
               $.qu('.detail-t2').style.display ='block';
               $.qu('.detail-t2').innerHTML ='返:';
           }

       }

       // 标题  北京—— 上海
       $.id('detailcity0').innerHTML=from;
       $.id("detailcity1").innerHTML=to;
       //头部加载数据
       changeDateOfTop(date);
       if (id == 1) {//单程
           searchtype = 1; //params.cliktype

          //var searchTypenew =1; // 单程  或者 往返返程进入

           if(params.cliktype == 4){

               searchtypeg ={
                   "backDate":date,// 返程日期
                   "goFlight":pcnumdata,
                   "goDate": detailChange(ftime1), // 去程日期 ftime1
                   "searchType":3,
                   "adultCount":1,
                   "childCount":1
               }
           }else{

               searchtypeg ={
                   "backDate":"",
                   "goFlight":"",
                   "goDate":date,
                   "searchType":1,
                   "adultCount":1,
                   "childCount":1
               }
           }



           backdata ={
               backtype:1 // 判断是否要返回 继续预订机票
           }

       }else {//往返  去程进入
           searchtype = 2;

           searchtypeg ={
               "backDate":date2,
               "goFlight":"",
               "goDate":date,
               "searchType":2,
               "adultCount":1,
               "childCount":1
           }


           backdata={// 返程数据包
               btime:date2,
               bcity1:to,
               bcity2:from,
               backtype:2, // 控制是否 要往返
               searcht:2,
               ftime:date



           }

       }
        //  日历弹出
        $.id('detail-tmmai').onclick = function(){
            var cityf = $.id('detailcity0').innerHTML;
            var cityt = $.id('detailcity1').innerHTML;
            $.router.go('#!/flightmb/picktime',{backtime:urlTime1,searchtype:searchtype,cityf:cityf,cityt:cityt},true)
        }

       myAjaxGetLowprice(getCityCode(from),getCityCode(to),date,searchtypeg); //加载航班

       getLowPrict(date); //获取最低价

       initialAction(); //绑定部分点击事件
       //downpull(from,to,date,searchtype); // 下拉刷新 有问题   待优化


       // 返回点击
       $.qu('.detail-t1').onclick = function() {
              $.router.go('#!/flightmb/join','',false)
       }
       // 头部 主页返回
      $.qu('.d_home').onclick =()=>{
          $.router.go('#!/flightmb/join','',false)
      }





  }
}


//  筛查出 经停 共享航班显示问题
function showyesNo(){
    var jtcl = $.qus('.jtstop');
    for(var i=0;i<jtcl.length;i++){
        var jtdata =jtcl[i].getAttribute('jtdata');
        if(jtdata == 0 ){
            jtcl[i].style.display ='none';
        }

    }
    var gxflight =$.qus('.shareno');
    for(var i=0;i<gxflight.length;i++){
        if(gxflight[i].innerHTML == '-'){
            gxflight[i].parentNode.style.display ='none';
        }
    }
}

// 下拉刷新 测试
function downpull(from,to,date,searchtype){

    var scroll = $.id('detail-m1');
    var outerScroller = $.id('detail-m');
    var touchStart = 0;
    var touchDis = 0;
    outerScroller.addEventListener('touchstart', function(event) {
        var touch = event.targetTouches[0];
        // 把元素放在手指所在的位置
        touchStart = touch.pageY;
        //console.log(touchStart);
    }, false);
    outerScroller.addEventListener('touchmove', function(event) {
        var touch = event.targetTouches[0];
        //console.log(touch.pageY + 'px');
        scroll.style.top = scroll.offsetTop + touch.pageY-touchStart + 'px';
        //console.log(scroll.style.top);
        touchStart = touch.pageY;
        touchDis = touch.pageY-touchStart;
    }, false);
    outerScroller.addEventListener('touchend', function(event) {
        touchStart = 0;
        var top = scroll.offsetTop;
        //console.log(top);
        if(top>120){
            scroll.innerHTML ='';
            myAjaxGetLowprice(getCityCode(from),getCityCode(to),date,searchtypeg); //加载航班

            getLowPrict(date); //获取最低价
            tobeforetable();// 刷新 时间 价格 状态函数
        }
        //  自动 减少上部空白
        if(top>0){
            var time = setInterval(function(){
                scroll.style.top = scroll.offsetTop -6+'px';
                if(scroll.offsetTop<=0){
                    clearInterval(time);
                    scroll.style.top = 0;
                }
            },1)
        }
        if(top<-20){// 限制 上拉上限
            var time1 = setInterval(function(){
                scroll.style.top = scroll.offsetTop +6+'px';
                if(scroll.offsetTop>=0){
                    clearInterval(time1);
                    scroll.style.top = 0;
                }
            },1)
        }
    }, false);
}
//获取航班
function myAjaxGetLowprice(fromcity,tocity,date,searchtypeg){

     $.qu('.lodin').style.display = '-webkit-box';
     //getLowPrict(date); //获取最低价

    var param = {
        "act": "SearchFlightICBCJson",
        "org_city": fromcity,
        "dst_city": tocity,
        "org_date": date,   //date.substring(0, 10),
        "xsltPath": "HTML5",
        "search_type": searchtypeg.searchType  //searchtype
    };
    var  otherParamjson =JSON.stringify(searchtypeg) ;
    //console.log(param)

         var  oData2 = '';
        var xhr = '';
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else{
            xhr =new ActiveXObject(' Microsoft . XMLHTTP')
        }
                 //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&jsoncallback=jQuery183011878398158009507_1481529281930&act='+param.act+'&org_city='+param.org_city+'&dst_city='+param.dst_city+'&org_date='+param.org_date+'&xsltPath=HTML5&search_type='+param.search_type+'&firstShowType=1&_=1481529832360','false');
         xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&jsoncallback=jQuery183011878398158009507_1481529281930&act='+param.act+'&org_city='+param.org_city+'&dst_city='+param.dst_city+'&org_date='+param.org_date+'&xsltPath=HTML5&search_type='+param.search_type+'&otherParam='+otherParamjson+'&firstShowType=1&_=1481529832360','false');

        //console.log('isKyReq=1&jsoncallback=jQuery183011878398158009507_1481529281930&act='+param.act+'&org_city='+param.org_city+'&dst_city='+param.dst_city+'&org_date='+param.org_date+'&xsltPath=HTML5&search_type='+param.search_type+'&otherParam='+otherParamjson+'&firstShowType=1&_=1481529832360')

         xhr.send();
         xhr.onreadystatechange = function(){
               if( xhr.readyState == 4){
                // ajax 响内容解析完成，可以在客户端调用了
                      if(xhr.status == 200){
                         $.qu('.lodin').style.display = 'none';
                           //console.log(xhr.responseText)
                           //  判断服务器返回的状态 200 表示 正常
                           if(xhr.responseText != ''){
                                oData2 = JSON.parse(xhr.responseText);
                                var alldatas = oData2.Flights;
                                //console.log(alldatas)


                                var ty =1;
                                var n =1;
                                //console.log(alldatas[0]) ty 时间/ 价格   n 高低
                               $.id('detail-m1').innerHTML =pullData(ty,n,alldatas);
                               showyesNo();// 经停 共享显示


                                 var theCp = removedata(getAllcp(alldatas));
                                 toproduct();
                                 // removedata(fCity(alldata))
                                 // removedata(toCity(alldata))
                                 pullCp(theCp);// 加载公司
                                 fCitydata(removedata(fCity(alldatas)),removedata(toCity(alldatas))) //加载起落机场
                                 picBox();// 开启筛选功能

                                thePrice(ty,n,alldatas)// 价格高低筛选
                                theTime(ty,n,alldatas)// 时间筛选




                                 $.id('detail-fl1').onclick =function(){
                                    $.qu('.detail-fl1pick').style.top ='-7.6rem'
                                 }
                                 $.id('fl1pick-h1s1').onclick =function(){
                                        $.qu('.detail-fl1pick').style.top ='2.6rem'
                                 }
                                 $.id('fl1pick-h1s3').onclick =function(){
                                        $.id('detail-m1').innerHTML =''; //清空所有页面内容 再加载
                                        $.qu('.detail-fl1pick').style.top ='2.6rem';

                                        //找出所有被选中的 元素
                                        var allSles = $.qus('.check_it');

                                        var sttime=[];
                                        var stcp=[];
                                        var sttype=[];
                                        var stairport=[];
                                        for(var i=0;i<allSles.length;i++){
                                                if( $.hasClass(allSles[i].parentNode.parentNode,'pickbox-time')){
                                                     sttime.push($.firstChild(allSles[i].parentNode).innerHTML)
                                                 }
                                                 if( $.hasClass(allSles[i].parentNode.parentNode,'pickbox-cp')){
                                                     stcp.push($.firstChild(allSles[i].parentNode).innerHTML)
                                                 }
                                                 if( $.hasClass(allSles[i].parentNode.parentNode,'pickbox-type')){
                                                     sttype.push($.firstChild(allSles[i].parentNode).innerHTML)
                                                 }
                                                 if( $.hasClass(allSles[i].parentNode.parentNode,'pickbox-airport')){
                                                     stairport.push($.firstChild(allSles[i].parentNode).innerHTML)
                                                 }
                                        }
                                        var  thedata =  youData(sttime,stcp,sttype,stairport,alldatas);
                                        $.id('detail-m1').innerHTML =pullData(ty,n,thedata);
                                        showyesNo();// 经停 共享显示
                                         thePrice(ty,n,thedata);
                                         theTime(ty,n,thedata);
                                         toproduct();

                                 }

                           }else{
                                //alert('航班查询超时！')
                                myalertp('detail','航班查询超时,请继续查询',function(){
                                    myAjaxGetLowprice(fromcity,tocity,date,searchtypeg)
                                })
                               //myAjaxGetLowprice(fromcity,tocity,date,searchtypeg)
                           }


                       }else{
                            //alert('出错了，航班查询超时，Err' +xhr.status);
                             myalertp('detail','出错了，航班查询超时，Err' +xhr.status)
                       }
                }
        }

 }



function toproduct(){
    // 进入 产品页面

    var bottns = $.qus('.dedata-wrap');
    for(var i=0;i<bottns.length;i++){
       bottns[i].onclick =function(){
                 var theWen= $.id('detail-nowdata2').innerHTML;
                 var flight1data =JSON.parse( this.getAttribute('data1'));// 带 展示航班 返回 产品页面
                 var dataArr ={
                     prWen:theWen,
                     prDate:this.getAttribute('flightdate'),
                     arrtime: this.getAttribute('arrtime'),
                     FlyTime: this.getAttribute('FlyTime'),
                     fromairport: this.getAttribute('fromairport')+this.getAttribute('Terminal'),//Terminal
                     //进出站　互换    3.29测试 进出航站楼写返
                     toairport: this.getAttribute('toairport')+this.getAttribute('arrhall'),　//arrhall
                     carrierabb: this.getAttribute('carrierabb'),
                     carrierabb1: this.getAttribute('carrierabb1'),
                     carrierabb2: this.getAttribute('carrierabb2'),
                     model: this.getAttribute('model'),
                     //RouteFrom:this.getAttribute('RouteFrom'),
                     RouteFrom:$.id('detailcity0').innerHTML,// 用 城市编码 获取城市名称可能会出错
                     RouteTo: $.id('detailcity1').innerHTML,
                     pulId:this.id,
                     theCarrier: this.getAttribute('Carrier'),
                     ZYtype:this.getAttribute('ZYtype'),
                     Discount:this.getAttribute('Discount'),
                     YPrice:this.getAttribute('YPrice'),
                     RouteFromCode:this.getAttribute('RouteFromCode'),
                     RouteToCode:this.getAttribute('RouteToCode'),
                     Lmodel:this.getAttribute('model')+this.getAttribute('Modelchar'),
                     Cabin:this.getAttribute('Cabin'),
                     Terminal:this.getAttribute('Terminal'),
                     JtStop:this.getAttribute('JtStop'),
                     flight1data:flight1data
                 }
           　　　//alert(this.getAttribute('Cabin'))


                 if(backtype ==''){
                     // 单程
                      $.router.go('#!/flightmb/product',{prData:dataArr,prot:1,bdata:backdata},true)

                 }else{
                     // 带着去程数据 进去产品页面
                     var fromcp = zhefromData.theCarrier1; // 去程 公司航司号
                     var tocp = dataArr.theCarrier; // 返程 去程 公司航司号
                     var preDate = zhefromData.thelowf.data1+zhefromData.thelowf.ttime;
                     var nowDate = dataArr.prDate+dataArr.FlyTime;
                     if((removeMh(preDate) - removeMh(nowDate)) > 0) {
                        myalertp("detail", "返程航班时间不能早于去程航班时间!请重新选择。");
                        return false;
                     };
                     if(zhefromData.thelowf.data1+zhefromData.thelowf.ttime)
                     var fromedzytype =zhefromData.zytypep;//  获取去程 是否是直营
                     if(fromedzytype == 1){ // 去程 为直营 1
                         if(tocp == fromcp){// 航空公司号相同
                             $.router.go('#!/flightmb/product',{prData:dataArr,prot:3,bdata:zhefromData},true)
                         }else{
                             switch(fromcp)
                             { // 还原航空公司号
                                 case "ZH": fromcp ='深圳航空';break;
                                 case "CZ": fromcp ='南方航空';break;
                                 case "3U": fromcp ='四川航空';break;

                             }
                             //alert('请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单。去程航司号为:'+fromcp)
                             myalertp('detail','请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单。去程航司号为:'+fromcp)
                         }

                     }else{// 去程不是直营 就直接 到产品页面，再判断直营问题
                         $.router.go('#!/flightmb/product',{prData:dataArr,prot:3,bdata:zhefromData},true)
                     }


                 }


        }
     }
}


// 绑定所有点击事件
function initialAction() {
      // 下一天
      $.id('detail-tms2').onclick=function () {
         var  date = this.getAttribute('date');
         var from = $.id('detailcity0').innerHTML;
         var to = $.id('detailcity1').innerHTML;
          $.qu('.detail-f-ulsp3').innerHTML ='价格';
          $.qu('.detail-f-ulsp2').innerHTML ='从早到晚';

          if (checkDateIsOK(date)) {
              changeDateOfTop(date);

              //search(searchtype, null);
          }


          myAjaxGetLowprice(getCityCode(from), getCityCode(to), date, searchtypeg);//加载航班
          getLowPrict(date); //获取最低价


      };
      // 上一天
      $.id('detail-tms1').onclick=function () {
         var  date = this.getAttribute('date');
         var from = $.id('detailcity0').innerHTML;
         var to = $.id('detailcity1').innerHTML;
         $.qu('.detail-f-ulsp3').innerHTML ='价格';
         $.qu('.detail-f-ulsp2').innerHTML ='从早到晚';
         if (checkDateIsOK(date)) {
              changeDateOfTop(date);
             myAjaxGetLowprice(getCityCode(from), getCityCode(to), date, searchtypeg);//加载航班

             getLowPrict(date); //获取最低价

              //search(searchtype, null);
         }



      };

}

// 价格筛选函数
function thePrice(ty,n,alldatas){
      var onOffprice = true;

      $.id('detail-fl3').onclick =function(){
         $.qu('.detail-f-ulo2').style.background ='#E4DCDC';
         $.qu('.detail-f-ulo3').style.background ='#FCA40B';
         $.qu('.detail-f-ulsp2').innerHTML ='时间';
         if(onOffprice){
             n = 1;
             ty= 2;
             $.qu('.detail-f-ulsp3').innerHTML ='从低到高';
             onOffprice =false;
         }else{
             n = 2;
             ty= 2;
              $.qu('.detail-f-ulsp3').innerHTML ='从高到低';
             onOffprice =true;
         }
         $.id('detail-m1').innerHTML =pullData(ty,n,alldatas);
          showyesNo();// 经停 共享显示
         toproduct();
      }

}
// 时间筛选函数
function theTime(ty,n,alldatas){
      var onOfftime = true;

      $.id('detail-fl2').onclick =function(){
         $.qu('.detail-f-ulo2').style.background ='#FCA40B';
         $.qu('.detail-f-ulo3').style.background ='#E4DCDC';
         $.qu('.detail-f-ulsp3').innerHTML ='价格';
         if(onOfftime){
             n = 2;
             ty= 1;
             $.qu('.detail-f-ulsp2').innerHTML ='从晚到早';
             onOfftime =false;
         }else{
             n = 1;
             ty= 1;
             $.qu('.detail-f-ulsp2').innerHTML ='从早到晚';
             onOfftime =true;
         }
         $.id('detail-m1').innerHTML =pullData(ty,n,alldatas);
          var  strss =$.id('detail-m1').innerHTML;
         showyesNo();// 经停 共享显示
         toproduct();
      }

}
// 刷新 价格 时间 筛选标签
function tobeforetable(){
    $.qu('.detail-f-ulo2').style.background ='#E4DCDC';
    $.qu('.detail-f-ulo3').style.background ='#FCA40B';
    $.qu('.detail-f-ulsp2').innerHTML ='从早到晚';
    $.qu('.detail-f-ulo2').style.background ='#FCA40B';
    $.qu('.detail-f-ulo3').style.background ='#E4DCDC';
    $.qu('.detail-f-ulsp3').innerHTML ='价格';
}
// 航空公司及降落地点动态加载
// removedata(fCity(alldata))
// removedata(toCity(alldata))
function fCitydata(data1,data2) {
  var st1 =   '<li ><span class="cityfrom"><em>北京</em>起飞</span></li>';
  var st2 ='<li class="pickbox-airport1"><span>不限</span><label class="check_it pickbox-airport11  "><input type="radio" value=" " name="airportFrom"></label></li>';
  var st3 ='';
  var st4 =  '<li ><span class="cityto"><em>上海</em>降落</span></li>';
  var st5 = '<li class="pickbox-airport2 "><span>不限</span><label class="check_it pickbox-airport22"><input type="radio" value=" " name="airportTo"></label></li>';
  var st6 ='';
   for (var i=0;i<data1.length;i++) {
       st3 +='<li class="pickbox-airport1"><span>'+data1[i]+'</span><label ><input type="radio" value=" " name="airportFrom"></label></li>';
   }
   for(var i=0;i<data2.length;i++){
      st6+='<li class="pickbox-airport2" ><span >'+data2[i]+'</span><label ><input type="radio" value=" " name="airportTo"></label></li>'
   }
  $.qu('.pickbox-airport').innerHTML = st1+st2+st3+st4+st5+st6;
}


//根据条件筛选数据
function youData(sttime,stcp,sttype,stairport,alldatas) {
     var thelastdata = [];
     var thelastdata1 = [];
     var thelastdata2 = [];
     var thelastdata3 = [];
     if(sttime[0] != '不限'){
          thelastdata =[];
          var sttime1 =[];
          sttime1.push(sttime[0].split('--', 2)[0])
          sttime1.push(sttime[sttime.length-1].split('--', 2)[1])
          var t1 =strKo(sttime1[0]);
          var t2 =strKo(sttime1[1]);

          for(var j=0;j<alldatas.length;j++){
                var ff1 =strKo(alldatas[j].FlyTime);

               if(t1 <= ff1 && ff1<=t2){
                 thelastdata.push(alldatas[j])
               }
          }
         if(thelastdata.length == 0){
              return ''
          }
     }else{
         thelastdata =alldatas;
     }

     if(stcp[0] != '不限'){
          for(var i=0; i<stcp.length;i++){
               for(var j=0;j<alldatas.length;j++){
                   if(stcp[i] == alldatas[j].CarrierAbb){
                         thelastdata1.push(alldatas[j])
                   }
               }
          }
         if(thelastdata1.length == 0){
              return ''
         }

     }else{
        thelastdata1 =alldatas;
     }

     if(sttype[0]!='不限'){
           for(var i=0; i<sttype.length;i++){
                for(var j=0;j<alldatas.length;j++){
                    if(sttype[i] == alldatas[j].Model){
                          thelastdata2.push(alldatas[j])
                    }
                }
           }
          if(thelastdata2.length == 0){
              return ''
          }
     }else{
         thelastdata2 =alldatas;
     }
     if(stairport[0] != '不限' && stairport[1] != '不限'){
            var p1 = [];
            var p2 = [];
            for(var i= 0;i<alldatas.length;i++){
                if(stairport[0] == alldatas[i].FromAirport){
                    p1.push(alldatas[i]);
                }
            };
            for (var i= 0;i<p1.length;i++) {
                if(stairport[1] == p1[i].ToAirport){
                   p2.push(p1[i])
                }
            }
        thelastdata3 =p2;
     }else if(stairport[0] != '不限' &&stairport[1] =='不限'){
           var p3 =[];
           for(var i= 0;i<alldatas.length;i++){
                if(stairport[0] == alldatas[i].FromAirport){
                    p3.push(alldatas[i]);
                }
           };
        thelastdata3 =p3;
     }else if(stairport[0] == '不限' &&stairport[1] =='不限'){
           thelastdata3 =alldatas;

     }else if(stairport[0] == '不限' &&stairport[1] !='不限'){
            var p4 =[];
            for(var i= 0;i<alldatas.length;i++){
                 if(stairport[1] == alldatas[i].ToAirport){
                     p4.push(alldatas[i]);
                 }
            };
         thelastdata3 =p4;
     }



     var d1 =[];
     for (var i=0;i<thelastdata.length;i++ ) {
          for (var j=0;j<thelastdata1.length;j++ ) {
              if(thelastdata[i].CabinFlag==thelastdata1[j].CabinFlag){
                  d1.push(thelastdata[i])
              }
          }
     }

     var d2 =[];
     for (var i=0;i<thelastdata2.length;i++ ) {
          for (var j=0;j<thelastdata3.length;j++ ) {
              if(thelastdata2[i].CabinFlag==thelastdata3[j].CabinFlag){
                  d2.push(thelastdata2[i])
              }
          }
     }
     var d3 =[];
     for (var i=0;i<d1.length;i++ ) {
          for (var j=0;j<d2.length;j++ ) {
              if(d1[i].CabinFlag==d2[j].CabinFlag){
                  d3.push(d1[i])
              }
          }
     }
    // console.log(d3)

return d3
}



function strKo(data){

  return  Number(data.split(":").join(""))
}

// 绑定 筛选 功能
function picBox() {


    // 机场选择
    var air2 = $.qus('.pickbox-airport2')
    for (var i = 0; i < air2.length; i++) {
        air2[i].onclick = function () {
            if ($.hasClass($.lastChild(this), 'check_it')) {
                $.removeClass($.lastChild(this), 'check_it');
                $.addClass($.qu('.pickbox-airport22'), 'check_it');
            } else {
                $.each(air2, function () {
                    $.removeClass($.lastChild(this), 'check_it');
                })
                $.addClass($.lastChild(this), 'check_it');
            }
            return false
        }

    }
    var air1 = $.qus('.pickbox-airport1')
    for (var i = 0; i < air1.length; i++) {
        air1[i].onclick = function () {
            if ($.hasClass($.lastChild(this), 'check_it')) {
                $.removeClass($.lastChild(this), 'check_it');
                $.addClass($.qu('.pickbox-airport11'), 'check_it');
            } else {
                $.each(air1, function () {
                    $.removeClass($.lastChild(this), 'check_it');
                })
                $.addClass($.lastChild(this), 'check_it');
            }
            return false
        }

    }
    // 筛选类型切换
    var ptitles = $.qus('.pickbox-title1')
    for (var i = 0; i < ptitles.length; i++) {
        ptitles[i].onclick = function () {
            $.each(ptitles, function () {
                $.removeClass(this, 'title-active');
            })
            $.addClass(this, 'title-active');
            if ($.hasClass($.qu('.pickbox-title11'), 'title-active')) {
                $.each($.qus('.pickbox-mian'), function () {
                    this.style.display = 'none';
                })
                $.qu('.pickbox-time').style.display = 'block';
            } else if ($.hasClass($.qu('.pickbox-title12'), 'title-active')) {
                $.each($.qus('.pickbox-mian'), function () {
                    this.style.display = 'none';
                })
                $.qu('.pickbox-cp').style.display = 'block';
            } else if ($.hasClass($.qu('.pickbox-title13'), 'title-active')) {
                $.each($.qus('.pickbox-mian'), function () {
                    this.style.display = 'none';
                })
                $.qu('.pickbox-type').style.display = 'block';
            } else if ($.hasClass($.qu('.pickbox-title14'), 'title-active')) {
                $.each($.qus('.pickbox-mian'), function () {
                    this.style.display = 'none';
                })
                $.qu('.pickbox-airport').style.display = 'block';
            }
        }
    }
    // 时间选择
    slectPick('.pickbox-time', '.pickbox-time1', '.pickbox-time2', 'check_it')
    // 公司选择
    slectPick('.pickbox-cp', '.pickbox-cp1', '.pickbox-cp2', 'check_it')
    // 机型
    slectPick('.pickbox-type', '.pickbox-type1', '.pickbox-type2', 'check_it')
    function slectPick(class1, class11, class12, atr) {
        // class1 为大类型的calss calsss11 为不限制的class  calsss12为 可选 的class
        var aType = $.tags($.qu(class1), 'li')
        for (var i = 1; i < aType.length; i++) {
            aType[i].onclick = function () {
                if ($.hasClass($.tags(this, 'label')[0], atr)) {
                    $.removeClass($.tags(this, 'label')[0], atr);
                    var aType1 = $.qus(class12);
                    var k = 0;
                    for (var i = 0; i < aType1.length; i++) {
                        k += $.hasClass(aType1[i], atr)
                    }
                    if (k == 0) {
                        $.addClass($.qu(class11), atr);
                    }
                } else {
                    $.removeClass($.qu(class11), atr);
                    $.addClass($.tags(this, 'label')[0], atr);
                }
                return false
            }
        }
        aType[0].onclick = function () {
            var aType12 = $.qus(class12);
            for (var i = 0; i < aType12.length; i++) {
                $.removeClass(aType12[i], atr);
            }
            $.addClass($.qu(class11), atr);
        }
    }


    $.id('fl1pick-h1s2').onclick = function () {
            allreMaddClass();
    }
    // 初始化筛选


}
// 清空筛选
function allreMaddClass(){
    var kk = $.tags($.qu('.detail-pickbox'), 'label')

    for (var i = 0; i < kk.length; i++) {
        if ($.hasClass(kk[i], 'check_it')) {
            $.removeClass(kk[i], 'check_it');

        }
    }

    var alrr = ['.pickbox-time1', '.pickbox-cp1', '.pickbox-type1', '.pickbox-airport11', '.pickbox-airport22']
    for (var i = 0; i < alrr.length; i++) {
        reMaddClass(alrr[i])
    }
    function reMaddClass(latr) {
        $.addClass($.qu(latr), 'check_it');
    }

}



// 数据处理函数  所有航班加入页面
function pullData(type,n,alldata) {

      if(alldata !=''){
          //判断筛选类型 时间 价格 type=1 时间， type=2 价格
            if(type==1){ // 为时间类型 偶然的？
                if(n==1){ //时间 早到晚
                    var alldata1 =alldata.sort(function(a,b){
                          return strKo(a.FlyTime)-strKo(b.FlyTime)
                    })
                }else{ //时间 晚到早
                    var alldata1 =alldata.sort(function(a,b){
                      return strKo(b.FlyTime)-strKo(a.FlyTime)
                    })
                }
            }else if(type==2){  //  为价格类型
                  if(n==1){ //价格 低到高
                    var alldata1 =alldata.sort(function(a,b){
                          return a.Fare-b.Fare
                    })
                }else{ //价格   高到底 alldata1[i].Fare
                    var alldata1 =alldata.sort(function(a,b){
                          return b.Fare-a.Fare
                    })
                }
            }


          // console.log(alldata1)
            var strs ='';
            for(var i=0;i<alldata1.length;i++){
                if(alldata1[i].Cabins.length ==0){
                    strs =strs;
                }else{
                    var fligth1=JSON.stringify(alldata1[i].Cabins[0]);
                    strs+='<ul class="dedata-wrap" id="'+alldata1[i].CabinFlag+'" ArrTime="'+alldata1[i].ArrTime+'"  CabinLevel="'+alldata1[i].CabinLevel+'"  ArrHall="'+alldata1[i].ArrHall+'" ZYtype="'+alldata1[i].Cabins[0].CabinType+'"  Model="'+alldata1[i].Model+'"  CarrierAbb="'+alldata1[i].CarrierAbb+alldata1[i].Carrier+alldata1[i].FlightNo+'" CarrierAbb1="'+alldata1[i].CarrierAbb+'"  CarrierAbb2="'+alldata1[i].Carrier+alldata1[i].FlightNo+'"  FlightDate="'+alldata1[i].FlightDate+'"  Terminal="'+alldata1[i].Terminal+'"  ToAirport="'+alldata1[i].ToAirport+'" FlyTime="'+alldata1[i].FlyTime+'" FromAirport="'+alldata1[i].FromAirport+'" RouteFrom="'+alldata1[i].RouteFrom+'"  RouteTo="'+alldata1[i].RouteTo+'" Carrier="'+alldata1[i].Carrier+'" YPrice ="'+alldata1[i].YPrice+'" Discount="'+alldata1[i].Discount+'" RouteFromCode="'+alldata1[i].RouteFromCode+'" RouteToCode="'+alldata1[i].RouteToCode+'" ModelChar="'+alldata1[i].ModelChar+'" Cabin="'+alldata1[i].Cabin+'"  Terminal="'+alldata1[i].Terminal+'" JtStop="'+alldata1[i].JtStop+'" data1='+fligth1+'><li class="d-wrapl1" ><span class="d-wrapl1-sp1">'+alldata1[i].FlyTime+'</span><span class="d-wrapl1-sp2"><strong></strong></span><span class="d-wrapl1-sp3">'+alldata1[i].ArrTime+'</span><span class="d-wrapl1-sp4">￥<em class="d-wrapl1price">'+alldata1[i].Fare+'</em></span><span class="jtstop"   jtdata="'+alldata1[i].JtStop+'">经停</span></li><li class="d-wrapl2"><span class="d-wrapl2-sp1">'+alldata1[i].FromAirport+'</span><span class="d-wrapl2-sp2">'+alldata1[i].ToAirport+'</span></li><li class="d-wrapl3"><img class="DF-logo" src="https://cos.uair.cn/mb/img/'+alldata1[i].Carrier+'.png"/> <span class="d-wrapl3-sp1">'+alldata1[i].CarrierAbb+alldata1[i].Carrier+alldata1[i].FlightNo+'</span><span class="d-wrapl3-sp2">'+alldata1[i].Model+ alldata1[i].ModelChar+'</span></li><li class="d-wrapl4">共享:实际乘坐<span class="shareno">'+alldata1[i].ShareNo+'</span></li></ul>'
                }

            }

            return strs


      }else{
          return '没有找到航班！'
      }





}




// 获取所有的航空公司
function getAllcp(alldata) {
   var strcp = [];
    for(var i=0;i<alldata.length;i++){
      strcp.push(alldata[i].CarrierAbb)

    }
  return strcp
}
//数组去重
 function removedata(ar){
    var a1=((new Date).getTime())
    var m=[],f;
    for(var i=0;i<ar.length;i++){
        f=true;
        for(var j=0;j<m.length;j++)
            if(ar[i]===m[j]){f=false;break;};
        if(f)m.push(ar[i])}

    return m.sort(function(a,b){return a-b});
}
//加载筛选项 公司
function pullCp(dataCp) {
    var str1='<li ><span>不限</span><label class="check_it pickbox-cp1"><input type="radio" value=" "></label></li>';
    var str2 ='';
    for (var i =0; i<dataCp.length;i++) {
        str2+='<li><span>'+dataCp[i]+'</span><label class="pickbox-cp2"><input type="checkbox" value=" "></label></li>'
    }

    $.qu('.pickbox-cp').innerHTML =str1+str2;
}
//加载筛选项 起落机场
function fCity(alldata) {
    var strcp = [];
    for(var i=0;i<alldata.length;i++){
      strcp.push(alldata[i].FromAirport)

    }
  return strcp
}
function toCity(alldata) {
    var strcp = [];
    for(var i=0;i<alldata.length;i++){
      strcp.push(alldata[i].ToAirport)

    }
  return strcp
}

// 时间格式组装
function detailChange(date){

      //对date进行重新组装成yyyy-MM-dd的格式
      //2014 - 8 - 7
      try {
          var tempDate1Arr = date.split("-");
          date = tempDate1Arr[0] + ""
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
      } catch (e) {
      }


   return date
}

//获取前一天或者后一天的时间
function getPointedDate(d, dateCount, dataDirect) {
        // d 2016-12-12
    Date.prototype.Format = function (formatStr) {
        var str = formatStr;
        var Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, this.getFullYear());
        str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

        str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
        str = str.replace(/M/g, (this.getMonth() + 1));

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
    }



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
     var time2 = urlTime1//返回时间

    if (nowDate < (new Date()).Format("yyyy-MM-dd")) {
        //alert("历史机票不可查询");
        myalertp('detail','历史航班不可查询！')
        //改变样式
         $.qu('.detail-tms1d2').style.display ='none';
         $.qu('.detail-tms1d1').style.lineHeight ='2.4rem';
         $.qu('.detail-tms1d1').style.color ='#A6A5A5';
         $.id('detail-tmbn1').style.color ='#A6A5A5';

        return false;
    }else{
         $.qu('.detail-tms1d2').style.display ='block';
         $.qu('.detail-tms1d1').style.lineHeight ='1.9rem';
         $.qu('.detail-tms1d1').style.color ='#fff';
         $.id('detail-tmbn1').style.color ='#fff';
    }
    if (time2 != "") { //返程的时候用到
        nowDate = nowDate.replace(/-/g, "");//现在要查询的时间
        nowDate = parseInt(nowDate);  //转换为数字类型
        //还在选择去程
        time2 = time2.replace(/-/g, "");
        time2 = parseInt(time2);
        if (time2 > nowDate) {
            //alert(time2)
            //alert(nowDate)
            //alert("去程时间不能大于返程时间");
            myalertp('detail','去程时间不能大于返程时间')

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
    $.id('detail-tms1').setAttribute('date',yesDay);
    $.id('detail-tms2').setAttribute('date',nextDay);
    $.id('detail-tmmai').setAttribute('date',date);
    $.id('detail-nowdata1').innerHTML =date;
    var _date = new Date(date);
    $.id('detail-nowdata2').innerHTML =getWeek(_date.getDay());


}
// city1:PEK
// city2:CKG
// date:2016-12-12&
// days :10
// 获取最低价
function getLowPrict(date1) {
   //$.qu('.lodin-p').style.display = '-webkit-box';
    var date =GetDateStrH(date1,-24)
   //console.log(date)
    var  jsonData= {
              from: getCityCode(urlFrom),
              to: getCityCode(urlTo),
              date: date
          }
    myAjaxGetLowpricepr(jsonData.from,jsonData.to);
    function myAjaxGetLowpricepr(city1,city2){


             var  oData2 = '';

            var xhr = '';
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest();
            }else{
                xhr =new ActiveXObject(' Microsoft . XMLHTTP')
            }
             //xhr.open('get','http://121.52.212.39:83/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'false');
             //xhr.open('get',flightUrlprice+'/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'true');//  异步加载 最低价
             xhr.open('get','/icbc/ajax.aspx?from='+city1+'&to='+city2+'&act=GetLowPrice','true');//  异步加载 最低价
             xhr.send();
             xhr.onreadystatechange = function(){
                   if( xhr.readyState == 4){
                    // ajax 响内容解析完成，可以在客户端调用了
                          //$.qu('.lodin-p').style.display = 'none';
                          if(xhr.status == 200){
                               //  判断服务器返回的状态 200 表示 正常

                              oData2 = JSON.parse(xhr.responseText);
                                //console.log(oData2)

                              var yesDay =  jsonData.date;
                              var nowDate = getPointedDate(yesDay, 1, "+");
                              var nextDay =getPointedDate(nowDate, 1, "+");
                              for (var p in oData2) {
                                  var dateDiv = p.replace(jsonData.from + "_" + jsonData.to + "_", "");
                                  //console.log(dateDiv) // 时间
                                  //console.log(oData2[p]) //价格
                                  if(false){ // 给日历中加价格
                                      // $("#calendarBox div[data=" + dateDiv + "]").find("font:eq(1)").html("￥" + result[p]);
                                  }

                                  // //顶部三天价格
                                  if (dateDiv == nowDate) {
                                     $.id('detail-nowdata3').innerHTML =oData2[p];
                                  }
                                  if (dateDiv == yesDay) {
                                      $.id('detail-odldata').innerHTML =oData2[p];
                                  }
                                  if (dateDiv == nextDay) {
                                      $.id('detail-nexdata1').innerHTML =oData2[p];
                                  }
                              }

                              zerofn();//出现 价格为0的时候 的处理
                          }else{
                                //alert('出错了，价格查询异常！'); 超时也不管 试试
                               // myalertp('detail','出错了，价格查询异常！')
                          }
                    }
            }

     }

}
// 价格为0 处理函数
function zerofn(){
   var nextp = $.id('detail-nexdata1').innerHTML;
   var todayp =  $.id('detail-nowdata3').innerHTML;
   var pre =  $.id('detail-odldata').innerHTML;
    if( nextp == 0){
        $.qu('.detail-tms2d1').style.height ='2.4rem';
        $.qu('.detail-tms2d1').style.lineHeight ='2.4rem';
        $.qu('.detail-tms2d2').style.display = 'none';
        $.qu('.detail-tmbn2img2').style.marginTop ='0';
    }else{
        $.qu('.detail-tms2d1').style.height ='1.3rem';
        $.qu('.detail-tms2d1').style.lineHeight ='1.9rem';
        $.qu('.detail-tms2d2').style.display = 'inline-block';
        $.qu('.detail-tmbn2img2').style.marginTop ='1rem';
    }
    if( pre == 0){
        $.qu('.detail-tms1d1').style.height ='2.4rem';
        $.qu('.detail-tms1d1').style.lineHeight ='2.4rem';
        $.qu('.detail-tms1d2').style.display = 'none';
        $.qu('.detail-tmbn1img1').style.marginTop ='0';
    }else{
        $.qu('.detail-tms1d1').style.height ='1.3rem';
        $.qu('.detail-tms1d1').style.lineHeight ='1.9rem';
        $.qu('.detail-tms1d2').style.display = 'inline-block';
        $.qu('.detail-tmbn1img1').style.marginTop ='1rem';
    }
    if( todayp == 0){
        $.qu('.detail-tmmais4').style.display = 'none';
    }else{
        $.qu('.detail-tmmais4').style.display = 'inline-block';
    }

}
// 增加 N天或者减少 N 天 函数封装
function GetDateStrH(date,h) {

    var  Y1 = date.substring(0, 4);
    var  m1 = date.substring(5, 7)-1;
    var  d1 = date.substring(8, 10);
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
    return  y + "-" + m + "-" + d ;
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
         //alert(citys[i].id);
      }
   }

}


function toTOP() {
    var odP = $.id('date-m');
    if( odP.scrollTop != 0){
        odP.scrollTop =0; // 返回顶部
    }
}

//去除"\:" and "\-"
function removeMh(date) {
    return parseInt(date.replace(/\:|\-/g, ""));
}





