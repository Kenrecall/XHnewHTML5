/**
 * Created by way on 16/9/28.
 */
import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp ,setTitle} from '../util/api'; //myalertp 封装的 alert提示弹层
//myalertp('router0','出错了，获取客服联系电话失败！')
let _view = require('raw!./city.html');
var dataType ='';
var dataC ='';
var joindata ='';// 存放 带过来的数据


export default class {
  path = '/flightmb/city$';
  hash = '/flightmb/city';
  title = '城市选择';
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

      dataType = params.citytype; //  0 或者 1  0为起始地点  1 为降落地点

      joindata = params.joindata // 打包 带过来的数据
        //console.log(joindata)
      // 获取本地存储数据 历史查询城市
         var dataHisCity=gethisCity();
         var  dataHotCity= '';
      $.html(pickCity, cityHtml(dataHisCity)); // 加载页面代码
      if(dataHisCity.length ==0){
          $.id('divTop').style.display = 'none';
          $.qu('.hc-ul2').style.display = 'none';
      }

      // 点击返回 可能带参数
      $.qu('.wrap-ft-ba').onclick= function () {

            $.router.go('#!/flightmb/join','',false)
            toTOP();
      };

      pullDom();



  }
}
// 获取 本地存储的 历史查询城市
function gethisCity(){
    var ck =sessionStorage.length+1;
    var citys =[];
    //console.log(sessionStorage)
    for(var i=1;i<ck;i++){
        var c ='city'+i;
        var city = sessionStorage.getItem(c)
        citys.push(city)
    }
    for(var i=0;i<citys.length;i++){
        for(var j= i+1;j<citys.length;j++){
            if( citys[i]==citys[j]){
                citys.splice(j,1);
                j--;
            }
        }
    }
    return  citys.reverse()

}


//页面相关操作
function pullDom(){

    var aLIbody = $.qus('.li-body');


    for (var i = 0; i < aLIbody.length; i++) {
         aLIbody[i].onclick=function(){
             var tcity = this.innerHTML;
             if(dataType ==0){//  0 就是 起始地点选择
                 if(tcity ==joindata.ctyf){// 再次选出发地点 和之前的出发地点一样
                     //alert('选择的出发地点相同！')
                      myalertp('pickCity','选择的出发地点相同')
                 }else{
                     if(tcity==joindata.ctyt){
                         //alert('出发地点不能和到达地点相同！')
                         myalertp('pickCity','出发地点不能和到达地点相同!')
                     }else{
                         joindata.ctyf =tcity;
                         $.router.go('#!/flightmb/join',{citytype:dataType,joindata:joindata},true)
                     }
                 }


             }else{//  1就是 降落地点
                 if(tcity ==joindata.ctyt){// 再次选出发地点 和之前的出发地点一样
                     //alert('选择的到达地点相同！')
                     myalertp('pickCity','选择的到达地点相同!')
                 }else{
                     if(tcity==joindata.ctyf){
                         //alert('出发地点不能和到达地点相同！')
                         myalertp('pickCity','出发地点不能和到达地点相同!')
                     }else{
                         joindata.ctyt =tcity;
                         $.router.go('#!/flightmb/join',{citytype:dataType,joindata:joindata},true)
                     }
                 }

             }

             toTOP();

          }
    }
    var aHCli = $.qus('.hc-li');
    for (var i = 0; i < aHCli.length; i++) {
         aHCli[i].onclick=function(){
           //$.html(pickCity, ''); //清空上一次加载的 html代码
             var ccity =this.innerHTML;
             if(dataType ==0){//  0 就是 起始地点选择
                 if(ccity ==joindata.ctyf){// 再次选出发地点 和之前的出发地点一样
                     //alert('选择的出发地点相同！')
                     myalertp('pickCity','选择的出发地点相同!')
                 }else{
                     if(ccity==joindata.ctyt){
                         //alert('出发地点不能和到达地点相同！')
                         myalertp('pickCity','出发地点不能和到达地点相同!')
                     }else{
                         joindata.ctyf =ccity;
                         $.router.go('#!/flightmb/join',{citytype:dataType,joindata:joindata},true)
                     }
                 }
             }else{//  1就是 降落地点
                 if(ccity ==joindata.ctyt){// 再次选出发地点 和之前的出发地点一样
                     //alert('选择的到达地点相同！')
                     myalertp('pickCity','选择的到达地点相同!')
                 }else{
                     if(ccity==joindata.ctyf){
                         //alert('出发地点不能和到达地点相同！')
                         myalertp('pickCity','出发地点不能和到达地点相同!')
                     }else{
                         joindata.ctyt =ccity;
                         $.router.go('#!/flightmb/join',{citytype:dataType,joindata:joindata},true)
                     }
                 }

             }
             toTOP();

         }
    }
    var Amycode = $.qus('.myCOde-a');
    for (var i = 0; i < Amycode.length; i++) {
         Amycode[i].onclick =function(){
             //var theTop =$.qu('.wrap-ft').getBoundingClientRect().top;
             var myID2 = this.innerHTML;
             //$.qu('.wrap-ft').style.paddingTop ='2.2rem';
             $.id(myID2).scrollIntoView(true);
             //$.qu('.wrap-ft').style.paddingTop ='4.4rem';


         }
     }
     var odP = $.id('pickCity');
     odP.onscroll =function (){
             if(odP.scrollTop < 50){
                 $.qu('.wrap-ft').style.paddingTop ='2.2rem';
             }
     }


}


function toTOP() {
    var odP = $.id('pickCity');
    if( odP.scrollTop != 0){
        odP.scrollTop =0; // 返回顶部
    }

}






// 页面布局函数
function  cityHtml(dataHisCity){ // 此处可以传递相关数据进去

    var  dataHotCity= strToJson(getPopCity()).results;


    var putData = '<ul class="data-ul">'+creatHmlt()+'</ul>'
    var str0 ='';
    var str1 ='';
    for(var i=0;i<dataHotCity.length;i++ ){
      str0+='<li class="hc-li">'+dataHotCity[i].info+'</li>'
    }

    for(var i=0;i<dataHisCity.length;i++ ){
      str1+='<li class="hc-li">'+dataHisCity[i]+'</li>'
    }

    var dCityt1 ='<div class="div2 ">'+
                   '<span class="sp1">热门城市</span>'+
                 '<div class="div3"></div>'+
                 '</div >'+'<ul class="hc-ul clear hc-ul1 ">';
    var dCityt ='<div class="div2 " id="divTop">'+
                   '<span class="sp1">历史查询</span>'+
                 '<div class="div3"></div>'+
                 '</div >'+'<ul class="hc-ul clear hc-ul2">';
    var  dCityb = '</ul>';

    var ahotCity =dCityt1+str0+dCityb;
    var ahisCity =dCityt+str1+dCityb;

    var popupHTMLt= '<div class="popup wrap-city">'+ '<p class="wrap-ft-p1"><a href="#" class="close-popup wrap-ft-ba">关闭</a></p>'+'<div class="wrap-ft"><div class="wrap-ft-wrap"> ';
    var popupHTMLb = '</div></div></div>';
    // 侧边栏点击
    var  myCOde = '';
    var mytagArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    for (var i = 0; i < mytagArray.length; i++) {
       myCOde+= '<a href="#" class="myCOde-a">'+ mytagArray[i] + '</a>';
    }
    var myBar = '<div class="mybar clear">'+myCOde+'</div>'
    // 整合好所有代码 装备加进 div层
    var theinHtml = popupHTMLt+ahisCity+ahotCity+putData+popupHTMLb+myBar;



   return theinHtml


}

// 转换为json
function strToJson(str){
    var json = (new Function("return" + str))();
    return json;
}
 //为一个数组 数据来源
//console.log(flightmbData)
function pushData(){

    var  searchData=strToJson(getCityObj()).results;


    var cityArray = new Array();
    var myAlldata = new Array();
    var mytagArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    for (var i = 0; i < mytagArray.length; i++) {
        var tag = mytagArray[i];
        var tagCityArray = new Array();

        var allCitys = searchData;
        for (var j = 0; j < allCitys.length; j++) {
            if (allCitys[j].value.indexOf(tag) == 0) {
                tagCityArray.push(allCitys[j].info);
            }
        }
        cityArray.push(tagCityArray);
    };

    for (var i = 0; i < mytagArray.length; i++) {
        myAlldata.push(mytagArray[i]+','+cityArray[i])
   }
   return  myAlldata
};
//console.log(pushData()[0].split(',')[0])
// 创建html
function  creatHmlt() {
  var creatDatas = pushData();//为一长度为26的数组
  var  createLis = new Array();
  var sTrs = '';
  for (var i = 0; i < creatDatas.length; i++) {
            var creatData =creatDatas[i].split(',');
            if(creatData[1] ==''){
              //console.log(creatData[0])
              var str ='<li id="'+creatData[0]+'" class="li-head li-head-dis">'+creatData[0]+'</li>'
            }else{
                var str ='<li id="'+creatData[0]+'" class="li-head">'+creatData[0]+'</li>'
              for(var j=1;j<creatData.length;j++){

                  str+='<li class="li-body">'+creatData[j]+'</li>'


              }
            }

      createLis.push(str)
  }
  //return createLis
  //
    for (var n = 0; n < createLis.length; n++) {
      sTrs+=createLis[n]
    }

    return sTrs
}

