/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp ,SetCookie,getCookieVal,GetCookie,userOnoffpp,setTitle,myget} from '../util/api';// myalertp 封装的 alert提示弹层
import { urlParam, session, getHash,getBaseUrl} from '../lib/kutil';
let _view = require('raw!./product.html');

var tcity ='';
var OT = 1;
var theID ='';
var theCarrier=''; //获取改签规则的数据
var tobookdata1 = {}; // 单程数据→ book
var tobookdata12 = {}; //防止被修改
var backdatapro = ''; // 返程数据包
var backprtyep = ''; // 判断是否要返程 在返程数据包里
var myfromData ={};//  去程需要调转的数据包 需要带回进行返程查找 最后在一起提交
var  fitstData ='';
window.top.userName ='';
window.top.userID ='';
var timer ='';// 定时器
var Member ={};
var flight1 = [];//存放 单程 或者去程 展示航班
var flight2 = [];//存放 返程 展示航班

var theCarrier ='';// 航空公司号
var DsOnePricep = ''; //匹配的 航司号


var isTripp =  0;//表示没匹配   1//直营  0/非直营
var thedatap ='';

var thelowf = '';// 存放 最低价数据
var thelowfo = '';// 存放 最低价格数据

var  pcnumdata = '';//存放航班号


export default class {
      path = '/flightmb/product$';
      hash = '/flightmb/product';
      title = '产品详情';
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

          var prt=params.prot;

          if(prt ==1){
              var prAlldata=params.prData;
              backdatapro = params.bdata;
              backprtyep =backdatapro.backtype; //  单程为 1  往返 为2
              //console.log(backprtyep);
              theCarrier = prAlldata.theCarrier; // 获取航空公司号
              pcnumdata = prAlldata.carrierabb2;
              getDsOnePricepp(theCarrier,prAlldata);//  后台获取 要匹配的 航司号
              thedatap = params.prData.prDate;


          }else if(prt ==3){
                //console.log(params)
                var prAlldata=params.prData;
                fitstData =params.bdata;
                backprtyep =3; //  带往返数据 进入预定页面
                theCarrier = prAlldata.theCarrier; // 获取航空公司号
                Member:params.Member;
                getDsOnePricepp(theCarrier,prAlldata)
                thedatap = params.prData.prDate;
          }else{
              // 什么都不做 2 就是预定界面返回的
          }

          // 页面返回
          $.qu('.product-t1').onclick =function () {
              $.router.go('#!/flightmb/detail',{cliktype:3,ptdata:thedatap},true)
          }

          // 头部 主页返回
          $.qu('.p_home').onclick =()=>{
              $.router.go('#!/flightmb/join','',false)
          }

          //  动态修改 头部电话
          pullHeadphone(theCarrier);

      }
}

//  动态修改 头部电话
function pullHeadphone(cpnum) {

    var telOB = $.qu('.p_phone');
    if(cpnum =="CZ" ){
        getCZphone('CZ',telOB)
    }else{
        getCZphone('XHSV',telOB)
    }
}
//页面填写数据
function productPulldata(prAlldata){

    $.id('productcity0').innerHTML =prAlldata.RouteFrom;
    $.id('productcity1').innerHTML =prAlldata.RouteTo;
    $.id('ptime').innerHTML =prAlldata.prDate;
    $.id('pwen').innerHTML =prAlldata.prWen;// 星期几
    //起飞和降落的时间差
    timetobf(prAlldata.FlyTime,prAlldata.arrtime);



    $.qu('.phw-ml1sp1').innerHTML =prAlldata.FlyTime;
    $.qu('.phw-ml1sp2').innerHTML =prAlldata.arrtime;
    $.qu('.phw-ml3sp1').innerHTML =prAlldata.fromairport;
    $.qu('.phw-ml31sp2').innerHTML =prAlldata.toairport;
    $.id('pc').innerHTML =prAlldata.carrierabb;
    $.id('plane').innerHTML =prAlldata.model; //bdata
    if(prAlldata.JtStop == 0){
        $.qu('.theJT').style.display = 'none';
    }else{
        $.qu('.theJT').style.display = 'block';
    }
    flight1 =prAlldata.flight1data;

     theCarrier = prAlldata.theCarrier;// 获取航空公司号

    theID =prAlldata.pulId;

    tobookdata1={  // 单程 主要数据 不包含价格  原始数据  航班页面带过来的
        data1:prAlldata.prDate,
        pc: prAlldata.carrierabb1,
        pcnum: prAlldata.carrierabb2,
        ftime:prAlldata.FlyTime,
        fplace:prAlldata.RouteFrom,
        fport:prAlldata.fromairport,
        ttime:prAlldata.arrtime,
        tplace:prAlldata.RouteTo,
        tport:prAlldata.toairport,
        ZYtype:prAlldata.ZYtype,
        theCarrier1:prAlldata.theCarrier,
        //Discount:prAlldata.Discount,
        YPrice:prAlldata.YPrice,
        RouteFromCode:prAlldata.RouteFromCode,
        RouteToCode:prAlldata.RouteToCode,
        Lmodel:prAlldata.Lmodel,
        Cabin1:prAlldata.Cabin,
        Terminal:prAlldata.Terminal
    };

    tobookdata12= deepCopy(tobookdata1);// 深拷贝 tobookdata1


    myAjaxGetLowprice(theID ,flight1,theCarrier);
}


//时间差函数
function timetobf(datef,datet){

    var t11 = Number(datef.split(':')[0])*60 + Number( datef.split(':')[1]);
    var t21 = Number( datet.split(':')[0])*60 + Number( datet.split(':')[1]);
    var t12 = parseInt((t21-t11)/60);
    var t22 = (t21-t11)%60;

    if(t12<0){ // 负数取余数
        t12 +=23;
        t22 +=60
    }
    $.id('pH1').innerHTML =t12;//相差几小时
    $.id('pH2').innerHTML =t22;//相差几分

}


// 获取 产品数据 ajax
function myAjaxGetLowprice(theID,flight1,theCarrier){
    var param = {
        "act": "SearchByCabinFlagJson",
        "cabinFlag": theID,
        };
    var  oData2 = [];

    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
         //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act='+param.act+'&cabinFlag='+param.cabinFlag,'false');
         xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act='+param.act+'&cabinFlag='+param.cabinFlag,'false');

         xhr.send();
         xhr.onreadystatechange = function(){
               if( xhr.readyState == 4){
                // ajax 响内容解析完成，可以在客户端调用了
                      if(xhr.status == 200){
                           //  判断服务器返回的状态 200 表示 正常
                          if(xhr.responseText !=''){
                              var ldata =JSON.parse(xhr.responseText);
                              //console.log(ldata.length)
                              //console.log(ldata)
                              ldata.unshift(flight1);
                              oData2 =ldata;
                          }else{
                              oData2.push(flight1);
                          }

                          //oData2 = xhr.responseText;
                          console.log(oData2)
                          $.qu('.pro-main-wrap').innerHTML ='';
                          proPulldatanew(oData2,theCarrier);
                          datashow();// 更多航班按钮
                          getjiad();//余票展示
                          ptoMybook();//预定函数
                          // 退改详情
                          getChangeData();


                       }else{
                           // alert('出错了，获取产品出错！');
                            myalertp('myproduct','出错了，获取产品出错。')
                       }
                }
        }



 }
//  获取最低价航班信息
function getloapriceflight(data){

    var theolddatalow =data;
    var theolddatalowo =deepCopy(data);

    var allflig = $.qus('.promiandata-l3');
    var  thelowflight ='';//浮动价格需要
    var  thelowflighto ='';//最低价格需要
    var  theindex = 0;// 获取 最低价 索引
    var  thedisc =[];//  所有 经济舱 折扣 数组
    var dataarr =[];// 折扣 数组对应的  舱位基础信息
    var dataarrno =[];//不是经济舱 的 所有基础仓位的数组


    for(var i =0;i< allflig.length;i++){
        var  zYt = allflig[i].getAttribute('zytypep');
        var  dis = allflig[i].getAttribute('discount');
        var  cabi = allflig[i].getAttribute('cabinlevel').indexOf('经济');

        if(isTripp ==1){// 航司匹配 说明 为直营且能卖差旅的票 南航
            if(zYt  == 1){
                if(cabi != -1){ //选出经济舱位
                    var thed = dis;
                    if(thed == '全价'){
                        thed = '10';
                    }else{
                        thed = dis.replace('折','')
                    }
                    thedisc.push(Number(thed))
                    dataarr.push(allflig[i])

                }else{
                    dataarrno.push(allflig[i])
                }

            }
        }else{
            if(zYt  == 0){ //  非直营 机票
                if(cabi != -1){ //选出经济舱位
                    var thed = dis;
                    if(thed == '全价'){
                        thed = '10';
                    }else{
                        thed = dis.replace('折','')
                    }
                    thedisc.push(Number(thed))
                    dataarr.push(allflig[i])
                }else{
                    dataarrno.push(allflig[i])
                }


            }

        }
    }
    var flightdiscount={
        floatnum:2,
        min:7,
        max:8
    }
    //var sthedisc = thedisc.sort() 不需要排序??
    var len =thedisc.length; // 7折为界线  6.8为是否浮动界线
    if(len != 0){
        if(len ==1){
            theindex = 0;
        }else if(len >=2){
            if(thedisc[0] >= flightdiscount.min){
                theindex = 0;
            }else {// 小于基础折扣

                if( thedisc[1]<= (thedisc[0]+flightdiscount.floatnum) && thedisc[1]< flightdiscount.max) { // 6.3 /7.6

                    theindex = 1;
                }else{
                    theindex = 0;
                }
            }
        }
        thelowflight =dataarr[theindex];

    }else{// 要 区分 直营 和非直营 深航的时候  只能选 非直营列表的 第一个
        //没有经济舱位 的时候 最低价 为非直营列表的第一个(南航除外 没有经济舱位  就是 当前列表的第一个)  价格最低
        thelowflight =dataarrno[0];
    }

    //console.log('打印最低价索引')
    //console.log(theindex)
    //console.log('打印最低价航班基础信息')
    //console.log(thelowflight)

    // 最低价航班数据打包

    theolddatalow.pice1 = thelowflight.getAttribute('proprice') // 添加价格
    theolddatalow.theCa = thelowflight.getAttribute('seachprice') // 添加查询价格 必备参数
    theolddatalow.CabinType = thelowflight.getAttribute('cabinType') // 判断是否是直营
    theolddatalow.InsureType = thelowflight.getAttribute('insureType') // 保险类型

    theolddatalow.zytypep = thelowflight.getAttribute('zytypep') // 判断是否是直营zytypep
    theolddatalow.hbjine = thelowflight.getAttribute('hbjine') // hbjine 红包价格
    theolddatalow.hashongbao = thelowflight.getAttribute('hashongbao') // 判断是否有红包 hashongbao
    theolddatalow.isTrippok = thelowflight.getAttribute('isTrippok') //  航司匹配与否
    theolddatalow.ZhPolicyId = thelowflight.getAttribute('ZhPolicyId') //
    theolddatalow.cabindesc = thelowflight.getAttribute('cabindesc') // 川航 字段1
    theolddatalow.sequencenumber = thelowflight.getAttribute('sequencenumber') // 川航 字段2
    theolddatalow.cbcount = thelowflight.getAttribute('CbCount') // 剩余票数量
    theolddatalow.discount = thelowflight.getAttribute('Discount') // 当前航班的折扣
    theolddatalow.cabinlevel = thelowflight.getAttribute('cabinlevel') // 舱位判断

    if(dataarr.length !=0){// 有经济舱位
        thelowflighto=dataarr[0];
    }else{// 没有经济舱位
        thelowflighto=dataarrno[0];

    }


    theolddatalowo.pice1 = thelowflighto.getAttribute('proprice') // 添加价格
    theolddatalowo.theCa = thelowflighto.getAttribute('seachprice') // 添加查询价格 必备参数
    theolddatalowo.CabinType = thelowflighto.getAttribute('cabinType') // 判断是否是直营
    theolddatalowo.InsureType = thelowflighto.getAttribute('insureType') // 保险类型

    theolddatalowo.zytypep = thelowflighto.getAttribute('zytypep') // 判断是否是直营zytypep
    theolddatalowo.hbjine = thelowflighto.getAttribute('hbjine') // hbjine 红包价格
    theolddatalowo.hashongbao = thelowflighto.getAttribute('hashongbao') // 判断是否有红包 hashongbao
    theolddatalowo.isTrippok = thelowflighto.getAttribute('isTrippok') //  航司匹配与否
    theolddatalowo.ZhPolicyId = thelowflighto.getAttribute('ZhPolicyId') //
    theolddatalowo.cabindesc = thelowflighto.getAttribute('cabindesc') // 川航 字段1
    theolddatalowo.sequencenumber = thelowflighto.getAttribute('sequencenumber') // 川航 字段2
    theolddatalowo.cbcount = thelowflighto.getAttribute('CbCount') // 剩余票数量
    theolddatalowo.discount = thelowflighto.getAttribute('Discount') // 当前航班的折扣
    theolddatalowo.cabinlevel = thelowflighto.getAttribute('cabinlevel') // 当前航班的折扣

    thelowf =theolddatalow ;
    thelowfo =theolddatalowo ;
    //console.log(thelowf)
}
//对象 深拷贝
function deepCopy(source) {
    var result={};
    for (var key in source) {
        result[key] = typeof source[key]==='object'? deepCoyp(source[key]): source[key];
    }
    return result;
}

//预订函数
function ptoMybook(){

    $.each( $.qus('.promiandata-l3'),function(){


          this.onclick = function(){
              tobookdata1.pice1 = this.getAttribute('proprice');// 添加价格
              tobookdata1.theCa = this.getAttribute('seachprice');// 添加查询价格 必备参数
              tobookdata1.CabinType = this.getAttribute('cabinType');// 判断是否是直营
              tobookdata1.InsureType = this.getAttribute('insureType');// 保险类型

              tobookdata1.zytypep = this.getAttribute('zytypep');// 判断是否是直营zytypep
              tobookdata1.hbjine = this.getAttribute('hbjine');// hbjine 红包价格
              tobookdata1.hashongbao = this.getAttribute('hashongbao');// 判断是否有红包 hashongbao
              tobookdata1.isTrippok = this.getAttribute('isTrippok') //  航司匹配与否
              tobookdata1.ZhPolicyId = this.getAttribute('ZhPolicyId') //
              tobookdata1.cabindesc = this.getAttribute('cabindesc') // 川航 字段1
              tobookdata1.sequencenumber = this.getAttribute('sequencenumber') // 川航 字段2
              tobookdata1.cbcount = this.getAttribute('CbCount') // 剩余票数量
              tobookdata1.discount = this.getAttribute('Discount') // 当前航班的 折扣
              tobookdata1.cabinlevel = this.getAttribute('cabinlevel') // 舱位判断






              //console.log(tobookdata1);







                  var  pfjprice =getbasep();
                  //SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
                  if(backprtyep==3){
                      //// 带着往 返数据 进入 预定界面
                      //$.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:tobookdata1,ptbdata2:fitstData,Member:Member},true)
                      // 判断直营 判断2次航班 必须都是是直营
                      var fromzytype = fitstData.zytypep;
                      var tozytype = tobookdata1.zytypep;
                      //console.log('去程直营'+fromzytype+',返程直营'+tozytype);
                      var alertms = '抱歉，您还未登陆，请前往登陆页面~~';
                      if(fromzytype ==1){
                          if(tozytype ==1){
                              // 带着往 返数据 进入 预定界面
                              tobookdata1.thelowf =thelowf;
                              tobookdata1.thelowfo =thelowfo;
                              var allbookdata ={pbtype:3,ptbdata1:tobookdata1,ptbdata2:fitstData,Member:Member,pfjprice:pfjprice,isclearps:1};
                              var allbookdatastr = JSON.stringify(allbookdata);
                              //console.log(allbookdatastr);

                              userOnoffpp('p', function(){
                                  $.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:tobookdata1,ptbdata2:fitstData,Member:Member,pfjprice:pfjprice,isclearps:1},true)
                              },'myproduct','.lodinp',allbookdatastr,alertms,1)

                          }else{
                              //alert('请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单')
                              myalertp('myproduct','请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单。')
                          }

                      }else{ //fromzytype ==0
                          if(tozytype ==0){
                              // 都不是直营
                              tobookdata1.thelowf =thelowf;
                              tobookdata1.thelowfo =thelowfo;
                              var allbookdata ={pbtype:3,ptbdata1:tobookdata1,ptbdata2:fitstData,Member:Member,pfjprice:pfjprice,isclearps:1};
                              var allbookdatastr = JSON.stringify(allbookdata);
                              //console.log(allbookdatastr)
                              userOnoffpp('p', function(){
                                  $.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:tobookdata1,ptbdata2:fitstData,Member:Member,pfjprice:pfjprice,isclearps:1},true)
                              },'myproduct','.lodinp',allbookdatastr,alertms,1)

                          }else{
                              //alert('请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单')
                              myalertp('myproduct','请选择与去程同一航司直营航班，航司直营无法与其他航班混合下单。')
                          }
                      }
                  }else if(backprtyep==1){
                      //console.log(tobookdata1)

                      // backprtyep  值 为1 或者2  2为往返
                      tobookdata1.thelowf =thelowf;
                      tobookdata1.thelowfo =thelowfo;
                      var allbookdata ={pbtype:3,ptbdata1:tobookdata1,ptbdata2:'',Member:Member,pfjprice:pfjprice,isclearps:1};
                      var allbookdatastr = JSON.stringify(allbookdata);
                      //console.log(allbookdatastr);
                      //console.log(allbookdatastr);
                      //userOnoffpp(num,fn,pageid,layercla,dataname,data)

                      userOnoffpp('p', function(){
                          // 单程 直接进入预定界面

                              $.router.go('#!/flightmb/book',{pbtype:3,ptbdata1:tobookdata1,ptbdata2:'',Member:Member,pfjprice:pfjprice,isclearps:1},true)
                      },'myproduct','.lodinp',allbookdatastr,alertms,1)

                  }else if(backprtyep==2){
                      //
                      tobookdata1.thelowf =thelowf;
                      tobookdata1.thelowfo =thelowfo;
                      myfromData =tobookdata1;// 去程数据打包
                      $.router.go('#!/flightmb/detail',{cliktype:4,ptbdata1:myfromData,searchbdata:backdatapro,thelowf:thelowf},true)
                  }

          }
    })

}
///////////////
 //   获取 Y以上仓位  的基础仓位  F/P  J 的价格函数
function getbasep(){
    var allpr = $.qus('.promiandata-l3');
    var P ='';
    var F ='';
    var G ='';
    var J ='';
    for (var i = 0; i < allpr.length; i++) {
        var cab =$.attr(allpr[i],'seachprice') ;
        if(cab =='P'){
            P  =$.attr(allpr[i],'proprice')
        }else if(cab =='J'){
            J =$.attr(allpr[i],'proprice')
        }else if(cab =='F'){
            F =$.attr(allpr[i],'proprice')
        }else if(cab =='G'){
            G =$.attr(allpr[i],'proprice')
        }


    }

    var json = {
        P :P,
        F :F,
        G :G,
        J :J
    }
   return  json

}

/////////////////////////////////////////////////////
// 页面数据整合 更新

// 页面数据格式整合
function proPulldatanew(data ,theCarrier){
    var zydata =[];
    var xhdata =[];
    for(var i=0;i<data.length;i++){
        if( data[i].CabinType == 6 || isTripp ==1){ //直营航班
            zydata.push(data[i])
        }else{ //非直营航班
            xhdata.push(data[i]);
        }
    }


    //return str
    //console.log('直营航班数据')
    //console.log(zydata)
    //console.log('非直营航班数据')
    //console.log(xhdata)
    var  zylen =  zydata.length;
    var  xhlen =  xhdata.length;
    var  allhtml =''
    if(zylen ==0 && xhlen !=0 ){
        for(i=0;i< xhlen;i++){
            allhtml += creathtmlxh(xhdata[i],1)
        }
    }else if( zylen !=0 && xhlen ==0 ){
        for(i=0;i< zylen;i++){
            allhtml += creathtmlzy(zydata[i],2);// 2表示 全部为直营航班 1表示都有
        }
    }else if( zylen !=0 && xhlen !=0){
        allhtml = newhtmlfn(zydata,2,theCarrier)+newhtmlfn(xhdata,1,theCarrier);

    }else{
        allhtml = '暂时没有数据'
    }
    $.qu('.pro-main-wrap').innerHTML = allhtml;
    $.each($.qus('.themore1'),function(){
       if($.attr(this,'hashongbaoe') == 'false'){
           this.style.display ='none';
       }
    })


    getloapriceflight(tobookdata12)

}
// 下拉 页面展示
function datashow(){
    var allpulldaxh = $.qus('.xhflight');
    var allpulldazy = $.qus('.zyflight');
    var btnproxh = $.qu('.fmoret');//fmoretz
    var btnprozy = $.qu('.fmoretz');
    var onoffbtn =true;
    var onoffbtnz =true;// 直营 更多航班按钮
    if(btnproxh){
        btnproxh.onclick = function(){
            //console.log('点击事件触发了')
            if(onoffbtn){
                for(let i=0;i<allpulldaxh.length;i++){
                    //allpulldaxh[i].style.display = 'block';
                    $.removeClass(allpulldaxh[i],'xhflight')
                }
                onoffbtn =false;
            }else{
                for(let i=0;i<allpulldaxh.length;i++){
                    //allpulldaxh[i].style.display = 'none';addClass
                    //allpulldaxh[i].className('promiandata xhflight')
                    $.addClass(allpulldaxh[i],'xhflight')
                }
                onoffbtn =true;
            }
        }
    }
    if(btnprozy){
        btnprozy.onclick = function(){
            if(onoffbtnz){

                for(var i=0;i<allpulldazy.length;i++){
                    allpulldazy[i].style.display = 'block';
                }
                onoffbtnz =false;

            }else{
                for(var i=0;i<allpulldazy.length;i++){
                    allpulldazy[i].style.display = 'none';
                }
                onoffbtnz =true;
            }
        }

    }
}

function newhtmlfn(data,type,theCarrier){ // data  为直营 或者非直营数据   type 1/2  判断直营 非直营
    var dlength =data.length;
    var str ='';
    var str1= '';
    var str2= '';
    // 川航直营 特殊参数
    var cabinDesc = '';
    var sequenceNumber ='';
    if(type ==1){// 非直营
        if(dlength !=0){
                if(dlength >1){
                    str1 ='<ul class="promiandata"><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">'+data[0].Fare+'</strong></span><span class="themore1" Hashongbaoe="'+data[0].Hashongbao+'" ><span class="lite">红包立减</span><em class="litep">￥</em><em class="themore">'+data[0].HBJinE+'</em></span></li><li class="promiandata-l2"><strong class="thecabin">'+data[0].CabinLevel+'</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">'+data[0].CbCount+'张</em><em class="prmove ">+</em></span><span class="thediscount">'+data[0].Discount+'</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="'+data[0].Fare+'" seachprice="'+data[0].Cabin+'" CabinType="'+data[0].CabinType+'" InsureType="'+data[0].InsureType+'"  zytypep =0  isTrippok=2   HBJinE="'+data[0].HBJinE+'" Hashongbao ="'+data[0].Hashongbao+'"  ZhPolicyId =1  cabinDesc =""  sequenceNumber =""  CbCount="'+data[0].CbCount+'"  discount="'+data[0].Discount+'" cabinLevel="'+data[0].CabinLevel+'" >预订</span></li><li class="promiandata-l5"><span class="changepage" data="'+data[0].Cabin+'" prPRice="'+data[0].Fare+'" CabinLevel="'+data[0].CabinLevel+'" >退改签规定</span><span class="xhcredit ">该航班支持授信月结</span><span class="fmoret"  >更多舱位<img class="fmore" src="https://cos.uair.cn/mb/img/botom.png" alt=""></span></li></ul>';
                    for(var i=1;i<data.length;i++){
                        str2 +=creathtmlxh(data[i],2);//非直营航班
                    }
                    str =str1 +str2;
                    return str
                }else{// 只有一条数据
                    str1 ='<ul class="promiandata"><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">'+data[0].Fare+'</strong></span><span class="themore1" Hashongbaoe="'+data[0].Hashongbao+'" ><span class="lite">红包立减</span><em class="litep">￥</em><em class="themore">'+data[0].HBJinE+'</em></span></li><li class="promiandata-l2"><strong class="thecabin">'+data[0].CabinLevel+'</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">'+data[0].CbCount+'张</em><em class="prmove ">+</em></span><span class="thediscount">'+data[0].Discount+'</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="'+data[0].Fare+'" seachprice="'+data[0].Cabin+'" CabinType="'+data[0].CabinType+'" InsureType="'+data[0].InsureType+'"  zytypep =0  isTrippok=2   HBJinE="'+data[0].HBJinE+'" Hashongbao ="'+data[0].Hashongbao+'"  ZhPolicyId =1  cabinDesc =""  sequenceNumber =""  CbCount="'+data[0].CbCount+'"  discount="'+data[0].Discount+'" cabinLevel="'+data[0].CabinLevel+'"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="'+data[0].Cabin+'" prPRice="'+data[0].Fare+'" CabinLevel="'+data[0].CabinLevel+'" >退改签规定</span><span class="xhcredit ">该航班支持授信月结</span></li></ul>';
                    str = str1;
                    return str
                }
        }else{//没得数据
            str ='';
            return str

            }

    }else{ // 直营数据
        var purl ='';
       // var ptext ='';
        var ptextp = '';
        switch(theCarrier)
        { // 还原航空公司号
            case "ZH":
                purl ='img/zy_ZH';
                ptextp ='无差旅月结,无配送';
                break;
            case "CZ":
                purl ='img/zy_CZ';
                ptextp ='差旅月结,无配送';
                break;
            case "3U":
                purl ='img/zy_3U';
                ptextp ='无差旅月结,无保险,无配送';
                break;
            case "HU":
                purl ='img/zy_HU';
                ptextp ='无差旅月结,无保险,无配送';
                break;
        }
        if(dlength !=0){
            var isTrippok =0;
            if(isTripp ==1){// 航司匹配
                isTrippok =1;
            }else{ // 航司不匹配
                isTrippok =0
            }
            if( data[0].ZhPolicyId == null){
                data[0].ZhPolicyId = 1;
            }

            if( !data[0].ChOtherParam ){
                cabinDesc = '';
                sequenceNumber = ''
            }else{
                cabinDesc =data[0].ChOtherParam.cabinDesc;
                sequenceNumber =data[0].ChOtherParam.sequenceNumber;
            }

            if(dlength >1){
                str1 ='<ul class="promiandata"><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">'+data[0].Fare+'</strong></span><span class="themore1" Hashongbaoe=0 style=" color: #e61515;padding-left: 0.2rem;" >官方直营</span></li><li class="promiandata-l2"><strong class="thecabin">'+data[0].CabinLevel+'</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">'+data[0].CbCount+'张</em><em class="prmovez ">+</em></span><span class="thediscount">'+data[0].Discount+'</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="'+data[0].Fare+'" seachprice="'+data[0].Cabin+'" CabinType="'+data[0].CabinType+'" InsureType="'+data[0].InsureType+'" zytypep =1   isTrippok="'+isTrippok+'"  HBJinE="'+data[0].HBJinE+'" Hashongbao ="'+data[0].Hashongbao+'"  ZhPolicyId ="'+data[0].ZhPolicyId+'"  cabinDesc ="'+cabinDesc+'"  sequenceNumber ="'+sequenceNumber+'"  CbCount="'+data[0].CbCount+'"  discount="'+data[0].Discount+'" cabinLevel="'+data[0].CabinLevel+'"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="'+data[0].Cabin+'" prPRice="'+data[0].Fare+'" CabinLevel="'+data[0].CabinLevel+'" >退改签规定</span><span class="xhcredit ">'+ptextp+'</span><span class="fmoretz">更多舱位<img class="fmore" src="https://cos.uair.cn/mb/img/botom.png" alt=""></span></li></ul>';
                for(var i=1;i<data.length;i++){
                    str2 += creathtmlzy(data[i],1);//直营 隐藏 航班
                    // zhiy
                }
                str =str1 +str2;
                return str
            }else{// 只有一条数据
                str1 ='<ul class="promiandata"><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">'+data[0].Fare+'</strong></span><span class="themore1" Hashongbaoe=0 style=" color: #e61515;padding-left: 0.2rem;" >官方直营</span></li><li class="promiandata-l2"><strong class="thecabin">'+data[0].CabinLevel+'</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">'+data[0].CbCount+'张</em><em class="prmovez ">+</em></span><span class="thediscount">'+data[0].Discount+'</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="'+data[0].Fare+'" seachprice="'+data[0].Cabin+'" CabinType="'+data[0].CabinType+'" InsureType="'+data[0].InsureType+'" zytypep =1   isTrippok="'+isTrippok+'"  HBJinE="'+data[0].HBJinE+'" Hashongbao ="'+data[0].Hashongbao+'"  ZhPolicyId ="'+data[0].ZhPolicyId+'"  cabinDesc ="'+cabinDesc+'"  sequenceNumber ="'+sequenceNumber+'" CbCount="'+data[0].CbCount+'"  discount="'+data[0].Discount+'"  cabinLevel="'+data[0].CabinLevel+'"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="'+data[0].Cabin+'" prPRice="'+data[0].Fare+'" CabinLevel="'+data[0].CabinLevel+'" >退改签规定</span><span class="xhcredit ">'+ptextp+'</span></span></li></ul>';
                str = str1;
                return str
            }
        }else{//没得数据
            str ='';
            return str

        }


    }
}
//  非直营  航班 数据
function creathtmlxh(datax,n){
    var xhtext ='';
    var xhclass ='';
    if(n==2){
        xhtext ='该航班支持授信月结';
        xhclass = '  xhflight';
    }else{
        xhtext ='';
        xhclass = '';
    }
    var strr ='<ul class="promiandata'+xhclass+' " ><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">'+datax.Fare+'</strong></span><span class="themore1" Hashongbaoe="'+datax.Hashongbao+'" ><span class="lite">红包立减</span><em class="litep">￥</em><em class="themore">'+datax.HBJinE+'</em></span></li><li class="promiandata-l2"><strong class="thecabin">'+datax.CabinLevel+'</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">'+datax.CbCount+'张</em><em class="prmove ">+</em></span><span class="thediscount">'+datax.Discount+'</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="'+datax.Fare+'" seachprice="'+datax.Cabin+'" CabinType="'+datax.CabinType+'" InsureType="'+datax.InsureType+'"  zytypep =0  isTrippok=2   HBJinE="'+datax.HBJinE+'" Hashongbao ="'+datax.Hashongbao+'"  ZhPolicyId =1  cabinDesc =""  sequenceNumber ="" CbCount="'+datax.CbCount+'"  discount="'+datax.Discount+'"             cabinLevel="'+datax.CabinLevel+'"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="'+datax.Cabin+'" prPRice="'+datax.Fare+'" CabinLevel="'+datax.CabinLevel+'" >退改签规定</span><span class="xhcredit ">'+xhtext+'</span></li></ul>';

    return strr

}

//  直营  航班 数据
function creathtmlzy(dataz,n){
    var  zyclass = '';
    if(n==1){ // 直营和非直营都有
        zyclass ='  zyflight';

    }else{
        zyclass ='';
    }
    var purl ='';
    var ptextp = '';
    switch(theCarrier)
    { // 还原航空公司号
        case "ZH":
            purl ='img/zy_ZH';
            ptextp ='无差旅月结,无配送';
            break;
        case "CZ":
            purl ='img/zy_CZ';
            ptextp ='有差旅月结,无配送';
            break;
        case "3U":
            purl ='img/zy_3U';
            ptextp ='无差旅月结,无保险,无配送';
            break;
        case "HU":
            purl ='img/zy_HU';
            ptextp ='无差旅月结,无保险,无配送';
            break;
    }
    var strzy ='';
    var cabinDesc = '';
    var sequenceNumber = '';
    var isTrippok =0;
    if(isTripp ==1){// 航司匹配
        isTrippok =1;
    }else{ // 航司不匹配
        isTrippok =0
    }
    if( dataz.ZhPolicyId == null){
        dataz.ZhPolicyId = 1;
    }

    if( !dataz.ChOtherParam ){
        cabinDesc = '';
        sequenceNumber = '';
    }else{
        cabinDesc =dataz.ChOtherParam.cabinDesc;
        sequenceNumber =dataz.ChOtherParam.sequenceNumber;
    }
    strzy ='<ul class="promiandata '+zyclass+' "><li class="promiandata-l1"><span class="prprice">￥<strong class="theprice">'+dataz.Fare+'</strong></span><span class="themore1" Hashongbaoe=0 style=" color: #e61515;padding-left: 0.2rem;" >官方直营</span></li><li class="promiandata-l2"><strong class="thecabin">'+dataz.CabinLevel+'</strong><span class="numticks"><em class="onlybn" style="display: none;">仅</em><em class="prnum">'+dataz.CbCount+'张</em><em class="prmovez  ">+</em></span><span class="thediscount">'+dataz.Discount+'</span></li><li class=" promiandata-l4" ><span class="promiandata-l3" proprice ="'+dataz.Fare+'" seachprice="'+dataz.Cabin+'" CabinType="'+dataz.CabinType+'" InsureType="'+dataz.InsureType+'" zytypep =1   isTrippok="'+isTrippok+'"  HBJinE="'+dataz.HBJinE+'" Hashongbao ="'+dataz.Hashongbao+'"  ZhPolicyId ="'+dataz.ZhPolicyId+'"  cabinDesc ="'+cabinDesc+'"  sequenceNumber ="'+sequenceNumber+'"  CbCount="'+dataz.CbCount+'" discount="'+dataz.Discount+'" cabinLevel="'+dataz.CabinLevel+'"  >预订</span></li><li class="promiandata-l5"><span class="changepage" data="'+dataz.Cabin+'" prPRice="'+dataz.Fare+'" CabinLevel="'+dataz.CabinLevel+'" >退改签规定</span><span class="xhcredit ">'+ptextp+'</span></li></ul>';

    return  strzy
}



// 退改说明
function getChangeData(){
     var changes =$.qus('.changepage');
     for(var i=0;i<changes.length;i++){


          changes[i].onclick= function(){
             let dt1 =this.getAttribute('data');
             let dt2 =$.nextNode(this).innerHTML;
             //$.qu('.numticks1').innerHTML =dt2;
             $.qu('.changepagbox-price-sp3').innerHTML =this.getAttribute('cabinlevel');
             $.qu('.x-price-sp11').innerHTML =this.getAttribute('prprice');


            $.qu('.changepagbox').style.display ='block';
                 myAjaxChange(theCarrier,dt1);

           }
     }
     $.qu('.changepagbox-close').onclick= function(){
            $.qu('.changepagbox').style.display ='none';
           // $.qu('.numticks1').innerHTML ='';


     }

}

// 该退说明
function myAjaxChange(carrier,seat){

    $.qu('.lodinp').style.display = '-webkit-box';
        //console.log(carrier+seat)
         var  oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
         //xhr.open('get','http://106.75.131.58:8015/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','false');
         xhr.open('get',flightUrl+'/icbc/ajax.aspx?isKyReq=1&act=getOtherKyData&ACTION=GetRefundDef&carrier='+carrier+'&seat='+seat+'&reqPath=utlsiteservice.aspx','true');
         xhr.send();
         xhr.onreadystatechange = function(){
               if( xhr.readyState == 4){
                // ajax 响内容解析完成，可以在客户端调用了
                      if(xhr.status == 200){
                           //  判断服务器返回的状态 200 表示 正常
                           //  隐藏loading
                           $.qu('.lodinp').style.display = 'none';
                           if(xhr.responseText !=''){
                                 oData2 = eval(xhr.responseText);
                                 //console.log(oData2)
                                 $.qu('.changetex1').innerHTML =oData2[0].EndorseNotice;
                                 $.qu('.changetex2').innerHTML =oData2[0].UpNotice;
                                 $.qu('.changetex3').innerHTML =oData2[0].RefundNotice;

                           }else{
                                 $.qu('.changetex1').innerHTML ='退改签规则以航空公司最新规则为准';
                                 $.qu('.changetex2').innerHTML ='退改签规则以航空公司最新规则为准';
                                 $.qu('.changetex3').innerHTML ='退改签规则以航空公司最新规则为准';
                           }

                       }else{
                            //alert('出错了，获取退改签出错！');
                            myalertp('myproduct','出错了，获取退改签出错。')
                       }
                }
        }
 }
//  判断 票张数
function getjiad(){
     var thenums =$.qus('.prnum');
      //console.log(thenums.length)
     for(let i= 0;i<thenums.length;i++){
         var oPrev = thenums[i].previousElementSibling || thenums[i].previousSibling;
         var oPnex = thenums[i].nextElementSibling  || thenums[i].nextSibling;
         if(thenums[i].innerHTML =='A张'){
             thenums[i].innerHTML ='9张';

             oPrev.style.display = 'none';// 隐藏 仅
             oPnex.style.display = 'inline-block';// 显示 +


         }else{
             oPrev.style.display = 'inline-block';// 显示 仅
             oPnex.style.display = 'none';// 隐藏 +
         }
     }






}


// 获取直营 标志 DsOnePrice
function getDsOnePricepp(cp,data){
    var oData2 = '';
    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETDSONEPRICE','false');
    xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETDSONEPRICE','false');// 非异步 阻塞
    xhr.send();
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                //$.qu('.lodin-pa').style.display ='none';
                //  判断服务器返回的状态 200 表示 正常
                var  data1 = eval('('+xhr.responseText+')');
                if(data1 != ''){
                    oData2= data1.DsOnePrice;
                   // DsOnePriceBackp(oData2);
                    var thecps = oData2.split(',');
                    for(var i=0;i<thecps.length;i++){
                        if(cp ==thecps[i]){
                            isTripp = 1;//直营
                            break;
                        }else{
                            isTripp = 0;//非直营
                        }
                    }
                    productPulldata(data);
                }else{
                    //alert('获取直营参数失败！')
                    myalertp('myproduct','获取直营参数失败。')
                }
            }else{
                //alert('出错了，获取直营参数超时！');
                myalertp('myproduct','获取直营参数失败。')
            }
        }
    }
}

//// 新的登陆方式
//function userOnoffpp(num,fn,pageid,layercla,data) {
//
//    $.qu(layercla).style.display = '-webkit-box';
//
//    var mycode = encodeURIComponent(String(num));
//    document.cookie = "tkey=0";
//    document.cookie = "userName=";
//    document.cookie = "userID=";
//
//    var myUrl =getBaseUrl( window.location.href)+'?entry_code='+mycode;
//
//    var oData2 = '';
//    var xhr = new XMLHttpRequest();
//    var reqPath = flightUrl+'/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
//    //var reqPath = flightUrl+'/icbc/xhService.ashx?act=checkLogin&returnUri=' + myUrl;
//    xhr.open('get', reqPath, 'false');
//    xhr.send();
//    xhr.onreadystatechange = function () {
//        if (xhr.readyState == 4) {
//            // ajax 响内容解析完成，可以在客户端调用了
//            if (xhr.status == 200) {
//                $.qu(layercla).style.display = 'none';
//                //  判断服务器返回的状态 200 表示 正常
//                oData2 = JSON.parse(xhr.responseText);
//                //oData2 =eval(xhr.responseText)
//                var sta = oData2.Status;
//                var url = oData2.Result;
//                //alert(url)
//                if (sta == 1) {
//                    // 1表示已经登录了
//
//                    document.cookie = "userName=" + url.MemberName;
//                    document.cookie = "userID=" + url.CardNo;
//                    fn();
//                    //alert('已经登陆')
//                    console.log('初次每次都要验证！');
//                } else {
//                    //没有登录
//                    //
//                    // document.cookie = "tkey=0";
//                    document.cookie = "userName=";
//                    document.cookie = "userID=";
//                    location.href = "/html5/" + url;
//                    //alert('跳转登陆界面');
//                    localStorage.setItem('allbookdatastr',data)
//                }
//            } else {
//                //alert('初次验证出错了，Err' + xhr.status);
//                myalertp(pageid,'验证用户登录出问题。')
//            }
//        }
//    };
//}
//顶部电话图标电话号码修改


function getCZphone(key,el){
    myget(flightUrl+'/icbc/xhService.ashx','act=GETSERVICEPHONE&Source='+key,true, function (err,res) {
        if(err){
            myalertp('router0','出错了，获取客服联系电话失败！')
        }else{
            let oData3 = eval('('+res+')');
            let phonts =oData3.Result.Phone;
            let phontn =oData3.Result.Source;
            el.href=`tel:${phonts}`;

        }
    })
}