/**
 * Created by way on 17/1/10.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,userOnoffpp,setTitle,myget} from '../util/api';// myalertp 封装的 alert提示弹层
let _view = require('raw!./Order.html');
var thelinkt ='';
var contid = ''; // 修改联系人 对应的id
var backFlight = false; // 是否是往返航班 false为单程 true为往返
var  havesafe = true;
var zytypep = '';// 直营判断  产品页面传过来的
var theisTripbank = '';
var isxh = '';

export default class {
    path = '/flightmb/Order$';
    hash = '/flightmb/Order';
    title = '订单详情';
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

        isxh = params.isxh;
        backFlight = params.backFlight;// 是否是 往返航班
        //console.log( typeof backFlight )
        havesafe =params.havesafe;// 是否购买保险


        pushData(params,zytypep); // 页面填充数据




        //gopaymoney(params.booktoorder.OrderID,1);//查询 授信权
        // 限及账号
        //  Oallprice2 支付跳转  console.log(pp.split(',')[0]) 支付 需要第一个订单号

        $.qu('.Oallprice2').onclick = function(){// 支付
            //gopaymoney(params.booktoorder.OrderID,1);//查询 授信权
            //userOnoffpp('b',myBookFn,'myBook','.lodinb',bookdata,'抱歉，登录超时，为确保余票充足，请重新查询该航班~');

            userOnoffpp('s',function(){


                var oidarr = params.booktoorder.OrderID;
                var oid= '';
                var oidr= '';
                if(oidarr.length>1){//混合订单
                    oidr =oidarr[0]+','+oidarr[1];
                    oid= oidarr[1];
                }else{
                    oid =oidarr[0];
                    oidr=oidarr[0];
                }

                if(isxh ==1){
                    gopaymoney(oidr,1,oid);//查询 授信权
                }else{
                    //goAndPay(oid)
                    goAndPay(oidr)
                }

            },'Order','.lodin-O','','');
        };



        //页面加载完成，点击展开收起
        $.qu(".Orderlooktext").onclick = function() {
            showList($.qu(".Orderlooktext1-text"),$.qu(".getPeInfo"));
        }
        $.qu(".OpriceFlight").onclick = function() {
            showList($.qu(".Othepriece"),$.qu(".getPeInfo1"));
        }
        $.qu(".Orderlooktext1").onclick = function () {
            //showList($.qu(".Orderlooktext11-text"),$.qu(".getPsInfo"));

            hideList($.qu(".Orderlooktext11-text"),$.qu(".getPsInfo"));
        };
        $.qu(".OpriceFlight1").onclick = function() {
            showList($.qu(".Othepriece1"),$.qu(".getPriInfo"));
        }
        $.qu(".Orderpasenger").onclick = function() {
            showList($.qu(".Opasengerdata"),$.qu(".getPsInfo1"));
        }
        $.qu(".Orderpacantact").onclick = function() {
            showList($.qu(".Ocantactdata"),$.qu(".getPeInfo2"));
        }
        $.qu(".Orderlinkadd").onclick = function() {
            showList($.qu(".Orderlinkadd-box"),$.qu(".getProInfo3"));
        }
        // 页面返回 就是前往 历史订单页面
        $.qu('.Order-tt1').onclick = function (){
            //进入页面隐藏展开列表，及图标向下
            hideList($.qu(".Orderlooktext1-text"),$.qu(".getPeInfo"));
            hideList($.qu(".Othepriece"),$.qu(".getPeInfo1"));
            //hideList($.qu(".Orderlooktext11-text"),$.qu(".getPsInfo"));
            showList($.qu(".Orderlooktext11-text"),$.qu(".getPsInfo"));
            hideList($.qu(".Othepriece1"),$.qu(".getPriInfo"));
            hideList($.qu(".Opasengerdata"),$.qu(".getPsInfo1"));
            hideList($.qu(".Ocantactdata"),$.qu(".getPeInfo2"));
            hideList($.qu(".Orderlinkadd-box"),$.qu(".getProInfo3"));

            $.router.go('#!/flightmb/allmybook',{btype:2},true)
        }

        //头部主页返回
        $.qu('.o_home').onclick =() =>$.router.go('#!/flightmb/join','',false);
        //  动态修改 头部电话
        pullHeadphoneO();



    }
}

//  动态修改 头部电话
function pullHeadphoneO() {

    var telOB = $.qu('.o_phone');
    var zycpB = $.qu('.Order-cpphone').style.display == 'none' ?0:1;//  1为直营
    let cpnum = $.qu('.Order-mtfsp3').innerHTML.substring(0,2);
    console.log(`直营标记=${zycpB}`)
    if(zycpB == 0){
        getCZphoneO('XHSV',telOB)
    }else{
        switch (cpnum) {
            case "ZH":getCZphoneO('ZH',telOB);break;
            case "CZ":getCZphoneO('CZ',telOB);break;
            case "3U":getCZphoneO('3U',telOB);break;
        }


    }

}
function getCZphoneO(key,el){
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


// 数据填充 函数
function pushData(params,zytypep){

    if(!backFlight){// 单程

        $.qu('.Oflght-data1').style.display = 'none';
        $.qu('.Oflght-data2').style.display = 'none';
        $.qu('.O-flght2').style.display = 'none';

        fromflight(params.linkdata)

    }else{
        $.qu('.Oflght-data1').style.display = 'inline-block';
        $.qu('.Oflght-data2').style.display = 'inline-block';
        $.qu('.O-flght2').style.display = 'block';
        fromflight(params.linkdata[0])
        toflight(params.linkdata[1])
    }
    // 航班信息
    function fromflight(data){ //去程
        $.qu('.Order-mtfsp1').innerHTML =getLastFive(data.data1); //时间
        $.qu('.Order-mtfsp111').innerHTML =isNextDay(data.ftime,data.ttime,data.data1); //时间
        $.qu('.Order-mtfsp2').innerHTML =data.pc; //航空公司
        $.qu('.Order-mtfsp3').innerHTML =data.pcnum; //航班数字编码
        $.qu('.Order-mttsp1').innerHTML =data.ftime; //起飞时间
        $.qu('.Order-mttsp11').innerHTML =data.fplace; //起飞地点
        $.qu(".Order-startFP").innerHTML = data.fplace; //起飞地点
        $.qu('.Order-mttsp2').innerHTML =data.ttime; //到达时间
        $.qu('.Order-mttsp22').innerHTML =data.tplace; //到达地点
        $.qu('.Order-endFP').innerHTML =data.tplace; //到达地点
    }
    function toflight(data){ //返程
        $.qu('.Order1-mtfsp1').innerHTML =getLastFive(data.data1); //时间
        $.qu('.Order1-mtfsp111').innerHTML =isNextDay(data.ftime,data.ttime,data.data1); //时间
        $.qu('.Order1-mtfsp2').innerHTML =data.pc; //航空公司
        $.qu('.Order1-mtfsp3').innerHTML =data.pcnum; //航班数字编码
        $.qu('.Order1-mttsp1').innerHTML =data.ftime; //起飞时间
        $.qu('.Order1-mttsp11').innerHTML =data.fplace; //起飞地点
        $.qu('.Order1-startFP').innerHTML =data.fplace; //起飞地点
        $.qu('.Order1-mttsp2').innerHTML =data.ttime; //到达时间
        $.qu('.Order1-mttsp22').innerHTML =data.tplace; //到达地点
        $.qu('.Order1-endFP').innerHTML =data.tplace; //到达地点
    }


    // 改退签说明 去 或者 单程儿童成人
    ////////////////////////////////////////////////////////
    if(!backFlight){ //单程
        $.qu('.Orderlooktext1-text').innerHTML =params.safedata; //退改签说明数据
        $.qu('.Otoprice').innerHTML =params.linkdata.pice1;// 成人价格

        $.qu('.thefee').innerHTML =params.peoplenum.hongbaoprice;// 返现，折扣？？
        $.qu('.thefeey').innerHTML =params.peoplenum.hongbaoprice;// 返现，折扣？？
        var Onums = $.qus('.cpeoplenum2'); // 给成人 加个数
        for(var i=0; i<Onums.length;i++){
            Onums[i].innerHTML =params.peoplenum.onum;
        }
        var Oynums = $.qus('.cpeoplenum2y'); // 给儿童加个数
        if(params.peoplenum.ynum == 0){ //没有儿童
            $.qu('.Ocpeopley').style.display= 'none';
        }else{// 有儿童

            for(var i=0; i<Oynums.length;i++){
                Oynums[i].innerHTML =params.peoplenum.ynum;
            }
            $.qu('.Ocpeopley').style.display= 'block';
           // $.qu('.Otopricey').innerHTML =params.linkdata.YPrice/2;//儿童价格 (Number(theprice)/20).toFixed(0)*10
            $.qu('.Otopricey').innerHTML =params.booktoorder.yprice;//儿童价格 (Number(theprice)/20).toFixed(0)*10
            $.qu('.thefee').innerHTML =params.peoplenum.hongbaoprice;// 返现，折扣？？
        }
        if(params.zytype ==1 ){// 为直营航班 保险数量 真直营 是没有保险的 差旅判断后
            if(havesafe){// 有保险 深圳直营
                $.qu('.Osafe').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 儿童/成人Osafey
                $.qu('.Osafey').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 儿童/成人Osafey
            }else{ //直营没得保险
                $.qu('.Osafe').innerHTML = 0;
                $.qu('.Osafey').innerHTML = 0;
                $.qu('.oldtwo').innerHTML = 0;
                $.qu('.youngone').innerHTML = 0;
                $.qu('.oldone').innerHTML = 0;
            }
        }else{ //非直营
            if(havesafe){// 有保险
                $.qu('.Osafe').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 儿童/成人Osafey
                $.qu('.Osafey').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 儿童
            }else{ //直营没得保险
                $.qu('.Osafe').innerHTML = 0;
                $.qu('.Osafey').innerHTML = 0;
                $.qu('.oldtwo').innerHTML = 0;
                $.qu('.youngone').innerHTML = 0;
                $.qu('.oldone').innerHTML = 0;
            }
        }
    }else{ // 往返 或者
        $.qu('.Ocpeopley').style.display= 'none';//隐藏儿童  机票详情 块
        $.qu('.Orderlooktext1-text').innerHTML =params.safedata[0]; //退改签说明数据 去程
        $.qu('.Orderlooktext11-text').innerHTML =params.safedata[1]; //退改签说明数据 返程

        $.qu('.Otoprice').innerHTML =params.linkdata[0].pice1;// 成人价格
        $.qu('.Otoprice12').innerHTML =params.linkdata[1].pice1;// 成人价格


        $.qu('.thefee').innerHTML =params.peoplenum.hongbaoprice;// 返现，折扣？？
        $.qu('.thefee1').innerHTML =params.peoplenum.hongbaoprice;// 返现，折扣？？
        var Onums = $.qus('.cpeoplenum2'); // 给成人 加个数
        var Onums1 = $.qus('.cpeoplenum21'); // 给成人 加个数

        for(var i=0; i<Onums.length;i++){
            Onums[i].innerHTML =params.peoplenum.onum;
        }
        for(var i=0; i<Onums1.length;i++){
            Onums1[i].innerHTML =params.peoplenum.onum;
        }

        if(params.zytype ==1){// 为直营航班
            if(havesafe){ // 直营有保险
                $.qu('.Osafe').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 成人
                $.qu('.Osafe1').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 成人
            }else{// 直营无保险
                $.qu('.Osafe').innerHTML = 0;
                $.qu('.Osafe1').innerHTML = 0;
                $.qu('.oldtwo').innerHTML = 0;// 保险数量为0
               // $.qu('.youngone').innerHTML = 0;
                $.qu('.oldone').innerHTML = 0;

            }

        }else{//非直营
            if(havesafe){//非直营 有保险
                $.qu('.Osafe').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 成人
                $.qu('.Osafe1').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 成人
            }else{ //非直营 无保险
                $.qu('.Osafe').innerHTML =0;// 保险  所有保险 都是一个价格 成人
                $.qu('.Osafe1').innerHTML =0;// 保险  所有保险 都是一个价格 成人
                $.qu('.oldtwo').innerHTML = 0;// 保险数量为0
                //$.qu('.youngone').innerHTML = 0;
                $.qu('.oldone').innerHTML = 0;
            }
        }
    }
    // 页面填充 客户 电话   ajax  获取
    if(backFlight){
        // 去程
        if(params.linkdata[0].zytypep ==1  && isxh == 0){
            var thepc1 = params.linkdata[0].theCarrier1;//直营的时候 的航空公司号 params.linkdata[0]
            var oData1 = '';

            var xhr = '';
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest();
            }else{
                xhr =new ActiveXObject(' Microsoft . XMLHTTP')
            }
            //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc1,'false');
            xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc1,'false');

            xhr.send();
            xhr.onreadystatechange = function(){
                if( xhr.readyState == 4){
                    // ajax 响内容解析完成，可以在客户端调用了
                    if(xhr.status == 200){
                        //  判断服务器返回的状态 200 表示 正常
                        oData1 = eval('('+xhr.responseText+')');
                        //console.log(oData1.Result.Phone);
                        $.qu('.phoneone').setAttribute('href','tel:'+oData1.Result.Phone);// 订一趟航班的时候
                        $.qu('.phoneone').innerHTML = oData1.Result.Phone;
                    }else{
                        //alert('出错了，获取直营联系电话失败！');
                        myalertp('Order','出错了，获取直营联系电话失败！')
                    }
                }
            }
        }else{
            $.qu('.Order-cpphone').style.display = 'none';
        }
        // 返程
        if(params.linkdata[1].zytypep ==1  && isxh == 0){
            var thepc2 = params.linkdata[1].theCarrier1;//直营的时候 的航空公司号 params.linkdata[0]
            var oData2 = '';
            var xhr = '';
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest();
            }else{
                xhr =new ActiveXObject(' Microsoft . XMLHTTP')
            }
            //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc2,'false');
            xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc2,'false');

            xhr.send();
            xhr.onreadystatechange = function(){
                if( xhr.readyState == 4){
                    // ajax 响内容解析完成，可以在客户端调用了
                    if(xhr.status == 200){
                        //  判断服务器返回的状态 200 表示 正常
                        oData2 = eval('('+xhr.responseText+')');
                        //console.log(oData2.Result.Phone);
                        $.qu('.phonetwo').setAttribute('href','tel:'+oData2.Result.Phone);// 订一趟航班的时候
                        $.qu('.phonetwo').innerHTML = oData2.Result.Phone;
                    }else{
                        //alert('出错了，获取直营联系电话失败！');
                        myalertp('Order','出错了，获取直营联系电话失败！')
                    }
                }
            }
        }else{
            $.qu('.Order1-cpphone').style.display = 'none';
        }



    }else{// 单词航班
        if(params.linkdata.zytypep ==1  && isxh == 0 ){
            var thepc = params.linkdata.theCarrier1;//直营的时候 的航空公司号
            var  oData3 = '';
            var xhr = '';
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest();
            }else{
                xhr =new ActiveXObject(' Microsoft . XMLHTTP')
            }
            //xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc,'false');
            xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETSERVICEPHONE&Source='+thepc,'false');
            xhr.send();
            xhr.onreadystatechange = function(){
                if( xhr.readyState == 4){
                    // ajax 响内容解析完成，可以在客户端调用了
                    if(xhr.status == 200){
                        //  判断服务器返回的状态 200 表示 正常
                        oData3 = eval('('+xhr.responseText+')');
                        //console.log(oData3.Result.Phone);
                        $.qu('.phoneone').setAttribute('href','tel:'+oData3.Result.Phone);// 订一趟航班的时候
                        $.qu('.phoneone').innerHTML = oData3.Result.Phone;
                    }else{
                        //alert('出错了，获取直营联系电话失败！');
                        myalertp('Order','出错了，获取直营联系电话失败！')
                    }
                }
            }
        }else{
            $.qu('.Order-cpphone').style.display = 'none';
        }

    }


   // $.qu('.Otoprice').innerHTML =params.linkdata.pice1;// 成人价格
   // $.qu('.Osafe').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 儿童/成人
    //$.qu('.thefee').innerHTML =params.peoplenum.hongbaoprice;// 返现，折扣？？
    //var Onums = $.qus('.cpeoplenum2'); // 给成人 加个数
    //for(var i=0; i<Onums.length;i++){
    //    Onums[i].innerHTML =params.peoplenum.onum;
    //}
    //var Oynums = $.qus('.cpeoplenum2y'); // 给儿童加个数
    //if(params.peoplenum.ynum ==0){
    //    $.qu('.Ocpeopley').style.display= 'none';
    //}else{
    //
    //    for(var i=0; i<Oynums.length;i++){
    //        Oynums[i].innerHTML =params.peoplenum.ynum;
    //    }
    //    $.qu('.Otopricey').innerHTML =params.linkdata.YPrice/2;// 成人价格
    //    $.qu('.Osafe').innerHTML =params.peoplenum.safeprice;// 保险  所有保险 都是一个价格 儿童/成人thefee
    //    $.qu('.thefee').innerHTML =params.peoplenum.hongbaoprice;// 返现，折扣？？
    //}

    //乘机人信息
    var  alltheData =params.passengerdata;
    var str ='';
    for(var i=0;i<alltheData.length;i++){
        var pnum =plusXing(alltheData[i].cardnum,5,4);
        var phonenum = alltheData[i].phonenum !=''?plusXing(alltheData[i].phonenum,3,4):'';
        str +='<ul class="Opasengerdata-ul"><li class="Opasengerdata-li1"><sapn class="Opbg">'+(i+1)+'</sapn> <img src="https://cos.uair.cn/mb/img/q_tip.png" alt=""></li><li><span class="Opasengerdata-sp1">乘客类型:</span><span class="Opasengerdata-ptype">'+alltheData[i].age+'</span></li><li><span class="Opasengerdata-sp1">姓名:</span><span class="Opasengerdata-pname">'+alltheData[i].name+'</span></li><li><span class="Opasengerdata-sp1">证件类型:</span><span class="Opasengerdata-pcard">'+alltheData[i].card+'</span></li><li><span class="Opasengerdata-sp1">证件号码:</span><span class="Opasengerdata-pnum">'+pnum+'</span></li><li><span class="Opasengerdata-sp1">手机号码:</span><span class="Opasengerdata-pphone">'+phonenum+'</span></li><li><span class="Opasengerdata-sp1">保险:</span><span class="Opasengerdata-psafe">'+alltheData[i].safenum+'</span></li> </ul>';
    }
    $.qu('.Opasengerdata').innerHTML =str;

    //联系人信息

    var cphone =plusXing(params.contactdata.phonenum,3,4);

    $.qu('.Ocantactdata-cname').innerHTML =params.contactdata.name;
    $.qu('.Ocantactdata-cphone').innerHTML =cphone;

    // 配送地址
    var  adddata =params.ShipAddr;
    if(adddata !=''){
        $.qu('.isShipAddr').style.display = 'block';
        $.qu('.shipfe1').innerHTML = 10;// 快递费用 10元
        $.qu('.Orderlinkadd').style.display ='block';
        $.qu('.Orderlinkadd-box').style.display ='block';
        $.qu('.Orderlinkadd-boxp2').innerHTML =adddata;
    }else{
        $.qu('.isShipAddr').style.display = 'none';
        $.qu('.Orderlinkadd').style.display ='none';
        $.qu('.Orderlinkadd-box').style.display ='none';


    }

    //  订单总额 订单号码
    $.qu('.Oallprice11').innerHTML =params.booktoorder.allprice;
    var oarrb = params.booktoorder.OrderID;
    var oarrball = '';
    if(oarrb.length>1){
        oarrball =oarrb[0]+','+oarrb[1];
    }else{
        oarrball =oarrb[0];
    }
    $.qu('.Order-Ordernum').innerHTML =oarrball;

    


}
//隐藏号码
function plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
        xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
}
// 支付跳转函数
function goAndPay(oid) {
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

// 授信 支付接口
function gopaymoney(theOid,type,oid){
    //console.log(theOid+'-'+type)
    if( type == 2){
        // $.id('loadorder-type').innerHTML ='授信支付中...';
        $.qu('.lodin-O').style.display ='-webkit-box';

    }else{
        // $.id('loadorder-type').innerHTML ='授信查询中...';
        $.qu('.lodin-O').style.display ='-webkit-box';

    }
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

            $.qu('.lodin-O').style.display ='none';

        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            if(xhr.status == 200){
                //  判断服务器返回的状态 200 表示 正常

                if(type ==1){
                    oData2 = eval('('+xhr.responseText+')');
                    if(oData2.Status ==1  && oData2.Msg =='成功'){// 是 授信企业


                        getbank(oData2.Result,theOid)
                    }else{
                         //alert('不是授信客户，将直接转往工商支付！')
                        var mst = oData2.Msg;
                        if(mst == '无授信账户!'){
                            myalertp('Order','抱歉，该账户的差旅授信功能已关闭')
                        }else{
                            myalertp('Order','抱歉，该账户的差旅授信功能发生异常')
                        }

                         //goAndPay(oid);// 直接跳转到 工商银行
                    }
                }else if(type ==2){
                    oData2 = eval('('+xhr.responseText+')');

                    if(oData2.Status ==1  && oData2.Msg =='成功'){// 支付成功！
                        //alert('恭喜，支付成功！！')
                        myalertp('Order','恭喜，支付成功！',function(){
                            $.qu('.creditbox').style.display ='none';
                            $.router.go('#!/flightmb/allmybook',{btype:1},true)
                        })

                    }else if(oData2.Status ==2){
                        //alert('对不起,该单位余额不足,不能支付。')
                        myalertp('Order','对不起,'+oData2.Msg)

                    }
                }
            }else{
                //alert('支付异常，请重试！');
                myalertp('Order','支付异常，请重试！')

            }
        }
    }
}
//  回调 授信 账号 theisTripbank
function  getbank(backms,oid){
    theisTripbank =backms;
    //myalertp('Order','已经进入弹层函数')
    $.qu('.payownbtnc').innerHTML = backms;
    $.qu('.creditbox').style.display ='-webkit-box';
    $.qu('.credit-close').onclick = function(){// 关闭弹层 取消支付
        $.qu('.creditbox').style.display ='none';
        $.qu('.payownbtnc').innerHTML = '代扣账号';
    }

    $.qu('.payownbtnc').onclick = function (){

        gopaymoney(oid,2,'');// 授信支付
    }
}


//判断时间是否应该加一天
function isNextDay(date1,date2,dateM) {
    let str1 = removeM(date1) - removeM(date2) >0?GetDateStrH(dateM,"24"):dateM;
    return getLastFive(str1);
}
//从日期中去除年份
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


function myAlertBox(b,fn,fns){ // 弹出层   b为显示的提示数据   fn 为确定后执行函数  fns 为取消执行函数
    var a = document.getElementById("book-alert");
    a.style.display = "-webkit-box";
    a.getElementsByClassName("book-alert-info")[0].innerHTML = b;
    var yesBtn = a.getElementsByClassName("book-alert-yes")[0];
    var noBtn = a.getElementsByClassName("book-alert-no")[0];
    yesBtn.onclick = function(){
        a.style.display = "none";
        if(fn && typeof fn == "function"){
            fn();
        }

    };
    noBtn.onclick = function() {
        a.style.display = "none";
        if(fns && typeof fns == "function"){
            fns();
        }
    };
}

//兼容获取样式
function getMyStyle(obj, attr)  
{  
    if(obj.currentStyle)  
    {  
        return obj.currentStyle[attr];  
    }  
    else  
    {  
        return  window.getComputedStyle(obj,false)[attr];  
    }  
}  
//列表收起操作
function showList(obj1,obj2) {
    if(getMyStyle(obj1,"display") =="none" || getMyStyle(obj1,"display") ==""){
        obj1.style.display = "block";
        obj2.src = "https://cos.uair.cn/mb/img/top.png";
    } else {
        obj1.style.display = "none";
        obj2.src = "https://cos.uair.cn/mb/img/botom.png";
    }
}
//初始化
function hideList(obj,obj1) {
    obj.style.display = "none";
    obj1.src = "https://cos.uair.cn/mb/img/botom.png";
}