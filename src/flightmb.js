/**
 * Created by way on 16/9/21.
 */

import cfg from './config';
import Router from './lib/krouter';
import {setTitle, urlParam, session, getHash,getBaseUrl} from './lib/kutil';

import {get, docker,myalertp,myget ,SetCookie,getCookieVal,GetCookie} from './util/api';
import * as ajax from "./lib/kajax";

//import {getView, get, post ,myalertp,prototype,core,Converter,BusinessTravelTool,Dept,MGOpt,MemberOpt,OrderSubmitOpt,RsaTool,mycheckuser,SetCookie,getCookieVal,GetCookie} from './util/api';// myalertp 封装的 alert提示弹层

import Join from './flightmb/join';
import City from './flightmb/city';
import Adate from './flightmb/adate';
import Detail from './flightmb/detail';
import Picktime from './flightmb/picktime';
import Product from './flightmb/product';
import Allmytickes from './flightmb/allmytickes';
import Passenger from './flightmb/passenger';
import Changepassenger from './flightmb/changepassenger';
import Myhalinkp from './flightmb/mychalinkp';
import CChangelinkp from './flightmb/changelinkp';
import Book from './flightmb/book';
import Orderpage from './flightmb/Order';
import Contactpeople from './flightmb/contactpeople';
import Changeadd from './flightmb/changeadd';
import  Trip from './flightmb/Trip';
import  Allmybook from './flightmb/allmybook';
import  Orderd from './flightmb/orderd';



const router = new Router({
  container: '#dvContainer'
});





/// 获取 手机




document.ready(() => {


//global.flightUrl = "http://106.75.131.58:8015"; //  机票的绝对地址
//global.flightUrlprice = "http://121.52.212.39:83"; //  查询航班最低价绝对地址 https://cos.uair.cn/mb/img/
//global.imgUrl = "https://cos.uair.cn/mb/"; //  腾讯地址图片


  router.push(new Join())
    .push(new City())
    .push(new Detail())
    .push(new Picktime())
    .push(new Product())
    .push(new Allmytickes())
    .push(new Passenger())
    .push(new Changepassenger())
    .push(new Myhalinkp())
    .push(new CChangelinkp())
    .push(new Book())
    .push(new Orderpage())
    .push(new Contactpeople())
    .push(new Changeadd())
    .push(new Trip())
    .push(new Allmybook())
    .push(new Orderd())
    .push(new Adate());

   //获取地址穿参
  console.log('传输地址');
  var url =window.location.href;
 // alert(url);

  var bsurl = getBaseUrl(window.location.href);
  console.log(bsurl)
  var myurlarr =bsurl.split('?')
  var  myurl = myurlarr[0];

  console.log(myurl)
  var  xhurl  =bsurl.slice(-1);

  var  xhurlC  =urlParam('entry_code');

  //alert(xhurlC)//  初始的时候 未带  entry_code  会截取 aspx的最后一位 为x
   // a  为 我的机票 登陆返回参数
   // p 为产品页面返回参数
  // 其他登陆超时的时候 会自动返回初始页面

  // 剪掉 地址参数
  //window.location.href =myurl;


    //alert(window.navigator.userAgent)

    var datap =localStorage.getItem("allbookdatastr");
    console.log(datap);
    var allbookdatastr = '';
    if(datap){
        allbookdatastr = JSON.parse( datap );//取回students变量 把字符串转换成JSON对象
    }

    console.log(allbookdatastr)

    // token 获取

    var code = urlParam('entry_tk');// 获取 token
    console.log('token测试')
    console.log(code)

    if(code){ // 有token
        SetCookie('myxhtoken',code,120);//  设置定时器 cookie 120分钟 值为1
    }else{
        code = GetCookie ('myxhtoken');
    }


    if(code){ //  有token 说明 是容易联过来的
        //alert('有token')
        //alert(code)
        GetUser(code,xhurl,allbookdatastr);
    }else{
        // 58测试 系统 需要登录页面
        //alert('没有token');
        //alert(xhurl);
        gowayn(xhurl);

    }





// 获取用户信息
    function GetUser(token,xhurl,allbookdatastr) {
        ajax.get(`http://wx.nuoyadalu.com/user/api/relandwx?token=${token}`, null, function (res) {
            const data = JSON.parse(res);
            if (data.rc != 200) return alert('暂时没有获取到用户的身份~！请退出后重试~！');
            // const wxInfo = data.wxInfo;
            // const wxMobile = data.wxInfo.mobile;
            var thephonep = data.relInfoRes.mobile;
            //alert('默认电话号码'+thephonep);
            goway(xhurl,allbookdatastr,thephonep);
        });
    }

    function goway(xhurl,allbookdatastr,thephonep) {
         //alert('路由前号码'+thephonep)
        // 初始路由

        if(thephonep && !xhurlC){
            $.router.go('/flightmb/join',{linkp:1,thephonep:thephonep},true);
        }else{
            if(xhurl == 'a'){// 我的机票登陆
                $.router.go('/flightmb/allmytickes', {}, true);

            }else if(xhurl == 'x' || xhurl == 's' || xhurl == 'c'){// 直接进入aspx   x新打开jion  s 乘机人返回的
                $.router.go('/flightmb/join',{linkp:1},true);
            }else if(xhurl == 'p' && allbookdatastr){ //产品页面 登陆
                $.router.go('/flightmb/book',allbookdatastr,true)
                localStorage.setItem("allbookdatastr",'');//  将 cookie清空

            }else if(xhurl == 'b' && allbookdatastr){//  预定 需要登陆

                $.router.go('/flightmb/detail',allbookdatastr,true)
                localStorage.setItem("allbookdatastr",'');//  将 cookie清空


            }else if(xhurl == 't') {//  差旅传数据
                console.log('差旅航程数据填充')

                //console.log(GetQueryString('splace'))//
                $.router.go('/flightmb/join',{linkp:5,joindata:GetQueryString(myurlarr[1])},true);
            }
            //else if(thephonep){ // 刷新卡的 解决  刷新了就要返回 首页的
            //
            //}

        }




    }
    // 58测试 系统 需要登录页面
    //gowayn();
    function gowayn(xhurl) {

        // 初始路由
        if(xhurl == 'a'){// 我的机票登陆
            $.router.go('/flightmb/allmytickes', {}, true);

        }else if(xhurl == 'x' || xhurl == 's' || xhurl == 'c'){// 直接进入aspx   x新打开jion  s 乘机人返回的
            $.router.go('/flightmb/join',{linkp:1},true);
        }else if(xhurl == 'p' && allbookdatastr){ //产品页面 登陆
            $.router.go('/flightmb/book',allbookdatastr,true)
            localStorage.setItem("allbookdatastr",'');//  将 cookie清空

        }else if(xhurl == 'b' && allbookdatastr){//  预定 需要登陆

            $.router.go('/flightmb/detail',allbookdatastr,true)
            localStorage.setItem("allbookdatastr",'');//  将 cookie清空


        }else if(xhurl == 't') {//  差旅传数据
            console.log('差旅航程数据填充')

            //console.log(GetQueryString('splace'))//
            $.router.go('/flightmb/join',{linkp:5,joindata:GetQueryString(myurlarr[1])},true);
        }else{// 兼容其他关键字
            $.router.go('/flightmb/join',{linkp:1},true);
        }

    }

});









//  默认 登陆函数
function checklogin() {
    var  userid = '';
    var  loginId ='';


}



function creatScript(url){
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", flightUrl + url);
  var script1 = document.getElementsByTagName('body')[0];
  script1.appendChild(script)
}

function creatScripth(url){
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", flightUrl + url);
  var script1 = document.getElementsByTagName('head')[0];
  script1.appendChild(script)
}



function GetQueryString(durl){
   var  myarr = durl.split('&');
   var json={
       sphone:getd(myarr[0]),
       sname:getd(myarr[1]),
       timef:getd(myarr[2]),
       etime:getd(myarr[3]),
       ctyf:getd(myarr[4]),
       ctyt:getd(myarr[5]),
       timet:''

  }
   console.log(json)

  function getd(data) {
      return decodeURI(data.split('=')[1])
  }

  return json

}

