/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp ,mycheckuser,SetCookie,getCookieVal,GetCookie ,userOnoffpp ,setTitle} from '../util/api';// myalertp 封装的 alert提示弹层
//myalertp('chpassenger','出错了，获取客服联系电话失败！')

 //import {getView, get, post ,myalertp,prototype,core,Converter,BusinessTravelTool,Dept,MGOpt,MemberOpt,OrderSubmitOpt,RsaTool,mycheckuser,SetCookie,getCookieVal,GetCookie} from '../util/api';// myalertp 封装的 alert提示弹层
//myalertp('chpassenger','出错了，获取客服联系电话失败！')
let _view = require('raw!./changepassenger.html');

var mylinktype ='';
var theindex = '';// 存放 待修改的数据索引
var changedata =''; // 存放 待修改的 参数包
var _people = ''; //存放 儿童  成人
var mytype ='';//  页面跳转 判断值

export default class {
      path = '/flightmb/changepassenger$';
      hash = '/flightmb/changepassenger';
      title = '乘机人';
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

         mytype =params.btype; // 判断 是 修改 还是增加
         mylinktype =params.linktype;// 是 由什么页面进入的 book 或者 tieckts
          ////初始化页面  清空出身日期
          //$.qu('.nbage').value ='';

         if(mytype ==11){
            $.qu('.chpassenger-tt2').innerHTML= '新增加乘机人';
             // 让成人筛选变红
             adultcolor();
             // 清空数据
             $.qu('.chname').value ='';

             $.qu('.nbT').value ='';
             $.qu('.fnumberT').value ='';
             $.qu('.chpassenger-agedata').style.display ='none';
             $.qu('.nbage').value ='';
             $.qu('.chpassenger-myse1').style.display ='none';
             $.qu('.chpassenger-myse').style.display ='block';
             $.qu('.chpassenger-myse').selectedIndex =0; // 设置它的选中 索引


             // 确认增加

             //$.qu('.chpassenger-sb').onclick = function(){
             //    if(GetCookie('xhtime') ==1){
             //        console.log('增加乘机人登录验证通过')
             //        addpsFN();
             //    }else{
             //        mycheckuser('chpassenger',function (){
             //            SetCookie('xhtime',1,6);//  设置定时器 cookie 6分钟 值为1
             //            console.log('增加乘机人登录验证通过')
             //            addpsFN();
             //        })
             //    }
             //
             //
             //}
             $.qu('.chpassenger-sb').onclick = function(){

                 userOnoffpp('c', addpsFN,'chpassenger','','','报告小主，您登录超时，请前往登陆页面~~');
                 //addpsFN();
             }


         }else if(mytype ==22){
             $.qu('.chpassenger-tt2').innerHTML= '修改乘机人'
             //console.log(params.pda);
             thechangepa(params.pda);//  添加 要修改的数据
             changedata =params.pda;
             theindex =params.pda.ftype;
              //确认修改

             $.qu('.chpassenger-sb').onclick = function(){

                 userOnoffpp('c', theoldfn,'chpassenger','','','报告小主，您登录超时，请前往登陆页面~~');
                 //theoldfn(changedata);
             }

         }

          // 页面返回
          $.qu('.chpassenger-tt1').onclick = function(){
                 $.router.go('#!/flightmb/passenger',{btype:mylinktype},false)
          };
          $.qu('.chpassenger-o1').onclick = function () {
              adultcolor();
          };
          $.qu('.chpassenger-o12').onclick = function () {
              youngcolor();
          };
          // 护照时候 显示 出生日期
          getagedata();
      }
}
// 选择护照的时候  显示 出生日期
function getagedata(){
    $.qu('.chpassenger-myse').onchange = function(){
         if(this.value =='护照'){
             $.qu('.chpassenger-agedata').style.display = 'block';

         }else{
             $.qu('.chpassenger-agedata').style.display = 'none';
             $.qu('.nbage').value ='';
         }
    }
    $.qu('.chpassenger-myse1').onchange = function(){
        if(this.value =='护照'){
            $.qu('.chpassenger-agedata').style.display = 'block';

        }else{
            $.qu('.chpassenger-agedata').style.display = 'none';
            $.qu('.nbage').value ='';
        }
    }


}


// 修改数据添加
function thechangepa(data){
    var nametype =data.age;
    if(nametype =='儿童'){
        youngcolor();
    }else{
        adultcolor();
    }
    var pcard =data.card;
    $.qu('.chname').value =data.name;
    puttypeCard(nametype,pcard);// 根据 儿童 或者成年 填充 证件类型
    $.qu('.nbT').value =data.nb;
    $.qu('.fnumberT').value =data.fnumber;
    $.qu('.nbage').value =data.birthday;




}
//  成年 图标该有的状态函数
function adultcolor(){
    $.qu('.chpassenger-o1').style.background ='red';
    $.qu('.chpassenger-o1').setAttribute('CO','red');
    $.qu('.chpassenger-o12').setAttribute('CO','AC');
    $.qu('.chpassenger-o12').style.background ='#ACA8A8';
    $.qu('.chpassenger-myse').style.display = 'block';
    $.qu('.chpassenger-myse1').style.display = 'none';

    var theidtype =$.qu('.chpassenger-myse').value;

    if(theidtype == '护照'){
        $.qu('.chpassenger-agedata').style.display = 'block';
    }else{
        $.qu('.chpassenger-agedata').style.display = 'none';
        $.qu('.nbage').value ='';
    }
}

// 儿童 图标改有的状态函数
function youngcolor(){
    $.qu('.chpassenger-o1').style.background ='#ACA8A8';
    $.qu('.chpassenger-o1').setAttribute('CO','red1');
    $.qu('.chpassenger-o12').setAttribute('CO','AC');
    $.qu('.chpassenger-o12').style.background ='red';
    $.qu('.chpassenger-myse').style.display = 'none';
    $.qu('.chpassenger-myse1').style.display = 'block';

    var theidtype1 =$.qu('.chpassenger-myse1').value;

    if(theidtype1 == '护照'){
        $.qu('.chpassenger-agedata').style.display = 'block';
    }else{
        $.qu('.chpassenger-agedata').style.display = 'none';
        $.qu('.nbage').value ='';
    }
}



// 确认修改 预处理函数
 //function theoldfn(changedata){}

function theoldfn(){
     //       ///////////////////////////////////////    确认键确认键确认键确认键

         var id = changedata.ftype; //  乘机人id
         var name = $.qu('.chname').value; //名称
         var phone =$.qu('.fnumberT').value; //电话
         var idtype = "";
         if ($.qu('.chpassenger-myse1').style.display == "block") {
             idtype = "身份证";
             var people = '儿童';// 成年 或者儿童
             //console.log('儿童')
         } else {
             idtype =$.qu('.chpassenger-myse').value; //  是 身份证 还是 护照
             var people = '成人';// 成年 或者儿童
         }


        if (!Verify.verifyFlightName(name)) {
            //alert("请填写正确的乘机人姓名，英文名字用‘/’分割");
            myalertp('chpassenger','请填写正确的乘机人姓名，英文名字用‘/’分割')

            //$("#card_type_data").html("身份证");
            //$("#name").focus();
            return false;
        }

         if (!getType(people)) { // people  为成年 或者儿童
             let msal = '';
             if(people =='儿童'){
                 msal = '儿童出生日期为成人出生日期'
             }else{
                 msal = '请填写正确的证件号码';
             }

             myalertp('chpassenger',msal)
             //$("#card_no").focus(); 焦点设置在 身份证号码上
             return false;
         }

         var idno = $.qu('.nbT').value;  // 证件号码
         if (idno == "") {
             //alert("证件号码不能为空");
             myalertp('chpassenger','证件号码不能为空')
             return false;
         }
         //var isUse = false;
         //$("#passengerBoxCover li").each(function (i) {//检查证件是否重复
         //    var data = $(this).attr("data");
         //    data = eval("(" + data + ")");
         //    var _id = $(this).attr("valueid");
         //    if (idtype == data.idtype && idno == data.idno && data.age != "儿童" && id != _id && idno != "") {
         //        isUse = true;
         //    }
         //});
         //if (isUse) {
         //    alert("对不起，该证件已经被使用！");
         //    return false;
         //}

         //alert(phone);
         //alert(phone);
         if (!Verify.verifyMobile(phone) && phone != "") {
             //alert("请填写正确的手机号码");
             myalertp('chpassenger','请填写正确的手机号码')
             //$("#card_type_data").html("身份证");
             //$("#phone").focus();
             return false;
         }else if( phone == "" && people == '成人' ){
             myalertp('chpassenger','成人手机号码必填！')
             return false;
         }
         //////////////////////////////////////////////////

         //var idno =cardNum;

         var theage ='';
         if (idtype == "护照") {
             //theage =$.qu('.nbage').value;
             //var r=/^[\d]{4}[\d]{1,2}[\d]{1,2}$/;
             //if(!r.test(theage)){
             //    alert("请填写正确出生日期");
             //    return false;
             //}

             var reg = /^[a-z,A-Z,0-9]+$/;
             if (!reg.test(idno)) {
                 //alert("请填写正确护照号码");
                 myalertp('chpassenger','请填写正确护照号码')
                 return false;
             }
         }

         var savepassenger = '{\"ID\":\"' + id + '\","Name":"' + name + '","Phone":"' + phone + '","IDNo":"' + idno + '","IDType":"' + idtype + '","AgeType":"' +people + '","Birthday":"'+theage+'"}';
         //_load.open("请稍候...", "255,255,255,1");
         //console.log(idtype)
         //console.log(savepassenger)
         //var member = UairB2C.MGOpt;
         var aes = new ICBCAes();
         aes.GetAesStr(savepassenger, function (encryptionSavepassenger, encryptionPwd) {
             //member.SavePassenger(encryptionSavepassenger, encryptionPwd, function (res) {
             //    //_load.close();
             //    if (res.value) {
             //        var json = JSON.parse(res.value);
             //        if (json.ret == 1) {
             //            //alert("修改乘机人成功");
             //            //myalertp('chpassenger','修改乘机人成功')
             //            $.router.go('#!/flightmb/passenger',{btype:mylinktype},true)
             //        } else {
             //            // alert("修改乘机人失败");
             //            myalertp('chpassenger','修改乘机人失败')
             //
             //        }
             //    }
             //});
             var  dataass ={
                 json:encryptionSavepassenger,
                 encryptionAESPwd:encryptionPwd
             }
             mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SavePassenger', (err, res) => {
                 var bdata =eval('(' +res+ ')');
                 if (bdata.value) {
                     var json = JSON.parse(bdata.value);
                     if (json.ret == 1) {
                         //alert("修改乘机人成功");
                         //myalertp('chpassenger','修改乘机人成功')
                         $.router.go('#!/flightmb/passenger',{btype:mylinktype},true)
                     } else {
                         // alert("修改乘机人失败");
                         myalertp('chpassenger','修改乘机人失败')
                     }
                 }else{
                     // alert("修改乘机人失败");
                     myalertp('chpassenger','修改乘机人失败')
                 }
             });
         });

 };

//得到乘机人的年龄
function getType(people) { // people  儿童/ 成人
    var rc = true;
    var pidtype = '';
    var pid = $.qu('.nbT').value; // 证件号码
    if(people =='成人'){
        var pidtype = $.qu('.chpassenger-myse').value; // 证件类型
    }else{

        let newcardtype =$.qu('.chpassenger-myse1').value;
        if(newcardtype == '护照'){
            pidtype = '护照';
            pid = $.qu('.nbage').value; // 证件号码
        }else{
            pidtype = '身份证';
        }


    }


    var pType = people; // 成年或者  儿童
    if (pidtype == "身份证" || (people !='成人' && pidtype == '护照')  ) { // 只验证身份证类型
        var reg = /^(\d{4})(\d{1,2})(\d{1,2})$/;
        if(pid.length>8){
            if (!validateIdCard(pid)) {
                rc = false;
            }
        }else{
            if(!pid.match(reg)){
                rc = false;
            }
        }

        if (pType == "儿童") {
            var nData = new Date();
            var bYear = 0;
            var nYear = nData.getFullYear();
            var bMonth = 0;
            var nMonth = nData.getMonth();
            var bDay = 0;
            var nDay = nData.getDate();
            pid.replace(reg, function ($0, $1, $2, $3) {
                bYear = parseInt($1);
                bMonth = parseInt($2);
                bDay = parseInt($3);
            })
            var childType = false;
            if (nYear - bYear > 12) {
                childType = false;
            } else if (nYear - bYear == 12) {
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
            if (!childType) {

                adultcolor();// 成年 图标切换
                _people = "成人";
                rc = false;
            } else {
                youngcolor();// 儿童状态 图标切换
                _people = "儿童";
            }
        } else { // 成年 或者 数据不是 生日
            if (validateIdCard(pid)) { // 是身份证号码
                var bData = pid.length == 18 ? pid.substr(6, 8) : pid.substr(6, 6);
                var nData = new Date();
                bData = bData.length == 8 ? bData : "19" + bData;
                var bYear = parseInt(bData.substr(0, 4));
                var nYear = nData.getFullYear();
                var bMonth = parseInt(bData.substr(4, 2));
                var nMonth = nData.getMonth();
                var bDay = parseInt(bData.substr(6, 2));
                var nDay = nData.getDate();
                var childType = false;
                if (nYear - bYear > 12) {
                    childType = false;
                } else if (nYear - bYear == 12) {
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
                if (!childType) {//自动选择为成人
                    adultcolor();// 成年 图标切换
                    _people = "成人";

                } else {
                    youngcolor();// 儿童状态 图标切换
                    _people = "儿童";
                }
            } else { // 不是身份证
                rc = false;
            }
        }
        puttypeCard(_people)
    }
    return rc;
}

// 证件类型 填充
function puttypeCard(pType,pcard){ // 儿童   ，证件类型

    if (pType == "成人") {
        $.qu('.chpassenger-myse').style.display ='block';
        if(pcard){
            var Ocard =$.qu('.chpassenger-myse');
            var thecops = Ocard.getElementsByTagName('option');
            //console.log(thecops)
            for(var i=0;i<thecops.length;i++){
                if(pcard ==thecops[i].innerHTML ){
                    Ocard.selectedIndex = thecops[i].index;
                    //ckey =thecops[i].value;
                    break;
                }
            }
             // 取消出生日期功能
            if(pcard =='护照'){
                $.qu('.chpassenger-agedata').style.display ='block';

            }else{
                $.qu('.chpassenger-agedata').style.display ='none';
                $.qu('.nbage').value ='';
            }
        }

        $.qu('.chpassenger-myse1').style.display ='none';
    } else {
        $.qu('.chpassenger-myse').style.display ='none';
        $.qu('.chpassenger-myse1').style.display ='block';
    }

}


// 身份证严格认证
function validateIdCard(idCard){
    var OK = true;
    //15位和18位身份证号码的正则表达式
    var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if(regIdCard.test(idCard)){
        if(idCard.length==18){
            var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
            var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
            for(var i=0;i<17;i++){
                idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
            }

            var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
            var idCardLast=idCard.substring(17);//得到最后一位身份证号码

            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if(idCardMod==2){
                if(idCardLast=="X"||idCardLast=="x"){
                }else{
                    OK =false;
                }
            }else{
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if(idCardLast==idCardY[idCardMod]){
                }else{
                    OK =false;
                }
            }
        }
    }else{
        OK =false;
    }
    return OK
}

// 增加乘机人 预处理函数
function addpsFN(){
    var countID = "0";

    var adname = $.qu('.chname').value;// 名字
    var cardNum = $.qu('.nbT').value;//  证件号码
    var cardtype =''; // 证件类型
    var agetype = '';
    if($.qu('.chpassenger-myse').style.display == 'block'){
         cardtype =$.qu('.chpassenger-myse').value;
         agetype ='成人';
    }else{
        let newcardtype =$.qu('.chpassenger-myse1').value;
        if(newcardtype == '护照'){
            cardtype = '护照';
        }else{
            cardtype = '身份证';
        }
        agetype ='儿童';
    }
    var phoneNum = $.qu('.fnumberT').value;// 电话号码

    if (!Verify.verifyFlightName(adname)) {
        // alert("请填写正确的乘机人姓名，英文名字用‘/’分割");
        myalertp('chpassenger','请填写正确的乘机人姓名，英文名字用‘/’分割')

        //$("#card_type_data").html("身份证");
        // $("#name").focus();
        return false;
    }

    ///////////////////////////////////
    if (cardNum == "") {
        //alert("证件号不能为空!");
        myalertp('chpassenger','请填写证件号码')

        //$("#card_type_data").html("身份证");
        return false;
    }

    if (!getType(agetype)) {
        //alert("请填写正确身份证号码");

        let msal = '';
        if(agetype =='儿童'){
            msal = '儿童出生日期为成人出生日期'
        }else{
            msal = '请填写正确的证件号码';
        }
        myalertp('chpassenger',msal);

        return false;
    }

    ///////////
    var id = countID;

    var idno =cardNum;

    var  birthday  ='';
    if (cardtype == "护照") {
        birthday  =$.qu('.nbage').value;
        if(birthday){
           let checkb = checkbrithday(birthday);
            if(!checkb){

                return false;
            }
        }else{
            myalertp('chpassenger','请填写出生日期')
            return false;
        }

        //var r=/^[\d]{4}[\d]{1,2}[\d]{1,2}$/;
        //if(!r.test(theage)){
        //    alert("请填写正确出生日期");
        //    return false;
        //}else{
        var reg = /^[a-z,A-Z,0-9]+$/;
        if (!reg.test(idno)) {
            //alert("请填写正确护照号码");
            myalertp('chpassenger','请填写正确护照号码')
            return false;
        }


    }

    if (!Verify.verifyMobile(phoneNum) && phoneNum != "") {
        //alert("请填写正确的手机号码");
        myalertp('chpassenger','请填写正确的手机号码')

        return false;
    }else if( phoneNum == ""  && agetype == '成人'){
        myalertp('chpassenger','成人手机号码必填！')
        return false;
    }
    phoneNum = phoneNum?phoneNum:' ';
    //if(cardtype == '护照'){
    //    cardNum =cardNum+':'+birthday;
    //}
    let birthdaypull ='';
    if(birthday){
        birthdaypull = birthday.substring(0,4)+'-'+birthday.substring(4,6)+'-'+birthday.substring(6,8);
    }
    var savepassenger = '{\"ID\":\"' + id + '\","Name":"' + adname + '","Phone":"' + phoneNum + '","IDNo":"' + cardNum + '","IDType":"' + cardtype + '","AgeType":"' + agetype + '","Notes":"' +`生日:${birthdaypull}`+'"}';
    console.log('空电话的时候，限儿童')
    console.log(phoneNum)
    console.log(savepassenger)
    var aes = new ICBCAes();
    //var member = UairB2C.MGOpt;
    aes.GetAesStr(savepassenger, function (encryptionSavepassenger, encryptionPwd) {
        //member.SavePassenger(encryptionSavepassenger, encryptionPwd, function (res) {
        //    if (res.value) {
        //        var json = JSON.parse(res.value);
        //        if (json.ret == 1) {
        //            //alert("增加乘机人成功");
        //            //myalertp('chpassenger', '增加乘机人成功')
        //            $.router.go('#!/flightmb/passenger', {btype: mylinktype}, true)
        //        } else {
        //            // alert("增加乘机人失败");
        //            myalertp('chpassenger', '增加乘机人失败,请重试。')
        //
        //        }
        //    }
        //});


        var  dataass ={
            json:encryptionSavepassenger,
            encryptionAESPwd:encryptionPwd
        }
        mypost('/ajaxpro/UairB2C.MGOpt,UairB2C.ashx', dataass, 'SavePassenger', (err, res) => {
            console.log(err)
            console.log(res)
            var bdata =eval('(' +res+ ')');
            if (bdata.value) {
                var json = JSON.parse(bdata.value);
                if (json.ret == 1) {
                    //myalertp('chpassenger', '增加乘机人成功')
                    $.router.go('#!/flightmb/passenger', {btype: mylinktype}, true)
                } else {
                    // alert("增加乘机人失败");
                    myalertp('chpassenger', '增加乘机人失败,请重试。')
                }
            }else{
                // alert("增加乘机人失败");
                myalertp('chpassenger', '增加乘机人失败,请重试。')
            }
        });
    });






}
// 判断填入的出身日期是否正常 value 为传入的出身日期
function checkbrithday(value){

    //str="19811101";
    var reg = /^(?:(?!0000)[0-9]{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;

    let t1 = reg.test(value);
    console.log(t1);
    if(!t1){
        myalertp('chpassenger', '出身日期有误，正确如：20140902');
        return false;
    }else{
        let myt = new Date();
        let myt1 =Number( (myt.getFullYear()+'').substring(0,4));
        let myt2 =Number( value.substring(0,4));
        if(myt1<myt2){
            myalertp('chpassenger', '出身日期不能大于当前日期');
            return false;
        }else {
            return true;
        }


    }


}
//  根据出生日期 判断是儿童 还成人 time '20120215'  y 12
function isAgePs(time, y) {
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

if (typeof Verify === "undefined") { var Verify = {} } (function (a) { a.toDateString = function (c) { var d = c.getMonth() + 1, b = c.getDate(); if (d < 10) { d = "0" + d } if (b < 10) { b = "0" + b } return c.getFullYear() + "-" + d + "-" + b }; a.verifyFlightName = function (c) { var d = false; c = c.replace(/(^\s*)|(\s*$)/g, ""); var b = /^[A-Za-z\/]+$/; if (b.test(c)) { if (c.indexOf("/") > 0 && c.indexOf("/") < c.length - 1) { d = true } else { d = false } } else { b = /^[\u4e00-\u9fa5]+[A-Z,a-z]*[\u4e00-\u9fa5]*$/; if (b.test(c)) { d = true } else { d = false } } return d }; a.verifyName = function (b) { var b = b.replace(/(^\s*)|(\s*$)/g, ""); return b.length > 0 }; a.verifyEmail = function (b) { return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(b) }; a.verifyTicketNo = function (c) { var d = false; var b = c.length; if (b === 13) { d = /^\d{13}$/.test(c) } return d }; a.verifyMobile = function (b) { return /^1\d{10}$/.test(b) }; a.verifyIdCard = function (t) { var s = t.length, b, i, w, m, d; if (s === 15) { b = t.match(/^(?:\d{6})(\d{2})(\d{2})(\d{2})(?:\d{3})$/); if (!b) { return false } i = parseInt("19" + b[1], 10); w = parseInt(b[2], 10); m = parseInt(b[3], 10); d = t.charAt(s - 1) % 2 } else { if (s === 18) { var u = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], y = "10X98765432"; for (var v = 0, c = 0; v < 17; v++) { c += t.charAt(v) * u[v] } if (y.charAt(c % 11) !== t.charAt(17).toUpperCase()) { return false } b = t.match(/^(?:\d{6})(\d{4})(\d{2})(\d{2})(?:\d{3})(?:[0-9]|X)$/i); if (!b) { return false } i = parseInt(b[1], 10); w = parseInt(b[2], 10); m = parseInt(b[3], 10); d = t.charAt(s - 2) % 2 } } var x = new Date(i, w - 1, m); if (i !== x.getFullYear() || w !== x.getMonth() + 1 || m !== x.getDate()) { return false } return true }; a.replaceIdCard = function (b) { var c = a.verifyIdCard(b); if (!c) { return b } if (b.length === 18) { return b.replace(/^(\d{4})\d{11}(\d{2}[\da-z])$/i, "$1***********$2") } else { if (b.length === 15) { return b.replace(/^(\d{4})\d{8}(\d{3})$/, "$1********$2") } } }; a.replaceMobile = function (b) { return b.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") } })(Verify);