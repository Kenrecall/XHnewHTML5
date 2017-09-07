

/**
 * Created by way on 16/9/28.
 */
import cfg from '../config';
const $ = require('../lib/kdom');
import {getView, get, post ,myalertp,setTitle} from '../util/api'; //myalertp 封装的 alert提示弹层
//myalertp('pickCity','出发地点不能和到达地点相同!')
let _view = require('raw!./adate.html');
var TTitype = '';
var Ftime = '';
var joindata ='';// 存放 带过来的数据



export default class {
  path = '/flightmb/adate$';
  hash = '/flightmb/adate';
  title = '时间选择';
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

      setTitle(`时间选择`);
     console.log(params)
     TTitype =params.timetype; //  0 或者1   0为去程 1  为返程
        joindata =params.joindata; // 路由带过来的数据
     if(TTitype==1){
      Ftime =params.ftim;
     }
     var nowDate = new Date();
     var nDt = new Date();

     var backDate = nowDate;
     backDate.setDate(backDate.getDate() + 7);
     returnDate("date-m1", nDt.Format("yyyy"), nDt.Format("MM"), nDt.Format("dd"), 1);
     var AdayNext = $.qus('.dayNext');
     // console.log(AdayNext.length)
     for (var i = 0; i < AdayNext.length; i++) {
            var _that =AdayNext[i];
            eClick(_that,joindata);
      }
     eClick($.qu(".dayNow"),joindata);
      myAjaxGetLowpricepr(getCityCode(joindata.ctyf),getCityCode(joindata.ctyt))

    // 返回按钮
     $.id('dateBack').onclick= function () {
     	$.router.go('#!/flightmb/join',{},false);
     }




  }
}

//根据城市取三字码
function getCityCode(city) {
    var citys = eval("(" + getCityObj() + ")").results;
    for (var i = 0; i < citys.length; i++) {
        if (citys[i].info.toUpperCase() == city.toUpperCase()) {
            return citys[i].id;
            //alert(citys[i].id);
        }
    }

}

function toTOP() {
    var odP = $.id('date-m');
    if( odP.scrollTop != 0){
        odP.scrollTop =0; // 返回顶部
    }

}


Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, (this.getMonth() + 1));

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}

function eClick(obj,joindata) {
    obj.onclick = function (){
         // var selectDate = this.find("font").eq(0).html();
          var selectDate =$.firstChild(this).innerHTML
          //console.log(selectDate)
          if (selectDate === "今天") {
             selectDate = new Date().getDate();
          }
          var dateCls = $.lastChild(this).innerHTML;
          var hID = this.parentNode.parentNode.parentNode.id;
          var dateString = $.nextNode($.firstChild($.firstChild($.id(hID)))).innerHTML;
          //console.log(dateString)
          var _date = new Date(dateString.replace(/-/g, "/"));
          if (dateCls == undefined) {
               dateCls = getWeek(_date.getDay());
          }
          if (selectDate != "") {
              // $("#emTime").html(dateString);
              // $("#headerID").hide();
              // $("#calendarCover").remove();
              // $("#emTime").next().html("&nbsp" + dateCls);
              // $("body").scrollTop(0);
              var Ttime = dateString+'-'+selectDate
              if(TTitype == 1){ // 返程时间 选择
                  var t2 =adaeeChange(Ttime);
                  var t1 =adaeeChange(joindata.timef);
                  var myt1 =t1.replace(/\-/g, "");
                  var myt2 =t2.replace(/\-/g, "")
                  //console.log(myt1)
                  //console.log(myt2)
                  if(myt1>myt2){
                      // alert('回程日期应该大于去程日期')
                       myalertp('date','回程日期应该大于去程日期')
                  }else{
                      //  点击 带时间 返回
                      joindata.timet =Ttime;
                      $.router.go('#!/flightmb/join',{timetype:TTitype,joindata:joindata},true)
                      toTOP()
                  }
              }else{ //去程时间 选择
                  joindata.timef =Ttime;
                  $.router.go('#!/flightmb/join',{timetype:TTitype,joindata:joindata},true)
                      toTOP()
              }


          }

    }

}
function adaeeChange(date){

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

 //获取星期几
function getWeek(num) {
    switch (num) {
        case 0:
            return "周日";
        case 1:
            return "周一";
        case 2:
            return "周二";
        case 3:
            return "周三";
        case 4:
            return "周四";
        case 5:
            return "周五";
        case 6:
            return "周六";
    }
}

//得到五个日历表的方法
function returnDate(id, nYear, nMonth, nDay, num) {
    var selectDate = "";
    // if (num == 1) {
    //     selectDate = $("#emTime").text();
    // } else {
    //     selectDate = $("#backTime").text();
    // }
    var year = nYear, month = nMonth;

    var size = 7;
    // var calendarBox = "<div id='calendarBox'></div>"
    // $("#calendarCover").append(calendarBox);
    var html ='';
    for (var i = 0; i < size; i++) {
         html+= calendar("calendar" + i, year, month, selectDate, false);
        //$("#" + id).append(html);
        month++;
        if (month == 13) {
            month = 1;
            year++;
        }
    }
    $.html( $.id(id),html)
    // $("#headerID").show();
    // $("#headerID").find("h1").html("选择日期");
}




function calendar(id, yy, mm, selectDate, showBtn) {//日历控件id:日历控件组id,yymm,开始的年份/月份,showBtn是否显示前一个月后一个月按钮
    var year = (parseInt(yy) < 1900) ? 1900 : parseInt(yy);
    year = year > 2030 ? 2030 : year;
    var month = parseInt(mm, 10) < 1 ? 1 : parseInt(mm, 10);
    month = month > 12 ? 12 : month;
    var calendarHTML =
        "<div class='calendar' id=" + id + " date=" + selectDate + ">" +
          "<div class='calendar_t'>";
    if (showBtn) {//显示按钮
        calendarHTML +=
            "<div class='calendar_t_prev' onclick='changeCalendar(this,-1);'><</div>" +
            "<div class='calendar_t_day'>" + year + "-" + month + "</div>" +
            "<div class='calendar_t_next'onclick='changeCalendar(this,1);'>></div>";
    } else {//无按钮
        calendarHTML +=
            "<div class='calendar_t_prev'></div>" +
            "<div class='calendar_t_day'>" + year + "-" + month + "</div>" +
            "<div class='calendar_t_next'></div>";
    }
    calendarHTML +=
        "<div class='clear'></div>" +
          "</div>" +
          "<div class='calendar_c'>" +
           "<div class='calendar_c_week'>" +
            "<div class='calendar_c_week_day'>日</div>" +
            "<div class='calendar_c_week_day'>一</div>" +
            "<div class='calendar_c_week_day'>二</div>" +
            "<div class='calendar_c_week_day'>三</div>" +
            "<div class='calendar_c_week_day'>四</div>" +
            "<div class='calendar_c_week_day'>五</div>" +
            "<div class='calendar_c_week_day'>六</div>" +
            "<div class='clear'></div>" +
           "</div>" +
           "<div class='calendar_c_box'>";
    calendarHTML += loadCalendar(year, month, selectDate);
    calendarHTML +=
           "</div>" +
          "</div>" +
         "</div>";
    return calendarHTML;
}



function loadCalendar(year, month, selectDate) {
    var rc = "";
    var dateObj = new Date();
    var nowYear = dateObj.getFullYear();//年
    var nowMonth = dateObj.getMonth() + 1;//月
    var nowDate = dateObj.getDate();//日
    var nowDay = dateObj.getDay();//周几
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    year = year < 1900 ? 1900 : year;
    year = year > 2030 ? 2030 : year;
    month = month < 1 ? 1 : month;
    month = month > 12 ? 12 : month;
    months[1] = year % 4 == 0 ? 29 : 28;//闰年判断
    dateObj.setFullYear(year, month - 1, 1);
    var day1 = dateObj.getDay();
    for (var i = 0; i < day1; i++) {
        rc += "<div class='day dayEmpty dayWhite'><font class='thettn'></font><font class='thett thettn1'></font></div>";
    }
    var tomorrow = 0;
    var afterTomorrow = 0;
    var minPrice = "¥" + 750;
    minPrice = "";
    for (var i = 1; i <= months[month - 1]; i++) {
        var dateString = year + "-" + month + "-" + i;//当前日历日期
        {
            //变成标准的日期格式如：2016-09-09
            var tempDate1Arr = dateString.split("-");
            dateString = tempDate1Arr[0] + ""
            if (tempDate1Arr[1].length == 1) {
                dateString += "-0" + tempDate1Arr[1];
            } else {
                dateString += "-" + tempDate1Arr[1];
            }
            if (tempDate1Arr[2].length == 1) {
                dateString += "-0" + tempDate1Arr[2];
            } else {
                dateString += "-" + tempDate1Arr[2];
            }
        }

        if (dateString == selectDate) {
            if (year == nowYear && month == nowMonth && i == nowDate) {
                tomorrow = i + 1;
                rc += "<div class='day daySelect';' data="+dateString+"><font class='thett'>今天</font><font class='thett1'>" + minPrice + "</font></div>";
            } else {
                if (i == tomorrow) {
                    tomorrow = 0;
                    afterTomorrow = i + 1;
                    rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font><font class='thett1'>" + minPrice + "</font><font style='display: none;'>明天</font></div>";
                } else {
                    if (afterTomorrow == i) {
                        afterTomorrow = 0;
                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font> <fontclass='thett1'>" + minPrice + "</font><font style='display: none;'>后天</font></div>";
                    } else {
                        rc += "<div class='day daySelect';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1'>" + minPrice + "</font></div>";
                    }
                }
            }
        } else {
            if (year < nowYear) {
                rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thettn'>" + i + "</font><font class='thettn1'></font></div>";
            } else if (year == nowYear) {
                if (month < nowMonth) {
                    rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thettn'>" + i + "</font><font class='thettn1'></font></div>";
                } else if (month == nowMonth) {
                    if (i < nowDate) {
                        rc += "<div class='day dayPrev dayGrey' data=" + dateString + "><font class='thettn'>" + i + "</font><font class='thettn1'></font></div>";
                    } else if (i == nowDate) {
                        tomorrow = i + 1;
                        rc += "<div class='day dayNow';' data=" + dateString + "><font class='thett'>今天</font> <font class='thett1' >" + minPrice + "</font><font style='display: none;'>今天</font></div>";
                    } else {
                        if (i == tomorrow) {
                            tomorrow = 0;
                            afterTomorrow = i + 1;
                            rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1' >" + minPrice + "</font><font style='display: none;'>明天</font></div>";
                        } else {
                            if (afterTomorrow == i) {
                                afterTomorrow == 0;
                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1' >" + minPrice + "</font><font style='display: none;'>后天</font></div>";
                            } else {
                                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1'>" + minPrice + "</font></div>";
                            }
                        }
                    }
                } else {
                    rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1' >" + minPrice + "</font></div>";
                }
            } else {
                rc += "<div class='day dayNext';' data=" + dateString + "><font class='thett'>" + i + "</font> <font class='thett1'>" + minPrice + "</font></div>";
            }
        }
    }
    rc += "<div class='clear'></div>";
    return rc;
}
// 显示按钮的时候调用
function changeCalendar(element,meth) {
    var calendarBox = $(element).parents(".calendar");
    var date = calendarBox.find(".calendar_t_day").html();
    var dateArray = date.split("-");
    var year = parseInt(dateArray[0]);
    var month = parseInt(dateArray[1]);
    var selectDate = calendarBox.attr("date");
    if (meth == -1) {
        month--;
        if (month == 0) {
            month = 12;
            year--;
        }
    } else if (meth == 1) {
        month++;
        if (month == 13) {
            month = 1;
            year++;
        }
    }
    var calendarHTML = loadCalendar(year, month,selectDate);
    calendarBox.find(".calendar_t_day").html(year + "-" + month);
    calendarBox.find(".calendar_c_box").html(calendarHTML);
}


// 获取最低价
function myAjaxGetLowpricepr(city1,city2){
    var  oData2 = '';

    var xhr = '';
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr =new ActiveXObject(' Microsoft . XMLHTTP')
    }
    //xhr.open('get','http://121.52.212.39:83/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'false');
    //xhr.open('get',flightUrlprice+'/CabinCountSearch/api/LowPriceController/Search.do?from='+city1+'&to='+city2+'&date='+date+'&day='+days,'true');//  异步加载 最低价
    xhr.open('get','/icbc/ajax.aspx?from='+city1+'&to='+city2+'&act=GetLowPrice','true');//  异步加载 最低价
    xhr.send();
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4){
            // ajax 响内容解析完成，可以在客户端调用了
            //$.qu('.lodin-p').style.display = 'none';
            if(xhr.status == 200){
                //  判断服务器返回的状态 200 表示 正常

                oData2 = JSON.parse(xhr.responseText);
                //console.log(oData2)
                var  pricearr = [];
                for (var p in oData2) {
                    // var dateDiv = p.replace(jsonData.from + "_" + jsonData.to + "_", "");
                    //console.log(dateDiv) // 时间
                    pricearr.push(oData2[p]) //价格


                }
               // console.log(pricearr)
                var htmlp = $.qus('.thett1');
                for (var i = 0; i < pricearr.length; i++) {
                    if(pricearr[i] && pricearr[i] !=0){
                        htmlp[i].innerHTML ='￥'+ pricearr[i];
                    }else {
                        htmlp[i].innerHTML ='￥--';
                    }


                }
                for (let k = 0; k < htmlp.length; k++) {
                     var noprice =  htmlp[k];
                    if(noprice.innerHTML ==''){
                        noprice.style.display = 'none';//
                        var  prenoode =$.firstChild( noprice.parentNode);
                        prenoode.style.height = '40px';
                        prenoode.style.lineHeight = '40px';
                    }

                }


            }else{
                //alert('出错了，价格查询异常！'); 超时也不管 试试
                // myalertp('detail','出错了，价格查询异常！')
            }
        }
    }

}
