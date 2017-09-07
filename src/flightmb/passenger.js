/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,mycheckuser,SetCookie,getCookieVal,GetCookie,userOnoffpp,myget,mypostn,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层
//myalertp('passenger','出错了，获取客服联系电话失败！')
//import {getView, get, post ,myalertp,prototype,core,Converter,BusinessTravelTool,Dept,MGOpt,MemberOpt,OrderSubmitOpt,RsaTool,mycheckuser,SetCookie,getCookieVal,GetCookie} from '../util/api';// myalertp 封装的 alert提示弹层
let _view = require('raw!./passenger.html');

var bte =2;
var backFlight = '';// 存放 往返标记

var flightPes = null;
var  alertms = '';// 弹出层 提示语言

export default class {
      path = '/flightmb/passenger$';
      hash = '/flightmb/passenger';
      title = '常用乘机人';
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
           console.log(bte);
          // 清空搜索数据 的样式修改
          deteledata()


          if (bte ==1) { //  预定页面进入的
              alertms = ''
              //  返回上一页
               $.qu('.passenger-tt1').onclick = function(){
                     $.router.go('#!/flightmb/book',{},false)
               }
              backFlight =params.backFlight;
          }else{
              alertms = '抱歉，您的登陆超时，请重新登录~~';
              $.qu('.passenger-tt1').onclick = function(){
                   $.router.go('#!/flightmb/allmytickes',{},false)
              }
          }
          // 乘机人数据加载 需要验证登陆


          userOnoffpp('s', pullPassData,'passenger','.lodinpass','',alertms);
          //pullPassData();
          //mycheckuser('passenger',function (){
          //    console.log('乘机人登录验证通过')
          //    pullPassData();
          //})
           // 初始点击事件
           // 新增加乘机人
           $.qu('.addpger').onclick = function(){

               $.router.go('#!/flightmb/changepassenger',{btype:11,linktype:bte},true)
           }


      }
}
//清空输入数据
function deteledata(){
    $.qu('.searpger-bn').innerHTML ='清空';
    $.qu('.searpger-te').value ='';
    $.qu('.searpger-bn').style.width ='20%';
    $.qu('.searpger-bn').style.background='#9a8c8c';
    $.qu('.searpger-te').style.width ='72%';
}

//  初始点击事件
function theClick(){
    //删除弹层
    $.each( $.qus('.mianpger-boxbtn1'),function () {
        this.onclick = function (e) {
            var that = this;
            //弹层

            $.qu('.mianpger-boxbtn1lay').style.display ='-webkit-box';
            $.qu('.boxbtn1lay-boxsp1').onclick = function(){
               // that.parentNode.style.display = 'none';
                var theid = that.parentNode.getAttribute('psid');

                var dataass={
                    id:theid
                };
                userOnoffpp('s', function(){
                    mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'DelPassenger', (err, res) => {
                        var bdata =eval('(' +res+ ')');
                        //console.log(bdata)
                        if (bdata.value) {
                            var json = JSON.parse(bdata.value);
                            //console.log(json)
                            if (json) {
                                //重新加载  乘机人数据加载
                                pullPassData();
                            } else {
                                //alert("删除乘机人失败");
                                myalertp('passenger','删除乘机人失败')

                            }
                        }else{
                            //alert("删除乘机人失败");
                            myalertp('passenger','删除乘机人失败')

                        }
                    });

                },'passenger','.lodinpass','',alertms);

                $.qu('.mianpger-boxbtn1lay').style.display ='none';
            }
            $.qu('.boxbtn1lay-boxsp2').onclick = function(){
                $.qu('.mianpger-boxbtn1lay').style.display ='none';
            }

            var e = e || window.e;
            e.stopPropagation();
        }

    })
    //修改乘机人
    $.each( $.qus('.mianpger-boxbtn2'),function () {
        var _that =this;
        _that.onclick = function (e) {
            var passdata ={
                 name : _that.getAttribute('name'),
                 age:_that.getAttribute('age'),
                 card : _that.getAttribute('card'),
                 nb : _that.getAttribute('nb'),
                 ftype: _that.getAttribute('ftype'),
                 fnumber : _that.getAttribute('fnumber'),
                 birthday:_that.getAttribute('psbirthday')
            }


            $.router.go('#!/flightmb/changepassenger',{btype:22,linktype:bte,pda:passdata},true)
            var e = e || window.e;
            e.stopPropagation();
        }

    })
     //筛选乘机人
     // 先隐藏 筛选功能
    //
    //$.qu('.searpger-bn').onclick = function(){
    //
    //    var thename = $.qu('.searpger-te').value;
    //    var allnames = $.qus('.mianpger-name') ;
    //    if(thename !=''){
    //        var  arrdata = [];
    //        for(var i= 0;i<allnames.length;i++){
    //            var nameall= allnames[i].innerHTML;
    //            console.log(thename)
    //            if(nameall.indexOf(thename) != -1){
    //
    //                arrdata.push(i)
    //            }
    //            allnames[i].parentNode.parentNode.style.display ='none';
    //        }
    //        console.log(arrdata)
    //        if(arrdata.length !=0){
    //            for(var j= 0;j<arrdata.length; j++){
    //                allnames[arrdata[j]].parentNode.parentNode.style.display ='block';
    //            }
    //        }else{
    //            myalertp('passenger','抱歉，未找到相应乘机人！')
    //            for(var i= 0;i<allnames.length;i++){
    //                allnames[i].parentNode.parentNode.style.display ='block';
    //            }
    //        }
    //
    //    }else{
    //        //myalertp('passenger','请输入关键字：姓、姓名等！')
    //
    //        for(var i= 0;i<allnames.length;i++){
    //            allnames[i].parentNode.parentNode.style.display ='block';
    //        }
    //    }
    //};

    var allnames = $.qus('.mianpger-name');
    var allnameslen = $.qus('.mianpger-name').length;
    $.qu('.searpger-bn').onclick = function(){
        $.qu('.searpger-te').value= '';

        for(var i= 0;i<allnameslen;i++){
            allnames[i].parentNode.parentNode.style.display ='block';
        }
    };


    $.qu('.searpger-te').onkeyup= function(e){
        var e = e || window.e;
        //alert(e.keyCode);
        var keynum =e.keyCode;
        let thename = $.qu('.searpger-te').value;
        if(keynum == 8 && !thename ){
            //alert(`清空的搜索！`);

            for(var i= 0;i<allnameslen;i++){
                allnames[i].parentNode.parentNode.style.display ='block';
            }
        }

    };


    $.qu('.searpger-te').oninput= function(){
        let thename = $.qu('.searpger-te').value;
        if(thename){

            var  arrdata = [];
            for(var i= 0;i<allnameslen;i++){
                var nameall= allnames[i].innerHTML;
                console.log(thename)
                if(nameall.indexOf(thename) != -1){

                    arrdata.push(i)
                }
               // allnames[i].parentNode.parentNode.style.display ='none';
            }
            console.log(arrdata)
            if(arrdata.length !=0){

                for(var i= 0;i<allnameslen;i++){
                    allnames[i].parentNode.parentNode.style.display ='none';
                }

                for(var j= 0;j<arrdata.length; j++){
                    allnames[arrdata[j]].parentNode.parentNode.style.display ='block';
                }
            }
        }
    }

}

//选择乘机人
function addthePeople(){
    var allbox =$.qus('.mianpger-box');

    for(let i=0;i<allbox.length;i++){
        allbox[i].onclick = function(){
            let xhdata =JSON.parse(this.getAttribute('data'));
            var odat ={
                psid: this.getAttribute('psid'),
                data: xhdata
            }
            if(odat.data.Age == '儿童'){
                if(backFlight){ // 往返
                    //alert('儿童不能选择往返航班！')
                    myalertp('passenger','儿童不能选择往返航班')

                }else{
                    //alert(bte)
                    if (bte ==1) {
                        //  返回book页面
                        //let idnolen = xhdata.IDNo ? xhdata.IDNo.length:0;
                        //if( idnolen ==8 || idnolen ==18){
                        //    $.router.go('#!/flightmb/book',{pbtype:1,pdata:odat},true)
                        //}else{
                        //    myalertp('passenger','儿童证件号码有误，请核实')
                        //}

                        $.router.go('#!/flightmb/book',{pbtype:1,pdata:odat},true)

                    }else{
                        // $.router.go('#!/flightmb/allmytickes',{},true)
                    }
                }
            }else{//成人 或者 老人
                //alert(bte)
                if (bte ==1) {
                    let idnolen = xhdata.IDNo ? xhdata.IDNo.length:0;
                    let xhphone =xhdata.Phone;
                    let idtype =xhdata.IDType;


                        if(idtype == '身份证' ){
                            if(idnolen ==18){ // 成人而 且 为身份证 且 身份证号码长度为18
                                $.router.go('#!/flightmb/book',{pbtype:1,pdata:odat},true)
                            }else{
                                myalertp('passenger','身份证号码有误,请核实')
                            }
                        }else{
                            if(xhdata.IDNo){
                                $.router.go('#!/flightmb/book',{pbtype:1,pdata:odat},true)
                            }else{
                                myalertp('passenger','证件号码为空,请核实')
                            }

                        }


                    //  返回上一页
                    //$.router.go('#!/flightmb/book',{pbtype:1,pdata:odat},true)
                }else{
                    // $.router.go('#!/flightmb/allmytickes',{},true)
                }
            }
        }
    }


}

// 乘机人数据加载
function pullPassData(){
    $.qu('.lodinpass').style.display ='-webkit-box';

    // 以下 为旧接口 获取数据
    var urlmy = flightUrl+ "/ajaxpro/UairB2C.MGOpt,UairB2C.ashx";
    var methodmy = "GetPassengers";

    //var datamy = {
    //  'xslpath':'icbc/xslt/book-passengers.xslt'
    //}
    var datamy = {
        'xslpath':'json'
    }
    var oTxt = null; // 返回的json数据
    var oC = null;
    var newOc = null;
    var plan = null;

    // var newData = null;
    var arrList = [];
    var newsss = null;
   // myalertp('passenger','抱歉，以下弹出提示为测试安卓手机兼容问题，请不要慌张，下单购票都能正常使用！')
   //alert('ajax数据请求')
    mypostAjax(urlmy, datamy, methodmy, function(a, b){
        if(a == null) {
            //成功

           // alert('获取数据成功')
            //alert(a)
           // alert(b);
            //alert( typeof b);
            $.qu('.lodinpass').style.display ='none';
           // alert( typeof  b)

            var  dat1 =JSON.parse(b).value;
           //alert( dat1);


            //oTxt =JSON.parse(JSON.parse(b).value);

            //for (var  attr in oTxt.Passengers) {
            //    //alert(attr)
            //    //if(k==1){
            //    //    dato.plan =oTxt.Passengers[attr];
            //    //    break;
            //    //}
            //    //k++;
            //}

            //alert(`乘机人数量${psg.length}`);
            if(!dat1) {
                $.qu('.pger-wrap').innerHTML='没有常用乘机人，请重新添加！'
            }else {
                oTxt =JSON.parse(dat1);
                var psg= oTxt.Passengers.Passenger;
                var dato ={
                    plan:''
                };

                //for (var  attr in oTxt.Passengers) {
                //    console.log(attr);
                //    //if(k==1){
                //    //    dato.plan =oTxt.Passengers[attr];
                //    //    break;
                //    //}
                //    //k++;
                //}

                var k =0;
                for (var  attr in oTxt.Passengers) {
                    console.log(attr);
                    if(k==1){
                        dato.plan =oTxt.Passengers[attr];
                        break;
                    }
                    k++;
                }
                var plandata = JSON.parse(dato.plan);
                console.log(plandata);
                if(plandata.length != 0){// 有plan数据
                    for (var i = 0; i < psg.length; i++) {
                        psg[i].planda=[];
                        for (var j = 0; j < plandata.length; j++) {
                            if(psg[i].ID ==plandata[j].PassengerID){
                                plandata[j].StartDate = plandata[j].StartDate.split(' ', 2)[0];
                                plandata[j].EndDate = plandata[j].EndDate.split(' ', 2)[0];
                                psg[i].planda.push(plandata[j]);
                            }
                        }
                    }
                }else{// 没有plan数据 pland为空
                    for (var i = 0; i < psg.length; i++) {
                        psg[i].planda=[];
                    }
                }
                //for (var i = 0; i < psg.length; i++) {
                //           psg[i].planda=[];
                //}

                arrList = psg;

                //alert(arrList.length);
                if (arrList.length > 10) {
                    //  乘机人 大于 10 出现搜索框
                    $.qu('.searpger').style.display = 'block';
                    //$.qu('.searpger').style.top = '2.8rem';
                    $.qu('.mianpger').style.top = '7.3rem';
                }else{
                    $.qu('.searpger').style.display = 'none';
                    //$.qu('.searpger').style.top = '0';
                    $.qu('.mianpger').style.top = '5.2rem';
                }
                console.log(arrList)
                topasengerHtml(arrList); // 页面加载数据
                //  搜索按钮点击
                theClick();
                // 带数据返回预定界面
                addthePeople();
            }

        } else {
            // alert('出错了，Err' +xhr.status);
            myalertp('passenger','获取乘机人出错了，Err')
        }
    });

}



// 乘机人数据整合html
function topasengerHtml(data){
    var str ='';
    var psData=[];
    //alert(`循环开始`);
    if(!data.length){
        psData.push(data)
    }else{
        psData =data;
    };

    for(let i=0;i<psData.length;i++){
        var theage =psData[i].Age ?psData[i].Age:'';
        var theidno =  psData[i].IDNo ? psData[i].IDNo:'';
        var theidtype =psData[i].IDType ? psData[i].IDType:'';

        let xhidnoshow1 =psData[i].IDNo  ? psData[i].IDNo:'';
        let xhidnoshow ='';
        let xhtype =psData[i].IDType  ? psData[i].IDType:'';
        let psbirthday =psData[i].birthday ? psData[i].birthday.split(' ')[0] : '';
        let birthday = '';
        if(psbirthday){
            let myTime1 =psbirthday ;
            var myTime = new Date(myTime1);
            birthday = myTime.getFullYear()+toTwo(myTime.getMonth()+1)+toTwo(myTime.getDate());
            psData[i].birthday =birthday;
        }

        if(xhidnoshow1 && xhtype=='护照' && xhidnoshow1.indexOf(':') !=-1){
            xhidnoshow =xhidnoshow1.split(':')[0];
            psData[i].birthday = birthday = psbirthday =xhidnoshow1.split(':')[1];

        }else{
            xhidnoshow =psData[i].IDNoShow  ? psData[i].IDNoShow:'';
        }

        //  再次根据 身份证 或者出生日期 判断 成人 儿童 老人
        if(theage =='儿童'){
            if(theidtype =='身份证'){
                if(theidno.length == 8){ // 说明为出生日期
                    theage = isAge(theidno, 12)?'儿童':'成人';
                }else if(theidno.length == 18){ // 说明 儿童为身份证
                    theage = isAge(theidno, 12)?'儿童':'成人';
                }
            }else if( theidtype =='护照'){
                // 不是身份证 还无法验证。。。
                theage = isAge(birthday, 12)?'儿童':'成人';

            }
        }else{
            if(theidtype =='身份证' && theidno.length == 18){
                let birthdaycard =theidno.substr(6,8);
                theage = isAge(birthdaycard, 65)?'成人':'老人';
            }else if( theidtype =='护照'){
                // 不是身份证 还无法验证。。。
                theage = isAge(birthday, 12)?'儿童':'成人';
                if(theage == '成人'){
                    theage = isAge(birthday, 65)?'成人':'老人';
                }


            }
        }
        // 根据具体年龄 显示老人 或者儿童

        psData[i].Age =theage;

       //alert(`计算老人儿童通过`)
        var  data1 =psData[i];
        if(!psData[i].rule){
            psData[i].rule='0';
        }

        var  data =JSON.stringify(data1);
        //alert(`对象转换为字符串成功`)
        //console.log(JSON.parse(data).age)
        var  phoneshow =psData[i].PhoneShow ? psData[i].PhoneShow:'';
        var phonenum =psData[i].Phone ? psData[i].Phone:'';

        let xhid =psData[i].ID ? psData[i].ID:'';
        let xhname =psData[i].Name  ? psData[i].Name:'';
        let xhage =psData[i].Age  ?`(${theage})`:'';
        let xhagel =psData[i].Age  ?psData[i].Age:'';





        str+='<div class="mianpger-box" ruletype="'+psData[i].rule+'"   psid="'+xhid+'"  data='+data+'><p><span class="mianpger-name">'+xhname+xhage+'</span></p>'+
            '<p><span class="mianpger-card">'+xhtype+'</span><span class="mianpger-num">'+xhidnoshow+'</span></p>'+
            '<p><span class="mianpger-ph">手机号</span><span class="mianpger-phnum">'+phoneshow+'</span></p>'+
            '<span class="mianpger-boxbtn1">删除</span>'+
            '<span class="mianpger-boxbtn2" name="'+xhname+'" age ="'+xhagel+'" card="'+xhtype+'"  nb="'+xhidnoshow+'"  ftype ="'+xhid+'"  fnumber="'+phonenum+'" psbirthday="'+birthday+'" >修改</span></div>';
        //alert(`部分数据尝试成功`)

    }
    //console.log(psData);
    //alert(str);
    $.qu('.pger-wrap').innerHTML =str;
}

function isAge(time, y) {
    var myTime = new Date();    //数据类型为 对象
    var n = myTime.getFullYear()+toTwo(myTime.getMonth()+1)+toTwo(myTime.getDate());
    //console.log(n)


    //var n =New Data();
    var bData = time;
    var nData = new Date();
    var bYear = parseInt(bData.substr(0, 4));
    //console.log(bYear)
    var nYear = nData.getFullYear();
    var bMonth = parseInt(bData.substr(4, 2));
    var nMonth = nData.getMonth();
    var bDay = parseInt(bData.substr(6, 2));
    var nDay = nData.getDate();
    if (n != null && n != undefined) {
        nYear = parseInt(n.substr(0, 4));
        nMonth = parseInt(n.substr(4, 2));
        nDay = parseInt(n.substr(6, 2));
    }
    var childType = false;
    if (nYear - bYear > y) {
        childType = false;
    } else if (nYear - bYear == y) {
        if (nMonth - bMonth > 0) {
            childType = false;
        } else if (nMonth - bMonth == 0) {
            if (nDay - bDay >= 0) {
                childType = false;
            } else {
                childType = true;
            }
        } else {
            childType = true;
        }
    } else {
        childType = true;
    }
    return childType;
}

function toTwo( n ) {    //  转换为 带0的
    return n < 10 ?  '0' + n : '' + n;
}


//myajax

function mypostAjax(url, data, method, cb) {
    var  xhr ='';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && cb) {
            if (xhr.status === 200)
                cb(null, xhr.responseText);
            else
                cb(new Error(xhr.status), xhr.responseText);
        }
    };

    // 异步 post,回调通知
    xhr.open('POST', url, true);
    let param = data;
    if ((typeof data) === 'object')
        param = JSON.stringify(data);

    xhr.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
    xhr.setRequestHeader('X-AjaxPro-Method', method);
    xhr.send(param);
}


//身份证加"*"处理 分两种情况 成人 or 儿童

function hideInfo(e) {
    var d = e.length;
    return d<18?e:e.replace(/^(.{6})(?:\d+)(.{4})$/,"$1****$2");
}

//手机号加"*"处理
function hideTel(e) {
    return e.replace(/^(.{3})(?:\d+)(.{4})$/,"$1****$2");
}