/**
 * Created by way on 16/9/28.
 */

import cfg from '../config';
const $ = require('../lib/kdom');
const kajax = require('../lib/kajax');
import {
    getView,
    get,
    post,
    myalertp,setTitle,myget
} from '../util/api'; // myalertp 封装的 alert提示弹层
//myalertp('orderd','出错了，获取客服联系电话失败！')
let _view = require('raw!./orderd.html');
var fcity = 'a';
var tcity = '';
var OT = 1;

var theuser = 1;
var timer = '';


export default class {
    path = '/flightmb/orderd$';
    hash = '/flightmb/orderd';
    title = '订单详情'
    constructor(opt) {
        opt = opt || {};
        this.path = opt.path || this.path;
        this.hash = opt.hash || this.hash;
        this.title = opt.title || this.title;
    }

    // 杈撳嚭瑙嗗浘
    view(cb) {
        if (!_view) {
            // 闈欐�佽祫婧愭祻瑙堝櫒鏈夌紦瀛�,澧炲姞鏃舵爣,寮哄埗鍒锋柊!
            getView(`${cfg.view.flightmbJoin}?t=${(+new Date())}`, '', (rs) => {
                _view = rs;
                cb(null, _view);
            });
        } else {
            cb(null, _view);
        }
    }

    // 鍦ㄥ凡缁忓姞杞界殑瑙嗗浘涓婃搷浣�
    bind(dv, params) {
        //var thecpn = params.
        console.log(params.OrderTime);
        console.log(params);
        lookorderdetail(params);

        // 默认展开详情 每次进入页面都是默认展开
        orderdInitfn();


        //页面加载完成，点击展开收起
        $.qu(".orderdlooktext").onclick = function() {
            showList($.qu(".orderdlooktext1-text"), $.qu(".getPeInfo"));
        }
        $.qu(".OpriceFlight-d").onclick = function() {
            showList($.qu(".Othepriece-d"), $.qu(".getPriInfo"));
        }
        $.qu(".orderdpasenger").onclick = function() {
            showList($.qu(".Opasengerdata-d"), $.qu(".getPsInfo"));
        }
        $.qu(".orderdpacantact").onclick = function() {
            showList($.qu(".Ocantactdata-d"), $.qu(".getlinkInfo"));
        }
        $.qu(".Orderdlinkadd").onclick = function() {
            showList($.qu(".Orderdlinkadd-box"), $.qu(".getProInfo"));
        }
        $.qu(".contact_sv").onclick = function() {
            showList($.qu(".orderd_nop"), $.qu(".contact_im"));
        }


        $.qu('.orderd-tt1').onclick = function() {
            //进入页面隐藏展开列表，及图标向下
           // hideList($.qu(".orderdlooktext1-text"), $.qu(".getPeInfo"));
            hideList($.qu(".Othepriece-d"), $.qu(".getPriInfo"));
            hideList($.qu(".Opasengerdata-d"), $.qu(".getPsInfo"));
            hideList($.qu(".Ocantactdata-d"), $.qu(".getlinkInfo"));
            hideList($.qu(".Orderdlinkadd-box"), $.qu(".getProInfo"));
            hideList($.qu(".orderd_nop"), $.qu(".contact_im"));

            // 返回 订单列表
            $.router.go('#!/flightmb/allmybook', {}, true)
        }


    }
}


//  页面初始话 退改签 默认展开
function orderdInitfn(){
    $.qu(".orderdlooktext1-text").style.display = 'block';
    $.qu(".getPeInfo").src = 'https://cos.uair.cn/mb/img/top.png';

}


// 改期or退票
function nStatusFn(params, data, fdata) {
    //获取数据
    $.qu(".gaiqiReasonInfo").value = ""; //初始话

    if (params.nStatus == 1) {
        //退票1
        pushInfo(params, data, fdata);
        $.qu(".gaiqiInfo").style.display = "block";
        $.qu(".gaiqiBtn").style.display = "block";
        $.qu(".gaiqiBtn").innerHTML = "我要退票";
        $.qu(".orderd-tt2").innerHTML = "退票申请";
        $.qu(".gaiqiRefund").style.display = "block";
        $.qu(".gaiqititle").innerHTML = "退票原因";
        $.qu(".gaiqiPeopel").style.display = "block";
        $.qu(".gaiqiReason").style.display = "block";
        $.qu(".gaiqidirtip").style.display = "none";
    } else if (params.nStatus == 2) {
        //改期2
        // $.qu(".gaiqiPeopel").style.display = "block";
        pushInfo(params, data, fdata);
        if(params.isDft == 1) {           
            $.qu(".gaiqiInfo").style.display = "block";
            $.qu(".gaiqiBtn").style.display = "none";
            $.qu(".orderd-tt2").innerHTML = "改期申请";
            $.qu(".gaiqiRefund").style.display = "none";
            $.qu(".gaiqiReason").style.display = "none";
            $.qu(".gaiqiPeopel").style.display = "none";
            $.qu(".gaiqidirtip").style.display = "block";
        }else {
            $.qu(".gaiqiInfo").style.display = "block";
            $.qu(".gaiqiBtn").style.display = "block";
            $.qu(".gaiqiBtn").innerHTML = "我要改期";
            $.qu(".orderd-tt2").innerHTML = "改期申请";
            $.qu(".gaiqiRefund").style.display = "none";
            $.qu(".gaiqiPeopel").style.display = "block";
            $.qu(".gaiqititle").innerHTML = "改期原因";
            $.qu(".gaiqiReason").style.display = "block";
            $.qu(".gaiqidirtip").style.display = "none";
        }
    } else {
        $.qu(".gaiqiInfo").style.display = "none";
        $.qu(".gaiqiBtn").style.display = "none";
        $.qu(".gaiqiRefund").style.display = "none";
        $.qu(".orderd-tt2").innerHTML = "订单详情";
    }
    changeImg();
    refundImg();
}
//选择改期or退票的乘机人按钮切换
function changeImg() {
    var oLiBox = $.qus(".gaiqiBox");
    for (let i = 0; i < oLiBox.length; i++) {
        //设置为默认图片
        //添加点击切换
        oLiBox[i].onclick = function() {
            var nimg = this.getElementsByTagName("img")[0];
            var urlImg = "https://cos.uair.cn/mb/img/";
            var tickno = this.getAttribute("tickno");
            if (nimg.src == (urlImg + "choice-black.png")) {
                nimg.src = urlImg + "choice-blue.png";
                this.setAttribute("choiced", tickno);
                $.addClass(this, "ghasChoiced");
            } else {
                nimg.src = urlImg + "choice-black.png";
                this.setAttribute("choiced", "");
                $.removeClass(this, "ghasChoiced");
            }
        }
    }
}

//退票选择按钮切换
function refundImg() {
    var leftBtn = $.qu(".refund-self");
    var rightBtn = $.qu(".refund-other");
    var rUrl = "https://cos.uair.cn/mb/img/";
    var leftImg = leftBtn.getElementsByTagName("img")[0];
    var rightImg = rightBtn.getElementsByTagName("img")[0];
    //初始化
    leftBtn.setAttribute("choiced", "2");
    rightBtn.setAttribute("choiced", "1");
    leftImg.src = rUrl + "choice-blue.png";
    rightImg.src = rUrl + "choice-black.png";
    //点击
    leftBtn.onclick = function() {
        this.setAttribute("choiced", "2");
        leftImg.src = rUrl + "choice-blue.png";
        rightBtn.setAttribute("choiced", "1");
        rightImg.src = rUrl + "choice-black.png";
    };
    rightBtn.onclick = function() {
        this.setAttribute("choiced", "2");
        rightImg.src = rUrl + "choice-blue.png";
        leftBtn.setAttribute("choiced", "1");
        leftImg.src = rUrl + "choice-black.png";
    };
}

//退票or改期加载页面
function pushInfo(params,data, fdata) {
    var str = '';
    var cuSer = ["400-066-2188", "95539", "400-777-4567", "95378"]; //CZ:1 南航客服,ZH:2 深圳直营 3U:3 川航直营,星合客服:0
    var comp = ["18723059501"]; //投诉电话
    //客服电话判断
    var odir = $.qu(".dirflight");
    var nFlight = fdata.Carrier;
    if (nFlight == "CZ" && params.isDft == 1) {
        $.qu(".kefuTel").innerHTML = cuSer[1];
        $.qu(".cumTel").style.display = "none";
        odir.innerHTML = "南航直营";
        odir.style.display = "block";
        $.qu(".kefuTel").href = "tel:" + cuSer[1];
    } else if (nFlight == "ZH" && params.isDft == 1) {
        $.qu(".kefuTel").innerHTML = cuSer[2];
        $.qu(".cumTel").style.display = "none";
        $.qu(".kefuTel").href = "tel:" + cuSer[2];
        odir.innerHTML = "深航直营";
        odir.style.display = "block";
    } else if (nFlight == "3U" && params.isDft == 1) {
        $.qu(".kefuTel").innerHTML = cuSer[3];
        $.qu(".cumTel").style.display = "none";
        odir.innerHTML = "川航直营";
        odir.style.display = "block";
        $.qu(".kefuTel").href = "tel:" + cuSer[3];
    } else {
        $.qu(".kefuTel").innerHTML = cuSer[0];
        $.qu(".tousuTel").innerHTML = comp[0];
        $.qu(".cumTel").style.display = "block";
        $.qu(".kefuTel").href = "tel:" + cuSer[0];
        $.qu(".tousuTel").href = "tel:" + comp[0];
        odir.style.display = "none";
    }
    if (data.Index) {
        str += '<li class="omyBook-namel gaiqiBox" choiced=""  tickno="' + data.TicketNo + '">';
        str += '<div class="gaiqiImag">';
        str += '<img src="https://cos.uair.cn/mb/img/choice-black.png" alt="">';
        str += '</div>';
        str += '<p class="omyBook-namelp1">';
        str += '<span class="onamelp1sp1">' + data.Name + '</span><span class="refundstatus"><span>';
        str += '</p>';
        str += '<p class="omyBook-namelp1">';
        str += '<span class="onamelp1sp3">' + data.IDType + '</span>';
        str += '<span class="onamelp1sp4">' + data.IDNo + '</span>';
        str += '</p>';
        str += '</li>';
    } else {
        for (var i = 0; i < data.length; i++) {
            str += '<li class="omyBook-namel gaiqiBox" choiced=""  tickno="' + data[i].TicketNo + '">';
            str += '<div class="gaiqiImag">';
            str += '<img src="https://cos.uair.cn/mb/img/choice-black.png" alt="">';
            str += '</div>';
            str += '<p class="omyBook-namelp1">';
            str += '<span class="onamelp1sp1">' + data[i].Name + '</span><span class="refundstatus"><span>';
            str += '</p>';
            str += '<p class="omyBook-namelp1">';
            str += '<span class="onamelp1sp3">' + data[i].IDType + '</span>';
            str += '<span class="onamelp1sp4">' + data[i].IDNo + '</span>';
            str += '</p>';
            str += '</li>';
        }
    };
    $.qu('.peopleList').innerHTML = str; // 动态加载退改乘机人信息;
}
//提交退票or改期申请
function setPush(params, source) {
    var oid = params.orderid;
    var route = $.qu(".orderd-startFP").innerHTML + $.qu(".orderd-endFP").innerHTML;
    var Source = source;
    //退票改期调用同一个接口;
    getRefund(oid);
    //console.log(abs);
    // getChangeinfo(oid);
    getArrList(oid);
    $.qu(".orderTime-t").innerHTML = params.OrderTime.substring(0, params.OrderTime.length-3);
    if (params.nStatus == 1) {
        //退票申请
        //显示退票选项\
        $.qu(".gaiqiBtn").onclick = function() {
            var ogLiss = $.qus(".ghasChoiced");
            var reason = rspace($.qu(".gaiqiReasonInfo").value);
            if(ogLiss.length < 1) {
                myalertp("Orderd", "请选择退票的乘机人！");
                return false;
            }
            var type1 = $.qu(".refund-self").getAttribute("choiced");
            var tickno = '';
            for (var i = 0; i < ogLiss.length; i++) {
                tickno += ogLiss[i].getAttribute("choiced") + "|";
            }
            // alert(tickno.replace(/\|/g,"").length);
            if (reason == "") {
                myalertp("Orderd", "请输入退票原因！");
            } else {
                $.qu(".lodinabc").style.display = "-webkit-box";
                tickno = tickno.substring(0, tickno.length - 1);
                var act = "RefundTicket"
                var getData1 = {
                    act: act,
                    oid: oid,
                    route: route,
                    type: type1,
                    reason: reason,
                    tickno: tickno,
                    Source: Source
                };
                console.log(tickno);
                // var getUrl = flightUrl + "/icbc/ajax.aspx";
                // kajax.get(getUrl, getData, function (res) {
                //     // res = res.replace(/\'/g, "\"");
                //     // res = $.parseJSON(res);
                //     console.log(res);
                //     res = eval("(" + res + ")");
                //     // if (res.data[0] && res.data[0].RC && res.data[0].RC == 0) {
                //     //     $.qu(".lodinabc").style.display = "none";
                //     //     alert("改期申请提交成功");
                //     //     //返回订单页面
                //     //     $.router.go('#!/flightmb/allmybook',{},true);
                //     // } else {
                //     //     alert("提交失败,请稍后重试");           
                //     // }
                // });
                var xhr = null;

                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }
                xhr.onreadystatechange = () => {
                    if ((xhr.readyState === 4) && (xhr.status === 200)) {
                        $.qu(".lodinabc").style.display = "none";
                        var rdata = xhr.responseText;
                        rdata = eval('(' + rdata + ')');
                        if (rdata.data[0] && rdata.data[0].RC && rdata.data[0].RC == 0) {
                            myalertp("Orderd", "退票申请提交成功，实际退票费用以航空公司最终退票费用为准、退票款项到账时间依据航空公司规定，请您留意。",function(){
                                $.router.go('#!/flightmb/allmybook', {}, true);
                            });
                        } else {
                            alert("提交申请失败!请稍后重试" + rdata.errorMsg);
                        }
                    }
                };
                xhr.open('GET', flightUrl + "/icbc/ajax.aspx?act=RefundTicket&oid=" + getData1.oid + "&route=" + getData1.route + "&type=" + getData1.type + "&reason=" + getData1.reason + "&tickno=" + getData1.tickno + "&Source=" + getData1.Source, true);
                xhr.send(null);
            }
        }
    } else if (params.nStatus == 2) {
        //改期申请
        //隐藏退票选项\
        $.qu(".gaiqiRefund").style.display = "none";
        var type = 4;
        $.qu(".gaiqiBtn").onclick = function() {
            var ogLiss = $.qus(".ghasChoiced");
            var reason = rspace($.qu(".gaiqiReasonInfo").value);
            if(ogLiss.length < 1) {
                myalertp("Orderd", "请选择改期的乘机人！");
                return false;
            }
            var type1 = $.qu(".refund-self").getAttribute("choiced");
            var tickno = '';
            for (var i = 0; i < ogLiss.length; i++) {
                tickno += ogLiss[i].getAttribute("choiced") + "|";
            }
            if (reason == "") {
                myalertp("Orderd", "请输入改期原因！");
            } else {
                $.qu(".lodinabc").style.display = "-webkit-box";
                tickno = tickno.substring(0, tickno.length - 1);
                var act = "RefundTicket";
                var getData = {
                    act: act,
                    oid: oid,
                    route: route,
                    type: type,
                    reason: reason,
                    tickno: tickno,
                    Source: Source
                };
                //console.log(tickno);
                // var getUrl = flightUrl + "/icbc/ajax.aspx";
                // kajax.get(getUrl, getData, function (res) {
                //     // res = res.replace(/\'/g, "\"");
                //     // res = $.parseJSON(res);
                //     console.log(res);
                //     res = eval("(" + res + ")");
                //     // if (res.data[0] && res.data[0].RC && res.data[0].RC == 0) {
                //     //     $.qu(".lodinabc").style.display = "none";
                //     //     alert("改期申请提交成功");
                //     //     //返回订单页面
                //     //     $.router.go('#!/flightmb/allmybook',{},true);
                //     // } else {
                //     //     alert("提交失败,请稍后重试");           
                //     // }
                // });
                var xhr = null;

                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }
                xhr.onreadystatechange = () => {
                    if ((xhr.readyState === 4) && (xhr.status === 200)) {
                        $.qu(".lodinabc").style.display = "none";
                        var rdata = xhr.responseText;
                        rdata = eval('(' + rdata + ')');
                        if (rdata.data[0] && rdata.data[0].RC && rdata.data[0].RC == 0) {
                            myalertp("Orderd", "提交改期申请成功!",function(){
                                $.router.go('#!/flightmb/allmybook', {}, true);
                            });

                        } else {
                            alert("提交申请失败!请稍后重试" + rdata.errorMsg);
                        }
                    }
                };
                xhr.open('GET', flightUrl + "/icbc/ajax.aspx?act=RefundTicket&oid=" + getData.oid + "&route=" + getData.route + "&type=" + getData.type + "&reason=" + getData.reason + "&tickno=" + getData.tickno + "&Source=" + getData.Source, true);
                xhr.send(null);
            }
        }

    } else {
        return;
    }
}

function getArrList(oid) {
    var arr = [];
    var arr1 = getRefundinfo(oid);
    var arr2 = getChangeinfo(oid);
    arr = arr1.concat(arr2);
    var str = "";
    $.qu(".gaiqilist-ul").innerHTML = "";
    if(arr.length > 0){
        arr.sort(function(a,b) {
            var aa = new Date(a.time).getTime();
            var bb = new Date(b.time).getTime();
            return aa-bb;
        });
        for(var i = 0; i<arr.length; i++) {
            str += `<li>
                        <div class="gaiqitype">
                        <p><span class="list-Type">姓名</span><span class="gaiqiTxt">${arr[i].passengerName}</span></p>
                          <p><span class="list-Type">状态</span><span class="gaiqiTxt">${arr[i].desc}</span></p>
                          <p><span class="list-Type">时间</span><span class="gaiqiTxt">${arr[i].time}</span></p>
                        `;
            if(arr[i].notes){
                str += `<p><span class="list-Type noteTips">备注</span><span class="gaiqiTxt">${arr[i].notes}</span></p>`;
            }
            str += `</div></li>`;
        }
    }else {
        str = "<li>暂无退改签历史信息哦！！</li>";
    }
    $.qu(".gaiqilist-ul").innerHTML = str;

}

function getRefundinfo(oid) {
    //http://localhost:34472/icbc/refund.aspx?OrderID=477978&act=getRefundPassengerInfo
    var arr = [];
    var xhr = null;
    if (window.XMLHttpRequest){
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onreadystatechange = () => {
      if ((xhr.readyState === 4) && (xhr.status === 200)) {
          var rdata = xhr.responseText;
          if(rdata){
            if(typeof rdata =="string"){
                rdata = JSON.parse(rdata);
            }
            arr = rdata;
          }
      }
    };
    xhr.open('POST', flightUrl+"/icbc/refund.aspx?act=getCancelStr&OrderID="+oid, false);
    xhr.send(null);
    return arr;
}
function getChangeinfo(oid) {
    //http://localhost:34472/icbc/refund.aspx?OrderID=477978&act=getRefundPassengerInfo
    var arr = [];
    var xhr = null;
    if (window.XMLHttpRequest){
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onreadystatechange = () => {
      if ((xhr.readyState === 4) && (xhr.status === 200)) {
          var rdata = xhr.responseText;
          if(rdata){
            if(typeof rdata =="string"){
                rdata = JSON.parse(rdata);
            }
            for(var i = 0; i<rdata.length; i++) {
                if(!rdata[i].time){
                    rdata.splice(i, 1);
                }
                arr = rdata;
            }
          }
      }
    };
    xhr.open('POST', flightUrl+"/icbc/refund.aspx?act=getRefundStr&OrderID="+oid, false);
    xhr.send(null);
    return arr;
}

function getRefund(oid) {
    //http://localhost:34472/icbc/refund.aspx?OrderID=477978&act=getRefundPassengerInfo
    var xhr = null;
    var arr2 = ["(申请)","(已审核)","(办理)","(拒审)","(核销)"];
    var arr3 = [];
    if (window.XMLHttpRequest){
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onreadystatechange = () => {
      if ((xhr.readyState === 4) && (xhr.status === 200)) {
          var rdata = xhr.responseText;
          rdata = eval('(' +rdata+ ')');
          console.log(rdata);
          var arr = [];
          var gaiLis = $.qus(".gaiqiBox");
          if(!(rdata.Passengers.Passenger instanceof Array)){
            arr.push(rdata.Passengers.Passenger);
          }else {
            arr = rdata.Passengers.Passenger;
          }
          //&& parseInt(arr[i].CancelStr) != 4 拒审
          for(var i = 0,len = arr.length; i < len; i++) {
                if(parseInt(arr[i].CancelStr) > 0 && parseInt(arr[i].CancelStr) != 4) {
                    arr3.push(i);
                    for(var j = 0; j<gaiLis.length; j++) {
                        if(arr[i].IDNo == gaiLis[j].getAttribute("tickno")){
                            gaiLis[j].onclick = null;
                            gaiLis[j].getElementsByClassName("refundstatus")[0].innerHTML = arr2[parseInt(arr[i].CancelStr) -1];
                        };
                    }
                }
           }
           if(gaiLis.length == arr3.length) {
                $.qu(".gaiqiBtn").style.display = "none";
           }

      }
    };
    xhr.open('POST', flightUrl+"/icbc/refund.aspx?OrderID="+oid+"&act=getRefundPassengerInfo", false);
    xhr.send(null);
}
//防止用户输入空格;
function rspace(st) {
    return st.replace(/\s/g, "");
}
// 查看详情订单  ajax请求
function lookorderdetail(params) {
    var nStatusnow = params.nStatus; //是否退票，改签.
    var theorderid = params.orderid
    var oData = '';
    var xhr = '';
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject(' Microsoft.XMLHTTP')
    }
    // xhr.open('get','http://106.75.131.58:8015/icbc/xhService.ashx?act=GETUSEDORDERS&ST='+date1+'&ET='+date2,'false');
    // //xhr.open('get',flightUrl+'/icbc/xhService.ashx?act=GETDSONEPRICE','false');
    // xhr.send();

    xhr.open('post', flightUrl + '/icbc/xhService.ashx', true);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send('act=GETORDERDETAIL&OrderID=' + theorderid);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // ajax 响内容解析完成，可以在客户端调用了
            if (xhr.status == 200) {
                //$.qu('.lodin-pa').style.display ='none';
                //  判断服务器返回的状态 200 表示 正常
                oData = eval('(' + xhr.responseText + ')');
                console.log(oData)
                if (oData.Status == 1) { //  获取数据成功
                    var mydata = oData.Result.Order;
                    var data1 = mydata.FlightInfo[0];
                    var data2 = mydata;
                    var data3 = mydata.PayStr.Psgs.Psg;
                    var data4 = mydata.PsgStr.Passengers.Passenger; //乘客信息
                    var source = mydata.Source;
                    var status_sv = mydata.Status;
                    var  cpn = data1.Carrier;// 航司号
                    //  页面填充数据函数
                    ondatapull(data1, data2, data3, data4);
                    nStatusFn(params, data4, data1);
                    setPush(params, source);
                    let  elm =$.qu('.od_phone');
                    let zyid =params.isDft;// 直营标记 0 为非直营 1为直营
                    let istirp =params.Personal;// 是否是月结支付  2 为月结支付
                    if(zyid == '1'){// 直营机票
                        getCZphoneod(cpn,elm);
                    }else{
                        getCZphoneod('XHSV',elm);
                    }


                    // 常见问题页面填充
                    // 未付款
                    let nosc1 =`<li><p>订单为什么失效:</p><p>订单的有效支付时间为20分钟，超过有效时间订单自动取消</p></li>`;
                    let nosc2 =`<li><p>航司直营和非直营区别:</p><p>航司直营:航司直接在融购平台上出售的客票，包括出票、退改签、打印行程单等其他售后问题由航司直接处理;非直营:融e购机票商户负责订单的所有售后问题</p></li>`;
                    let nosc3 =`<li><p>差旅月结和自己结算区别:</p><p>差旅月结:和融e购机票商户(星合联盟)签订了差旅协议的单位，在支付订单的时候可以选择授信支付，不用自己垫款,月底单位直接结账;自己结算:自行垫款出票，不能差旅月结</p></li>`;
                    // 已经付款
                    let yssc1 =`<li><p>订单如何退改签:</p><p>退票:在订单里直接提交退票申请，航司直接取消位置，没有办法重新恢复座位;改期:直接用订单里所留电话致电航司操作变更</p></li>`;
                    let yssc11 =`<li><p>订单如何退改签:</p><p>退改签直接在订单里面提交申请，后台收到申请后会直接电话联系申请人，确定好退改签信息后再操作变更</p></li>`;
                    let yssc2 =`<li><p>行程单怎么寄送:</p><p> 预订机票的时候在订单里选择“需要报销凭证”并填写收件地址;寄送时间:航班起飞后3到5个工作日</p></li>`;
                    let yssc3 =`<li><p>积分是否可以兑换机票:</p><p>积分不可以兑换机票，具体情况可以咨询融e购客服热线:<a href="tel:4009195588" class="reg_phone">4009195588</a></p></li>`;

                    let sv_text = $.qu('.orderd_nop');
                    if(status_sv == "未付款"){


                        if(istirp == 2){ // 月结用户
                            sv_text.innerHTML =nosc1+nosc3;
                        }else{
                            if(zyid == '1'){// 直营机票
                                sv_text.innerHTML =nosc1+nosc2;
                            }else{
                                sv_text.innerHTML =nosc1;
                            }
                        }
                    }else{
                        if(istirp == 2){ // 月结用户
                            sv_text.innerHTML =yssc11+nosc2+nosc3+yssc2+yssc3;
                        }else{
                            if(zyid == '1'){// 直营机票
                                sv_text.innerHTML =yssc1+nosc2+yssc2+yssc3;
                            }else{
                                sv_text.innerHTML =yssc11+nosc2+yssc2+yssc3;
                            }

                        }
                    }

                } else {

                    myalertp('orderd', '登陆状态超时或获取数据失败，请重试或者登陆！')
                }
            } else {
                //alert('出错了，Err' +xhr.status);
                myalertp('orderd', '查看订单详情出错了，Err' + xhr.status)
            }
        }
    }


}

// 头部电话 更换
function getCZphoneod(key,el){
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



// 航班信息  改退签  联系人  填入函数
function ondatapull(data1, data2, data3, data4) {
    //  订单状态 及返现
    $.qu('.orderd-h1state').innerHTML = data2.Status;
    $.qu('.thefee-d').innerHTML = 0; // 返现
    $.qu('.Odelivery-d').innerHTML =data2.shipStr;// 邮寄费
    // 航班信息
    $.qu('.orderd-mtfsp1').innerHTML = getLastFive(data1.FlightDate); // 日期
    $.qu('.orderd-mtfsp2').innerHTML = data1.FromCarrier; // 航空公司号
    $.qu('.orderd-mtfsp3').innerHTML = data1.FromNo; // 航班号
    $.qu('.orderd-mtfsp4').innerHTML = data1.FromModel; // 机型
    $.qu('.orderd-mttsp1').innerHTML = data1.FromTime; // 起飞时间
    $.qu(".orderd-startFP").innerHTML = data1.From; //起飞城市
    $.qu('.orderd-mttsp11').innerHTML = data1.FromPort; // 起飞机场
    $.qu('.orderd-mttsp2').innerHTML = data1.ToTime; // 到达时间
    $.qu(".orderd-endFP").innerHTML = data1.To; //到达城市
    $.qu('.orderd-mttsp22').innerHTML = data1.ToPort; // 到达机场
    $.qu(".orderd-mtfsp111").innerHTML = isNextDay(data1.FromTime, data1.ToTime, data1.FlightDate); // 日期

    // 改退签规定
    let changeText = data2.RefundStr.replace(/\%b/g,'').replace(/\b/g,'').replace('改期：','.<br/>改期：').replace('签转：','.<br/>签转：');
    $.qu('.orderdlooktext1-text').innerHTML = changeText; // 退改说明

    //联系人
    $.qu('.Ocantactdata-d-cname').innerHTML = data2.ConName; // 联系人 姓名
    $.qu('.Ocantactdata-d-cphone').innerHTML = data2.ConPhone; // 联系人电话

    // 价格明细
    if (data3.AgeType == '成人') {
        $.qu('.Ocpeople-d-sp1').innerHTML = '成人票';
        $.qu('.Otoprice-d').innerHTML = data1.FlightPrice;

        $.qu('.cpeoplenum1-d').innerHTML = data3.Count;
        $.qu('.cpeoplenum2-d').innerHTML = data3.Count;
        $.qu('.OoilO-d').innerHTML = 50; // 没有基建 费用为 0

        if (data3.InsuredQty == '1') { // 有保险
            $.qu('.cpeoplenum3-d').innerHTML = data3.Count;
            $.qu('.Osafe-d').innerHTML = data2.InsureStr;

        } else { //没有保险
            $.qu('.cpeoplenum3-d').innerHTML = 0;
            $.qu('.Osafe-d').innerHTML = 0;
        }
    } else if (data3.AgeType == '儿童') {
        $.qu('.Ocpeople-d-sp1').innerHTML = '儿童票';
        $.qu('.Otoprice-d').innerHTML = data1.FlightPrice;
        $.qu('.OoilO-d').innerHTML = 0; // 没有基建 费用为 0
        $.qu('.cpeoplenum1-d').innerHTML = data3.Count; // 儿童票数量
        $.qu('.cpeoplenum2-d').innerHTML = 0; // 基建 数量 0

        if (data3.InsuredQty == '1') { // 有保险
            $.qu('.cpeoplenum3-d').innerHTML = data3.Count;
            $.qu('.Osafe-d').innerHTML = data2.InsureStr;

        } else { //没有保险
            $.qu('.cpeoplenum3-d').innerHTML = 0;
            $.qu('.Osafe-d').innerHTML = 0;
        }

    }

    //总价
    $.qu('.Oallprice11-d').innerHTML = data2.TotalAmount;

    //乘机人信息
    var str = '';
    //console.log(data4)
    if (data4.Index) {
        var safe = '';
        if (data4.InsuredQty == '1') { //有保险
            safe = '1份';

        } else {
            safe = '无';
        }

        str += '<ul class="Opasengerdata-d-ul"><li class="Opasengerdata-d-li1"><sapn class="Opbg-d">' + data4.Index + '</sapn> <img src="https://cos.uair.cn/mb/img/q_tip.png" alt=""></li><li><span class="Opasengerdata-d-sp1">乘客类型</span><span class="Opasengerdata-d-ptype">' + data4.AgeType + '</span></li><li><span class="Opasengerdata-d-sp1">姓名</span><span class="Opasengerdata-d-pname">' + data4.Name + '</span></li><li><span class="Opasengerdata-d-sp1">证件类型</span><span class="Opasengerdata-d-pcard">' + data4.IDType + '</span></li><li><span class="Opasengerdata-d-sp1">证件号码</span><span class="Opasengerdata-d-pnum">' + data4.IDNo + '</span></li><li><span class="Opasengerdata-d-sp1">手机号码</span><span class="Opasengerdata-d-pphone">' + data4.Phone + '</span></li><li><span class="Opasengerdata-d-sp1">保险</span><span class="Opasengerdata-d-psafe">' + safe + '</span></li></ul>';
    } else {

        for (var i = 0; i < data4.length; i++) {
            var safe = '';
            if (data4[i].InsuredQty == '1') { //有保险
                safe = '1份';

            } else {
                safe = '无';
            }

            str += '<ul class="Opasengerdata-d-ul"><li class="Opasengerdata-d-li1"><sapn class="Opbg-d">' + data4[i].Index + '</sapn> <img src="https://cos.uair.cn/mb/img/q_tip.png" alt=""></li><li><span class="Opasengerdata-d-sp1">乘客类型</span><span class="Opasengerdata-d-ptype">' + data4[i].AgeType + '</span></li><li><span class="Opasengerdata-d-sp1">姓名</span><span class="Opasengerdata-d-pname">' + data4[i].Name + '</span></li><li><span class="Opasengerdata-d-sp1">证件类型</span><span class="Opasengerdata-d-pcard">' + data4[i].IDType + '</span></li><li><span class="Opasengerdata-d-sp1">证件号码</span><span class="Opasengerdata-d-pnum">' + data4[i].IDNo + '</span></li><li><span class="Opasengerdata-d-sp1">手机号码</span><span class="Opasengerdata-d-pphone">' + data4[i].Phone + '</span></li><li><span class="Opasengerdata-d-sp1">保险</span><span class="Opasengerdata-d-psafe">' + safe + '</span></li></ul>';
        }
    }

    $.qu('.Opasengerdata-d').innerHTML = str; // 动态加载乘客信息

    //快递地址
    if (data2.shipStr != '') {
        $.qu('.Orderdlinkadd').style.display = 'block';
        // $.qu('.Orderdlinkadd-box').style.display = 'block';
        $.qu('.Orderdlinkadd-boxp2').innerHTML = data2.ConAddress;
        //配送费
        $.qu(".orderd-dfee").style.display = "block";
    } else {
        $.qu('.Orderdlinkadd').style.display = 'none';
        $.qu('.Orderdlinkadd-box').style.display = 'none';
        $.qu('.Orderdlinkadd-boxp2').innerHTML = '';
        $.qu(".orderd-dfee").style.display = "none";
    }

    //改签退定判断


}


//兼容获取样式
function getMyStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return window.getComputedStyle(obj, false)[attr];
    }
}
//列表收起操作
function showList(obj1, obj2) {
    if (getMyStyle(obj1, "display") == "none" || getMyStyle(obj1, "display") == "") {
        obj1.style.display = "block";
        obj2.src = "https://cos.uair.cn/mb/img/top.png";
    } else {
        obj1.style.display = "none";
        obj2.src = "https://cos.uair.cn/mb/img/botom.png";
    }
}
//初始化
function hideList(obj, obj1) {
    obj.style.display = "none";
    obj1.src = "https://cos.uair.cn/mb/img/botom.png";
}


//判断时间是否应该加一天
function isNextDay(date1, date2, dateM) {
    let str1 = removeM(date1) - removeM(date2) > 0 ? GetDateStrH(dateM, "24") : dateM;
    return getLastFive(str1);
}
//日期中去除年份
function getLastFive(date) {
    return date.substring(date.length - 5, date.length);
}
//去除"\:"
function removeM(date) {
    return parseInt(date.replace(/\:/g, ""));
}
//天数加1
function GetDateStrH(data1, h) {

    var Y1 = data1.substring(0, 4);
    var m1 = data1.substring(5, 7) - 1;
    var d1 = data1.substring(8, 10);
    // var  h1 = data1.substring(11, 13);
    // var  M1 = data1.substring(14, 17);
    var dd = new Date(Y1, m1, d1)
    dd.setHours(dd.getHours() + h); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = dd.getDate();

    if ((m + "").length == 1) {
        m = "0" + m;
    }
    if ((d + "").length == 1) {
        d = "0" + d;
    }

    return y + "-" + m + "-" + d

}


//身份证加"*"处理 分两种情况 成人 or 儿童

function hideInfo(e) {
    var d = e.length;
    return d < 18 ? e : e.replace(/^(.{6})(?:\d+)(.{4})$/, "$1****$2");
}

//手机号加"*"处理
function hideTel(e) {
    return e.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2");
}