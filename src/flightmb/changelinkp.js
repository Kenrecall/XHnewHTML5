/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,mycheckuser,SetCookie,getCookieVal,GetCookie,userOnoffpp ,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层
//myalertp('changelinkp','出错了，获取客服联系电话失败！')
let _view = require('raw!./changelinkp.html');
var thelinkt ='';
var contid = ''; // 修改联系人 对应的id

export default class {
      path = '/flightmb/changelinkp$';
      hash = '/flightmb/changelinkp';
      title = '增加或者修改联系人';
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

         var mytype =params.type; //  判断是 增加 还是修改
         thelinkt = params.linktype;// 判断是  book 进入 还是 ticekts进入的
         if(mytype ==1){//  1 为增加
             $.qu('.changelinkp-tt2').innerHTML= '新增联系人';
             $.qu('.changelinkp-mainin11').value ='';
             $.qu('.changelinkp-mainin12').value ='';
             $.qu('.changelinkp-mainin13').value ='';
             // 确认按钮
             //$.qu('.changelinkp-sb').onclick = function(){
             //    //mycheckuser('changelinkp',function (){
             //    //    console.log('增加联系人登录验证通过')
             //    //    addcontactF(thelinkt);
             //    //})
             //    if(GetCookie('xhtime') ==1){
             //        console.log('增加联系人登录验证通过')
             //        addcontactF(thelinkt);
             //    }else{
             //        mycheckuser('changelinkp',function (){
             //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
             //            console.log('增加联系人登录验证通过')
             //            addcontactF(thelinkt);
             //        })
             //    }
             //
             //    //addcontactF(thelinkt)
             //}
             $.qu('.changelinkp-sb').onclick = function(){

                 //addcontactF(thelinkt);
                 userOnoffpp('c', function(){
                     addcontactF(thelinkt)
                 },'changelinkp','','','报告小主，您登录超时，请前往登陆页面~~');


             }





         }else if(mytype ==4){ //4 为修改 会带数据过来
             console.log(params)
             $.qu('.changelinkp-tt2').innerHTML= '修改联系人';
             var  todata = params.cdat;
             $.qu('.changelinkp-mainin11').value =todata.name;
             $.qu('.changelinkp-mainin12').value =todata.phone;
             $.qu('.changelinkp-mainin13').value =todata.email;
             contid =todata.contid;
             // 确认按钮
             $.qu('.changelinkp-sb').onclick = function(){
                 //changeContact(contid,thelinkt);

                 userOnoffpp('c', function(){
                     changeContact(contid,thelinkt)
                 },'changelinkp','','','报告小主，您登录超时，请前往登陆页面~~');
             };


             //$.qu('.changelinkp-sb').onclick = function(){
             //    if(GetCookie('xhtime') ==1){
             //        console.log('修改联系人登录验证通过，未')
             //        changeContact(contid,thelinkt);
             //    }else{
             //        mycheckuser('chpassenger',function (){
             //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
             //            console.log('修改联系人登录验证通过')
             //            changeContact(contid,thelinkt);
             //        })
             //    }
             //    //mycheckuser('changelinkp',function (){
             //    //
             //    //    console.log('修改联系人登录验证通过')
             //    //    changeContact(contid,thelinkt);
             //    //})
             //    //changeContact(contid,thelinkt);
             //}



         }

          // 页面返回
          $.qu('.changelinkp-tt1').onclick = function(){
              $.router.go('#!/flightmb/mychalinkp',{btype:thelinkt},false)
          }
          //  点击确认按钮（确认修改 / 确认添加）  带数据返回上一页 并向数据库提交数据



      }
}



// 修改联系人 预处理函数
function changeContact(contid ,thelinkt){


    var name  = $.qu('.changelinkp-mainin11').value;
    var phone = $.qu('.changelinkp-mainin12').value;
    var email = $.qu('.changelinkp-mainin13').value;
    if (!Verify.verifyName(name)) {
        //alert("请填写联系人姓名！");
        myalertp('changelinkp','请填写联系人姓名')

        //$("#name").focus();
        return false;
    }
    if(!phone){
        myalertp('changelinkp','请填写联系人手机号码')
        return false;
    }
    if (!Verify.verifyMobile(phone)) {
        //alert("请填写正确手机号码！");
        myalertp('changelinkp','请填写正确的联系人手机号码')

        //$("#phone").focus();
        return false;
    }
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (email != "") {
        if (!filter.test(email)) {
            //alert('您的电子邮件格式不正确');
            myalertp('changelinkp','您的电子邮件格式不正确')
           // $("#email").focus();
            return false;
        }
    }
    var savecontacter = '{\"ID\":\"' + contid + '\","Name":"' + name + '","Phone":"' + phone + '","Email":"' + email + '"}';


    var aes = new ICBCAes();
    //var member = UairB2C.MGOpt;
    aes.GetAesStr(savecontacter, function (encryptionSavecontacter, encryptionPwd) {
        //member.SaveContacter(encryptionSavecontacter, encryptionPwd, function (res) {
        //
        //    if (res.value) {
        //        var json = JSON.parse(res.value);
        //        if (json.ret == 1) {
        //            //alert("修改联系人成功！");
        //            myalertp('changelinkp','修改联系人成功')
        //            $.router.go('#!/flightmb/mychalinkp',{btype:thelinkt},true)
        //
        //        } else {
        //            //alert("保存联系人失败！");
        //            myalertp('changelinkp','保存联系人失败')
        //
        //        }
        //    }
        //});
        var  dataass ={
            json:encryptionSavecontacter,
            encryptionAESPwd:encryptionPwd
        }

        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SaveContacter', (err, res) => {
            console.log(err)
            console.log(res)
            var bdata =eval('(' +res  + ')');
            if (bdata.value) {
                var json = JSON.parse(bdata.value);
                if (json.ret == 1) {
                    //alert("修改联系人成功！");
                    //myalertp('changelinkp','修改联系人成功')
                    $.router.go('#!/flightmb/mychalinkp',{btype:thelinkt},true)

                } else {
                    //alert("保存联系人失败！");
                    myalertp('changelinkp','保存联系人失败')

                }
            }
        });
    });
}

//  新增联系人 预处理函数
function addcontactF(thelinkt){

    var countid = "0";
    var name = $.qu('.changelinkp-mainin11').value;
    var phone =$.qu('.changelinkp-mainin12').value;
    var email =$.qu('.changelinkp-mainin13').value;
    if (!Verify.verifyName(name)) {
        //alert("请填写联系人姓名！");
        myalertp('changelinkp','请填写联系人姓名')

        //$("#name").focus();
        return false;
    }
    if(!phone){
        myalertp('changelinkp','请填写联系人手机号码');
        return false;
    }
    if (!Verify.verifyMobile(phone)) {
       // alert("请填写正确手机号码！");
        myalertp('changelinkp','请填写正确的联系人手机号码')

        //$("#phone").focus();
        return false;
    }
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email != "") {
        if (!filter.test(email)) {
            //alert('您的电子邮件格式不正确');
            myalertp('changelinkp','您的电子邮件格式不正确')

            //$("#email").focus();
            return false;
        }
    }
    var savecontacter = '{\"ID\":\"' + countid + '\","Name":"' + name + '","Phone":"' + phone + '","Email":"' + email + '"}';
    var aes = new ICBCAes();
    //var member = UairB2C.MGOpt;
    aes.GetAesStr(savecontacter, function (encryptionSavecontacter, encryptionPwd) {
        //member.SaveContacter(encryptionSavecontacter, encryptionPwd, function (res) {
        //    if (res.value) {
        //        var json = JSON.parse(res.value);
        //        if (json.ret == 1) {
        //            //alert("添加联系人成功！");
        //            myalertp('changelinkp','添加联系人成功')
        //
        //            $.router.go('#!/flightmb/mychalinkp',{btype:thelinkt},true)
        //            //loadContacter();
        //            //$("#addContacterBoxCover").remove();
        //        } else {
        //            //alert("添加联系人失败！");
        //            myalertp('changelinkp','添加联系人失败')
        //
        //        }
        //    }
        //});
        var  dataass ={
            json:encryptionSavecontacter,
            encryptionAESPwd:encryptionPwd
        }

        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SaveContacter', (err, res) => {
            console.log(err)
            console.log(res)
            var bdata =eval('(' +res  + ')');
            if (bdata.value) {
                var json = JSON.parse(bdata.value);
                if (json.ret == 1) {
                    //alert("添加联系人成功！");
                    //myalertp('changelinkp','添加联系人成功')
                    $.router.go('#!/flightmb/mychalinkp',{btype:thelinkt},true)

                } else {
                    //alert("添加联系人失败！");
                    myalertp('changelinkp','添加联系人失败')
                }
            }else{
                myalertp('changelinkp','添加联系人失败')
            }
        });



    });

}





//  检查数据格式函数
if (typeof Verify === "undefined") { var Verify = {} } (function (a) { a.toDateString = function (c) { var d = c.getMonth() + 1, b = c.getDate(); if (d < 10) { d = "0" + d } if (b < 10) { b = "0" + b } return c.getFullYear() + "-" + d + "-" + b }; a.verifyFlightName = function (c) { var d = false; c = c.replace(/(^\s*)|(\s*$)/g, ""); var b = /^[A-Za-z\/]+$/; if (b.test(c)) { if (c.indexOf("/") > 0 && c.indexOf("/") < c.length - 1) { d = true } else { d = false } } else { b = /^[\u4e00-\u9fa5]+[A-Z,a-z]*[\u4e00-\u9fa5]*$/; if (b.test(c)) { d = true } else { d = false } } return d }; a.verifyName = function (b) { var b = b.replace(/(^\s*)|(\s*$)/g, ""); return b.length > 0 }; a.verifyEmail = function (b) { return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(b) }; a.verifyTicketNo = function (c) { var d = false; var b = c.length; if (b === 13) { d = /^\d{13}$/.test(c) } return d }; a.verifyMobile = function (b) { return /^1\d{10}$/.test(b) }; a.verifyIdCard = function (t) { var s = t.length, b, i, w, m, d; if (s === 15) { b = t.match(/^(?:\d{6})(\d{2})(\d{2})(\d{2})(?:\d{3})$/); if (!b) { return false } i = parseInt("19" + b[1], 10); w = parseInt(b[2], 10); m = parseInt(b[3], 10); d = t.charAt(s - 1) % 2 } else { if (s === 18) { var u = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], y = "10X98765432"; for (var v = 0, c = 0; v < 17; v++) { c += t.charAt(v) * u[v] } if (y.charAt(c % 11) !== t.charAt(17).toUpperCase()) { return false } b = t.match(/^(?:\d{6})(\d{4})(\d{2})(\d{2})(?:\d{3})(?:[0-9]|X)$/i); if (!b) { return false } i = parseInt(b[1], 10); w = parseInt(b[2], 10); m = parseInt(b[3], 10); d = t.charAt(s - 2) % 2 } } var x = new Date(i, w - 1, m); if (i !== x.getFullYear() || w !== x.getMonth() + 1 || m !== x.getDate()) { return false } return true }; a.replaceIdCard = function (b) { var c = a.verifyIdCard(b); if (!c) { return b } if (b.length === 18) { return b.replace(/^(\d{4})\d{11}(\d{2}[\da-z])$/i, "$1***********$2") } else { if (b.length === 15) { return b.replace(/^(\d{4})\d{8}(\d{3})$/, "$1********$2") } } }; a.replaceMobile = function (b) { return b.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") } })(Verify);