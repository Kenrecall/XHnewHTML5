/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,mycheckuser,SetCookie,getCookieVal,GetCookie,mypost,userOnoffpp ,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层
//changeadd myalertp('router0','出错了，获取客服联系电话失败！')
let _view = require('raw!./changeadd.html');


var mytype =''; // 判断 是 修改 还是增加
var mylinktype ='';// 是 由什么页面进入的 book 或者 tieckts
var  theaddata = '';// 存放 传过来的 需要修改的 地址信息



export default class {
      path = '/flightmb/changeadd$';
      hash = '/flightmb/changeadd';
      title = '联系人';
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
            mytype =params.type; // 判断 是 修改 还是增加
            mylinktype =params.linktype;// 是 由什么页面进入的 book 或者 tieckts
            if (mytype ==1) { //  1 为增加  2为修改
                $.qu('.changeadd-tt2').innerHTML='新增常用地址';
                $.id('addr_province').selectedIndex =1;
                $.qu('.adrssadrss').value ='';
                $.qu('.adrssname').value ='';
                $.qu('.adrssphone').value ='';
                addAddressData();// 加载 三级联动

                //$.qu('.changeadd-sb').onclick = function(){
                //    if(GetCookie('xhtime') ==1){
                //        console.log('添加联系人验证登录通过，无')
                //        totheAdddress(mylinktype,0);// 确认添加联系人
                //    }else{
                //        mycheckuser('changeadd',function (){
                //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
                //            console.log('添加联系人验证登录通过')
                //            totheAdddress(mylinktype,0);// 确认添加联系人
                //        })
                //    }
                //}
                $.qu('.changeadd-sb').onclick = function(){
                    //totheAdddress(mylinktype,0);// 确认添加联系人

                    userOnoffpp('c', function(){
                        totheAdddress(mylinktype,0);// 确认添加联系人
                    },'changeadd','','','抱歉，您登录超时，请前往登陆页面~~');
                }


            }else{ //2 为修改 需要带数据过来
                $.qu('.changeadd-tt2').innerHTML='修改常用地址';
                theaddata=params.addrdata;
                addAddressData();// 加载 三级联动
                var province = theaddata.Province;
                var city = theaddata.City;
                var town = theaddata.Town;
                // 根据 带过来的数据 填充页面
                datatoSelect(province,city,town);
                $.qu('.adrssadrss').value =theaddata.Addr;
                $.qu('.adrssname').value =theaddata.Name;
                $.qu('.adrssphone').value =theaddata.Phone;

                //$.qu('.changeadd-sb').onclick = function(){
                //    if(GetCookie('xhtime') ==1){
                //        console.log('修改联系人验证登录通过，无')
                //        totheAdddress(mylinktype,theaddata.ID);// 确认修改联系人
                //    }else{
                //        mycheckuser('changeadd',function (){
                //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
                //            console.log('修改联系人验证登录通过')
                //            totheAdddress(mylinktype,theaddata.ID);// 确认修改联系人
                //        })
                //    }
                //}
                $.qu('.changeadd-sb').onclick = function(){
                    //totheAdddress(mylinktype,theaddata.ID);// 确认修改联系人

                    userOnoffpp('c', function(){
                        totheAdddress(mylinktype,theaddata.ID);// 确认修改联系人
                    },'changeadd','','','抱歉，您登录超时，请前往登陆页面~~');
                }





            }




            //  返回上一页 地址
            $.qu('.changeadd-tt1').onclick = function(){
                 $.router.go('#!/flightmb/contactpeople',{btype:mylinktype},true)
            }



      }
}


// 提交新增数据
function totheAdddress(mylinktype,theid){

    var id =theid;
    var province= theselectData('addr_province');
    var city= theselectData('addr_city');
    var town= theselectData('addr_town');
    var address =$.qu(".adrssadrss").value;
    var name = $.qu(".adrssname").value;
    var phone = $.qu(".adrssphone").value;
    var post = '';

    if (!Verify.verifyName(name)) {
        //alert("请填写收件人姓名");
        myalertp('changeadd','请填写收件人姓名')
        //$("#addr_name").focus();
        return false;
    }
    var reg = /^\d{6}$/;
    if(!phone){
        myalertp('changeadd','请填写手机号码')
        return false;
    }

    if (!Verify.verifyMobile(phone)) {
        //alert("请填写正确手机号码");
        myalertp('changeadd','请填写正确手机号码')
        //$("#addr_phone").focus();
        return false;
    }
    if (province == "1" || province == 1 || province == undefined || province == null || province == "选择省") {
        //alert("请选择省份");
        myalertp('changeadd','请选择省份')
        //$("#addr_province").focus();
        return false;
    }
    if (city == "1" || city == 1 || city == undefined || city == null || city == "选择市") {
       // alert("请选择城市");
        myalertp('changeadd','请选择城市')
        //$("#addr_city").focus();
        return false;
    }
    if (!Verify.verifyName(address)) {
        //alert("请填写街道地址");
        myalertp('changeadd','请填写街道地址')

        // $("#addr_address").focus();
        return false;
    }

    if (town == "1" ||town =='选择区' ) town = "";

    var saveaddr = '{"ID":"' + id + '","Name":"' + name + '","Phone":"' + phone + '","Post":"' + post + '","Country":"中国","Province":"' + province + '","City":"' + city + '","Town":"' + town + '","Addr":"' + address + '"}';
    var aes = new ICBCAes();
    aes.GetAesStr(saveaddr, function (encryptionSaveaddr, encryptionPwd) {
        //console.log( typeof encryptionSaveaddr )
        //console.log( typeof encryptionPwd )
        //member.SaveAddress(encryptionSaveaddr, encryptionPwd, function (res) {
        //    if (res.value) {
        //        var json = JSON.parse(res.value);
        //        if (json.ret == 1) {
        //            $.router.go('#!/flightmb/contactpeople',{btype:mylinktype},true);
        //            //$("#addressBoxCover").show();
        //            //loadAddressInfo(setActionCallback);
        //            //$("#addAddressBoxCover").remove();
        //        } else {
        //            //alert("操作失败");
        //            myalertp('changeadd','操作失败')
        //
        //        }
        //    }
        //});



        var  dataass ={
            json:encryptionSaveaddr,
            encryptionAESPwd:encryptionPwd
        }
        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SaveAddress', (err, res) => {
            console.log(err)
            console.log(res)
            var bdata =eval('(' +res+ ')');
            if (bdata.value) {
                var json = JSON.parse(bdata.value);
                if (json.ret == 1) {
                    $.router.go('#!/flightmb/contactpeople',{btype:mylinktype},true);

                } else {
                    //alert("操作失败");
                    myalertp('changeadd','操作失败')

                }
            }
        });

    });
}





//  修改时 根据 城市 填充相应数据
function datatoSelect(province,city,town){

    var Oprovince =$.id('addr_province');
    var pkey ='';
    var theops = Oprovince.getElementsByTagName('option');
    //console.log(theops)
    for(var i=0;i<theops.length;i++){
        if(province ==theops[i].innerHTML ){
            Oprovince.selectedIndex = theops[i].index;
            pkey =theops[i].value;
            break;
        }
    }
    //  给城市选项 填充城市
    for (var k in AreaData) {
        var idx = AreaData[k][1];
        if (idx == pkey){
            $.id("addr_city").innerHTML+="<option value=\"" + k + "\">" + AreaData[k][0] + "</option>";
        }

    }
    // 显示城市
    var Ocity =$.id('addr_city');
    var ckey ='';
    var thecops = Ocity.getElementsByTagName('option');
    //console.log(thecops)
    for(var i=0;i<thecops.length;i++){
        if(city ==thecops[i].innerHTML ){
            Ocity.selectedIndex = thecops[i].index;
            ckey =thecops[i].value;
            break;
        }
    }
    //  给乡镇选项 填充乡镇
    for (var k in AreaData) {
        var idx = AreaData[k][1];
        if (idx == ckey)
            $.id("addr_town").innerHTML+="<option value=\"" + k + "\">" + AreaData[k][0] + "</option>";
    }
    // 显示区
    if(town){
        var Otown =$.id('addr_town');
        var tkey ='';
        var thetops = Otown.getElementsByTagName('option');
        //console.log(thetops)
        for(var i=0;i<thetops.length;i++){
            if(town ==thetops[i].innerHTML ){
                Otown.selectedIndex = thetops[i].index;
                tkey =thetops[i].value;
                break;
            }
        }
    }



}

//  获取selec的选中值
function theselectData(obj){
    var index = $.id(obj).selectedIndex;
    var text1 = $.id(obj).options[index].text;
    return text1
}

//三级联动数据加载
function addAddressData() {

    //加载地区三级联动AreaData
    var area = [["北京", "110000"], ["上海", "310000"], ["广东省", "440000"]];
    for (var key in AreaData) {
        var idx = AreaData[key][1];
        if (idx == "1" && key != "110000" && key != "310000" && key != "440000") {
            var _area = ["" + AreaData[key][0] + "", "" + key + ""];
            area.push(_area);
        }
    }
    //$("#addr_province").html("<option value=\"1\" selected=\"selected\">选择省</option>");
    $.id('addr_province').innerHTML="<option value=\"1\" selected=\"selected\">选择省</option>";
    for (var key in area) {
        var reg = /\d{1,}/;
        if (reg.test(key))
            $.id("addr_province").innerHTML+="<option value=\"" + area[key][1] + "\">" + area[key][0] + "</option>";
    }
    //省级联动市级
    $.id("addr_city").innerHTML="<option value=\"1\" selected=\"selected\">选择市</option>";
    $.id("addr_town").innerHTML="<option value=\"1\" selected=\"selected\">选择区</option>";
    $.id("addr_province").onchange=function () {
        //var key = $(this).val();
        $.id("addr_city").innerHTML="<option value=\"1\" selected=\"selected\">选择市</option>";
        $.id("addr_town").innerHTML="<option value=\"1\" selected=\"selected\">选择区</option>";
        var key =this.value;

        if (key == "1")
            return false;
        for (var k in AreaData) {
            var idx = AreaData[k][1];
            if (idx == key)
                $.id("addr_city").innerHTML+="<option value=\"" + k + "\">" + AreaData[k][0] + "</option>";
        }
    }
    //市级联动区级
    $.id("addr_city").onchange=function () {
        var key = this.value;
        $.id("addr_town").innerHTML="<option value=\"1\" selected=\"selected\">选择区</option>";
        if (key == "1")
            return false;
        for (var k in AreaData) {
            var idx = AreaData[k][1];
            if (idx == key)
                $.id("addr_town").innerHTML+="<option value=\"" + k + "\">" + AreaData[k][0] + "</option>";
        }
    }
}

if (typeof Verify === "undefined") { var Verify = {} } (function (a) { a.toDateString = function (c) { var d = c.getMonth() + 1, b = c.getDate(); if (d < 10) { d = "0" + d } if (b < 10) { b = "0" + b } return c.getFullYear() + "-" + d + "-" + b }; a.verifyFlightName = function (c) { var d = false; c = c.replace(/(^\s*)|(\s*$)/g, ""); var b = /^[A-Za-z\/]+$/; if (b.test(c)) { if (c.indexOf("/") > 0 && c.indexOf("/") < c.length - 1) { d = true } else { d = false } } else { b = /^[\u4e00-\u9fa5]+[A-Z,a-z]*[\u4e00-\u9fa5]*$/; if (b.test(c)) { d = true } else { d = false } } return d }; a.verifyName = function (b) { var b = b.replace(/(^\s*)|(\s*$)/g, ""); return b.length > 0 }; a.verifyEmail = function (b) { return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(b) }; a.verifyTicketNo = function (c) { var d = false; var b = c.length; if (b === 13) { d = /^\d{13}$/.test(c) } return d }; a.verifyMobile = function (b) { return /^1\d{10}$/.test(b) }; a.verifyIdCard = function (t) { var s = t.length, b, i, w, m, d; if (s === 15) { b = t.match(/^(?:\d{6})(\d{2})(\d{2})(\d{2})(?:\d{3})$/); if (!b) { return false } i = parseInt("19" + b[1], 10); w = parseInt(b[2], 10); m = parseInt(b[3], 10); d = t.charAt(s - 1) % 2 } else { if (s === 18) { var u = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], y = "10X98765432"; for (var v = 0, c = 0; v < 17; v++) { c += t.charAt(v) * u[v] } if (y.charAt(c % 11) !== t.charAt(17).toUpperCase()) { return false } b = t.match(/^(?:\d{6})(\d{4})(\d{2})(\d{2})(?:\d{3})(?:[0-9]|X)$/i); if (!b) { return false } i = parseInt(b[1], 10); w = parseInt(b[2], 10); m = parseInt(b[3], 10); d = t.charAt(s - 2) % 2 } } var x = new Date(i, w - 1, m); if (i !== x.getFullYear() || w !== x.getMonth() + 1 || m !== x.getDate()) { return false } return true }; a.replaceIdCard = function (b) { var c = a.verifyIdCard(b); if (!c) { return b } if (b.length === 18) { return b.replace(/^(\d{4})\d{11}(\d{2}[\da-z])$/i, "$1***********$2") } else { if (b.length === 15) { return b.replace(/^(\d{4})\d{8}(\d{3})$/, "$1********$2") } } }; a.replaceMobile = function (b) { return b.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") } })(Verify);