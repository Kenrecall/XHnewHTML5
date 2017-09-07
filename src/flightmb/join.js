/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,mycheckuser,SetCookie,getCookieVal,GetCookie,userOnoffpp,myget,mypostn,setTitle} from '../util/api'; //myalertp 封装的 alert提示弹层
import { urlParam, session, getHash,getBaseUrl} from '../lib/kutil';
//import { TouchSlide } from '../lib/kslide';

import Swipe from '../lib/kswipe';
import * as ajax from '../lib/kajax';
let _view = require('raw!./join.html');
var fcity = 'a';
var tcity ='';
var OT = 1;
var phonenum ='';

var theuser =1;
var timer ='';



export default class {
      path = '/flightmb/join$';
      hash = '/flightmb/join';
      title = '机票查询Title';
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
          getView(`${cfg.view.flightmbJoin}?t=${(+new Date())}`, '', (rs) => {
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

            setTitle(`机票`);

          //// 轮播图
          //let dataimg =['pic-1.jpg','pic-2.jpg','pic-3.jpg','pic-4.jpg'];
          //pullimgLi(dataimg)
          //function pullimgLi(data){
          //    let str ='';
          //    for(var i=0;i<data.length;i++){
          //        str += `<li><a href="#"><img src="https://cos.uair.cn/mb/img/${data[i]}" alt=""/></a></li>`
          //    }
          //    $.qu('.bd_xhli').innerHTML =str;
          //}
          //
          //TouchSlide({slideCell:"#focus", titCell:".hd ul", mainCell:".bd ul", effect:"left", autoPlay:true,autoPage:true})


          // 加载轮播图片
          let  imgs =['https://cos.uair.cn/mb/img/pic-1.jpg','https://cos.uair.cn/mb/img/pic-2.jpg','https://cos.uair.cn/mb/img/pic-3.jpg','https://cos.uair.cn/mb/img/pic-4.jpg'];
          startSwipe(imgs,1.9);
          function startSwipe(imgs,WHR) {
              // const imgs = ['img/meinv.jpg', 'img/lizhi.jpg', 'img/8.jpg'];
              // const imgs = ['img/lizhi.jpg'];
              //const imgs = [];
              //const ls = qus('.weui_uploader_files > li');
              //for (let i = 0; i < ls.length; i++) {
              //    let url = ls[i].style.backgroundImage;
              //    url = url.substring(4, url.length - 1);
              //    // pc 上有 " , 需去掉!
              //    if (url[0] === '"')
              //        url = url.substring(1, url.length - 1);
              //    if (url)
              //        imgs.push(url);
              //}

              if (imgs && imgs.length > 0) {
                  const dv = $.qu('.swipe');
                  window.swipe = new Swipe(dv, {
                      width: screen.width,
                      //height: parseInt(screen.width,10) / WHR,
                      height:  window.screen.width/320*120,
                      imgs,
                      auto: 5000,
                      continuous: true
                  });
              }
          }





          let  myurl = (window.location.href).split('/');
          let myurlkey = myurl[myurl.length-1];
          console.log(myurlkey)

            var nowd = jiondateChange(Ntime());
            $.qu('.input1').innerHTML = nowd ;// 默认 填充 去程时间 只能放在前面
            $.qu('.input1w').innerHTML ='('+ getWeekDaylong(nowd)+')' ;// 默认 填充 去程时间 只能放在前面

            console.log(params)
            if(params.linkp == 1){




                // 免账号登陆

                if(params.thephonep){
                   var thephonep =params.thephonep;
                    // 存在电话 说明是 容易联的 默认登陆
                   //alert('路由后电话号码'+thephonep)
                    mypostn('http://ca.nuoya.io/leaveSp/api/credit', 'MobilePhone='+thephonep,'', function(err,res){
                        console.log(err)
                        //alert(res)
                        if(err){
                            myalertp('router0','抱歉，获取登陆用户id出错,请重试！')
                        }else{
                            if( JSON.parse(res).rc =='202'){
                               // myalertp('router0','抱歉，数据库暂无该账号信息')
                            }else{
                                var  AgentID = JSON.parse(res).CreditData[0].CardNo.replace('MFW','20');
                                //var DisplayName = '';//存放 获取到的 用户昵称
                                var  DisplayName = JSON.parse(res).CreditData[0].MemberName;
                                //alert(AgentID)
                                // alert(DisplayName)
                                if(!AgentID || ! DisplayName){
                                    myalertp('router0','抱歉，账号信息有误')
                                }else{
                                    //pullLogin(AgentID,DisplayName)
                                    //pullLogin(DisplayName)

                                    // 4分钟 发送一次 登陆信息
                                    //alert(DisplayName)
                                    pullLogin(DisplayName)
                                    var mytimer = setInterval(function(){
                                            //alert(DisplayName)
                                            pullLogin(DisplayName)

                                    },240000)

                                }

                            }
                        }
                    })

                }else{
                    var thephonep = '';
                }

                // 郭彩霞测试
                //pullLogin('201507120017583251','gcxia1')

            }else{
                    allthedatatohtml(params.joindata);
            }


            $.qu('.tab-item2').onclick = function(){ //  跳转到我的机票  要检查是否登录

                userOnoffpp('a',function(){
                    $.router.go('#!/flightmb/allmytickes', {}, true);
                },'router0','','','抱歉，您还未登陆，请前往登陆页面~~',1);// 1表示 我的机票登陆


            }
            // 加载客服电话 html
            //thexhPhone();

             //  测试加入 所有电话
             pullallmyphone();
            $.qu('.tab-item3').onclick = function(){ //  联系客服
                $.qu('.thephone').style.display ='-webkit-box';
                //console.log(phonenum);
                pullnumtohtml(phonenum)
            }




             ttbtn1.onclick = function () { //单程选择
                 $.removeClass(ttbtn2,'active');
                 $.addClass(this,'active')
                 //$.qu('.tab-ul9').style.display = 'none';
                 $.qu('.tab-ul9').style.left = '0';

                 $.qu('.from_la').style.left ='4%';
                 $.qu('.from_la1').style.left ='3%';
                 //单程图标
                 // $.qu('.change').src = "https://cos.uair.cn/mb/img/right-go.png";
                 $.qu('.input2').innerHTML = '';
                 OT =1;

             }
             ttbtn2.onclick = function () {  //往返选择
                 $.removeClass(ttbtn1,'active');
                 $.addClass(this,'active');
                 //$.qu('.tab-ul9').style.display = 'block';
                 $.qu('.tab-ul9').style.left = '50%';

                 $.qu('.from_la').style.left ='56%';
                 $.qu('.from_la1').style.left ='55%';
                 //返程图标
                 // $.qu('.change').src = "https://cos.uair.cn/mb/img/change.png";
                 $.qu('.input2').innerHTML =Ntime1();
                 $.qu('.input2w').innerHTML ='('+ getWeekDaylong( Ntime1()) +')';
                 OT =2;
             }


             city0.onclick = function(){// 起始地点 选择
                 var onecity = allthedata();// 获取页面数据 进入 地点选择页面 再返回 加载
                 $.router.go('#!/flightmb/city',{citytype:0,joindata:onecity},true)

             }
             city1.onclick = function(){
                 var onecity = allthedata();// 获取页面数据 进入 地点选择页面 再返回 加载
                 $.router.go('#!/flightmb/city',{citytype:1,joindata:onecity},true)

             }
             // 地点切换
             $.qu('.tab-ul4').onclick = function () {
                  var city0 =$.id('city0').innerHTML;
                  var city1 =$.id('city1').innerHTML;
                  $.qu(".tab-ul3").className="tab-ul3 go-right";
                  $.qu(".tab-ul5").className="tab-ul5 go-left";
                  this.children[0].className = "city-icon rotate";
                      setTimeout(function(){
                        $.qu('.tab-ul4').children[0].className = "city-icon";
                        $.id('city0').innerHTML=city1;
                        $.id('city1').innerHTML=city0;
                        $.qu(".tab-ul3").className="tab-ul3";
                        $.qu(".tab-ul5").className="tab-ul5";
                      },500);
            
             }


            $.qu('.tab-ul8').onclick = function () {
                var onecity = allthedata();//获取页面数据 进入 地点选择页面 再返回 加载
                // 0 为选择 去程时间
                 $.router.go('#!/flightmb/adate',{timetype:0,joindata:onecity},true)
            }

            $.qu('.tab-ul9').onclick = function () {
                 var ftime = $.qu('.input1').innerHTML;
                 //1 为选择 返程时间
                 var onecity = allthedata();//获取页面数据 进入 地点选择页面 再返回 加载
                 $.router.go('#!/flightmb/adate',{timetype:1,joindata:onecity},true)
            }
            //  带数据  点击查询按钮
            $.qu('.search-b').onclick = function (){
                  var city00 =$.id('city0').innerHTML;
                  var city11 =$.id('city1').innerHTML;

                   //存储 历史查询
                  var k =sessionStorage.length+1;
                  var m =k+1;
                  sessionStorage.setItem('city'+k,city00)
                  sessionStorage.setItem('city'+m,city11)
                  var time00 = $.qu('.input1').innerHTML;
                  var time11 = $.qu('.input2').innerHTML;
                  var num2 =time11;
                  if(num2 == ''){
                      num2 =0;
                  }

                  //console.log(jiondateChange(time00))
                  //console.log(jiondateChange(num2))
                  var t1 =jiondateChange(time00).replace(/\-/g, '');
                  if(num2 ==0){ //单程
                        console.log('单程')
                      //$.router.go('#!/flightmb/detail',{},true)
                      $.router.go('#!/flightmb/detail',{citydetail1:city00,citydetail2:city11,timedetail1:time00,timedetail2:time11,cliktype:1,backtype:1},true)
                      //$.router.go('/flightmb/join',{},true)
                      //$.router.go('#!/flightmb/adate',{},true)
                  }else{ // 往返
                      var t2 =jiondateChange(num2).replace(/\-/g,'');
                      if(t1>t2){
                          //alert('出发日期不能大于返回日期~~！')
                          myalertp('router0','出发日期不能大于返回日期~~！')

                      }else{
                          $.router.go('#!/flightmb/detail',{citydetail1:city00,citydetail2:city11,timedetail1:time00,timedetail2:time11,cliktype:1,backtype:1},true)
                          console.log('往返')
                      }
                  }
            }

      }
}

////  轮询登陆函数
//function pullloinname(){
//    setTimeout(function(){
//        var n=1;
//        var mytimer = setInterval(function(){
//            console.log(n);
//            n++;
//            if(DisplayName){
//                alert(DisplayName)
//                pullLogin(DisplayName)
//            }
//        },8000)
//    },2000)
//}


// 电话按顺序整合
function pullnumtohtml(phonenum){

    var arrdata = phonenum.split(',');
    console.log('获取的电话数据');
    console.log(arrdata);
    arrdata.length = 5;
    var data = arrdata.sort(); //排序 按顺序后
    var data1 =[]
    for(var i=0;i<data.length;i++){
        data1.push((data[i].split('|'))[1])
    }
    //console.log(data1)

    var text = ['南航直营客服电话：','深航直营客服电话：','川航直营客服电话：','非直营机票客服电话：','投诉电话：']


    var str2 = ' <span class="thephone-sp">确定</span>';
    //var

    var str1 ='';
    for(var i=0;i<data1.length;i++){
        var phone =data1[i].replace(/-/g,'');
        str1+='<p><span>'+text[i]+'</span><a href="tel:'+phone+'">'+phone+'</a></p>';

    }
    var str3 =str1+str2;
    $.qu('.thephone-wrap').innerHTML =str3;
    // 隐藏 电话页面
    $.qu('.thephone-sp').onclick = function(){
        $.qu('.thephone').style.display ='none';
    }


}


function getallphonenum(key,n){

    myget(flightUrl+'/icbc/xhService.ashx','act=GETSERVICEPHONE&Source='+key,true, function (err,res) {
         if(err){
             myalertp('router0','出错了，获取客服联系电话失败！')
         }else{
             var oData3 = eval('('+res+')');
             console.log(oData3)
             var phonts =oData3.Result.Phone;
             var phontn =oData3.Result.Source;
             var dt = n+phontn+'|'+phonts;
             getmyphone(dt)
         }
    })


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









// 获取页面 已经填入的数据
function  allthedata(){
     var ctyf = $.id('city0').innerHTML;
     var ctyt = $.id('city1').innerHTML;
     var timef = $.qu('.input1').innerHTML;
     var timet = $.qu('.input2').innerHTML;
    var  data ={
        ctyf:ctyf,
        ctyt:ctyt,
        timef:timef,
        timet:timet
    }

    return data
}
//  重新填入 页面数据
function  allthedatatohtml(data){
    if(data){
        $.id('city0').innerHTML = data.ctyf ;
        $.id('city1').innerHTML = data.ctyt;
        $.qu('.input1').innerHTML = jiondateChange(data.timef) ; //getWeekDaylong()
        $.qu('.input1w').innerHTML = '('+getWeekDaylong( jiondateChange(data.timef) )+')';
        $.qu('.input2').innerHTML = jiondateChange(data.timet);
        $.qu('.input2w').innerHTML = '('+getWeekDaylong( jiondateChange(data.timet) )+')';

    }

}

function Ntime(){ //默认 出发日期
     var myTime = new Date();
     var iYear = myTime.getFullYear();
       var iMonth = myTime.getMonth()+1;
       var iDate = myTime.getDate();
       var ssr =iYear+'-'+iMonth+'-'+iDate

   return ssr
}
function Ntime1(){ //默认 到达日期

    var  data1 = jiondateChange($.qu('.input1').innerHTML);
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
    return  GetDateStrH(data1,24)
}
//重组时间
function jiondateChange(date){

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



//  根据时间 填写 星期几
function getWeekDaylong(obj){
    var NewArray = new Array("周日","周一","周二","周三","周四","周五","周六");
    var oArray = ["今天","明天","后天"];
    var DateYear = parseInt(obj.split("-")[0]);
    var DateMonth = parseInt(obj.split("-")[1]);
    var DateDay = parseInt(obj.split("-")[2]);
    var NewDate = new Date(DateYear,DateMonth-1,DateDay);
    var NewWeek = NewDate.getDay();
    var nowDate = new Date();
    var num = 1;
    var currentDate = nowDate.getFullYear()+"-"+(oneToTwo(nowDate.getMonth()+1))+"-"+oneToTwo(nowDate.getDate());
    var cha = removeType(obj) - removeType(currentDate);
    return cha > 2?NewArray[NewWeek]:oArray[cha];
    //一位数转成两位数
    function oneToTwo(b) {
        if(b<10) {
            return "0"+b;
        }else {
            return b;
        }
    }
    //去掉横杠好比较大小
    function removeType(e) {
        return e.replace(/\-/g,"");
    }
}


//function mylayer(id,fn){
//    //var str1 = '<div class="mianpger-boxbtn1lay"></div>';
//    var div = document.createElement("div");
//    var div_html ='<div id="loginlay-w"><p class="text">2s后即将登陆，请稍后...</p><input type="text" class="loginname" value="kenrecall" ><span class="loginlay-sb">取消该账号登录</span></div>';
//    div.setAttribute("id", "loginlay");
//    var fdiv = $.id(id);
//    fdiv.appendChild(div);
//
//
//    div.innerHTML =div_html;
//
//
//    var n=2;
//    var ltimer = setInterval(function () {
//        var  endtime = n+'s后即将登陆，请稍后...';
//        $.qu('.text').innerHTML =endtime;
//        n--;
//        if(n==-1){
//            clearInterval(ltimer);
//            //alert('进入登陆页面')
//
//            fn()
//
//
//        }
//
//    },1000)
//    var onoff = false;
//    $.qu('.loginlay-sb').onclick = function (){
//        if(onoff){
//            //alert('进入登陆页面')
//
//            fn()
//            //$.id(id).removeChild($.id('loginlay'));
//
//        }else{
//            clearInterval(ltimer);
//            $.qu('.text').innerHTML ='请输入新账号';
//            this.innerHTML = '点击登录';
//            onoff = true;
//        }
//
//    }
//
//
//}

function  pullLogin(name){
          //pullLogin(id,name){
           ///icbc/zyService.ashx?act=nameLogin&userNick=xx&OrderID=1  更新
          // '/icbc/zyService.ashx','act=loginOrder&userId='+id+'&loginId='+name+'&OrderID=1', 旧版本

    myget('/icbc/zyService.ashx','act=nameLogin&userNick='+name+'&OrderID=1',true, function (err, res) {
        console.log(err)
        console.log(res)
        if(err){
            //myalertp('dvContainer','出错了，默认登陆失败')
            console.log('默认登陆失败！')
            myalertp('router0','抱歉，默认登陆失败,请重试！')
        }else{
            console.log('默认登陆成功！')
            //alert('默认登陆成功')
            console.log(res)
            //$.id('router0').removeChild($.id('loginlay'));
        }
    });
}

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
            title:'测试5',
            url:''//可写返回事件的跳转路径
        } ;
        window.history.pushState(state,'title',url);
    }
}